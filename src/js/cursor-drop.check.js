/**
 * Minimal self-check for drop follow math (run: node src/js/cursor-drop.check.js)
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function toTransform(x, y) {
  return `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
}

const head = lerp(0, 100, 0.26);
console.assert(Math.abs(head - 26) < 1e-9, 'lerp 0.26 should move 26% toward target');

const t = toTransform(120, 80);
console.assert(t.includes('translate3d(120px, 80px, 0)'), 'transform must use translate3d');
console.assert(t.includes('translate(-50%, -50%)'), 'transform must center the oval');

console.log('cursor-drop.check: ok');
