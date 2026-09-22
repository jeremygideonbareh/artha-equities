/* Order-to-report demo: choose → details → pay (test) → upload → status + review gate + upgrade window.
   Everything is simulated in the browser. Nothing is sent anywhere. */
window.ArthaPage = {
  init(A) {
    const { $, $$, reduce } = A;
    const C = window.ARTHA_CONFIG, P = C.products;
    const S = { step: 0, product: 'intelligence', upgrade: false, paid: 0, ref: 'AE-2026-' + String(Math.floor(400 + Math.random() * 500)).padStart(4, '0') };
    const steps = ['choose', 'details', 'pay', 'upload', 'status'];
    const panel = (n) => $(`[data-panel="${n}"]`);
    const stepper = $$('[data-hstepper] li');
    const q = new URLSearchParams(location.search);
    if (q.get('p') === 'strategy') { S.product = 'strategy'; $('input[name="product"][value="strategy"]').checked = true; }

    const setStepper = (i) => stepper.forEach((li, k) => { li.classList.toggle('is-done', k < i); li.classList.toggle('is-current', k === i); li.setAttribute('aria-current', k === i ? 'step' : 'false'); });
    const show = (i, instant) => {
      const from = panel(steps[S.step]), to = panel(steps[i]);
      setStepper(i);
      if (from === to) { to.hidden = false; return; }
      const enter = () => {
        from.hidden = true; to.hidden = false;
        if (!reduce && !instant) gsap.fromTo(to, { opacity: 0, y: 40, rotationX: -6, transformPerspective: 1200, transformOrigin: '50% 0%' }, { opacity: 1, y: 0, rotationX: 0, duration: 0.9, ease: 'expo.out', clearProps: 'transform' });
        const h = to.querySelector('h2'); h?.setAttribute('tabindex', '-1'); h?.focus({ preventScroll: true });
        ScrollTrigger.refresh();
        A.scrollTo('#o-title', { offset: -(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) + 60) });
      };
      S.step = i;
      if (reduce || instant) return enter();
      gsap.to(from, { opacity: 0, y: -24, duration: 0.35, ease: 'power2.in', onComplete: () => { gsap.set(from, { clearProps: 'all' }); enter(); } });
    };
    $$('[data-back]').forEach(b => b.addEventListener('click', () => show(S.step - 1)));

    /* ---------- 1 · choose ---------- */
    const priceNow = () => (S.product === 'strategy' && S.upgrade) ? P.strategy.price - S.paid : P[S.product].price;
    const renderChoose = () => {
      const banner = $('[data-upgrade-banner]'), sp = $('[data-opt-strategy-price]');
      banner.hidden = !S.upgrade;
      sp.innerHTML = S.upgrade ? `${formatINR(P.strategy.price - S.paid)} <s style="font-size:18px;color:var(--sage)">${formatINR(P.strategy.price)}</s>` : formatINR(P.strategy.price);
    };
    panel('choose').addEventListener('submit', e => { e.preventDefault(); S.product = $('input[name="product"]:checked').value; show(1); });
    $$('input[name="product"]').forEach(r => r.addEventListener('change', () => { S.product = r.value; }));

    /* ---------- 2 · details ---------- */
    panel('details').addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target, bad = [];
      const chk = (name, ok) => { const fld = f[name].closest('.field'); fld.classList.toggle('is-invalid', !ok); f[name].setAttribute('aria-invalid', !ok); if (!ok) bad.push(f[name]); };
      chk('name', f.name.value.trim().length > 1);
      chk('mobile', /^(\+?91)?[6-9]\d{9}$/.test(f.mobile.value.replace(/[\s-]/g, '')));
      chk('email', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim()));
      chk('email2', f.email2.value.trim().toLowerCase() === f.email.value.trim().toLowerCase() && f.email2.value.trim() !== '');
      const consentOk = f.na.checked && f.privacy.checked;
      $('.err-consent', f).hidden = consentOk;
      if (!consentOk) bad.push(f.na.checked ? f.privacy : f.na);
      if (bad.length) { bad[0].focus(); if (!reduce) gsap.fromTo(f, { x: -8 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, .3)' }); return; }
      renderSummary(); show(2);
    });

    /* ---------- 3 · pay ---------- */
    const renderSummary = () => {
      const p = P[S.product];
      let h = `<div><span>${p.name}</span><span class="num">${formatINR(p.price)}</span></div>`;
      if (S.product === 'strategy' && S.upgrade) h += `<div class="disc"><span>Less: Intelligence Report already paid</span><span class="num">−${formatINR(S.paid)}</span></div>`;
      h += `<div class="total"><span>Total, incl. taxes as applicable</span><span class="num">${formatINR(priceNow())}</span></div>`;
      $('[data-summary]').innerHTML = h;
      $('[data-pay-btn] .btn__label').textContent = `Pay ${formatINR(priceNow())} (test mode)`;
    };
    const log = $('[data-log]');
    const typeLog = (lines, done) => {
      log.hidden = false; log.innerHTML = '';
      const tl = gsap.timeline({ onComplete: done });
      lines.forEach(([t, cls], i) => tl.call(() => { const d = document.createElement('div'); d.className = cls || ''; d.textContent = t; log.appendChild(d); if (!reduce) gsap.from(d, { opacity: 0, x: -10, duration: 0.4 }); }, null, reduce ? 0 : i * 0.55));
      tl.to({}, { duration: reduce ? 0 : 0.7 });
    };
    panel('pay').addEventListener('submit', e => {
      e.preventDefault();
      const m = e.target.method.value, btn = $('[data-pay-btn]');
      btn.disabled = true; $('[data-pay-fail]').hidden = true;
      typeLog([
        [`→ Order ${S.ref} created · status: Awaiting payment`],
        [`→ Opening gateway in test mode · ${m}`],
        ['… Waiting for the gateway to confirm'],
        ['✓ Webhook received · signature verified', 'ok'],
        [`✓ Paid ${formatINR(priceNow())} · receipt emailed · status: Awaiting upload`, 'ok'],
      ], () => { btn.disabled = false; if (S.product === 'intelligence') S.paid = P.intelligence.price; prepUpload(); show(3); });
    });
    $('[data-pay-simfail]').addEventListener('click', () => {
      typeLog([[`→ Order ${S.ref} created · status: Awaiting payment`], ['… Waiting for the gateway to confirm'], ['✕ Gateway reported: payment not completed. No charge made.']], () => {
        const n = $('[data-pay-fail]'); n.hidden = false; if (!reduce) gsap.from(n, { opacity: 0, y: 10, duration: 0.6 });
      });
    });

    /* ---------- 4 · upload ---------- */
    const dt = $('[data-doctypes]');
    C.upload.types.forEach((t, i) => dt.insertAdjacentHTML('beforeend', `<option value="${i}">${t}</option>`));
    const drop = $('[data-drop]'), fileIn = $('[data-file]'), upBtn = $('[data-up-btn]');
    const err = (title, msg) => { const n = $('[data-up-err]'); $('[data-up-err-title]').textContent = title; $('[data-up-err-msg]').textContent = ' ' + msg; n.hidden = false; drop.classList.remove('has-file'); upBtn.disabled = true; if (!reduce) gsap.fromTo(n, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }); };
    const accept = (name) => {
      $('[data-up-err]').hidden = true; drop.classList.add('has-file');
      $('[data-file-name]').textContent = name;
      const st = $('[data-file-state]'), bar = $('[data-file-bar]');
      gsap.set(bar, { scaleX: 0 });
      gsap.timeline()
        .to(bar, { scaleX: 0.45, duration: reduce ? 0 : 0.8, ease: 'power2.out', onStart: () => { st.textContent = 'Encrypting'; } })
        .to(bar, { scaleX: 0.85, duration: reduce ? 0 : 0.8, ease: 'power2.out', onStart: () => { st.textContent = 'Scanning'; } })
        .to(bar, { scaleX: 1, duration: reduce ? 0 : 0.4, onComplete: () => { st.textContent = 'Checked ✓'; upBtn.disabled = false; } });
    };
    const handle = (file) => {
      if (!file) return;
      if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') return err('That file is not a PDF', 'Please upload your statement as a PDF file.');
      if (file.size === 0) return err('That file is empty', 'Please download your statement again and retry.');
      if (file.size > C.upload.maxMB * 1048576) return err('That file is too large', `The limit is ${C.upload.maxMB} MB. Your file is ${(file.size / 1048576).toFixed(1)} MB.`);
      const r = new FileReader();
      r.onload = () => { new TextDecoder().decode(new Uint8Array(r.result)).startsWith('%PDF-') ? accept(file.name) : err('That file cannot be read as a PDF', 'It may be damaged, or saved in another format. Please try another copy.'); };
      r.readAsArrayBuffer(file.slice(0, 5));
    };
    fileIn.addEventListener('change', () => handle(fileIn.files[0]));
    ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('is-over'); }));
    ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('is-over'); }));
    drop.addEventListener('drop', e => handle(e.dataTransfer.files[0]));
    $('[data-sample-cas]').addEventListener('click', () => { $('#f-pw').value = 'SAMPLE1234F'; accept('Synthetic_CAS_Aug2026.pdf · password protected'); });
    const prepUpload = () => {
      const note = panel('upload').querySelector('[data-on-file]');
      if (S.product === 'strategy' && S.upgrade && !note) {
        panel('upload').querySelector('h2').insertAdjacentHTML('afterend', '<div class="notice notice--info" data-on-file><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg><div><b>We already hold your statement</b>From your Intelligence Report order. Submit to use it, or upload a newer one.</div></div>');
        upBtn.disabled = false;
      }
    };
    panel('upload').addEventListener('submit', e => {
      e.preventDefault();
      $('#f-pw').value = ''; // the password is used once, then discarded
      startStatus();
      show(4);
    });

    /* ---------- 5 · status + review gate ---------- */
    const vs = $$('[data-vstepper] li'), msg = $('[data-status-msg]'), draft = $('[data-draft]'), out = $('[data-phrase-out]');
    const approve = $('[data-approve]'), fix = $('[data-fix]'), hold = $('[data-hold]'), chip = $('[data-admin-chip]'), audit = $('[data-audit]');
    const ist = (d) => new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).format(d);
    const setVS = (i) => vs.forEach((li, k) => { li.classList.toggle('is-done', k < i || (i === 3 && k === 3)); li.classList.toggle('is-current', k === i && i !== 3); });
    const setMsg = (kind, title, text) => {
      msg.className = 'notice notice--' + kind;
      msg.querySelector('div').innerHTML = `<b>${title}</b>${text}`;
      if (!reduce) gsap.fromTo(msg, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 });
    };
    const DRAFT = 'The portfolio holds 31% of equity value in financials, across four holdings. Investors may wish to trim this position. The ten largest holdings account for 58.4% of value, and a target price of 1,240 is recommended for Holding 01. Two holdings share a parent group, combining to 11.3%.';
    const NEUTRAL = 'The portfolio holds 31% of equity value in financials, across four holdings. This is the largest sector weight in the portfolio. The ten largest holdings account for 58.4% of value, and Holding 01 alone accounts for 9.8%. Two holdings share a parent group, combining to 11.3%.';
    const esc = (t) => t.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    const terms = [...C.restrictedTerms].sort((a, b) => b.length - a.length);
    const rx = new RegExp(`\\b(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+')).join('|')})\\b`, 'gi');
    const check = () => {
      const t = draft.value; let n = 0;
      out.innerHTML = esc(t).replace(rx, (m) => { n++; return `<mark>${m}</mark>`; });
      approve.disabled = n > 0; fix.disabled = n === 0;
      chip.className = 'chip ' + (n ? 'chip--hold' : 'chip--review');
      chip.textContent = n ? `${n} phrase${n > 1 ? 's' : ''} flagged · approval blocked` : 'Phrase check clear · ready to approve';
      if (n && !reduce) gsap.from($$('mark', out), { backgroundColor: 'rgba(166,58,43,.5)', duration: 0.8, stagger: 0.08 });
      return n;
    };
    draft.addEventListener('input', check);
    fix.addEventListener('click', () => {
      if (reduce) { draft.value = NEUTRAL; return check(); }
      const o = { i: 0 };
      gsap.to(o, { i: NEUTRAL.length, duration: 1.4, ease: 'none', onUpdate: () => { draft.value = NEUTRAL.slice(0, Math.round(o.i)); check(); } });
    });
    const toReview = () => {
      setVS(2); setMsg('info', 'In review', 'Your report is being reviewed by our team.');
      draft.disabled = false; draft.value = DRAFT; hold.disabled = false;
      const n = check();
      audit.textContent = `Audit log: draft v1 received ${ist(new Date())} IST · phrase check found ${n} matches`;
      if (!reduce) gsap.from('[data-admin]', { boxShadow: '0 0 0 12px rgba(200,169,107,.45)', duration: 1.4 });
    };
    let timers = [];
    const startStatus = (skip) => {
      timers.forEach(clearTimeout); timers = [];
      $('[data-ref]').textContent = S.ref; $('[data-product-name]').textContent = P[S.product].name;
      $('[data-deliver]').hidden = true; $('[data-upgrade]').hidden = true; $('[data-upgrade-closed]').hidden = true;
      draft.disabled = true; approve.disabled = true; fix.disabled = true; out.innerHTML = '';
      chip.className = 'chip chip--muted'; chip.textContent = 'Waiting for draft';
      if (skip) return toReview();
      setVS(0); setMsg('info', 'Received', 'We have your statement. An email has been sent to you.');
      timers.push(setTimeout(() => { setVS(1); setMsg('info', 'Generating', 'Your report is being prepared. We will email you when it moves to review.'); chip.className = 'chip chip--gen'; chip.textContent = 'Engine job running'; }, reduce ? 300 : 2400));
      timers.push(setTimeout(toReview, reduce ? 600 : 5400));
    };
    hold.addEventListener('click', () => {
      setMsg('warn', 'We are looking into it', 'Your order is on hold while we check something. You do not need to do anything yet.');
      chip.className = 'chip chip--hold'; chip.textContent = 'On hold';
      audit.textContent = `Audit log: put on hold ${ist(new Date())} IST by Reviewer (demo)`;
    });
    approve.addEventListener('click', () => {
      if (check()) return;
      setVS(3); approve.disabled = true; fix.disabled = true; hold.disabled = true; draft.disabled = true;
      chip.className = 'chip chip--done'; chip.textContent = 'Approved · delivered';
      audit.textContent = `Audit log: approved and delivered ${ist(new Date())} IST by Reviewer (demo)`;
      setMsg('info', 'Delivered', 'Your report is ready. Files are downloaded from this page, not attached to email.');
      const d = $('[data-deliver]'); d.hidden = false; d.style.marginTop = '20px';
      if (!reduce) gsap.from(d.children, { opacity: 0, y: 20, stagger: 0.12, duration: 0.8 });
      if (S.product === 'intelligence') startUpgrade();
    });

    /* ---------- upgrade window ---------- */
    let cdTimer, end;
    const up = $('[data-upgrade]');
    const pad = (n) => String(n).padStart(2, '0');
    const tick = () => {
      const ms = Math.max(0, end - Date.now()), s = Math.floor(ms / 1000);
      $('[data-cd-h]').textContent = pad(Math.floor(s / 3600)); $('[data-cd-m]').textContent = pad(Math.floor(s / 60) % 60); $('[data-cd-s]').textContent = pad(s % 60);
      if (ms <= 0) closeWindow();
    };
    const startUpgrade = () => {
      S.paid = P.intelligence.price;
      end = Date.now() + C.upgrade.windowHours * 3600e3;
      $('[data-cd-end]').textContent = ist(new Date(end));
      $('[data-paid]').textContent = formatINR(S.paid);
      up.hidden = false; $('[data-upgrade-closed]').hidden = true;
      if (!reduce) gsap.from(up, { opacity: 0, y: 40, clipPath: 'inset(30% 0 30% 0 round 18px)', duration: 1.2, ease: 'expo.out' });
      clearInterval(cdTimer); tick(); cdTimer = setInterval(tick, 1000);
    };
    const closeWindow = () => {
      clearInterval(cdTimer);
      const done = () => { up.hidden = true; const c = $('[data-upgrade-closed]'); c.hidden = false; if (!reduce) gsap.from(c, { opacity: 0, y: 12, duration: 0.6 }); };
      reduce ? done() : gsap.to(up, { opacity: 0, y: -20, duration: 0.5, onComplete: () => { gsap.set(up, { clearProps: 'all' }); done(); } });
    };
    $('[data-upgrade-expire]').addEventListener('click', () => {
      clearInterval(cdTimer);
      const o = { v: Math.max(0, end - Date.now()) };
      gsap.to(o, { v: 0, duration: reduce ? 0 : 2.2, ease: 'power2.in', onUpdate: () => { end = Date.now() + o.v; tick(); }, onComplete: closeWindow });
    });
    $('[data-upgrade-go]').addEventListener('click', () => {
      clearInterval(cdTimer);
      S.upgrade = true; S.product = 'strategy'; S.ref = 'AE-2026-' + String(Math.floor(400 + Math.random() * 500)).padStart(4, '0');
      $('input[name="product"][value="strategy"]').checked = true;
      renderChoose(); show(0);
    });

    /* deep link straight to the review gate */
    setStepper(0);
    if (location.hash === '#review') { S.paid = P.intelligence.price; startStatus(true); show(4, true); }
  },
};
