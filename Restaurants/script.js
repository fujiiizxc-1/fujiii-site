const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

function setMenu(isOpen) {
  if (!menuToggle || !mobileMenu) return;

  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  mobileMenu.classList.toggle('is-open', isOpen);
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  setMenu(!isOpen);
});

document.querySelectorAll('.mobile-menu a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 800) setMenu(false);
});

const revealItems = document.querySelectorAll('[data-reveal]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
