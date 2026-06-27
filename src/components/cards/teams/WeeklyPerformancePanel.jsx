import { useState } from 'react';
import GlossyCard from '@/components/ui/GlossyCard';

export default function WeeklyPerformancePanel({ performance = [] }) {
  const [hovered, setHovered] = useState(null);

  return (
    <GlossyCard className="p-4">
      <h4 className="text-md font-semibold text-text-primary mb-1">This Week's Performance</h4>
      <p className="text-xs text-text-light mb-4">Avg productive hours / day</p>
      <div className="flex items-end gap-1 h-[50px] font-poppins relative">
        {performance.length > 0 ? (
          performance.map((bar, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-[3px] relative"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered === i && bar.tooltip && (
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-ink text-white text-[9px] font-semibold px-[7px] py-[3px] rounded-[6px] whitespace-nowrap z-10 shadow-lg pointer-events-none">
                  {bar.tooltip}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-ink" />
                </div>
              )}
              <div
                className="w-full rounded-t-[3px] transition-opacity"
                style={{
                  height: `${bar.height}px`,
                  background: bar.bg,
                  opacity: hovered !== null && hovered !== i ? 0.45 : 1,
                }}
              />
              <span className="text-[8.5px] text-text-lighter">{bar.day}</span>
            </div>
          ))
        ) : (
          <div className="text-xs text-text-light py-2 w-full text-center">No weekly performance metrics.</div>
        )}
      </div>
    </GlossyCard>
  );
}
