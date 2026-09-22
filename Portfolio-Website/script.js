const root = document.documentElement;
root.classList.replace("no-js", "js");

const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");
const themeStatus = document.querySelector("[data-theme-status]");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const themeStorageKey = "alren-portfolio-theme";
const systemTheme = window.matchMedia("(prefers-color-scheme: light)");

const readStoredTheme = () => {
  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    return storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
  } catch {
    return null;
  }
};

const writeStoredTheme = (theme) => {
  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch {
    // The theme still works when storage is unavailable.
  }
};

const setTheme = (theme, persist = true) => {
  const nextTheme = theme === "light" ? "light" : "dark";
  const isLight = nextTheme === "light";

  root.dataset.theme = nextTheme;

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark mode" : "Switch to light mode",
    );
  }

  if (themeLabel) themeLabel.textContent = isLight ? "Dark" : "Light";
  if (themeStatus) themeStatus.textContent = isLight ? "Light" : "Dark";
  if (themeMeta) themeMeta.setAttribute("content", isLight ? "#f2f1ec" : "#090a0c");
  if (persist) writeStoredTheme(nextTheme);
};

const storedTheme = readStoredTheme();
setTheme(storedTheme || (systemTheme.matches ? "light" : "dark"), false);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    setTheme(root.dataset.theme === "light" ? "dark" : "light");
  });
}

if (!storedTheme) {
  systemTheme.addEventListener("change", (event) => {
    setTheme(event.matches ? "light" : "dark", false);
  });
}

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector(".site-menu");

const setMenuState = (isOpen) => {
  if (!header || !menuToggle) return;

  header.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
};

if (menuToggle && siteMenu) {
  menuToggle.addEventListener("click", () => {
    setMenuState(!header.classList.contains("menu-open"));
  });

  siteMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });
}

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
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

const heroStage = document.querySelector("[data-tilt]");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (heroStage && finePointer && !reducedMotionQuery.matches) {
  heroStage.addEventListener("pointermove", (event) => {
    const bounds = heroStage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    heroStage.style.setProperty("--pointer-x", `${x * 12}px`);
    heroStage.style.setProperty("--pointer-y", `${y * 12}px`);
  });

  heroStage.addEventListener("pointerleave", () => {
    heroStage.style.setProperty("--pointer-x", "0px");
    heroStage.style.setProperty("--pointer-y", "0px");
  });
}

const heroBackdrop = document.querySelector(".hero-backdrop");
let scrollFrameRequested = false;

const updateHeroBackdrop = () => {
  if (heroBackdrop && !reducedMotionQuery.matches) {
    const shift = Math.min(window.scrollY * 0.08, 42);
    heroBackdrop.style.setProperty("--hero-shift", `${shift}px`);
  }

  scrollFrameRequested = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (scrollFrameRequested) return;

    scrollFrameRequested = true;
    window.requestAnimationFrame(updateHeroBackdrop);
  },
  { passive: true },
);
