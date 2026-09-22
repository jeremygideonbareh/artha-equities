/* About: principles track gets a gentle parallax on its numerals */
window.ArthaPage = {
  init(A) {
    const t = A.hTracks[0];
    if (!t || A.reduce) return;
    A.$$('.pr-card__n').forEach(n => gsap.fromTo(n, { x: 80 }, { x: -40, ease: 'none', scrollTrigger: { containerAnimation: t.tween, trigger: n.closest('.pr-card'), start: 'left right', end: 'right left', scrub: true } }));
  },
};
