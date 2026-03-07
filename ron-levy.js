// Mobile menu
function toggleMob() { document.getElementById('mobMenu').classList.toggle('open'); }

// Filter gallery
function filter(cat, btn) {
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.gi').forEach(el => {
    el.style.display = (cat === 'all' || el.dataset.cat === cat) ? 'block' : 'none';
  });
}

// Navigate to section and filter
function go(cat) {
  document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    const btn = [...document.querySelectorAll('.tab')].find(b => b.textContent.trim().toLowerCase().includes(cat === 'all' ? 'all' : cat)) || document.querySelector('.tab');
    if (btn) filter(cat, btn);
  }, 400);
}

// Lightbox
let lbItems = [], lbIdx = 0;
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
function lbNav(d) { lbIdx = (lbIdx + d + lbItems.length) % lbItems.length; lbShow(lbIdx); }
function lbClose() { document.getElementById('lbBox').classList.remove('open'); document.body.style.overflow = ''; }
function lbOut(e) { if (e.target.id === 'lbBox') lbClose(); }
document.addEventListener('keydown', e => {
  if (!document.getElementById('lbBox').classList.contains('open')) return;
  if (e.key === 'ArrowRight') lbNav(1);
  if (e.key === 'ArrowLeft') lbNav(-1);
  if (e.key === 'Escape') lbClose();
});