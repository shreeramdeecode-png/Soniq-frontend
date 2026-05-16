import { cn } from '@/utils/cn';

export default function ReportKpiGrid({ kpis, columns = 5 }) {
  const colClass =
    columns === 6
      ? 'grid-cols-6'
      : columns === 4
        ? 'grid-cols-4'
        : 'grid-cols-5';

  return (
    <div className={cn('grid gap-2.5 mb-3.5', colClass)}>
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className={cn(
            'rounded-[14px] border px-3.5 py-3',
            kpi.cardBg ?? 'bg-white/84 border-white/95 shadow-[0_2px_0_rgba(255,255,255,.95)_inset]',
          )}
          style={kpi.cardStyle}
        >
          <div
            className="text-[8.5px] text-[#AAA] uppercase tracking-[0.07em] mb-0.5"
            style={kpi.labelColor ? { color: kpi.labelColor } : undefined}
          >
            {kpi.label}
          </div>
          <div
            className="text-[17px] font-extrabold text-text-primary tracking-tight leading-tight"
            style={kpi.valueColor ? { color: kpi.valueColor } : undefined}
          >
            {kpi.value}
          </div>
          {kpi.sub && (
            <div className="text-[9px] text-[#888] mt-0.5" style={kpi.subColor ? { color: kpi.subColor } : undefined}>
              {kpi.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
