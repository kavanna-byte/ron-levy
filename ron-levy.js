/* ============================================================
   Ron Levy — Paintings  |  Site JavaScript
   Fixed: duplicate declarations, scroll reveal, hero animation
   ============================================================ */

// ── Inject scroll-reveal CSS ──────────────────────────────────
(function injectCSS() {
  const css = `
    .reveal {
      opacity: 0;
      transform: translateY(26px);
      transition: opacity 0.75s cubic-bezier(.16,1,.3,1), transform 0.75s cubic-bezier(.16,1,.3,1);
    }
    .reveal.vis { opacity: 1; transform: none; }
    @media (prefers-reduced-motion: reduce) {
      .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
    }
    /* Hero banner cycling */
    .hero-right { position: relative; overflow: hidden; }
    .hero-right img {
      position: absolute !important;
      inset: 0;
      width: 100% !important;
      height: 100% !important;
      object-fit: cover;
      transition: opacity 1.5s ease !important;
    }
    .hero-right img:first-child { position: relative !important; opacity: 1; }
    /* Nav scroll glow */
    nav { transition: box-shadow 0.3s ease; }
  `;
  const s = document.createElement('style');
  s.id = 'rl-dynamic-css';
  s.textContent = css;
  document.head.appendChild(s);
})();

// ── Scroll Reveal ─────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

function initReveal() {
  const selectors = [
    '.hero-eyebrow', '.hero-h1', '.hero-sub', '.hero-btns',
    '.quote', '.story-copy', '.story-photo',
    '.sec-title', '.sec-desc',
    '.cc', '.about-img', '.about-badge', '.about-text',
    '.contact .label', '.contact .sec-title', '.contact .sec-desc', '.cta-link',
    '.g-grid .gi'
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        if (sel.includes('.gi')) {
          el.style.transitionDelay = Math.min(i * 0.035, 0.45) + 's';
        }
      }
    });
  });
  document.querySelectorAll('.reveal').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight) {
      el.classList.add('vis');
    } else {
      revealObs.observe(el);
    }
  });
}

document.addEventListener('DOMContentLoaded', initReveal);

// ── Auto-filter from URL ?cat= param (used by nav deep-links) ──
window.addEventListener('load', function () {
  const cat = new URLSearchParams(window.location.search).get('cat');
  if (!cat) return;
  const tabs = [...document.querySelectorAll('.tab')];
  const btn = tabs.find(b => (b.getAttribute('onclick') || '').includes("'" + cat + "'"));
  if (!btn) return;
  tabs.forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.gi').forEach(el => {
    el.style.display = (el.dataset.cat === cat) ? 'block' : 'none';
  });
});

// ── Hero Banner Cycling ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const heroRight = document.querySelector('.hero-right');
  if (!heroRight) return;
  const imgs = [...heroRight.querySelectorAll('img')];
  if (imgs.length < 2) return;

  let current = 0;
  imgs.forEach((img, i) => {
    img.style.opacity = i === 0 ? '1' : '0';
  });

  setInterval(() => {
    imgs[current].style.opacity = '0';
    current = (current + 1) % imgs.length;
    imgs[current].style.opacity = '1';
  }, 3800);
});

// ── Parallax on hero right panel ──────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const heroRight = document.querySelector('.hero-right');
  if (!heroRight) return;
  window.addEventListener('scroll', () => {
    const s = window.pageYOffset;
    if (s < window.innerHeight * 1.2) {
      heroRight.style.transform = 'translateY(' + (s * 0.10) + 'px)';
    }
  }, { passive: true });
});

// ── Navbar shadow on scroll ────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
    } else {
      nav.style.boxShadow = 'none';
    }
  }, { passive: true });
});

// ── Mobile Menu ───────────────────────────────────────────────
function toggleMob() {
  document.getElementById('mobMenu').classList.toggle('open');
}

// ── Filter Gallery ────────────────────────────────────────────
function filter(cat, btn) {
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.gi').forEach(el => {
    el.style.display = (cat === 'all' || el.dataset.cat === cat) ? 'block' : 'none';
  });
}

// ── Navigate to gallery and filter ───────────────────────────
function go(cat) {
  document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    const tabs = [...document.querySelectorAll('.tab')];
    const btn = tabs.find(b => b.textContent.trim().toLowerCase() === cat)
      || tabs.find(b => b.textContent.trim().toLowerCase().includes(cat))
      || tabs[0];
    if (btn) filter(cat === 'all' ? 'all' : cat, btn);
  }, 400);
}

// ── Lightbox ──────────────────────────────────────────────────
// Use var (not let/const) at top level to avoid duplicate-declaration errors
// if old inline script is still present in index.html
var lbItems = [], lbIdx = 0;

function lbOpen(el) {
  lbItems = [...document.querySelectorAll('.gi')].filter(e => e.style.display !== 'none');
  lbIdx = lbItems.indexOf(el);
  lbShow(lbIdx);
  document.getElementById('lbBox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function lbShow(i) {
  const el = lbItems[i];
  const img = el.querySelector('img');
  document.getElementById('lbImg').src = img.dataset.full || img.src;
  document.getElementById('lbCap').textContent = el.querySelector('.gi-cap')?.textContent || img.alt;
  document.getElementById('lbNum').textContent = (i + 1) + ' of ' + lbItems.length;
}

function lbNav(d) {
  lbIdx = (lbIdx + d + lbItems.length) % lbItems.length;
  lbShow(lbIdx);
}

function lbClose() {
  document.getElementById('lbBox').classList.remove('open');
  document.body.style.overflow = '';
}

function lbOut(e) {
  if (e.target.id === 'lbBox') lbClose();
}

document.addEventListener('keydown', e => {
  if (!document.getElementById('lbBox')?.classList.contains('open')) return;
  if (e.key === 'ArrowRight') lbNav(1);
  if (e.key === 'ArrowLeft') lbNav(-1);
  if (e.key === 'Escape') lbClose();
});
