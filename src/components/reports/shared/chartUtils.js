export const GRID = 'rgba(0,0,0,0.04)';
export const TICK_FONT = { fontSize: 10, fontFamily: 'Poppins, sans-serif' };
export const TICK_FONT_SM = { fontSize: 9, fontFamily: 'Poppins, sans-serif' };

export function buildYTicks(min, max, step) {
  const ticks = [];
  for (let v = min; v <= max; v += step) ticks.push(v);
  return ticks;
}

/** Chart.js cubic spline (tension ~0.4) */
export function tensionLinePath(points, tension = 0.4) {
  if (points.length < 2) return '';
  const t = tension;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1x = p1.x + ((p2.x - p0.x) / 6) * t * 3;
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * t * 3;
    const cp2x = p2.x - ((p3.x - p1.x) / 6) * t * 3;
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * t * 3;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function scalePoint(i, len, pad, plotW, plotH, value, min, max) {
  return {
    x: pad.left + (i / (len - 1)) * plotW,
    y: pad.top + plotH - ((value - min) / (max - min)) * plotH,
  };
}
