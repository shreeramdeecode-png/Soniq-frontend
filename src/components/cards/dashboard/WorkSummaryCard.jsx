import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlossyCard from '@/components/ui/GlossyCard';
import api from '@/utils/api';
import { cn } from '@/utils/cn';

const BAR_VARIANTS = {
  dark: 'bar-dark',
  gray: 'bar-gray',
  primary: 'bar-primary',
};

function localDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function BarColumn({ day, height, variant, tooltip, active, pinTooltip }) {
  const [hovered, setHovered] = useState(false);
  const showTip = tooltip && (pinTooltip || hovered);

  return (
    <div
      className="flex flex-col items-center gap-[5px] flex-1 min-w-0 font-poppins"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="self-stretch relative">
        <div
          className={cn('w-full rounded-t-[5px] transition-opacity', BAR_VARIANTS[variant], !pinTooltip && hovered && 'opacity-80')}
          style={{ height: `${height}px` }}
        />
        {showTip && (
          <div className={cn(
            'absolute -top-7 left-1/2 -translate-x-1/2 text-white text-2xs font-semibold py-0.5 px-1.5 rounded-md whitespace-nowrap z-10',
            variant === 'primary' ? 'bg-primary' : 'bg-ink',
          )}>
            {tooltip}
          </div>
        )}
      </div>
      <div className={cn('w-1 h-1 rounded-full', active ? 'bg-primary' : 'bg-ink')} />
      <span className="text-2xs-plus text-text-light">{day}</span>
    </div>
  );
}

export default function WorkSummaryCard({ from: propFrom, to: propTo }) {
  const [data, setData] = useState({
    todayHours: 0,
    displayLabel: 'avg today',
    weeklyData: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchWorkSummary() {
      try {
        const toDate = propTo ? new Date(propTo) : new Date();
        const toStr = localDateStr(toDate);

        const fromDate = propFrom ? new Date(propFrom) : (() => {
          const dayOfWeek = toDate.getDay();
          const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          const d = new Date(toDate);
          d.setDate(toDate.getDate() - daysFromMonday);
          return d;
        })();
        const fromStr = localDateStr(fromDate);

        const [statsRes, chartRes] = await Promise.all([
          api.get('/api/client/dashboard/stats'),
          api.get(`/api/client/dashboard/work-hour-chart?from=${fromStr}&to=${toStr}`),
        ]);

        const stats = statsRes.data;
        const rawChart = chartRes.data ?? [];
        const totalEmployees = Math.max(stats.totalEmployees || 1, 1);

        const weekDayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const apiByDate = new Map(rawChart.map(r => [r.date, r]));

        // Always render full Mon→Sun (7 columns)
        const fullWeek = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(fromDate);
          d.setDate(fromDate.getDate() + i);
          const dateStr = localDateStr(d);
          const dayIdx = d.getDay();
          const apiRow = apiByDate.get(dateStr);
          const prodHours = apiRow ? (apiRow.productive / 3600) / totalEmployees : 0;
          const isFuture = d > toDate;

          return {
            dateStr,
            day: weekDayLabels[dayIdx],
            hours: prodHours,
            isToday: dateStr === toStr,
            isWeekend: dayIdx === 0 || dayIdx === 6,
            hasData: !!apiRow,
            isFuture,
          };
        });

        const maxHours = Math.max(...fullWeek.map(d => d.hours), 0.1);
        const absMax = 8;

        const scaledData = fullWeek.map(d => {
          let variant = d.isWeekend ? 'gray' : 'dark';
          if (d.isToday && d.hasData) variant = 'primary';

          const h = Math.floor(d.hours);
          const m = Math.round((d.hours % 1) * 60);
          const tooltip = d.hasData ? `${h}h ${m}m` : null;
          const isPeak = d.hasData && d.hours === maxHours;

          return {
            day: d.day,
            height: d.isFuture ? 4 : d.hasData ? Math.max(16, Math.round((d.hours / absMax) * 110)) : 5,
            variant: d.isFuture ? 'gray' : variant,
            tooltip,
            active: d.isToday && d.hasData,
            pinTooltip: isPeak,
          };
        });

        const latestWithData = [...fullWeek].reverse().find(d => d.hasData);
        const displayHours = latestWithData ? Math.round(latestWithData.hours * 10) / 10 : 0;
        const displayLabel = latestWithData?.isToday ? 'avg today' : 'avg last day';

        setData({ todayHours: displayHours, displayLabel, weeklyData: scaledData });
      } catch (err) {
        console.error('Error fetching work summary:', err);
      }
    }

    fetchWorkSummary();
  }, [propFrom, propTo]);

  return (
    <GlossyCard className="p-4.5">
      {/* Header row: title left, stats centre-right, button far right */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold text-text-primary">Work Summary</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-end gap-1.5">
            <span className="text-2xl font-bold text-text-primary tracking-tight leading-none">
              {data.todayHours}<span className="text-lg">h</span>
            </span>
            <span className="text-xs text-text-light leading-[1.3] mb-0.5">
              Productive<br />{data.displayLabel}
            </span>
          </div>
          <button onClick={() => navigate('/reports')} className="w-[26px] h-[26px] rounded-full border border-black/10 flex items-center justify-center cursor-pointer text-sm-plus text-text-muted bg-white/60 shrink-0">
            ↗
          </button>
        </div>
      </div>

      <div className="flex items-end gap-[7px] h-[120px] mt-6 pt-6">
        {data.weeklyData.map((bar, i) => (
          <BarColumn key={i} {...bar} />
        ))}
      </div>
    </GlossyCard>
  );
}
