/* How it works: document stack, lifecycle rail, password flow */
window.ArthaPage = {
  init(A) {
    const { $, $$, reduce } = A;

    /* the four steps on a 3D ring, turned by scroll */
    const ringSec = $('[data-ring]');
    if (ringSec) {
      const el = $('[data-ring-el]', ringSec), faces = $$('.ring__face', ringSec), num = $('[data-ring-num]'), list = $$('[data-ring-list] li');
      let cur = -1;
      const drawn = new Set();
      const setActive = (i) => {
        if (i === cur) return; cur = i;
        num.textContent = '0' + (i + 1);
        list.forEach((l, k) => l.classList.toggle('is-on', k === i));
        if (!reduce) gsap.fromTo(num, { yPercent: 50, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7 });
        if (!drawn.has(i) && !reduce) { drawn.add(i); gsap.from($$('[data-ring-draw]', faces[i]), { drawSVG: 0, duration: 1.4, stagger: 0.12, ease: 'power2.inOut' }); }
      };
      const shade = () => {
        const r = gsap.getProperty(el, 'rotationY');
        faces.forEach((f, i) => { const a = Math.abs(i * 36 + r); f.style.opacity = Math.max(0.12, 1 - a / 80).toFixed(3); f.style.filter = `brightness(${Math.max(0.55, 1 - a / 120).toFixed(2)})`; f.style.pointerEvents = a < 18 ? 'auto' : 'none'; });
      };
      const setZ = () => gsap.set(el, { z: -faces[0].offsetWidth * 1.5 });
      setZ(); addEventListener('resize', setZ);
      gsap.to(el, {
        rotationY: -108, ease: 'none', onUpdate: shade,
        scrollTrigger: { trigger: ringSec, pin: true, refreshPriority: 1, start: 'top top', end: '+=260%', scrub: 1, snap: reduce ? false : { snapTo: 1 / 3, duration: 0.7, ease: 'power2.inOut', delay: 0.05 },
          onUpdate: s => setActive(Math.min(3, Math.round(s.progress * 3))) },
      });
      shade(); setActive(0);
    }

    const stack = $('[data-docstack]');
    if (stack) {
      const sheets = $$('.docstack__sheet', stack);
      gsap.set(sheets, { rotationX: 52, rotationZ: -28, z: (i) => i * 10 });
      if (!reduce) gsap.to(sheets, {
        z: (i) => i * 90, y: (i) => -i * 26, rotationX: 38, rotationZ: -18, ease: 'none', stagger: 0,
        scrollTrigger: { trigger: stack, start: 'top 85%', end: 'bottom 30%', scrub: 1 },
      });
    }

    const life = $('[data-life]');
    if (life) $$('.vstep', life).forEach(step => {
      gsap.to($('.vstep__rail i', step), { scaleY: 1, ease: 'none', scrollTrigger: { trigger: step, start: 'top 60%', end: 'bottom 60%', scrub: true } });
      ScrollTrigger.create({ trigger: step, start: 'top 62%', onToggle: s => step.classList.toggle('is-on', s.isActive || s.progress === 1), end: 'max' });
      gsap.from(step.children, { opacity: 0, x: 30, stagger: 0.08, duration: 1, scrollTrigger: { trigger: step, start: 'top 80%', once: true } });
    });

    const pw = $('[data-pwflow]');
    if (pw && !reduce) gsap.timeline({ scrollTrigger: { trigger: pw, start: 'top 90%', once: true } })
      .from($$('.pw-flow__node', pw), { opacity: 0, y: 14, stagger: 0.35, duration: 0.7 })
      .from($$('i', pw), { scaleX: 0, stagger: 0.35, duration: 0.5, ease: 'power2.out' }, 0.2)
      .to($$('.pw-flow__node', pw)[0], { opacity: 0.35, textDecoration: 'line-through', duration: 0.4 }, '+=.3');

    const j = $('[data-journey]');
    if (j && !reduce) gsap.from(j.children, { y: 60, opacity: 0, rotationX: -20, transformPerspective: 800, stagger: 0.12, duration: 1.2, scrollTrigger: { trigger: j, start: 'top 85%', once: true } });
  },
};
