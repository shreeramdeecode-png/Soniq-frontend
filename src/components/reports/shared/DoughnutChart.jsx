export default function DoughnutChart({
  segments,
  size = 200,
  cutout = 0.65,
  centerValue,
  centerLabel = 'productive',
  showCenter = true,
  hideLegend = false,
  legendUnit = '%',
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let cumulative = 0;
  const r = 40;
  const cx = 50;
  const cy = 50;
  const innerR = r * cutout;

  const arcs = segments.map((seg) => {
    const start = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    cumulative += seg.value;
    const end = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = end - start > Math.PI ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    return <path key={seg.label} d={d} fill={seg.color} />;
  });

  const center = centerValue ?? segments[0]?.value;

  return (
    <div className="flex flex-col items-center w-full">
      <svg width={size} height={size} viewBox="0 0 100 100" className="mx-auto">
        {arcs}
        <circle cx={cx} cy={cy} r={innerR} fill="white" />
        {showCenter && (
          <>
            <text x={cx} y={cy - 1} textAnchor="middle" fill="#0F6E56" style={{ fontSize: 12, fontWeight: 800, fontFamily: 'Poppins, sans-serif' }}>
              {center}%
            </text>
            <text x={cx} y={cy + 9} textAnchor="middle" fill="#888" style={{ fontSize: 5.5, fontFamily: 'Poppins, sans-serif' }}>
              {centerLabel}
            </text>
          </>
        )}
      </svg>
      {!hideLegend && (
        <div className="flex flex-wrap gap-3 mt-2 justify-center text-[10px] text-[#888]">
          {segments.map((s) => (
            <span key={s.label} className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
              {s.label} {s.value}{legendUnit}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
