/* How it works: document stack, lifecycle rail, password flow */
window.ArthaPage = {
  init(A) {
    const { $, $$, reduce } = A;

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
