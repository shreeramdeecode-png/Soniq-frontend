import { GRID, TICK_FONT, TICK_FONT_SM } from './chartUtils';
import { RT } from './reportTheme';

export default function ReportBarChart({
  data,
  labels,
  colors,
  height = 200,
  horizontal = false,
  signed = false,
  max: maxProp,
  ySuffix = '',
  xSuffix = '',
  borderRadius = 4,
}) {
  const max = maxProp ?? Math.max(...data.map(Math.abs), 1);
  const W = 600;
  const H = height;

  if (horizontal && signed) {
    const pad = { top: 12, right: 24, bottom: 12, left: 100 };
    const plotW = (W - pad.left - pad.right) / 2;
    const rowH = (H - pad.top - pad.bottom) / data.length;
    const midX = pad.left + plotW;

    return (
      <div className="relative w-full" style={{ height: H }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="none" role="img">
          <line x1={midX} y1={pad.top} x2={midX} y2={H - pad.bottom} stroke={GRID} strokeWidth={1} />
          {data.map((val, i) => {
            const y = pad.top + i * rowH + rowH * 0.2;
            const barH = rowH * 0.6;
            const w = (Math.abs(val) / max) * plotW;
            const x = val >= 0 ? midX : midX - w;
            const fill = val >= 0 ? 'rgba(15,110,86,0.55)' : 'rgba(8,80,65,0.45)';
            return (
              <g key={labels[i]}>
                <text x={pad.left - 8} y={y + barH / 2 + 3.5} textAnchor="end" fill="#AAA" style={TICK_FONT_SM}>
                  {labels[i]}
                </text>
                <rect x={x} y={y} width={w} height={barH} rx={borderRadius} fill={fill} />
                <text
                  x={val >= 0 ? x + w + 6 : x - 6}
                  y={y + barH / 2 + 3.5}
                  textAnchor={val >= 0 ? 'start' : 'end'}
                  fill={RT.greenDark}
                  style={{ ...TICK_FONT_SM, fontWeight: 600 }}
                >
                  {val > 0 ? '+' : ''}{val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  if (horizontal) {
    const pad = { top: 12, right: 40, bottom: 12, left: 88 };
    const plotW = W - pad.left - pad.right;
    const rowH = (H - pad.top - pad.bottom) / data.length;

    return (
      <div className="relative w-full" style={{ height: H }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="none" role="img">
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const x = pad.left + pct * plotW;
            return <line key={pct} x1={x} y1={pad.top} x2={x} y2={H - pad.bottom} stroke={GRID} strokeWidth={1} />;
          })}
          {data.map((val, i) => {
            const y = pad.top + i * rowH + rowH * 0.18;
            const barH = rowH * 0.64;
            const w = (val / max) * plotW;
            const fill = colors?.[i] ?? colors ?? RT.green;
            return (
              <g key={labels[i]}>
                <text x={pad.left - 8} y={y + barH / 2 + 3.5} textAnchor="end" fill="#AAA" style={TICK_FONT_SM}>
                  {labels[i]}
                </text>
                <rect x={pad.left} y={y} width={w} height={barH} rx={borderRadius} fill={fill} />
                <text x={pad.left + w + 6} y={y + barH / 2 + 3.5} fill="#AAA" style={TICK_FONT_SM}>
                  {val}{xSuffix}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  const pad = { top: 14, right: 18, bottom: 32, left: 40 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const barW = plotW / data.length;
  const gap = barW * 0.28;
  const yTicks = [0, Math.round(max * 0.25), Math.round(max * 0.5), Math.round(max * 0.75), max].filter(
    (v, i, arr) => arr.indexOf(v) === i,
  );

  return (
    <div className="relative w-full" style={{ height: H }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="none" role="img">
        {yTicks.map((tick) => {
          const y = pad.top + plotH - (tick / max) * plotH;
          return (
            <g key={tick}>
              <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke={GRID} strokeWidth={1} />
              <text x={pad.left - 6} y={y + 3.5} textAnchor="end" fill="#AAA" style={TICK_FONT_SM}>
                {tick}{ySuffix}
              </text>
            </g>
          );
        })}

        {data.map((val, i) => {
          const bh = (val / max) * plotH;
          const x = pad.left + i * barW + gap / 2;
          const w = barW - gap;
          const y = pad.top + plotH - bh;
          const fill = colors?.[i] ?? colors ?? RT.green;
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={bh} rx={borderRadius} fill={fill} />
              {labels?.[i] && (
                <text x={x + w / 2} y={H - 10} textAnchor="middle" fill="#AAA" style={TICK_FONT_SM}>
                  {labels[i]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
