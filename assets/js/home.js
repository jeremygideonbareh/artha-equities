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


    /* X-ray: a live, non-advisory diagnostic of a synthetic portfolio */
    const xr = $('#xray');
    if (xr) {
      const S = [['Financials', '#C8A96B'], ['Technology', '#7C9186'], ['Energy', '#E4D2A6'], ['Consumer', '#B08A45'], ['Healthcare', '#D9D4C8']];
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
          <p><b>DERIVED</b><span>${above} of ${S.length} sectors each hold 20% or more of the portfolio.</span></p>
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

    /* orbit */
    if (!reduce) gsap.to('[data-orbit]', { rotation: 180, ease: 'none', transformOrigin: '50% 50%', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true } });
  },
};
