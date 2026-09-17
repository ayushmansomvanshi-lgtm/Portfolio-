const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

$('#year').textContent = new Date().getFullYear();

const loader = $('.preloader');
const count = $('.load-count');
const line = $('.load-line i');
if (window.gsap && !reduceMotion) {
  const state = { n: 0 };
  gsap.to(state, { n: 100, duration: .8, ease: 'power2.out', onUpdate: () => count.textContent = String(Math.round(state.n)).padStart(3, '0') });
  gsap.to(line, { width: '100%', duration: .8, ease: 'power2.out' });
  gsap.to(loader, { yPercent: -100, duration: .72, delay: .88, ease: 'expo.inOut', onComplete: () => loader.remove() });
} else loader?.remove();

if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

let lenis = null;
if (window.Lenis && window.gsap && !reduceMotion) {
  lenis = new Lenis({ duration: 1.05, smoothWheel: true });
  lenis.on('scroll', () => window.ScrollTrigger?.update());
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(target, immediate = false) {
  const el = typeof target === 'string' ? $(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: immediate ? 0 : 1.05, immediate });
  else el.scrollIntoView({ behavior: reduceMotion || immediate ? 'auto' : 'smooth' });
}

$$('[data-scroll]').forEach(btn => btn.addEventListener('click', () => scrollToTarget(btn.dataset.scroll)));
$$('.process-track article').forEach(card => card.addEventListener('click', () => scrollToTarget(card.dataset.target)));

const panel = $('.index-panel');
const toggle = $('.menu-toggle');
const close = $('.index-close');
function openMenu() {
  panel.style.visibility = 'visible'; panel.setAttribute('aria-hidden', 'false'); toggle.setAttribute('aria-expanded', 'true');
  lenis?.stop();
  if (window.gsap) gsap.to(panel, { xPercent: 0, duration: .55, ease: 'expo.out' }); else panel.style.transform = 'translateX(0)';
}
function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  if (window.gsap) gsap.to(panel, { xPercent: 105, duration: .45, ease: 'expo.inOut', onComplete: () => { panel.style.visibility = 'hidden'; panel.setAttribute('aria-hidden', 'true'); lenis?.start(); } });
  else { panel.style.transform = 'translateX(105%)'; panel.style.visibility = 'hidden'; panel.setAttribute('aria-hidden', 'true'); lenis?.start(); }
}
toggle.addEventListener('click', openMenu); close.addEventListener('click', closeMenu);
$$('.index-panel a').forEach(a => a.addEventListener('click', e => { e.preventDefault(); const href = a.getAttribute('href'); closeMenu(); setTimeout(() => scrollToTarget(href), 220); }));
window.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false') closeMenu(); });

if (window.gsap && window.ScrollTrigger) {
  const railProgress = $('.rail-progress');
  const railNumber = $('.rail-number');
  const railName = $('.rail-name');
  gsap.to(railProgress, { height: '100%', ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: .2 } });
  $$('[data-stage]').forEach(section => ScrollTrigger.create({ trigger: section, start: 'top 52%', end: 'bottom 52%', onEnter: () => setRail(section), onEnterBack: () => setRail(section) }));
  function setRail(section) { railNumber.textContent = section.dataset.stage; railName.textContent = section.dataset.name; }

  if (!reduceMotion) {
    $$('.section-head, .context-layout, .loop-intro, .stats-grid, .process-track, .design-intro, .design-board, .design-capabilities, .toolkit-layout, .github-shelf, .ship-layout').forEach(el => {
      gsap.from(el, { y: 34, opacity: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
    });
    $$('.project-shell').forEach(shell => {
      const copy = $('.project-copy', shell); const card = $('.product-card', shell);
      gsap.from(copy.children, { y: 28, opacity: 0, stagger: .065, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: shell, start: 'top 74%', once: true } });
      gsap.from(card, { y: 38, rotate: 1.4, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: shell, start: 'top 72%', once: true } });
    });
    gsap.from('.hero h1', { y: 44, opacity: 0, duration: .92, delay: 1.0, ease: 'expo.out' });
    gsap.from('.hero .loop-map', { y: 24, rotate: -2, opacity: 0, duration: .9, delay: 1.12, ease: 'power3.out' });
    gsap.from('.hero-meta > div', { y: 16, opacity: 0, stagger: .08, duration: .55, delay: 1.2, ease: 'power2.out' });

    gsap.to('.hero-ghost', { xPercent: -8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    $$('.design-card').forEach((card, i) => gsap.from(card, { y: 55 + i * 8, rotate: i % 2 ? 1.5 : -1.5, opacity: 0, duration: .85, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 88%', once: true } }));
  }
}

$$('[data-loop-reset]').forEach(btn => btn.addEventListener('click', () => scrollToTarget($('#top'), false)));

const returnHero = $('.hero-return');
let wrapping = false;
if (returnHero && window.ScrollTrigger) {
  ScrollTrigger.create({ trigger: returnHero, start: 'top top', onEnter: () => {
    if (wrapping) return; wrapping = true;
    requestAnimationFrame(() => { if (lenis) lenis.scrollTo(0, { immediate: true, force: true }); else window.scrollTo(0, 0); setTimeout(() => { wrapping = false; }, 120); });
  }});
}

$$('.hero').forEach(hero => hero.addEventListener('pointermove', e => {
  const r = hero.getBoundingClientRect();
  hero.style.setProperty('--mx', `${((e.clientX-r.left)/r.width)*100}%`);
  hero.style.setProperty('--my', `${((e.clientY-r.top)/r.height)*100}%`);
}, { passive: true }));

const pointer = $('.pointer-dot');
if (pointer && matchMedia('(pointer:fine)').matches && !reduceMotion) {
  window.addEventListener('pointermove', e => {
    pointer.style.opacity = '1';
    if (window.gsap) gsap.to(pointer, { x: e.clientX, y: e.clientY, duration: .16, ease: 'power2.out' });
    else { pointer.style.left = `${e.clientX}px`; pointer.style.top = `${e.clientY}px`; }
  }, { passive: true });
  $$('a,button,.process-track article,.design-card').forEach(el => {
    el.addEventListener('pointerenter', () => pointer.classList.add('is-active'));
    el.addEventListener('pointerleave', () => pointer.classList.remove('is-active'));
  });
}

window.addEventListener('load', () => window.ScrollTrigger?.refresh());
