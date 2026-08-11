const cache = new Map<string, string>();

/**
 * three.js's THREE.Color constructor doesn't understand oklch() strings (only
 * hex/rgb/hsl/named formats) — it silently falls back to white and logs a
 * warning instead of throwing. This resolves any valid CSS color (including
 * oklch()) to a hex string by asking the browser's own color parser via a 1x1
 * canvas read-back, so WebGL materials can use the same oklch() design tokens
 * as the rest of the app. Results are cached since this touches the DOM.
 */
export function resolveWebglColor(cssColor: string): string {
  const cached = cache.get(cssColor);
  if (cached) return cached;

  let hex = '#ffffff';
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = cssColor;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    hex = `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  }

  cache.set(cssColor, hex);
  return hex;
}
