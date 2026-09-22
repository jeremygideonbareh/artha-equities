/* Methodology: evidence plates separate in 3D as you read; TOC progress */
window.ArthaPage = {
  init(A) {
    const { $, $$, reduce } = A;
    const plates = $$('[data-plates] .plate');
    if (plates.length) {
      gsap.set('.plates__stack', { rotationX: 58, rotationZ: -38 });
      gsap.set(plates, { z: 0 });
      if (!reduce) gsap.timeline({ scrollTrigger: { trigger: '[data-plates]', start: 'top 85%', end: 'bottom 35%', scrub: 1 } })
        .to(plates, { z: (i) => (2 - i) * 70, ease: 'none' })
        .to('.plates__stack', { rotationZ: -28, ease: 'none' }, 0);
      else gsap.set(plates, { z: (i) => (2 - i) * 70 });
    }
    const bar = $('.toc__progress i');
    if (bar) gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.prose', start: 'top 40%', end: 'bottom 60%', scrub: true } });
  },
};
