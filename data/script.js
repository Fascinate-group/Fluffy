const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const lightbox = document.querySelector("#gallery-lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCaption = lightbox?.querySelector("figcaption");
const lightboxFrame = lightbox?.querySelector(".lightbox-frame");
const imageCloseButton = lightbox?.querySelector(".lightbox-image-close");
const closeButton = lightbox?.querySelector(".lightbox-close");
const prevButton = lightbox?.querySelector(".lightbox-prev");
const nextButton = lightbox?.querySelector(".lightbox-next");
const xTimeline = document.querySelector(".x-timeline");
const lightboxGroups = {
  gallery: {
    label: "Gallery",
    items: Array.from(document.querySelectorAll(".gallery-item img")),
  },
  cast: {
    label: "Cast",
    items: Array.from(document.querySelectorAll(".cast-profile-card img")),
  },
};
let activeLightboxGroup = "gallery";
let activeLightboxIndex = 0;
let touchStartX = 0;
let touchStartY = 0;
let touchDeltaX = 0;
let touchDeltaY = 0;
let swipedRecently = false;

navToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    siteNav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

if (xTimeline) {
  const syncTimelineState = () => {
    xTimeline.classList.toggle("has-embed", Boolean(xTimeline.querySelector("iframe")));
  };
  const timelineObserver = new MutationObserver(syncTimelineState);
  timelineObserver.observe(xTimeline, { childList: true, subtree: true });
  syncTimelineState();
}

const getActiveItems = () => lightboxGroups[activeLightboxGroup]?.items || [];

const getImageLabel = (image) => {
  const caption = image.closest("figure")?.querySelector("figcaption")?.textContent?.trim();
  return caption || image.alt || "";
};

const showLightboxImage = (index) => {
  const activeItems = getActiveItems();

  if (!lightbox || !lightboxImage || !lightboxCaption || activeItems.length === 0) {
    return;
  }

  activeLightboxIndex = (index + activeItems.length) % activeItems.length;
  const image = activeItems[activeLightboxIndex];
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  const label = lightboxGroups[activeLightboxGroup]?.label || "";
  const name = getImageLabel(image);
  lightboxCaption.textContent = [name, `${label} ${activeLightboxIndex + 1} / ${activeItems.length}`]
    .filter(Boolean)
    .join(" - ");
};

const showNextImage = (step) => {
  showLightboxImage(activeLightboxIndex + step);
};

const openLightbox = (group, index) => {
  if (!lightbox) {
    return;
  }

  activeLightboxGroup = group;
  showLightboxImage(index);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-lightbox-open");
  closeButton?.focus();
};

const closeLightbox = () => {
  if (!lightbox) {
    return;
  }

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-lightbox-open");
};

const closeFromLightboxClick = () => {
  if (swipedRecently) {
    return;
  }

  closeLightbox();
};

window.closeGalleryLightbox = closeFromLightboxClick;

document.querySelectorAll(".gallery-item").forEach((item, index) => {
  item.addEventListener("click", () => {
    openLightbox("gallery", Number(item.dataset.galleryIndex || index));
  });
});

document.querySelectorAll(".cast-profile-card").forEach((card, index) => {
  const imageName = card.querySelector("figcaption")?.textContent?.trim() || "キャスト";
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-label", `${imageName}の画像を拡大表示`);

  card.addEventListener("click", () => {
    openLightbox("cast", index);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox("cast", index);
    }
  });
});

closeButton?.addEventListener("click", closeLightbox);
imageCloseButton?.addEventListener("click", closeFromLightboxClick);
prevButton?.addEventListener("click", () => showNextImage(-1));
nextButton?.addEventListener("click", () => showNextImage(1));
lightboxImage?.addEventListener("click", closeFromLightboxClick);
lightboxFrame?.addEventListener("click", (event) => {
  if (event.target !== lightboxCaption) {
    closeFromLightboxClick();
  }
});

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox || event.target === lightboxImage) {
    closeFromLightboxClick();
  }
});

lightbox?.addEventListener(
  "touchstart",
  (event) => {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchDeltaX = 0;
    touchDeltaY = 0;
    swipedRecently = false;
  },
  { passive: true }
);

lightbox?.addEventListener(
  "touchmove",
  (event) => {
    const touch = event.touches[0];
    touchDeltaX = touch.clientX - touchStartX;
    touchDeltaY = touch.clientY - touchStartY;

    if (Math.abs(touchDeltaX) > 12 && Math.abs(touchDeltaX) > Math.abs(touchDeltaY)) {
      event.preventDefault();
    }
  },
  { passive: false }
);

lightbox?.addEventListener("touchend", () => {
  const isHorizontalSwipe = Math.abs(touchDeltaX) > 48 && Math.abs(touchDeltaX) > Math.abs(touchDeltaY) * 1.4;

  if (!isHorizontalSwipe) {
    return;
  }

  swipedRecently = true;
  showNextImage(touchDeltaX < 0 ? 1 : -1);
  window.setTimeout(() => {
    swipedRecently = false;
  }, 260);
});

document.addEventListener("keydown", (event) => {
  if (!lightbox?.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowLeft") {
    showNextImage(-1);
  } else if (event.key === "ArrowRight") {
    showNextImage(1);
  }
});
