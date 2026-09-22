/* Home page choreography */
window.ArthaPage = {
  init(A) {
    const { $, $$, reduce } = A;

    /* hero copy drifts and dissolves as the landscape takes over */
    if (!reduce) gsap.to('.hero__copy', { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: true } });

    /* report fan: stacked pages open into a spread */
    const fan = $('[data-fan]');
    if (fan) {
      const pages = $$('.rpage', fan);
      const spread = [{ x: -165, r: -14, y: 30 }, { x: -55, r: -4, y: 0 }, { x: 55, r: 4, y: 0 }, { x: 165, r: 14, y: 30 }];
      const k = () => Math.min(1, fan.clientWidth / 820);
      gsap.set(pages, { x: 0, rotation: 0, rotationY: 0, scale: 0.9 });
      if (!reduce) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: fan, start: 'top 85%', end: 'center 45%', scrub: 1 } });
        pages.forEach((p, i) => tl.fromTo(p, { x: 0, y: 80, rotation: 0, rotationX: 30, opacity: 0.4 },
          { x: () => spread[i].x * k(), y: spread[i].y, rotation: spread[i].r, rotationX: 0, opacity: 1, ease: 'none' }, 0));
        pages.forEach((p, i) => {
          p.addEventListener('pointerenter', () => gsap.to(p, { y: spread[i].y - 34, scale: 0.98, zIndex: 10, duration: 0.6 }));
          p.addEventListener('pointerleave', () => gsap.to(p, { y: spread[i].y, scale: 0.9, zIndex: i, duration: 0.6 }));
        });
      } else pages.forEach((p, i) => gsap.set(p, { x: spread[i].x * k(), y: spread[i].y, rotation: spread[i].r }));
      $$('[data-bar]', fan).forEach(b => gsap.from(b, { scaleX: 0, duration: 1.4, scrollTrigger: { trigger: fan, start: 'top 60%', once: true } }));
    }

    /* review gate: nodes light up, then advice-style wording is flagged and struck */
    const gate = $('[data-gate]');
    if (gate) {
      const nodes = $$('.gate__node', gate), flags = $$('.flag', gate), chip = $('[data-gate-chip]', gate), note = $('[data-gate-note]', gate);
      const setNode = (n) => nodes.forEach((el, i) => { el.classList.toggle('is-on', i < n); el.classList.toggle('is-current', i === n); });
      let last = -1;
      const render = (t) => {
        const st = t < 1 ? 0 : t < 2 ? 1 : t < 2.8 ? 2 : t < 3.6 ? 3 : t < 4.9 ? 4 : 5;
        if (st === last) return; last = st;
        setNode(Math.min(st, 2));
        flags.forEach(f => { f.classList.toggle('is-flagged', st >= 3); f.classList.toggle('is-struck', st >= 4); });
        const c = [['chip--muted', 'Awaiting draft'], ['chip--gen', 'Generating'], ['chip--gen', 'Checking wording'], ['chip--hold', '3 phrases flagged'], ['chip--review', 'Reviewer resolving'], ['chip--done', 'Approved · Delivered']][st];
        chip.className = 'chip ' + c[0]; chip.textContent = c[1];
        note.textContent = st === 5 ? 'Released by a person, not a script' : 'Approval blocked until resolved';
        if (st === 5) nodes.forEach(n => { n.classList.add('is-on'); n.classList.remove('is-current'); });
      };
      const tl = gsap.timeline({ scrollTrigger: { trigger: gate, start: 'top 75%', end: 'bottom 30%', scrub: 1 }, onUpdate: () => render(tl.time()) });
      tl.to('.gate__track i', { scaleX: 0.66, ease: 'none', duration: 3 }, 0)
        .to('.gate__track i', { scaleX: 1, ease: 'none', duration: 1 }, 4)
        .to({}, { duration: 0.4 });
      render(0);
    }

    /* orbit */
    if (!reduce) gsap.to('[data-orbit]', { rotation: 180, ease: 'none', transformOrigin: '50% 50%', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true } });
  },
};
