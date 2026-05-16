import { useId } from 'react';
import { RT } from './reportTheme';
import { GRID, TICK_FONT, TICK_FONT_SM, buildYTicks, tensionLinePath, scalePoint } from './chartUtils';

export default function ReportLineChart({
  data,
  labels,
  height = 200,
  min = 0,
  max = 100,
  yTickStep = 10,
  ySuffix = '%',
  color = RT.green,
  fillColor = RT.greenFill,
  showFill = true,
  tension = 0.4,
  pointRadius = 4,
  strokeWidth = 2.5,
}) {
  const gradId = useId().replace(/:/g, '');
  const W = 600;
  const H = 200;
  const pad = { top: 14, right: 18, bottom: 32, left: 46 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const baseline = pad.top + plotH;
  const yTicks = buildYTicks(min, max, yTickStep);
  const tickStyle = labels.length > 12 ? TICK_FONT_SM : TICK_FONT;

  const points = data.map((v, i) => scalePoint(i, data.length, pad, plotW, plotH, v, min, max));
  const linePath = tensionLinePath(points, tension);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`;

  const labelStep = labels.length <= 10 ? 1 : labels.length <= 15 ? 2 : 3;

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="Line chart"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => {
          const y = pad.top + plotH - ((tick - min) / (max - min)) * plotH;
          return (
            <g key={tick}>
              <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke={GRID} strokeWidth={1} />
              <text x={pad.left - 8} y={y + 3.5} textAnchor="end" fill="#AAA" style={tickStyle}>
                {tick}{ySuffix}
              </text>
            </g>
          );
        })}

        {points.map((p, i) => (
          <line key={`v-${i}`} x1={p.x} y1={pad.top} x2={p.x} y2={baseline} stroke={GRID} strokeWidth={1} />
        ))}

        {showFill && <path d={areaPath} fill={`url(#${gradId})`} />}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, i) => (
          <circle
            key={`pt-${i}`}
            cx={p.x}
            cy={p.y}
            r={pointRadius}
            fill={color}
            stroke="#fff"
            strokeWidth={1.5}
          />
        ))}

        {labels.map((label, i) => {
          if (i % labelStep !== 0 && i !== labels.length - 1) return null;
          return (
            <text
              key={`${label}-${i}`}
              x={points[i].x}
              y={H - 10}
              textAnchor="middle"
              fill="#AAA"
              style={tickStyle}
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
