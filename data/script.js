const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const galleryItems = Array.from(document.querySelectorAll(".gallery-item img"));
const lightbox = document.querySelector("#gallery-lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCaption = lightbox?.querySelector("figcaption");
const closeButton = lightbox?.querySelector(".lightbox-close");
const prevButton = lightbox?.querySelector(".lightbox-prev");
const nextButton = lightbox?.querySelector(".lightbox-next");
let activeGalleryIndex = 0;

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

const showGalleryImage = (index) => {
  if (!lightbox || !lightboxImage || !lightboxCaption || galleryItems.length === 0) {
    return;
  }

  activeGalleryIndex = (index + galleryItems.length) % galleryItems.length;
  const image = galleryItems[activeGalleryIndex];
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = `${activeGalleryIndex + 1} / ${galleryItems.length}`;
};

const openLightbox = (index) => {
  if (!lightbox) {
    return;
  }

  showGalleryImage(index);
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

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    openLightbox(Number(item.dataset.galleryIndex || 0));
  });
});

closeButton?.addEventListener("click", closeLightbox);
prevButton?.addEventListener("click", () => showGalleryImage(activeGalleryIndex - 1));
nextButton?.addEventListener("click", () => showGalleryImage(activeGalleryIndex + 1));

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox?.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowLeft") {
    showGalleryImage(activeGalleryIndex - 1);
  } else if (event.key === "ArrowRight") {
    showGalleryImage(activeGalleryIndex + 1);
  }
});
