/* =========================================================
   ARTHA · WebGL scene
   Gold contour ridges (GPU-displaced line field) + dust + a floating
   3D report with a companion slide deck. data-mode="hero" | "terrain"
   ========================================================= */
import * as THREE from 'three';

const MARK = [
  'M47 9 C 30 26, 14 52, 7 78 C 6 83, 10 86, 16 85 C 22 84, 30 80, 36 77 C 31 64, 31 42, 40 26 C 43 20, 46 14, 47 9 Z',
  'M50 8 C 57 12, 60 22, 57 33 C 53 48, 46 60, 50 73 C 52 79, 58 82, 62 84 C 52 84, 42 80, 39 71 C 35 58, 41 44, 46 31 C 49 23, 51 15, 50 8 Z',
  'M53 9 C 66 24, 80 48, 92 74 C 94 79, 92 84, 86 85 C 80 86, 74 85, 68 84 C 74 78, 78 70, 76 60 C 72 42, 62 24, 53 9 Z',
  'M9 83 C 24 91, 44 88, 60 83 C 72 79, 84 80, 93 86 C 82 93, 66 94, 52 92 C 36 90, 20 90, 9 83 Z',
];

const NOISE = /* glsl */`
vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod(i,289.0);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw; return 130.0*dot(m,g);
}
float ridge(vec2 p){ float s=0.0, a=0.5, f=1.0; for(int i=0;i<5;i++){ float n=1.0-abs(snoise(p*f)); s+=n*n*a; f*=2.03; a*=0.5; } return s; }
`;

function makeCover({ title, sub, tone }) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 1434;
  const g = c.getContext('2d');
  const bg = tone === 'bronze' ? '#86652A' : '#123C32';
  g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height);
  const grd = g.createLinearGradient(0, 0, c.width, c.height);
  grd.addColorStop(0, 'rgba(255,255,255,0.07)'); grd.addColorStop(0.5, 'rgba(255,255,255,0)'); grd.addColorStop(1, 'rgba(0,0,0,0.18)');
  g.fillStyle = grd; g.fillRect(0, 0, c.width, c.height);
  // mark
  g.save(); g.translate(96, 96); g.scale(1.2, 1.2); g.fillStyle = '#F7F3EA';
  MARK.forEach(d => g.fill(new Path2D(d))); g.restore();
  g.fillStyle = '#E4D2A6'; g.font = '500 30px "JetBrains Mono", monospace';
  g.fillText('ARTHA EQUITIES  ·  RESEARCH', 96, 300);
  g.fillStyle = '#C8A96B'; g.fillRect(96, 330, 520, 2);
  g.fillStyle = '#F7F3EA'; g.font = '500 116px Zodiak, Georgia, serif';
  title.forEach((l, i) => g.fillText(l, 90, 480 + i * 124));
  g.fillStyle = '#E4D2A6'; g.font = 'italic 400 84px Zodiak, Georgia, serif';
  g.fillText(sub, 92, 480 + title.length * 124 + 10);
  // ridges
  g.strokeStyle = 'rgba(200,169,107,0.9)'; g.lineWidth = 2.5;
  for (let k = 0; k < 5; k++) {
    g.beginPath(); g.globalAlpha = 1 - k * 0.17;
    for (let x = 0; x <= c.width; x += 8) {
      const y = 1180 - k * 34 - Math.abs(Math.sin(x * 0.006 + k) * 120) - Math.sin(x * 0.017 + k * 2) * 26;
      x === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
    }
    g.stroke();
  }
  g.globalAlpha = 1; g.fillStyle = 'rgba(247,243,234,0.6)'; g.font = '400 26px "JetBrains Mono", monospace';
  g.fillText('ILLUSTRATIVE DATA  ·  VOL. 01  ·  2026', 96, 1350);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

