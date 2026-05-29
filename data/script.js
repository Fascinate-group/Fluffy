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
const heroPhotoScatter = document.querySelector(".hero-photo-scatter");
const castSwitchButtons = Array.from(document.querySelectorAll(".cast-switch-card"));
const castPanels = Array.from(document.querySelectorAll(".cast-panel"));
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
let pendingLightboxOrientationImage = null;
const galleryPhotos = [
  "images/gallery/01.jpg",
  "images/gallery/02.jpg",
  "images/gallery/03.jpg",
  "images/gallery/04.jpg",
  "images/gallery/05.jpg",
  "images/gallery/06.jpg",
  "images/gallery/07.jpg",
  "images/gallery/08.jpg",
  "images/gallery/09.jpg",
  "images/gallery/10.jpg",
  "images/gallery/11.jpg",
  "images/gallery/12.jpg",
  "images/gallery/13.jpg",
  "images/gallery/14.jpg",
  "images/gallery/15.jpg",
  "images/gallery/16.jpg",
  "images/gallery/17.jpg",
  "images/gallery/18.jpg",
  "images/gallery/19.jpg",
];

const markImageOrientation = (image, target = image) => {
  const setOrientation = (isPortrait) => {
    target.classList.toggle("is-portrait", isPortrait);
    target.classList.toggle("is-landscape", !isPortrait);
  };

  const applyOrientation = () => {
    setOrientation(image.naturalHeight > image.naturalWidth);
  };

  if (image.complete && image.naturalWidth) {
    applyOrientation();
    return;
  }

  image.addEventListener("load", applyOrientation, { once: true });
};

const updateLightboxOrientation = (sourceImage) => {
  if (!lightboxFrame || !lightboxImage) {
    return;
  }

  const setOrientation = (isPortrait) => {
    lightboxFrame.classList.toggle("is-portrait", isPortrait);
    lightboxFrame.classList.toggle("is-landscape", !isPortrait);
  };

  if (sourceImage.naturalWidth) {
    setOrientation(sourceImage.naturalHeight > sourceImage.naturalWidth);
    return;
  }

  pendingLightboxOrientationImage = sourceImage;
  lightboxFrame.classList.remove("is-portrait", "is-landscape");
};

lightboxImage?.addEventListener("load", () => {
  if (pendingLightboxOrientationImage?.src === lightboxImage.src && lightboxFrame) {
    lightboxFrame.classList.toggle("is-portrait", lightboxImage.naturalHeight > lightboxImage.naturalWidth);
    lightboxFrame.classList.toggle("is-landscape", lightboxImage.naturalWidth >= lightboxImage.naturalHeight);
    pendingLightboxOrientationImage = null;
  }
});

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
  window.twttr = window.twttr || { _e: [], ready: (callback) => window.twttr._e.push(callback) };

  const markTimelineRendered = () => {
    xTimeline.classList.add("is-rendered");
  };

  window.twttr.ready((twttr) => {
    if (!twttr.events?.bind) {
      return;
    }

    twttr.events.bind("rendered", (event) => {
      if (event.target?.closest?.(".x-timeline")) {
        markTimelineRendered();
      }
    });
    twttr.widgets?.load?.(xTimeline);
  });

  if (!document.querySelector("#twitter-wjs")) {
    const script = document.createElement("script");
    script.id = "twitter-wjs";
    script.async = true;
    script.src = "https://platform.twitter.com/widgets.js";
    script.charset = "utf-8";
    document.head.appendChild(script);
  }
}

if (heroPhotoScatter) {
  const photoPositions = [
    { x: -2, y: 18, rotate: -11 },
    { x: 17, y: 8, rotate: 8 },
    { x: 36, y: 22, rotate: -6 },
    { x: 57, y: 5, rotate: 10 },
    { x: 80, y: 20, rotate: -8 },
    { x: 101, y: 42, rotate: 9 },
    { x: 7, y: 76, rotate: 7 },
    { x: 43, y: 84, rotate: -10 },
    { x: 74, y: 72, rotate: 6 },
  ];
  const shuffledPhotos = [...galleryPhotos].sort(() => Math.random() - 0.5);
  const fragment = document.createDocumentFragment();

  photoPositions.forEach((position, index) => {
    const frame = document.createElement("span");
    frame.className = "hero-scatter-photo";
    frame.style.left = `${position.x}%`;
    frame.style.top = `${position.y}%`;
    frame.style.setProperty("--photo-rotate", `${position.rotate}deg`);

    const image = document.createElement("img");
    image.src = shuffledPhotos[index % shuffledPhotos.length];
    image.alt = "";
    image.loading = "eager";
    markImageOrientation(image, frame);

    frame.append(image);
    fragment.append(frame);
  });

  heroPhotoScatter.append(fragment);
}

const updateCastGroup = (group) => {
  castSwitchButtons.forEach((button) => {
    const isActive = button.dataset.castPanel === group;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  castPanels.forEach((panel) => {
    const isActive = panel.id === `${group}-cast-panel`;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
};

castSwitchButtons.forEach((button) => {
  button.addEventListener("click", () => {
    updateCastGroup(button.dataset.castPanel || "child");
  });
});

const getActiveItems = () => lightboxGroups[activeLightboxGroup]?.items || [];

const getImageLabel = (image) => {
  if (activeLightboxGroup === "gallery") {
    return "";
  }

  return image.alt?.replace("のキャラクター紹介", "") || "";
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
  updateLightboxOrientation(image);
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
  const image = item.querySelector("img");

  if (image) {
    markImageOrientation(image, item);
  }

  item.addEventListener("click", () => {
    openLightbox("gallery", Number(item.dataset.galleryIndex || index));
  });
});

document.querySelectorAll(".cast-profile-card").forEach((card, index) => {
  const imageName = card.querySelector("img")?.alt?.replace("のキャラクター紹介", "") || "キャスト";
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
