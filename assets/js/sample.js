/* Sample page: the report opens on scroll; a 3D page-turn viewer */
window.ArthaPage = {
  init(A) {
    const { $, $$, reduce } = A;

    /* book opens */
    const sec = $('[data-book-open]');
    if (sec) {
      const spread = $('[data-spread]'), cover = $('[data-cover]');
      if (reduce) { gsap.set(cover, { rotationY: -180 }); }
      else {
        gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 1 } })
          .fromTo(spread, { rotationX: 55, rotationZ: -18, scale: 0.7, x: '-25%' }, { rotationX: 0, rotationZ: 0, scale: 1, x: '0%', ease: 'none', duration: 1 })
          .to(cover, { rotationY: -180, ease: 'none', duration: 1.2 }, 0.6)
          .from($$('.spread__left .rpage > *, .spread__right .rpage > *', spread), { opacity: 0, y: 12, stagger: 0.02, ease: 'none', duration: 0.6 }, 1.2)
          .to('.book-open__label', { opacity: 0, duration: 0.3 }, 0.4)
          .to(spread, { scale: 1.06, ease: 'none', duration: 0.6 });
      }
    }

    /* viewer */
    const stage = $('[data-viewer]');
    if (!stage) return;
    const pages = $$('.rpage', stage), dots = $('[data-dots]'), label = $('[data-page-label]');
    const names = ['Cover', 'Allocation', 'Sector exposure', 'Concentration', 'Observations'];
    let cur = 0, busy = false;
    pages.forEach((p, i) => {
      const b = document.createElement('button'); b.setAttribute('aria-label', `Go to page ${i + 1}`);
      b.addEventListener('click', () => go(i)); dots.appendChild(b);
      gsap.set(p, { xPercent: -50, left: '50%', rotationY: i === 0 ? 0 : 90, opacity: i === 0 ? 1 : 0, zIndex: pages.length - i, transformOrigin: 'left center' });
    });
    const sync = () => { [...dots.children].forEach((d, i) => d.classList.toggle('is-on', i === cur)); label.textContent = `Page ${cur + 1} of ${pages.length} · ${names[cur]}`; };
    const go = (n) => {
      n = (n + pages.length) % pages.length; if (n === cur || busy) return;
      const fwd = n > cur, from = pages[cur], to = pages[n];
      busy = true;
      const d = reduce ? 0 : 0.9;
      gsap.set(to, { zIndex: 10, opacity: 1, rotationY: fwd ? 70 : -70, transformOrigin: fwd ? 'right center' : 'left center', x: fwd ? 60 : -60 });
      gsap.timeline({ onComplete: () => { gsap.set(from, { opacity: 0, zIndex: 1 }); busy = false; } })
        .to(from, { rotationY: fwd ? -100 : 100, x: fwd ? -80 : 80, opacity: 0, transformOrigin: fwd ? 'left center' : 'right center', duration: d, ease: 'power3.inOut' }, 0)
        .to(to, { rotationY: 0, x: 0, duration: d * 1.1, ease: 'expo.out' }, d * 0.3);
      cur = n; sync();
    };
    $('[data-next]').addEventListener('click', () => go(cur + 1));
    $('[data-prev]').addEventListener('click', () => go(cur - 1));
    stage.addEventListener('keydown', e => { if (e.key === 'ArrowRight') go(cur + 1); if (e.key === 'ArrowLeft') go(cur - 1); });
    let sx = null;
    stage.addEventListener('pointerdown', e => { sx = e.clientX; });
    addEventListener('pointerup', e => { if (sx === null) return; const dx = e.clientX - sx; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); sx = null; });
    sync();
  },
};
