import { cn } from '@/utils/cn';
import { burnoutData } from '@/mock/reports';

export default function BurnoutViz() {
  const { tiles, overtimeBars, barLabels } = burnoutData;
  const maxBar = Math.max(...overtimeBars);

  return (
    <div className="space-y-5">
      {/* Burn tiles */}
      <div className="grid grid-cols-3 gap-3">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-[14px] px-4 py-3.5" style={{ background: t.bg }}>
            <div className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: t.color, opacity: 0.8 }}>{t.label}</div>
            <div className="text-[24px] font-extrabold" style={{ color: t.color }}>{t.value}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div>
        <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Daily Overtime (minutes)</div>
        <div className="flex items-end gap-1 h-[160px] bg-surface-subtle rounded-[14px] p-4">
          {overtimeBars.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
              <div
                className="w-full rounded-t-[4px] transition-all hover:opacity-80"
                style={{
                  height: `${(val / maxBar) * 100}%`,
                  background: val > 50 ? 'rgba(153,53,53,0.7)' : val > 35 ? 'rgba(153,53,53,0.5)' : 'rgba(153,53,53,0.3)',
                }}
                title={`${barLabels[i]}: ${val}m`}
              />
              <span className="text-2xs text-text-light font-medium">{barLabels[i].slice(0, 2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
