/* =========================================================
   ARTHA · core motion engine
   Lenis smooth scroll · GSAP ScrollTrigger / SplitText / DrawSVG
   Preloader · page curtain · cursor · magnetic · tilt · marquee
   horizontal pinned tracks · scrub text · reveals
   ========================================================= */
(() => {
  const html = document.documentElement;
  const prefersReduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let forced = /[?&]motion=full/.test(location.search);
  try { if (forced) localStorage.setItem('artha-motion', 'full'); forced = forced || localStorage.getItem('artha-motion') === 'full'; } catch (e) {}
  const reduce = prefersReduce && !forced;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduce) html.classList.add('reduced');

  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
  gsap.defaults({ ease: 'expo.out', duration: 1 });

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const A = (window.Artha = { reduce, fine, $, $$ });

  /* ---------- motion preference pill ---------- */
  if (prefersReduce) {
    const pill = document.createElement('button');
    pill.className = 'motion-pill';
    pill.innerHTML = reduce ? '<i></i>Reduced motion is on for this device. <b>Turn full motion on</b>' : '<i></i>Full motion on. <b>Reduce motion</b>';
    pill.addEventListener('click', () => { try { reduce ? localStorage.setItem('artha-motion', 'full') : localStorage.removeItem('artha-motion'); } catch (e) {} location.href = location.pathname; });
    document.body.appendChild(pill);
  }

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  A.lenis = lenis;
  A.scrollTo = (target, opts = {}) => lenis ? lenis.scrollTo(target, { offset: -90, duration: 1.6, ...opts }) :
    (typeof target === 'number' ? scrollTo({ top: target }) : (typeof target === 'string' ? $(target) : target)?.scrollIntoView());

  /* ---------- config-driven prices ---------- */
  const C = window.ARTHA_CONFIG;
  $$('[data-price]').forEach(el => { el.textContent = formatINR(C.products[el.dataset.price].price); });
  $$('[data-price-diff]').forEach(el => { el.textContent = formatINR(C.products.strategy.price - C.products.intelligence.price); });
  $$('[data-window]').forEach(el => { el.textContent = C.upgrade.windowHours; });
  $$('[data-timing]').forEach(el => { const t = C.products[el.dataset.timing].timing; el.textContent = el.textContent.replace(/^Typically[^.]*\./, t + '.'); });
  $$('[data-maxmb]').forEach(el => { el.textContent = C.upload.maxMB; });

  /* ---------- roll labels ---------- */
  $$('[data-roll]').forEach(el => {
    const t = el.textContent;
    el.setAttribute('aria-label', t);
    el.innerHTML = [...t].map((c, i) => `<span class="roll" aria-hidden="true" style="--i:${i}" data-c="${c === ' ' ? ' ' : c}">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  });

  /* ---------- cursor ---------- */
  const cursor = $('.cursor');
  if (fine && cursor && !reduce) {
    const dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = $('.cursor__label');
    const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' }), dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' });
    addEventListener('pointermove', e => { cursor.classList.add('is-live'); dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); }, { passive: true });
    document.addEventListener('pointerover', e => {
      const l = e.target.closest('[data-cursor]');
      const h = e.target.closest('a, button, [data-hover], input, select, textarea, label');
      cursor.classList.toggle('is-label', !!l);
      label.textContent = l ? l.dataset.cursor : '';
      cursor.classList.toggle('is-hover', !!h && !l);
    });
    document.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
    document.addEventListener('pointerenter', () => cursor.classList.remove('is-hidden'));
  }

  /* ---------- magnetic ---------- */
  if (fine && !reduce) $$('[data-magnetic]').forEach(el => {
    const k = parseFloat(el.dataset.magnetic) || 0.35;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, .4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, .4)' });
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * k); yTo((e.clientY - r.top - r.height / 2) * k);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });

  /* ---------- 3D tilt ---------- */
  A.tilt = (els, max = 8) => { if (!fine || reduce) return; els.forEach(el => {
    gsap.set(el, { transformPerspective: 1200 });
    const rX = gsap.quickTo(el, 'rotationX', { duration: 0.9, ease: 'power3' });
    const rY = gsap.quickTo(el, 'rotationY', { duration: 0.9, ease: 'power3' });
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      rY((px - 0.5) * max * 2); rX((0.5 - py) * max * 2);
      el.style.setProperty('--gx', px * 100 + '%'); el.style.setProperty('--gy', py * 100 + '%');
    });
    el.addEventListener('pointerleave', () => { rX(0); rY(0); });
  }); };
  A.tilt($$('[data-tilt]'), 7);

  /* ---------- header ---------- */
  const header = $('[data-header]');
  let darkCount = 0;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate(self) {
      const y = self.scroll();
      header.classList.toggle('is-scrolled', y > 40);
      if (!html.classList.contains('menu-open')) header.classList.toggle('is-hidden', self.direction === 1 && y > 420);
      gsap.set('.progress i', { scaleX: self.progress });
    },
  });
  const darkTriggers = () => $$('[data-theme="dark"]').forEach(sec => ScrollTrigger.create({
    trigger: sec, start: 'top 38px', end: 'bottom 38px',
    onToggle: s => { darkCount += s.isActive ? 1 : -1; header.classList.toggle('is-dark', darkCount > 0); },
  }));

  /* ---------- mobile menu ---------- */
  const burger = $('.burger'), menu = $('.menu');
  let menuTl;
  if (burger) {
    menuTl = gsap.timeline({ paused: true, defaults: { ease: 'expo.inOut' } })
      .set(menu, { visibility: 'visible' })
      .fromTo('.menu__bg', { clipPath: 'circle(0% at calc(100% - 40px) 38px)' }, { clipPath: 'circle(150% at calc(100% - 40px) 38px)', duration: 1 })
      .from('.menu__nav a', { yPercent: 120, opacity: 0, stagger: 0.05, duration: 0.8, ease: 'expo.out' }, '-=.5')
      .from('.menu__foot', { opacity: 0, y: 10, duration: 0.5 }, '-=.4');
    burger.addEventListener('click', () => {
      const open = !html.classList.contains('menu-open');
      html.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open); menu.setAttribute('aria-hidden', !open);
      header.classList.remove('is-hidden');
      open ? (menuTl.timeScale(1).play(), lenis?.stop()) : (menuTl.timeScale(1.6).reverse(), lenis?.start());
    });
  }

  /* ---------- page transitions (curtain) ---------- */
  const curtainCols = $$('.curtain i'), curtainMark = $('.curtain__mark');
  const leave = (href) => {
    if (reduce) { location.href = href; return; }
    lenis?.stop();
    gsap.timeline({ onComplete: () => { location.href = href; } })
      .set(curtainCols, { transformOrigin: 'bottom' })
      .to(curtainCols, { scaleY: 1, duration: 0.7, stagger: 0.06, ease: 'expo.inOut' })
      .fromTo(curtainMark, { opacity: 0, scale: 0.6, rotate: -20 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.6 }, '-=.35');
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.hash) { e.preventDefault(); A.scrollTo(url.hash); history.replaceState(null, '', url.hash); return; }
    if (!/\.html?$|\/$/.test(url.pathname)) return;
    e.preventDefault();
    if (html.classList.contains('menu-open')) burger.click();
    leave(url.href);
  });
  addEventListener('pageshow', e => { if (e.persisted) { gsap.set(curtainCols, { scaleY: 0 }); gsap.set(curtainMark, { opacity: 0 }); lenis?.start(); } });

  /* ---------- scroll helpers ---------- */
  $$('[data-to-top]').forEach(b => b.addEventListener('click', () => A.scrollTo(0, { offset: 0 })));

  /* ---------- split text ---------- */
  const splitLines = (el, { scroll = true, delay = 0 } = {}) => {
    if (reduce) { el.classList.add('is-split'); return; }
    let tween;
    SplitText.create(el, {
      type: 'lines,words', mask: 'lines', autoSplit: true, linesClass: 'line',
      onSplit(self) {
        el.classList.add('is-split');
        tween?.kill();
        tween = gsap.from(self.words, {
          yPercent: 115, rotate: 3, duration: 1.3, stagger: 0.035, delay, ease: 'expo.out',
          scrollTrigger: scroll ? { trigger: el, start: 'top 88%', once: true } : null,
        });
        return tween;
      },
    });
  };
  A.splitLines = splitLines;

  /* ---------- marquee (velocity-reactive) ---------- */
  const marquee = (el) => {
    const dir = parseFloat(el.dataset.marquee) || -1;
    const content = el.innerHTML;
    el.innerHTML = `<div class="marquee"><div class="marquee__group">${content}</div><div class="marquee__group" aria-hidden="true">${content}</div></div>`;
    const track = el.firstElementChild, group = track.firstElementChild;
    let x = 0, w = group.offsetWidth, boost = 0;
    addEventListener('resize', () => { w = group.offsetWidth; });
    if (reduce) return;
    gsap.ticker.add((t, dt) => {
      const v = lenis ? Math.min(Math.abs(lenis.velocity), 60) : 0;
      boost += (v * 0.08 - boost) * 0.1;
      x += dir * (0.6 + boost) * (dt / 16.67);
      if (x <= -w) x += w; if (x > 0) x -= w;
      track.style.transform = `translate3d(${x}px,0,0)`;
    });
  };

  /* ---------- horizontal pinned tracks ---------- */
  A.hTracks = [];
  const hscroll = (sec) => {
    const track = $('.hs__track', sec), bar = $('.hs__bar i', sec), count = $('.hs__count b', sec);
    const items = $$('[data-hs-item]', sec);
    if (reduce) { sec.style.overflowX = 'auto'; return; }
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: sec, start: 'top top', end: () => '+=' + dist() * 1.05, pin: true, refreshPriority: 1, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: s => {
          if (bar) gsap.set(bar, { scaleX: s.progress });
          if (count && items.length) count.textContent = String(Math.min(items.length, Math.floor(s.progress * items.length * 0.999) + 1)).padStart(2, '0');
        },
      },
    });
    A.hTracks.push({ sec, tween });
    /* velocity skew: panels lean into fast scrolling */

    items.forEach(item => {
      gsap.fromTo(item, { rotationY: -18, z: -120, opacity: 0.25, transformPerspective: 1400, transformOrigin: 'left center' }, {
        rotationY: 0, z: 0, opacity: 1, ease: 'none',
        scrollTrigger: { containerAnimation: tween, trigger: item, start: 'left 100%', end: 'left 62%', scrub: true, onLeave: () => gsap.set(item, { clearProps: 'transform' }) },
      });
      $$('[data-hs-draw]', item).forEach(p => gsap.from(p, {
        drawSVG: 0, ease: 'none', stagger: 0.1,
        scrollTrigger: { containerAnimation: tween, trigger: item, start: 'left 85%', end: 'left 25%', scrub: true },
      }));
      $$('[data-hs-par]', item).forEach(p => gsap.fromTo(p, { xPercent: 30 }, {
        xPercent: -30, ease: 'none',
        scrollTrigger: { containerAnimation: tween, trigger: item, start: 'left right', end: 'right left', scrub: true },
      }));
    });
    return tween;
  };

  /* ---------- scroll-built motion ---------- */
  const buildScroll = () => {
    $$('[data-split]:not([data-split="intro"])').forEach(el => splitLines(el));

    $$('[data-scrub-words]').forEach(el => {
      const s = SplitText.create(el, { type: 'words', wordsClass: 'word' });
      if (reduce) return;
      gsap.to(s.words, { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: true } });
    });

    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%', once: true,
      onEnter: b => gsap.to(b, { opacity: 1, y: 0, scale: 1, stagger: 0.09, duration: 1.2, ease: 'expo.out', overwrite: true }),
    });

    $$('[data-draw]').forEach(p => {
      if (reduce) return;
      gsap.from(p, { drawSVG: 0, duration: 2.6, ease: 'power2.inOut', scrollTrigger: { trigger: p.closest('svg') || p, start: 'top 92%', once: true } });
    });

    $$('[data-speed]').forEach(el => {
      if (reduce) return;
      const s = parseFloat(el.dataset.speed);
      gsap.fromTo(el, { yPercent: -s * 50 }, { yPercent: s * 50, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    $$('[data-count]').forEach(el => {
      const end = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length, o = { v: 0 };
      if (reduce) { el.textContent = end.toFixed(dec); return; }
      gsap.to(o, { v: end, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => { el.textContent = o.v.toFixed(dec); } });
    });

    $$('[data-rule]').forEach(el => gsap.from(el, { scaleX: 0, duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));


    /* photography: clip reveals, parallax, full-bleed band */
    $$('[data-img-reveal]').forEach(el => {
      if (reduce) return;
      const img = $('img', el);
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
        .to(el, { clipPath: 'inset(0% 0 0 0 round 16px)', duration: 1.5, ease: 'expo.inOut' })
        .from(img, { scale: 1.35, duration: 2, ease: 'expo.out' }, 0.1);
    });
    $$('[data-parallax] img, img[data-parallax]').forEach(img => {
      if (reduce) return;
      const host = img.closest('[data-parallax]') === img ? img.parentElement : img.closest('[data-parallax]');
      gsap.fromTo(img, { yPercent: -9, scale: 1.2 }, { yPercent: 9, scale: 1.2, ease: 'none', scrollTrigger: { trigger: host, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('.photoband').forEach(band => {
      const frame = $('.photoband__frame', band), img = $('img', frame), txt = $('.photoband__text', band);
      if (reduce) { gsap.set(frame, { clipPath: 'inset(0% 0% round 0px)' }); return; }
      gsap.timeline({ scrollTrigger: { trigger: band, start: 'top top', end: 'bottom bottom', scrub: 1 } })
        .to(frame, { clipPath: 'inset(0% 0% round 0px)', ease: 'none', duration: 1 })
        .to(img, { scale: 1, ease: 'none', duration: 1 }, 0)
        .fromTo(txt, { y: 80, opacity: 0.2 }, { y: 0, opacity: 1, ease: 'none', duration: 0.8 }, 0.15);
    });

    $$('[data-marquee]').forEach(marquee);
    $$('[data-hscroll]').forEach(hscroll);

    /* FAQ accordion */
    $$('.faq__item').forEach(item => {
      const q = $('.faq__q', item), a = $('.faq__a', item);
      q.setAttribute('aria-expanded', 'false');
      q.addEventListener('click', () => {
        const open = !item.classList.contains('is-open');
        item.classList.toggle('is-open', open); q.setAttribute('aria-expanded', open);
        gsap.to(a, { height: open ? 'auto' : 0, duration: 0.8, ease: 'expo.out', onComplete: () => ScrollTrigger.refresh() });
        if (open) gsap.from($('p', a), { y: 16, opacity: 0, duration: 0.8, delay: 0.05 });
      });
    });

    /* table of contents */
    const tocLinks = $$('.toc a');
    tocLinks.forEach(a => {
      const sec = $(a.getAttribute('href'));
      if (!sec) return;
      ScrollTrigger.create({ trigger: sec, start: 'top 45%', end: 'bottom 45%', onToggle: s => s.isActive && tocLinks.forEach(l => l.classList.toggle('is-active', l === a)) });
    });
  };

  /* ---------- boot sequence ---------- */
  const intro = () => {
    html.dataset.introDone = '1';
    document.dispatchEvent(new CustomEvent('artha:intro'));
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    $$('[data-split="intro"]').forEach((el, i) => splitLines(el, { scroll: false, delay: 0.1 + i * 0.15 }));
    const introEls = $$('[data-intro]');
    if (introEls.length && !reduce) tl.from(introEls, { y: 30, opacity: 0, duration: 1.4, stagger: 0.1, delay: 0.35 }, 0);
    if (!reduce) tl.from(A.fromLoader ? '.header__inner > *:not(.lockup)' : '.header__inner > *', { y: -30, opacity: 0, duration: 1.2, stagger: 0.08 }, 0.1);
    if (!reduce && A.fromLoader) tl.from('.header .lockup__word', { opacity: 0, x: -12, duration: 1 }, 0.35).from('.header .lockup__icon svg', { opacity: 0, duration: 0.3 }, 0.5);
    window.ArthaPage?.intro?.(tl, A);
  };

  const runLoader = () => new Promise(res => {
    const loader = $('.loader');
    try { sessionStorage.setItem('artha-visited', '1'); } catch (e) {}
    if (!loader || reduce || getComputedStyle(loader).display === 'none') return res();
    lenis?.stop();
    A.fromLoader = true;
    const paths = $$('.loader__mark path'), counter = $('.loader__count');
    const o = { v: 0 };
    const tl = gsap.timeline({ onComplete: () => { loader.remove(); lenis?.start(); } });
    tl.from(paths, { drawSVG: 0, duration: 1.7, ease: 'power2.inOut' }, 0)
      .to(o, { v: 100, duration: 2.3, ease: 'power2.inOut', onUpdate: () => { counter.textContent = String(Math.round(o.v)).padStart(3, '0'); } }, 0)
      .to('.loader__bar i', { scaleX: 1, duration: 2.3, ease: 'power2.inOut' }, 0)
      .to(paths, { fillOpacity: 1, strokeOpacity: 0, duration: 0.9, ease: 'power2.out' }, 1.2)
      .fromTo('.loader__word', { clipPath: 'inset(0 100% 0 0)', x: -20 }, { clipPath: 'inset(0 0% 0 0)', x: 0, duration: 1.4, ease: 'expo.inOut' }, 0.9)
      .from('.loader__tag', { opacity: 0, letterSpacing: '0.7em', duration: 1.4 }, 1.4)
      .to(['.loader__word', '.loader__tag'], { opacity: 0, y: -16, duration: 0.6, ease: 'expo.in', stagger: 0.05 }, 2.3)
      .to('.loader__meta', { opacity: 0, duration: 0.4 }, 2.4)
      .add(() => {
        // FLIP: the drawn mark flies into the header logo tile
        const mark = $('.loader__mark'), target = $('.header .lockup__icon svg');
        if (!target) return;
        const a = mark.getBoundingClientRect(), b = target.getBoundingClientRect();
        if ($('[data-header]').classList.contains('is-dark')) gsap.to(paths, { fill: '#143D33', duration: 1, delay: 0.3 });
        gsap.to(mark, { x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2), scale: b.width / a.width, duration: 1.2, ease: 'expo.inOut' });
      }, 2.5)
      .to('.loader__panel--top', { yPercent: -100, duration: 1.3, ease: 'expo.inOut' }, 3.0)
      .to('.loader__panel--bottom', { yPercent: 100, duration: 1.3, ease: 'expo.inOut' }, 3.0)
      .add(res, 3.2)
      .to('.loader__mark', { opacity: 0, duration: 0.35 }, 3.75);
  });

  const runCurtainOut = () => new Promise(res => {
    if (!html.classList.contains('is-return') || reduce) { gsap.set(curtainCols, { scaleY: 0 }); gsap.set(curtainMark, { opacity: 0 }); return res(); }
    gsap.timeline()
      .to(curtainMark, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'power2.in' }, 0.05)
      .set(curtainCols, { transformOrigin: 'top' })
      .to(curtainCols, { scaleY: 0, duration: 0.9, stagger: 0.07, ease: 'expo.inOut' }, 0.2)
      .add(res, 0.45);
  });

  const fontsReady = Promise.race([
    Promise.all(['600 1em "Clash Display"', '500 1em "Clash Display"', 'italic 700 1em Zodiak', '400 1em "General Sans"', '500 1em "General Sans"'].map(f => document.fonts?.load(f).catch(() => {}))).then(() => document.fonts?.ready),
    new Promise(r => setTimeout(r, 6000)),
  ]);
  const boot = () => fontsReady.then(async () => {
    buildScroll();
    window.ArthaPage?.init?.(A);
    darkTriggers();
    await (html.classList.contains('is-return') ? runCurtainOut() : runLoader());
    intro();
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    if (location.hash && $(location.hash)) setTimeout(() => A.scrollTo(location.hash, { immediate: true }), 50);
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else setTimeout(boot, 0);
  addEventListener('load', () => ScrollTrigger.refresh());
})();
