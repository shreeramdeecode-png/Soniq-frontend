import { useState, useMemo } from 'react';
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

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const VARIANTS = ['excellent', 'good', 'avg', 'good', 'excellent'];

function generateMonthCells(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cells = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push({ day: null, variant: 'empty' });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isToday = date.toDateString() === today.toDateString();

    if (isWeekend) {
      cells.push({ day: d, variant: 'weekend' });
    } else {
      const seed = (d * 7 + month * 31) % 10;
      const variant = seed < 2 ? 'low' : seed < 4 ? 'avg' : seed < 7 ? 'good' : 'excellent';
      const hours = (5 + (seed / 10) * 3.5).toFixed(1) + 'h';
      cells.push({ day: d, hours, variant, today: isToday });
    }
  }

  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let i = 0; i < remaining; i++) {
      cells.push({ day: null, variant: 'empty' });
    }
  }

  return cells;
}

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
  const [monthOffset, setMonthOffset] = useState(0);

  const { monthLabel, cells } = useMemo(() => {
    const baseDate = new Date(2026, 3 + monthOffset, 1);
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();

    if (monthOffset === 0) {
      return { monthLabel: heatmapData.month, cells: heatmapData.cells };
    }

    return {
      monthLabel: `${MONTH_NAMES[month]} ${year}`,
      cells: generateMonthCells(year, month),
    };
  }, [monthOffset]);

  const { days, legend } = heatmapData;

  return (
    <GlossyCard className="p-4.5">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-lg font-semibold text-text-primary">
          Work Hours Calendar — {monthLabel}
        </h3>
        <div className="flex items-center gap-2.5 text-sm-plus text-text-primary font-medium">
          <button
            onClick={() => setMonthOffset((p) => p - 1)}
            className="w-[26px] h-[26px] rounded-full border border-black/10 flex items-center justify-center cursor-pointer bg-white/60 hover:bg-white/90 transition-colors"
          >
            <ChevronLeft size={10} stroke="#888" strokeWidth={2} />
          </button>
          <span className="min-w-[100px] text-center">{monthLabel}</span>
          <button
            onClick={() => setMonthOffset((p) => p + 1)}
            disabled={monthOffset >= 0}
            className="w-[26px] h-[26px] rounded-full border border-black/10 flex items-center justify-center cursor-pointer bg-white/60 hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
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
