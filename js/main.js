/* ============================================================
   TU BOTELLA — main.js
   Navbar, stats counter, scroll animations, form handling
============================================================ */

// ── Navbar ──────────────────────────────────────────────────
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

// Scroll → sticky style
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile toggle
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

// Close menu on link click
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('open'));
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
    navMenu.classList.remove('open');
  }
});

// ── Stats Counter ────────────────────────────────────────────
function animateCounter(el, target, duration = 2000) {
  const start     = performance.now();
  const isLarge   = target >= 1000;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(eased * target);

    el.textContent = isLarge
      ? current.toLocaleString('es-MX')
      : current.toString();

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isLarge
      ? target.toLocaleString('es-MX')
      : target.toString();
  }
  requestAnimationFrame(update);
}

// Trigger when stats section enters view
const statsSection  = document.getElementById('stats');
let   statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
      });
    }
  });
}, { threshold: 0.5 });

if (statsSection) statsObserver.observe(statsSection);

// ── Scroll Fade-in Animations ────────────────────────────────
// Add .fade-in to major content blocks
const fadeTargets = [
  '.nosotros__img-wrap',
  '.nosotros__content',
  '.marca-card',
  '.producto-card',
  '.testimonio-card',
  '.representados__content',
  '.representados__form-wrap',
  '.contacto__info',
  '.contacto__form-wrap',
];

fadeTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('fade-in');
  });
});

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ── Active nav link on scroll ────────────────────────────────
const sections     = document.querySelectorAll('section[id]');
const navLinks     = document.querySelectorAll('.navbar__menu a:not(.btn)');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(
        `.navbar__menu a[href="#${entry.target.id}"]`
      );
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));

// ── Form — Representados ─────────────────────────────────────
const repForm    = document.getElementById('repForm');
const repSuccess = document.getElementById('repSuccess');

if (repForm) {
  repForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic client-side validation feedback
    const inputs = repForm.querySelectorAll('[required]');
    let valid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = '#e05c5c';
        input.addEventListener('input', () => {
          input.style.borderColor = '';
        }, { once: true });
      }
    });

    if (!valid) return;

    // Simulate form submission (replace with actual endpoint / EmailJS / Formspree)
    const btn = repForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando…';

    setTimeout(() => {
      repForm.style.display    = 'none';
      repSuccess.style.display = 'block';
      // Scroll the success message into view
      repSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1400);
  });
}

// ── Form — Contacto ──────────────────────────────────────────
const contactoForm    = document.getElementById('contactoForm');
const contactoSuccess = document.getElementById('contactoSuccess');

if (contactoForm) {
  contactoForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const inputs = contactoForm.querySelectorAll('[required]');
    let valid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = '#e05c5c';
        input.addEventListener('input', () => {
          input.style.borderColor = '';
        }, { once: true });
      }
    });

    if (!valid) return;

    const btn = contactoForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando…';

    setTimeout(() => {
      contactoForm.style.display    = 'none';
      contactoSuccess.style.display = 'block';
      contactoSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1400);
  });
}

// ── Smooth scroll polyfill for older Safari ──────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
