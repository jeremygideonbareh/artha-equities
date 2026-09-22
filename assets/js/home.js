/* Home page choreography */
window.ArthaPage = {
  init(A) {
    const { $, $$, reduce, fine } = A;

    /* hero pins while the report opens; the copy steps aside */
    if (!reduce) {
      const heroTl = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=110%', pin: true, scrub: 1, refreshPriority: 2,
        onUpdate: s => { A.heroProgress = s.progress; } } });
      heroTl.to('.hero__copy', { yPercent: -14, opacity: 0, ease: 'power1.in', duration: 0.45 }, 0)
        .to('.hero__meta', { opacity: 0, duration: 0.2 }, 0)
        .to('[data-hero-photo] img', { scale: 1.12, yPercent: 6, ease: 'none', duration: 1 }, 0);
    }

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


    /* X-ray: a live, non-advisory diagnostic of a synthetic portfolio */
    const xr = $('#xray');
    if (xr) {
      const S = [['Financials', '#DDC07E'], ['Technology', '#F1EEE9'], ['Energy', '#7C9186'], ['Consumer', '#B0703F'], ['Healthcare', '#4F8A76']];
      const w = [31, 22, 14, 12, 7];
      const sl = $('[data-xray-sliders]', xr), lg = $('[data-xray-legend]', xr), dn = $('[data-xray-donut]', xr), obs = $('[data-xray-obs]', xr);
      const R = 80, CIRC = 2 * Math.PI * R;
      dn.innerHTML = S.map(([, c]) => `<circle cx="100" cy="100" r="${R}" stroke="${c}" stroke-dasharray="0 ${CIRC}" />`).join('') + `<circle cx="100" cy="100" r="${R - 20}" stroke="rgba(247,243,234,.08)" style="stroke-width:1" />`;
      const arcs = $$('circle', dn).slice(0, S.length);
      sl.innerHTML = S.map(([n, c], i) => `<div class="slider"><label for="xr${i}"><i style="background:${c}"></i>${n}</label><input id="xr${i}" type="range" min="0" max="100" value="${w[i]}"><output for="xr${i}">0%</output></div>`).join('');
      lg.innerHTML = S.map(([n, c]) => `<span><i style="background:${c}"></i>${n}<b>0%</b></span>`).join('');
      const inputs = $$('input', sl), outs = $$('output', sl), lgv = $$('b', lg);
      const topEl = $('[data-xray-top]', xr), topName = $('[data-xray-top-name]', xr);
      const shown = { top: 0 };
      let obsKey = '';
      const render = (instant) => {
        const raw = inputs.map(i => +i.value), sum = raw.reduce((a, b) => a + b, 0) || 1;
        const pct = raw.map(v => v / sum * 100);
        let off = 0;
        pct.forEach((p, i) => {
          const len = p / 100 * CIRC;
          gsap.to(arcs[i], { attr: { 'stroke-dasharray': `${Math.max(0, len - 2)} ${CIRC}`, 'stroke-dashoffset': -off }, duration: instant ? 0 : 0.8, ease: 'expo.out' });
          off += len;
          outs[i].textContent = p.toFixed(0) + '%'; lgv[i].textContent = p.toFixed(1) + '%';
          inputs[i].style.setProperty('--p', inputs[i].value + '%');
        });
        const ti = pct.indexOf(Math.max(...pct));
        gsap.to(shown, { top: pct[ti], duration: instant ? 0 : 0.8, ease: 'expo.out', onUpdate: () => { topEl.textContent = shown.top.toFixed(0) + '%'; } });
        topName.textContent = S[ti][0];
        const hhi = pct.reduce((a, p) => a + (p / 100) ** 2, 0), above = pct.filter(p => p >= 20).length;
        const level = hhi < 0.22 ? 'lower' : hhi < 0.35 ? 'moderate' : 'higher';
        const key = [ti, above, level].join('|');
        obs.innerHTML = `<p><b>DERIVED</b><span>${S[ti][0]} is the largest sector, at ${pct[ti].toFixed(1)}% of equity value.</span></p>
          <p><b>DERIVED</b><span>${above === 0 ? 'No sector holds' : above === 1 ? '1 of ' + S.length + ' sectors holds' : above + ' of ' + S.length + ' sectors each hold'} 20% or more of the portfolio.</span></p>
          <p><b>DERIVED</b><span>Concentration index (HHI) ${hhi.toFixed(2)}: ${level} concentration by this measure.</span></p>
          <p><b>CHECK</b><span>Phrase check: 0 advisory terms. Describes; does not recommend.</span></p>`;
        if (key !== obsKey && !instant && !reduce) gsap.from($$('p', obs), { opacity: 0, x: 14, stagger: 0.05, duration: 0.5 });
        obsKey = key;
      };
      inputs.forEach(i => i.addEventListener('input', () => { $$('[data-xray-presets] button').forEach(b => b.classList.remove('is-on')); render(); }));
      $$('[data-xray-presets] button').forEach(b => b.addEventListener('click', () => {
        const v = b.dataset.p.split(',').map(Number);
        $$('[data-xray-presets] button').forEach(x => x.classList.toggle('is-on', x === b));
        inputs.forEach((i, k) => { const o = { v: +i.value }; gsap.to(o, { v: v[k], duration: reduce ? 0 : 0.9, ease: 'expo.inOut', onUpdate: () => { i.value = o.v; render(true); }, onComplete: () => render() }); });
      }));
      render(true);
      ScrollTrigger.create({ trigger: xr, start: 'top 70%', once: true, onEnter: () => { arcs.forEach(a => gsap.set(a, { attr: { 'stroke-dasharray': `0 ${CIRC}` } })); render(); } });
      const panel = $('[data-xray-panel]', xr);
      panel.addEventListener('pointermove', e => { const r = panel.getBoundingClientRect(); panel.style.setProperty('--gx', (e.clientX - r.left) + 'px'); panel.style.setProperty('--gy', (e.clientY - r.top) + 'px'); });
    }


    /* Chapter I: holdings drift in fog, the story unfolds, everything collapses into one statement */
    const fog = $('.story-fog');
    if (fog) {
      const chips = $$('.fog-chip', fog), lines = $$('.story-lines p', fog), doc = $('.fog-doc', fog), layer = $('.story-fog__chips', fog);
      const rnd = gsap.utils.random;
      gsap.set(doc, { xPercent: -50, yPercent: -50 });
      chips.forEach((c, i) => {
        const z = rnd(-700, 250), side = i % 2 ? 1 : -1;
        c.dataset.z = z;
        gsap.set(c, { xPercent: -50, yPercent: -50, x: side * rnd(innerWidth * 0.08, innerWidth * 0.46), y: rnd(-innerHeight * 0.42, innerHeight * 0.42), z,
          rotation: rnd(-8, 8), filter: `blur(${Math.max(0, (-z) / 140).toFixed(1)}px)`, opacity: gsap.utils.mapRange(-700, 250, 0.35, 1, z) });
      });
      if (reduce) { gsap.set(lines[lines.length - 1], { opacity: 1 }); gsap.set(doc, { opacity: 1 }); }
      else {
        const tl = gsap.timeline({ scrollTrigger: { trigger: fog, start: 'top top', end: '+=360%', pin: true, scrub: 1, refreshPriority: 1 } });
        tl.fromTo(chips, { opacity: 0 }, { opacity: (i, el) => gsap.utils.mapRange(-700, 250, 0.35, 1, +el.dataset.z), stagger: 0.02, duration: 0.6 }, 0)
          .to(chips, { y: (i, el) => '-=' + (160 + (+el.dataset.z + 700) * 0.35), rotation: '+=6', ease: 'none', duration: 4.2 }, 0)
          .to('.story-fog__photo img', { scale: 1.18, ease: 'none', duration: 5 }, 0);
        lines.forEach((l, i) => {
          tl.fromTo(l, { opacity: 0, y: 50, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' }, 0.05 + i * 1.0);
          if (i < lines.length - 1) tl.to(l, { opacity: 0, y: -40, filter: 'blur(6px)', duration: 0.4, ease: 'power2.in' }, 0.05 + i * 1.0 + 0.72);
        });
        tl.to(chips, { x: 0, y: 0, z: 0, scale: 0.2, rotation: 0, opacity: 0, filter: 'blur(0px)', stagger: { each: 0.03, from: 'random' }, duration: 0.9, ease: 'power3.in' }, 4.2)
          .to(lines[lines.length - 1], { opacity: 0, y: -30, duration: 0.4 }, 4.3)
          .fromTo(doc, { opacity: 0, scale: 0.4, rotationX: 50, rotationY: -20 }, { opacity: 1, scale: 1, rotationX: 0, rotationY: 0, duration: 0.9, ease: 'expo.out' }, 4.8)
          .to({}, { duration: 0.6 });
        if (fine) {
          const rx = gsap.quickTo(layer, 'rotationY', { duration: 1.2, ease: 'power3' }), ry = gsap.quickTo(layer, 'rotationX', { duration: 1.2, ease: 'power3' });
          fog.addEventListener('pointermove', e => { rx((e.clientX / innerWidth - 0.5) * 14); ry((0.5 - e.clientY / innerHeight) * 10); });
        }
      }
    }

    /* Epilogue: the fog lifts off the summit */
    const summit = $('.summit');
    if (summit && !reduce) {
      gsap.timeline({ scrollTrigger: { trigger: summit, start: 'top bottom', end: 'center center', scrub: 1 } })
        .fromTo('.summit__photo img', { scale: 1.45, filter: 'brightness(.45) saturate(.6)' }, { scale: 1, filter: 'brightness(.95) saturate(1)', ease: 'none' }, 0)
        .fromTo('.summit__mist', { opacity: 1 }, { opacity: 0, ease: 'power1.in' }, 0);
    } else if (summit) gsap.set('.summit__mist', { opacity: 0 });

    /* orbit */
    if (!reduce) gsap.to('[data-orbit]', { rotation: 180, ease: 'none', transformOrigin: '50% 50%', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true } });
  },
};
