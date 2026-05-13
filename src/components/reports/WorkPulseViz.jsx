import { cn } from '@/utils/cn';
import { heatmapData } from '@/mock/reports';

function HeatCell({ value }) {
  const alpha = value / 100;
  const bg = value >= 70
    ? `rgba(15,110,86,${alpha})`
    : `rgba(240,240,232,0.8)`;

  return (
    <div
      className="h-[38px] rounded-[6px] cursor-pointer transition-transform hover:scale-105 flex items-center justify-center"
      style={{ background: bg }}
      title={`${value}%`}
    >
      {value >= 70 && (
        <span className="text-2xs font-bold text-white/80">{value}</span>
      )}
    </div>
  );
}

export default function WorkPulseViz() {
  const { hours, days, values, distractions } = heatmapData;

  return (
    <div className="space-y-5">
      {/* Heatmap */}
      <div>
        {/* Hours header */}
        <div className="grid gap-[3px] mb-1" style={{ gridTemplateColumns: '44px repeat(10, 1fr)' }}>
          <div />
          {hours.map((h) => (
            <div key={h} className="text-xs text-text-light text-center font-medium">{h}</div>
          ))}
        </div>
        {/* Day rows */}
        {days.map((day) => (
          <div key={day} className="grid gap-[3px] mb-[3px]" style={{ gridTemplateColumns: '44px repeat(10, 1fr)' }}>
            <div className="text-xs text-text-muted font-semibold flex items-center">{day}</div>
            {values[day].map((v, i) => (
              <HeatCell key={i} value={v} />
            ))}
          </div>
        ))}
        {/* Legend */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-xs text-text-light">Low</span>
          {[0.1, 0.25, 0.45, 0.65, 0.85, 1].map((a, i) => (
            <div key={i} className="flex-1 h-2.5 rounded-sm" style={{ background: `rgba(15,110,86,${a})` }} />
          ))}
          <span className="text-xs text-text-light">High</span>
        </div>
      </div>

      {/* Distractions */}
      <div>
        <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Top Distraction Sources</div>
        <div className="grid grid-cols-2 gap-2.5">
          {distractions.map((d) => (
            <div key={d.name} className="flex items-center gap-2.5 bg-surface-subtle rounded-lg px-4 py-3">
              <div className="w-6 h-6 rounded-[6px] shrink-0" style={{ background: d.color }} />
              <span className="flex-1 text-sm font-medium text-text-primary">{d.name}</span>
              <span className="text-xs font-semibold text-[#993535]">{d.time}</span>
              <div className="w-10 h-[6px] rounded-full bg-neutral-pale overflow-hidden">
                <div className="h-full rounded-full bg-[#993535]" style={{ width: `${d.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