function makeDeck() {
  const c = document.createElement('canvas'); c.width = 1280; c.height = 800;
  const g = c.getContext('2d');
  g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = '#123C32'; g.fillRect(0, 0, c.width, 90);
  g.fillStyle = '#C8A96B'; g.font = '500 26px "JetBrains Mono", monospace'; g.fillText('SECTOR EXPOSURE  ·  SLIDE 04', 48, 56);
  g.fillStyle = '#123C32'; g.font = '500 58px Zodiak, Georgia, serif'; g.fillText('Where the weight sits', 48, 190);
  const bars = [0.82, 0.64, 0.51, 0.38, 0.27, 0.16], cols = ['#123C32', '#7C9186', '#C8A96B', '#123C32', '#7C9186', '#C8A96B'];
  bars.forEach((b, i) => {
    g.fillStyle = '#D9D4C8'; g.fillRect(300, 260 + i * 78, 860, 34);
    g.fillStyle = cols[i]; g.fillRect(300, 260 + i * 78, 860 * b, 34);
    g.fillStyle = '#252525'; g.font = '400 26px "General Sans", Arial'; g.fillText(['Financials', 'Technology', 'Energy', 'Consumer', 'Industrials', 'Healthcare'][i], 48, 287 + i * 78);
  });
  g.fillStyle = '#7C9186'; g.font = '400 22px "JetBrains Mono", monospace'; g.fillText('ILLUSTRATIVE DATA. NOT A REAL CLIENT.', 48, 760);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

function pageEdges(horizontal) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256; const g = c.getContext('2d');
  g.fillStyle = '#F4EEE1'; g.fillRect(0, 0, 256, 256);
  g.fillStyle = 'rgba(160,150,130,0.35)';
  for (let i = 0; i < 256; i += 3) horizontal ? g.fillRect(0, i, 256, 1) : g.fillRect(i, 0, 1, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function mount(el) {
  const mode = el.dataset.mode || 'hero';
  const reduce = window.Artha ? window.Artha.reduce : matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  const camBase = new THREE.Vector3(0, 3.4, 12);
  camera.position.copy(camBase);

  /* ---- ridge field ---- */
  const ROWS = mode === 'hero' ? 78 : 56, COLS = 240;
  const pos = new Float32Array(ROWS * COLS * 3), idx = [];
  for (let r = 0; r < ROWS; r++) {
    const z = 8 - r * (82 / ROWS);
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      pos[i * 3] = -46 + (c / (COLS - 1)) * 92; pos[i * 3 + 1] = 0; pos[i * 3 + 2] = z;
      if (c < COLS - 1) idx.push(i, i + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setIndex(idx);
  const uniforms = {
    uTime: { value: 0 }, uRise: { value: reduce ? 1 : 0 }, uMouse: { value: new THREE.Vector2(0, -10) },
    uGold: { value: new THREE.Color('#C8A96B') }, uSage: { value: new THREE.Color('#7C9186') }, uFlow: { value: 0 },
  };
  const ridgeMat = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: NOISE + /* glsl */`
      uniform float uTime, uRise, uFlow; uniform vec2 uMouse;
      varying float vH; varying float vD; varying float vX;
      void main(){
        vec3 p = position;
        float back = smoothstep(6.0, -46.0, p.z);
        vec2 q = vec2(p.x * 0.055, (p.z - uFlow) * 0.07);
        float h = ridge(q + vec2(uTime * 0.012, 0.0));
        h = pow(h, 1.6) * mix(0.5, 13.0, back);
        float d = distance(p.xz, uMouse);
        h += exp(-d * d * 0.02) * 1.6 * (1.0 - back * 0.6);
        h += sin(p.x * 0.35 + uTime * 0.6 + p.z * 0.2) * 0.08;
        p.y = h * uRise - 1.6;
        vH = h; vX = p.x;
        vec4 mv = modelViewMatrix * vec4(p, 1.0); vD = -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 uGold, uSage; varying float vH; varying float vD; varying float vX;
      void main(){
        float near = smoothstep(2.0, 9.0, vD);
        float far = 1.0 - smoothstep(40.0, 88.0, vD);
        float sides = 1.0 - smoothstep(26.0, 46.0, abs(vX));
        vec3 col = mix(uSage, uGold, smoothstep(0.4, 6.5, vH));
        float a = near * far * sides * (0.22 + smoothstep(0.5, 9.0, vH) * 0.78);
        gl_FragColor = vec4(col, a * 0.9);
      }`,
  });
  const ridges = new THREE.LineSegments(geo, ridgeMat);
  scene.add(ridges);

  /* ---- dust ---- */
  const N = 900, dp = new Float32Array(N * 3), ds = new Float32Array(N);
  for (let i = 0; i < N; i++) { dp[i * 3] = (Math.random() - 0.5) * 60; dp[i * 3 + 1] = Math.random() * 14 - 1; dp[i * 3 + 2] = -Math.random() * 60 + 8; ds[i] = Math.random(); }
  const dGeo = new THREE.BufferGeometry();
  dGeo.setAttribute('position', new THREE.BufferAttribute(dp, 3)); dGeo.setAttribute('aSeed', new THREE.BufferAttribute(ds, 1));
  const dust = new THREE.Points(dGeo, new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`uniform float uTime; attribute float aSeed; varying float vA;
      void main(){ vec3 p = position; p.y += sin(uTime * 0.3 + aSeed * 30.0) * 0.6; p.x += cos(uTime * 0.2 + aSeed * 20.0) * 0.4;
        vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_PointSize = (1.5 + aSeed * 2.5) * (18.0 / -mv.z); vA = (0.3 + aSeed * 0.7) * (0.5 + 0.5 * sin(uTime + aSeed * 50.0));
        gl_Position = projectionMatrix * mv; }`,
    fragmentShader: /* glsl */`uniform vec3 uGold; varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); if(d > 0.5) discard; gl_FragColor = vec4(uGold, vA * smoothstep(0.5, 0.0, d) * 0.8); }`,
  }));
  scene.add(dust);

  /* ---- floating report + deck ---- */
  let book = null, deck = null, group = null;
  if (mode === 'hero') {
    scene.add(new THREE.AmbientLight('#fff6e6', 1.2));
    const key = new THREE.DirectionalLight('#ffe9c2', 2.4); key.position.set(-4, 6, 8); scene.add(key);
    const rim = new THREE.DirectionalLight('#C8A96B', 3); rim.position.set(6, 2, -4); scene.add(rim);
    group = new THREE.Group(); scene.add(group);
    const cover = makeCover({ title: ['Portfolio', 'Intelligence'], sub: 'Report', tone: 'forest' });
    const side = new THREE.MeshStandardMaterial({ map: pageEdges(false), roughness: 0.9 });
    const top = new THREE.MeshStandardMaterial({ map: pageEdges(true), roughness: 0.9 });
    const spine = new THREE.MeshStandardMaterial({ color: '#0c2d25', roughness: 0.6 });
    const front = new THREE.MeshStandardMaterial({ map: cover, roughness: 0.45, metalness: 0.05 });
    const back = new THREE.MeshStandardMaterial({ color: '#0E3029', roughness: 0.6 });
    book = new THREE.Mesh(new THREE.BoxGeometry(3, 4.2, 0.32, 1, 1, 1), [side, spine, top, top, front, back]);
    group.add(book);
    deck = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 2.06), new THREE.MeshStandardMaterial({ map: makeDeck(), roughness: 0.5, side: THREE.DoubleSide }));
    deck.position.set(-1.9, -1.5, -1.4); deck.rotation.set(-0.15, 0.5, 0.1);
    group.add(deck);
    const halo = new THREE.Mesh(new THREE.RingGeometry(3.4, 3.42, 128), new THREE.MeshBasicMaterial({ color: '#C8A96B', transparent: true, opacity: 0.35 }));
    halo.position.z = -1.8; group.add(halo);
    const halo2 = halo.clone(); halo2.scale.setScalar(1.25); halo2.material = halo.material.clone(); halo2.material.opacity = 0.15; group.add(halo2);
    group.userData = { halo, halo2 };
  }

  /* ---- layout ---- */
  const layout = () => {
    const w = el.clientWidth, h = el.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    if (group) {
      const mobile = w < 900;
      group.position.set(mobile ? 1.2 : 4.7, mobile ? 5.6 : 2.9, mobile ? -5 : 0.3);
      group.scale.setScalar(mobile ? 0.5 : 0.95);
      group.visible = w >= 700;
    }
  };
  layout(); addEventListener('resize', layout);

  /* ---- interaction ---- */
  const m = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', e => { m.tx = (e.clientX / innerWidth) * 2 - 1; m.ty = (e.clientY / innerHeight) * 2 - 1; }, { passive: true });
  const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1.2), hit = new THREE.Vector3();
  const state = { scroll: 0, spin: 0, enter: reduce ? 1 : 0 };

  if (window.gsap && window.ScrollTrigger) {
    const host = el.closest('section') || el;
    ScrollTrigger.create({ trigger: host, start: 'top top', end: 'bottom top', scrub: true, onUpdate: s => { state.scroll = s.progress; } });
  }
  const introGo = () => {
    if (reduce || !window.gsap) return;
    gsap.to(uniforms.uRise, { value: 1, duration: 3.2, ease: 'expo.out' });
    gsap.fromTo(state, { enter: 0 }, { enter: 1, duration: 2.6, ease: 'expo.out', delay: 0.2 });
    gsap.fromTo(state, { spin: -Math.PI * 1.2 }, { spin: 0, duration: 3, ease: 'expo.out', delay: 0.2 });
  };
  document.addEventListener('artha:intro', introGo, { once: true });
  if (document.documentElement.dataset.introDone) introGo();

  /* ---- loop ---- */
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(el);
  const clock = new THREE.Clock();
  const tick = () => {
    requestAnimationFrame(tick);
    if (!visible) return;
    const t = clock.getElapsedTime();
    m.x += (m.tx - m.x) * 0.05; m.y += (m.ty - m.y) * 0.05;
    uniforms.uTime.value = reduce ? 0 : t;
    uniforms.uFlow.value = reduce ? 0 : t * 0.9 + state.scroll * 18;
    ray.setFromCamera({ x: m.x, y: -m.y }, camera);
    if (ray.ray.intersectPlane(plane, hit)) uniforms.uMouse.value.lerp(new THREE.Vector2(hit.x, hit.z), 0.08);

    camera.position.set(camBase.x + m.x * 0.9, camBase.y - m.y * 0.5 + state.scroll * 2.2, camBase.z - state.scroll * 6);
    camera.lookAt(m.x * 0.6, 1.6 - state.scroll * 1.2, -20);

    if (group) {
      const e = state.enter;
      group.rotation.y = -0.45 + m.x * 0.35 + state.spin + state.scroll * 1.4;
      group.rotation.x = 0.08 + m.y * 0.18 - state.scroll * 0.3;
      group.rotation.z = Math.sin(t * 0.5) * 0.03;
      book.position.y = Math.sin(t * 0.9) * 0.12 + (1 - e) * 6 + state.scroll * 3;
      deck.position.y = -1.5 + Math.sin(t * 0.9 + 1.2) * 0.16 + (1 - e) * 8 + state.scroll * 1.2;
      deck.rotation.y = 0.5 + Math.sin(t * 0.4) * 0.06;
      group.userData.halo.rotation.z = t * 0.1; group.userData.halo2.rotation.z = -t * 0.06;
      group.userData.halo.material.opacity = 0.35 * e; group.userData.halo2.material.opacity = 0.15 * e;
    }
    renderer.render(scene, camera);
  };
  tick();
}

document.querySelectorAll('[data-webgl]').forEach(el => {
  try { mount(el); } catch (err) { console.warn('WebGL unavailable', err); el.classList.add('no-webgl'); }
});
