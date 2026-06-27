import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GlossyCard from '@/components/ui/GlossyCard';
import api from '@/utils/api';
import { cn } from '@/utils/cn';

const CELL_VARIANTS = {
  empty: 'bg-black/[0.04]',
  weekend: 'bg-black/[0.03]',
  excellent: 'hmap-excellent',
  good: 'hmap-good',
  avg: 'hmap-avg',
  low: 'hmap-low',
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const LEGEND = [
  { label: 'Excellent', bg: 'linear-gradient(135deg, #1D9E75, #0F6E56)' },
  { label: 'Good', bg: 'rgba(29, 158, 117, 0.55)', border: '1px solid rgba(29, 158, 117, 0.7)' },
  { label: 'Average', bg: 'rgba(29, 158, 117, 0.2)', border: '1px solid rgba(29, 158, 117, 0.3)' },
  { label: 'Low', bg: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.06)' },
];

function HeatmapCell({ day, hours, variant, today }) {
  const isWeekend = variant === 'weekend';
  const isEmpty = variant === 'empty';

  return (
    <div
      className={cn(
        'h-9 rounded-lg flex flex-col items-center justify-center cursor-pointer relative transition-transform hover:scale-105 font-poppins',
        CELL_VARIANTS[variant]
      )}
      style={today ? { outline: '2px solid #1D9E75', outlineOffset: '2px' } : undefined}
    >
      {day && (
        <div className={cn(
          'text-xs font-semibold leading-none font-poppins',
          (isEmpty || isWeekend) ? 'text-[#DDD]'
            : variant === 'excellent' ? 'text-white'
            : variant === 'good' ? 'text-[#0F6E56]'
            : variant === 'avg' ? 'text-[#1D9E75]'
            : 'text-text-muted'
        )}>
          {day}
        </div>
      )}
      {hours && (
        <div className={cn(
          'text-[8px] mt-px font-poppins',
          variant === 'excellent' ? 'text-white/75'
            : variant === 'good' ? 'text-[#0F6E56]/80'
            : variant === 'avg' ? 'text-[#1D9E75]/70'
            : 'text-text-light'
        )}>
          {hours}
        </div>
      )}
    </div>
  );
}

export default function CalendarHeatmap({ teamId }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [apiCells, setApiCells] = useState([]);

  const baseDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthOffset);
    return d;
  }, [monthOffset]);

  const year = baseDate.getFullYear();
  const month = baseDate.getMonth(); // 0-indexed
  const monthLabel = `${MONTH_NAMES[month]} ${year}`;

  useEffect(() => {
    if (!teamId) return;

    async function fetchCalendar() {
      try {
        const yearParam = year;
        const monthParam = month + 1; // 1-indexed for backend

        const res = await api.get(`/api/client/teams/${teamId}/calendar?year=${yearParam}&month=${monthParam}`);
        const data = res.data || [];

        // Generate normal month cells structure
        const firstDay = new Date(year, month, 1).getDay();
        const startOffset = firstDay === 0 ? 6 : firstDay - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        const cells = [];

        // Padding for offset
        for (let i = 0; i < startOffset; i++) {
          cells.push({ day: null, variant: 'empty' });
        }

        // Create map of API responses by day string
        const apiMap = new Map();
        data.forEach(item => {
          const dateDay = new Date(item.date).getUTCDate();
          apiMap.set(dateDay, item);
        });

        // Generate days
        for (let d = 1; d <= daysInMonth; d++) {
          const date = new Date(year, month, d);
          const dayOfWeek = date.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const isToday = date.toDateString() === today.toDateString();

          if (isWeekend) {
            cells.push({ day: d, variant: 'weekend' });
          } else {
            // Check if backend has tracked data for this day
            const apiData = apiMap.get(d);
            if (apiData) {
              const score = apiData.avgProductivityScore != null ? Number(apiData.avgProductivityScore) : 0;
              const hoursVal = apiData.totalProductiveSeconds / 3600;
              const hStr = Math.floor(hoursVal);
              const mStr = Math.round((hoursVal % 1) * 60);
              const hoursLabel = `${hStr}h ${mStr}m`;

              let variant = 'low';
              if (score >= 85) variant = 'excellent';
              else if (score >= 70) variant = 'good';
              else if (score >= 50) variant = 'avg';

              cells.push({ day: d, hours: hoursLabel, variant, today: isToday });
            } else {
              // No tracked data — show as empty (grey), not fake data
              cells.push({ day: d, variant: 'empty', today: isToday });
            }
          }
        }

        // Pad end
        const remaining = 7 - (cells.length % 7);
        if (remaining < 7) {
          for (let i = 0; i < remaining; i++) {
            cells.push({ day: null, variant: 'empty' });
          }
        }

        setApiCells(cells);
      } catch (err) {
        console.error('Error fetching calendar stats:', err);
      }
    }

    fetchCalendar();
  }, [teamId, year, month]);

  return (
    <GlossyCard className="p-4.5">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-lg font-semibold text-text-primary">
          Work Hours Calendar — {monthLabel}
        </h3>
        <div className="flex items-center gap-2.5 text-sm-plus text-text-primary font-medium font-poppins">
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

      <div className="grid grid-cols-7 gap-1 mb-1.5 font-poppins">
        {DAYS.map((d) => (
          <div key={d} className="text-2xs-plus text-text-lighter text-center font-medium">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {apiCells.map((cell, i) => (
          <HeatmapCell key={i} {...cell} />
        ))}
      </div>

      <div className="flex items-center gap-3 mt-2.5 justify-end font-poppins">
        {LEGEND.map((leg) => (
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

