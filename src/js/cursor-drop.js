/**
 * Monolithic blue SVG oval under frosted glass.
 * CSS morphs/rotates constantly; JS only GPU-follows the pointer.
 */
export function initCursorDrop(options = {}) {
  const { lerp = 0.26 } = options;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const drop = document.createElement('div');
  drop.className = 'cursor-drop';
  drop.setAttribute('aria-hidden', 'true');
  if (reduceMotion) drop.classList.add('is-static');

  drop.innerHTML = `
    <div class="cursor-drop__spin">
      <svg class="cursor-drop__svg" viewBox="0 0 320 260" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="dropGrad" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#9ec0ff"/>
            <stop offset="45%" stop-color="#2b5cff"/>
            <stop offset="100%" stop-color="#1230a8"/>
          </radialGradient>
          <filter id="dropBlur" x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="10"/>
          </filter>
        </defs>
        <ellipse
          class="cursor-drop__oval"
          cx="160"
          cy="130"
          rx="118"
          ry="88"
          fill="url(#dropGrad)"
          filter="url(#dropBlur)"
        />
      </svg>
    </div>
  `;

  const glass = document.createElement('div');
  glass.className = 'site-glass';
  glass.setAttribute('aria-hidden', 'true');

  document.body.prepend(glass);
  document.body.prepend(drop);

  let raf = 0;
  let visible = true;
  let hasPointer = false;
  const target = { x: 0, y: 0 };
  const head = { x: 0, y: 0 };

  function placeStart() {
    target.x = window.innerWidth * 0.62;
    target.y = window.innerHeight * 0.42;
    head.x = target.x;
    head.y = target.y;
    apply();
  }

  function apply() {
    drop.style.transform = `translate3d(${head.x}px, ${head.y}px, 0) translate(-50%, -50%)`;
  }

  function frame() {
    if (!visible) {
      raf = 0;
      return;
    }

    if (!reduceMotion) {
      head.x += (target.x - head.x) * lerp;
      head.y += (target.y - head.y) * lerp;
    } else {
      head.x = target.x;
      head.y = target.y;
    }

    apply();

    const dx = target.x - head.x;
    const dy = target.y - head.y;
    if (Math.hypot(dx, dy) > 0.15 && !reduceMotion) {
      raf = requestAnimationFrame(frame);
    } else {
      raf = 0;
    }
  }

  function ensureLoop() {
    if (!raf && visible && !reduceMotion) raf = requestAnimationFrame(frame);
  }

  function onPointerMove(e) {
    if (reduceMotion) return;
    hasPointer = true;
    target.x = e.clientX;
    target.y = e.clientY;
    ensureLoop();
  }

  function onResize() {
    if (!hasPointer) placeStart();
  }

  function onVisibility() {
    visible = document.visibilityState === 'visible';
    if (visible) ensureLoop();
  }

  placeStart();
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  ensureLoop();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('visibilitychange', onVisibility);
    drop.remove();
    glass.remove();
  };
}
