import { heatColorGreen, HEAT_LEGEND } from './reportTheme';

export { heatColorGreen as heatColor };

export default function ProductivityHeatmap({ hours, days, values }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[520px]">
        <div className="grid gap-[3px] mb-[3px]" style={{ gridTemplateColumns: `36px repeat(${hours.length}, 1fr)` }}>
          <div />
          {hours.map((h) => (
            <div key={h} className="text-[8.5px] text-[#AAA] text-center font-medium">{h}</div>
          ))}
        </div>
        {days.map((day) => (
          <div
            key={day}
            className="grid gap-[3px] mb-[3px]"
            style={{ gridTemplateColumns: `36px repeat(${hours.length}, 1fr)` }}
          >
            <div className="text-[9px] text-[#AAA] font-semibold flex items-center">{day}</div>
            {values[day].map((v, i) => (
              <div
                key={i}
                className="h-[34px] rounded-[6px] flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                style={{ background: heatColorGreen(v) }}
                title={`${day} ${hours[i]}: ${v}%`}
              >
                <span className="text-[9px] font-bold" style={{ color: v >= 60 ? '#fff' : '#CCC' }}>
                  {v}%
                </span>
              </div>
            ))}
          </div>
        ))}
        <div className="flex items-center gap-1.5 mt-2.5">
          <span className="text-[9px] text-[#AAA]">Low</span>
          <div className="flex-1 flex gap-0.5">
            {HEAT_LEGEND.map((c, i) => (
              <div key={i} className="flex-1 h-2.5 rounded-sm" style={{ background: c }} />
            ))}
          </div>
          <span className="text-[9px] text-[#AAA]">High</span>
        </div>
      </div>
    </div>
  );
}
