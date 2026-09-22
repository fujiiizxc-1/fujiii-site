const root = document.documentElement;
root.classList.replace("no-js", "js");

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuLinks = document.querySelectorAll(".mobile-nav a");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const setMenuState = (isOpen) => {
  if (!header || !menuToggle || !mobileMenu) return;

  header.classList.toggle("menu-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
};

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    setMenuState(!header.classList.contains("menu-open"));
  });

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });
}

const updateHeader = () => {
  if (header) header.classList.toggle("is-scrolled", window.scrollY > 32);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealElements = document.querySelectorAll("[data-reveal]");

if (reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const heroPhoto = document.querySelector(".hero-photo");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (heroPhoto && finePointer && !reducedMotionQuery.matches) {
  heroPhoto.addEventListener("pointermove", (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;

    heroPhoto.style.setProperty("--pointer-x", `${x * -10}px`);
    heroPhoto.style.setProperty("--pointer-y", `${y * -6}px`);
  });

  heroPhoto.addEventListener("pointerleave", () => {
    heroPhoto.style.setProperty("--pointer-x", "0px");
    heroPhoto.style.setProperty("--pointer-y", "0px");
  });
}
