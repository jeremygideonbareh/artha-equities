# Artha Equities · website demo

Motion-led design prototype for Artha Equities: a marketing site plus an in-browser demo of the order-to-report flow (choose, pay in test mode, upload, status, human review gate with phrase check, and the timed upgrade window).

- Static site, no build server needed. Pages are assembled from `src/` with `node build.mjs`.
- Motion: GSAP (ScrollTrigger, SplitText, DrawSVG), Lenis smooth scroll, Three.js contour-ridge hero.
- All prices, timings, upgrade rules and restricted terms live in `assets/js/config.js`.
- All data is synthetic. Copy is placeholder pending Artha approval. Non-advisory throughout.
- Respects `prefers-reduced-motion`, with an on-page toggle to switch full motion on.
