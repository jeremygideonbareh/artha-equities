/* Synthetic report page templates. Every page carries the illustrative-data marking.
   Usage: <div data-rpage="cover|alloc|sector|conc|obs|deck" data-tone="bronze"></div> */
(() => {
  const mark = '<svg viewBox="0 0 100 100"><use href="#mark"/></svg>';
  const stamp = '<span class="rpage__stamp">Illustrative data. Not a real client.</span>';
  const head = (label, n) => `<div class="rpage__head">${mark}<span>${label}</span><span>p. ${n}</span></div>`;
  const foot = (n) => `<div class="rpage__foot"><span>Artha Equities · Portfolio Intelligence Report</span><span>${n} / 24</span></div>`;
  const lines = (n) => `<div class="rpage__lines">${'<i></i>'.repeat(n)}</div>`;
  const ridge = '<svg class="ridge" viewBox="0 0 300 90"><path d="M0 80 L40 52 L70 64 L110 26 L140 46 L180 12 L215 40 L250 22 L300 58"/><path d="M0 86 L50 66 L90 74 L130 48 L170 62 L210 40 L260 58 L300 50" opacity=".5"/></svg>';

  const donut = () => {
    const segs = [[48, '#123C32', 'Large cap'], [27, '#7C9186', 'Mid cap'], [15, '#C8A96B', 'Small cap'], [10, '#D9D4C8', 'Cash and other']];
    let off = 0; const r = 38, C = 2 * Math.PI * r;
    const circles = segs.map(([v, c]) => { const s = `<circle cx="50" cy="50" r="${r}" stroke="${c}" stroke-dasharray="${(v / 100) * C} ${C}" stroke-dashoffset="${-off}" />`; off += (v / 100) * C; return s; }).join('');
    return `<div class="rdonut"><svg viewBox="0 0 100 100">${circles}</svg><div class="rlegend">${segs.map(([v, c, l]) => `<span><i style="background:${c}"></i>${l} <b class="num" style="margin-left:auto">${v}%</b></span>`).join('')}</div></div>`;
  };
  const bars = () => [['Financials', 31], ['Technology', 22], ['Energy', 14], ['Consumer', 12], ['Industrials', 9], ['Healthcare', 7], ['Other', 5]]
    .map(([l, v]) => `<div class="rbar"><span>${l}</span><b style="width:${v * 3}%" data-bar></b><span>${v}.0%</span></div>`).join('');

  const T = {
    cover: (el) => {
      const bronze = el.dataset.tone === 'bronze';
      el.classList.add('rpage', 'rpage--cover');
      if (bronze) el.style.background = 'var(--bronze)';
      return `<div class="rpage__head">${mark}<span>Research. Clarity. Confidence.</span></div>
        <div><h4>Portfolio<br>${bronze ? 'Strategy' : 'Intelligence'} <em>Report</em></h4><p style="color:rgba(247,243,234,.7);margin-top:10px">Prepared for: Sample Client · Statement basis 31 Aug 2026</p></div>
        ${ridge}<div class="rpage__foot"><span>Illustrative data · Not a real client</span><span>Vol. 01</span></div>`;
    },
    alloc: () => `${head('01 · Allocation', 3)}<h4>How the portfolio is allocated</h4><p>Market-capitalisation split of listed equity holdings, by current value. Basis: statement date. Units: % of equity value.</p>${donut()}${lines(5)}${stamp}${foot(3)}`,
    sector: () => `${head('02 · Sector exposure', 6)}<h4>Where the weight sits</h4><p>Share of equity value by sector classification. Observation only; no view is expressed on any sector.</p><div style="display:grid;gap:7px;margin-top:4px">${bars()}</div>${lines(4)}${stamp}${foot(6)}`,
    conc: () => `${head('03 · Concentration', 9)}<h4>Concentration at a glance</h4><p>The ten largest positions account for 58.4% of equity value.</p>
      <table class="rtable"><thead><tr><th>Holding</th><th>Weight</th><th>Sector</th></tr></thead><tbody>
      ${[['Holding 01', '9.8%', 'Fin.'], ['Holding 02', '8.1%', 'Tech.'], ['Holding 03', '7.4%', 'Energy'], ['Holding 04', '6.2%', 'Fin.'], ['Holding 05', '5.9%', 'Cons.'], ['Holding 06', '5.1%', 'Tech.'], ['Holding 07', '4.6%', 'Ind.']].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}
      </tbody></table>${lines(3)}${stamp}${foot(9)}`,
    toc: () => `${head('Contents', 2)}<h4>Inside this report</h4>
      <div style="display:grid;gap:6px;margin-top:6px">${['Allocation', 'Sector exposure', 'Concentration', 'Holdings-level observations', 'Market context', 'Methodology and disclaimer'].map((t, i) => `<div class="rbar" style="grid-template-columns:22px 1fr 24px;border-bottom:1px solid var(--stone);padding-bottom:5px"><span style="font-family:var(--f-mono);color:var(--bronze)">${String(i + 1).padStart(2, '0')}</span><span style="font-size:9px">${t}</span><span>${[3, 6, 9, 14, 18, 22][i]}</span></div>`).join('')}</div>
      <p style="margin-top:8px">Every finding is labelled Observed, Derived or Context. See the methodology section for sources and limits.</p>${stamp}${foot(2)}`,
    obs: () => `${head('04 · Observations', 14)}<h4>Holdings-level observations</h4>
      <p><b style="color:var(--forest)">Observed.</b> Two holdings share the same parent group, combining to 11.3% of value.</p>
      <p><b style="color:var(--bronze)">Derived.</b> Portfolio-weighted dividend yield on the statement date: 1.4%.</p>
      <p><b style="color:var(--sage)">Context.</b> Sector weights shown against a broad-market reference for orientation only.</p>${lines(6)}${stamp}${foot(14)}`,
  };
  document.querySelectorAll('[data-rpage]').forEach(el => {
    const k = el.dataset.rpage; if (!T[k]) return;
    if (k !== 'cover') el.classList.add('rpage');
    el.innerHTML = T[k](el);
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', `Sample report page (${k}), illustrative data only`);
  });
})();
