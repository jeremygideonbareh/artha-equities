/* Product pages: the 3D report, window bar, upgrade maths, ordering line */
window.ArthaPage = {
  init(A) {
    const { $, $$, reduce, fine } = A;

    /* 3D report: floats, follows the pointer, turns as you scroll away */
    const stage = $('[data-book-stage]'), book = $('[data-book]');
    if (stage && book && !reduce) {
      const state = { rx: 8, ry: -28, mx: 0, my: 0, scroll: 0, spin: 0 };
      if (fine) stage.addEventListener('pointermove', e => {
        const r = stage.getBoundingClientRect();
        state.mx = ((e.clientX - r.left) / r.width - 0.5) * 2; state.my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      });
      stage.addEventListener('pointerleave', () => { state.mx = 0; state.my = 0; });
      stage.addEventListener('click', () => gsap.to(state, { spin: state.spin + 360, duration: 1.6, ease: 'expo.inOut' }));
      ScrollTrigger.create({ trigger: stage, start: 'top top+=100', end: 'bottom top', scrub: true, onUpdate: s => { state.scroll = s.progress; } });
      let cx = 0, cy = 0;
      gsap.ticker.add((t) => {
        cx += (state.mx - cx) * 0.06; cy += (state.my - cy) * 0.06;
        const ry = -28 + cx * 22 + state.scroll * 90 + state.spin, rx = 8 - cy * 12 - state.scroll * 10;
        book.style.transform = `translateY(${Math.sin(t * 1.1) * 10 - state.scroll * 60}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        book.style.setProperty('--shine', `${-60 + ((ry + 28) % 360) * 1.6}%`);
      });
      gsap.from(book, { rotateY: -200, y: 120, opacity: 0, duration: 2.2, ease: 'expo.out', delay: 0.4 });
    }

    /* ordering line */
    const ms = $('[data-mini-steps]');
    if (ms) gsap.to($('.mini-steps__line i', ms), { scaleX: 1, ease: 'none', scrollTrigger: { trigger: ms, start: 'top 75%', end: 'bottom 55%', scrub: true } });

    /* upgrade: window bar + calculation */
    const bar = $('[data-window-bar]');
    if (bar) gsap.to($('.timeline-bar__fill', bar), { scaleX: 1, ease: 'none', scrollTrigger: { trigger: bar, start: 'top 85%', end: 'top 45%', scrub: true } });
    const calc = $('[data-calc]');
    if (calc && !reduce) $$('b', calc).forEach((b, i) => {
      const end = parseFloat(b.textContent.replace(/[^\d.]/g, '')) || 0, o = { v: 0 };
      b.textContent = formatINR(0);
      gsap.to(o, { v: end, duration: 1.6, delay: i * 0.3, ease: 'power3.out', scrollTrigger: { trigger: calc, start: 'top 80%', once: true }, onUpdate: () => { b.textContent = formatINR(Math.round(o.v)); } });
    });

    /* donut segments grow in horizontal track */
    $$('[data-donut]').forEach((c, i) => {
      const dash = c.getAttribute('stroke-dasharray').split(' ');
      gsap.fromTo(c, { attr: { 'stroke-dasharray': `0 ${dash[1]}` } }, { attr: { 'stroke-dasharray': dash.join(' ') }, duration: 1.4, delay: i * 0.2, ease: 'expo.out', scrollTrigger: { trigger: c.closest('.rcard'), start: 'top 90%', once: true } });
    });

    /* report bars in excerpts */
    $$('.excerpt [data-bar]').forEach(b => gsap.from(b, { scaleX: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: b, start: 'top 92%', once: true } }));
  },
};
