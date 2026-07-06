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
  '.ventaja-card',
  '.marca-card',
  '.producto-card',
  '.aplicacion-item',
  '.equipo-card',
  '.testimonio-card',
  '.representados__content',
  '.representados__content--centered',
  '.contacto__info',
  '.contacto__form-wrap',
  '.rep-body__info',
  '.rep-body__form',
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
  contactoForm.addEventListener('submit', async function (e) {
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

    try {
      const response = await fetch(contactoForm.action, {
        method: 'POST',
        body: new FormData(contactoForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        contactoForm.style.display    = 'none';
        contactoSuccess.style.display = 'block';
        contactoSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar solicitud de cotización';
        alert('Hubo un error al enviar. Por favor intenta de nuevo.');
      }
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar solicitud de cotización';
      alert('Error de conexión. Por favor intenta de nuevo.');
    }
  });
}

// ── Carrusel de Productos ────────────────────────────────────
(function () {
  const track   = document.getElementById('carouselTrack');
  const dotsEl  = document.getElementById('carouselDots');
  const btnPrev = document.getElementById('carouselPrev');
  const btnNext = document.getElementById('carouselNext');
  if (!track) return;

  const cards = Array.from(track.children);
  let current = 0;

  function visibleCount() {
    const w = window.innerWidth;
    if (w < 600)  return 1;
    if (w < 960)  return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, cards.length - visibleCount());
  }

  // Crear dots
  function buildDots() {
    dotsEl.innerHTML = '';
    const count = maxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const d = document.createElement('button');
      d.className = 'carousel__dot' + (i === current ? ' active' : '');
      d.setAttribute('aria-label', `Ir a ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
    }
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 24;
    track.style.transform = `translateX(-${current * (cardWidth + gap)}px)`;
    // Actualizar dots
    dotsEl.querySelectorAll('.carousel__dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    btnPrev.disabled = current === 0;
    btnNext.disabled = current >= maxIndex();
  }

  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));

  // Reconstruir al cambiar tamaño
  window.addEventListener('resize', () => {
    buildDots();
    goTo(Math.min(current, maxIndex()));
  });

  // Touch/swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });

  buildDots();
  goTo(0);
})();

// ── FAQ Acordeón ─────────────────────────────────────────────
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    // Cierra todos
    document.querySelectorAll('.faq__question').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });
    // Abre el clickeado si estaba cerrado
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      btn.nextElementSibling.classList.add('open');
    }
  });
});

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
