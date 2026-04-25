/* =============================================
   NAVIGATION — scroll behavior & mobile toggle
   ============================================= */
const navbar   = document.getElementById('navbar');
const navLinks = document.getElementById('nav-links');
const navToggle = document.getElementById('nav-toggle');
const allNavLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

// Shrink nav on scroll + highlight active section
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  navbar.classList.toggle('scrolled', scrollY > 20);

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === current);
  });
}, { passive: true });

// Mobile toggle
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

// Close mobile nav on link click
allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

// Close mobile nav on outside click
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  }
});

/* =============================================
   SCROLL ANIMATIONS — Intersection Observer
   ============================================= */
const animatedEls = document.querySelectorAll('.fade-in, .animate-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

animatedEls.forEach((el, i) => {
  // Stagger cards in the same parent
  if (el.closest('.projects-grid') || el.closest('.about-stats')) {
    const siblings = [...el.parentElement.querySelectorAll('.fade-in')];
    const idx = siblings.indexOf(el);
    if (idx > 0) el.style.transitionDelay = `${idx * 0.1}s`;
  }
  observer.observe(el);
});

// Hero animates on load
window.addEventListener('load', () => {
  document.querySelector('.animate-up')?.classList.add('visible');
});

/* =============================================
   SMOOTH SCROLL — handle anchor hrefs
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* =============================================
   COPY-TO-CLIPBOARD — for any [data-copy] button
   ============================================= */
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy') ? resolve() : reject();
    } catch (e) { reject(e); }
    document.body.removeChild(ta);
  });
}

document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const label = btn.querySelector('.copy-label');
    const original = label.textContent;
    try {
      await copyText(btn.dataset.copy);
      label.textContent = 'Copied!';
      btn.classList.add('copied');
    } catch {
      label.textContent = 'Failed';
    }
    setTimeout(() => {
      label.textContent = original;
      btn.classList.remove('copied');
    }, 1600);
  });
});
