import { TICK_FONT, GRID, buildYTicks, tensionLinePath, scalePoint } from './chartUtils';

export default function ReportMultiLineChart({
  labels,
  series,
  height = 200,
  min = 55,
  max = 95,
  yTickStep = 5,
  ySuffix = '%',
}) {
  const W = 600;
  const H = 200;
  const pad = { top: 14, right: 18, bottom: 32, left: 46 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const yTicks = buildYTicks(min, max, yTickStep);

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="Multi-line chart"
      >
        {yTicks.map((tick) => {
          const y = pad.top + plotH - ((tick - min) / (max - min)) * plotH;
          return (
            <g key={tick}>
              <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke={GRID} strokeWidth={1} />
              <text x={pad.left - 8} y={y + 3.5} textAnchor="end" fill="#AAA" style={TICK_FONT}>
                {tick}{ySuffix}
              </text>
            </g>
          );
        })}

        {labels.map((_, i) => {
          const x = pad.left + (i / (labels.length - 1)) * plotW;
          return (
            <line key={`gx-${i}`} x1={x} y1={pad.top} x2={x} y2={pad.top + plotH} stroke={GRID} strokeWidth={1} />
          );
        })}

        {series.map((s) => {
          const points = s.data.map((v, i) => scalePoint(i, s.data.length, pad, plotW, plotH, v, min, max));
          const path = tensionLinePath(points, 0.3);
          return (
            <g key={s.label}>
              <path d={path} fill="none" stroke={s.color} strokeWidth={s.strokeWidth ?? 2.5} strokeLinecap="round" />
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={s.pointRadius ?? 3.5} fill={s.color} stroke="#fff" strokeWidth={1.2} />
              ))}
            </g>
          );
        })}

        {labels.map((label, i) => {
          const x = pad.left + (i / (labels.length - 1)) * plotW;
          return (
            <text key={label} x={x} y={H - 10} textAnchor="middle" fill="#AAA" style={TICK_FONT}>
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
