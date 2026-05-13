import { ChevronLeft, ChevronRight } from 'lucide-react';
import GlossyCard from '@/components/ui/GlossyCard';
import { heatmapData } from '@/mock/teamDetail';
import { cn } from '@/utils/cn';

const CELL_VARIANTS = {
  empty: 'bg-black/[0.04]',
  weekend: 'bg-black/[0.03]',
  excellent: 'hmap-excellent',
  good: 'hmap-good',
  avg: 'hmap-avg',
  low: 'hmap-low',
};

function HeatmapCell({ day, hours, variant, today }) {
  const isWeekend = variant === 'weekend';
  const isEmpty = variant === 'empty';
  const isLow = variant === 'low';

  return (
    <div
      className={cn(
        'h-9 rounded-lg flex flex-col items-center justify-center cursor-pointer relative transition-transform hover:scale-105',
        CELL_VARIANTS[variant]
      )}
      style={today ? { outline: '2px solid #1D9E75', outlineOffset: '2px' } : undefined}
    >
      {day && (
        <div className={cn(
          'text-xs font-semibold leading-none',
          (isEmpty || isWeekend) ? 'text-[#DDD]' : isLow ? 'text-text-muted' : 'text-white'
        )}>
          {day}
        </div>
      )}
      {hours && (
        <div className={cn(
          'text-[8px] mt-px',
          isLow ? 'text-text-light' : 'text-white/70'
        )}>
          {hours}
        </div>
      )}
    </div>
  );
}

export default function CalendarHeatmap() {
  const { month, days, cells, legend } = heatmapData;

  return (
    <GlossyCard className="p-4.5">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-lg font-semibold text-text-primary">
          Work Hours Calendar — {month}
        </h3>
        <div className="flex items-center gap-2.5 text-sm-plus text-text-primary font-medium">
          <button className="w-[26px] h-[26px] rounded-full border border-black/10 flex items-center justify-center cursor-pointer bg-white/60">
            <ChevronLeft size={10} stroke="#888" strokeWidth={2} />
          </button>
          <span>{month}</span>
          <button className="w-[26px] h-[26px] rounded-full border border-black/10 flex items-center justify-center cursor-pointer bg-white/60">
            <ChevronRight size={10} stroke="#888" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1.5">
        {days.map((d) => (
          <div key={d} className="text-2xs-plus text-text-lighter text-center font-medium">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => (
          <HeatmapCell key={i} {...cell} />
        ))}
      </div>

      <div className="flex items-center gap-3 mt-2.5 justify-end">
        {legend.map((leg) => (
          <div key={leg.label} className="flex items-center gap-[5px] text-2xs-plus text-text-muted">
            <div
              className="w-2.5 h-2.5 rounded-[3px]"
              style={{ background: leg.bg, border: leg.border || 'none' }}
            />
            {leg.label}
          </div>
        ))}
      </div>
    </GlossyCard>
  );
}
