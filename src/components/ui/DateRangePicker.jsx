import { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function formatDate(date) {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`;
}

function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(date, from, to) {
  if (!from || !to) return false;
  return date >= from && date <= to;
}

function MiniCalendar({ year, month, onMonthChange, from, to, onDateClick, hoverDate, onHover }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const effectiveTo = to || hoverDate;

  return (
    <div className="w-[260px]">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => onMonthChange(-1)} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/5 cursor-pointer transition-colors">
          <ChevronLeft size={13} stroke="#888" strokeWidth={2} />
        </button>
        <span className="text-sm font-semibold text-text-primary">
          {MONTH_FULL[month]} {year}
        </span>
        <button onClick={() => onMonthChange(1)} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/5 cursor-pointer transition-colors">
          <ChevronRight size={13} stroke="#888" strokeWidth={2} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-[10px] font-semibold text-text-lighter text-center py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((date, i) => {
          if (!date) return <div key={`e-${i}`} className="h-8" />;

          const isFrom = isSameDay(date, from);
          const isTo = isSameDay(date, to) || (!to && isSameDay(date, hoverDate));
          const inRange = from && effectiveTo && isInRange(date, from, effectiveTo) && !isFrom && !isTo;
          const isToday = isSameDay(date, today);
          const isFuture = date > today;

          return (
            <button
              key={date.toISOString()}
              onClick={() => !isFuture && onDateClick(date)}
              onMouseEnter={() => onHover(date)}
              disabled={isFuture}
              className={cn(
                'h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all cursor-pointer',
                isFrom || isTo
                  ? 'bg-primary text-white font-bold shadow-sm'
                  : inRange
                    ? 'bg-primary/[0.1] text-[#0F6E56]'
                    : isToday
                      ? 'ring-1 ring-primary/40 text-primary font-semibold'
                      : isFuture
                        ? 'text-text-lighter/50 cursor-not-allowed'
                        : 'text-text-secondary hover:bg-black/5'
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DateRangePicker({ from: initialFrom, to: initialTo, onChange, variant = 'glass' }) {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(initialFrom || new Date(2026, 3, 16));
  const [to, setTo] = useState(initialTo || new Date(2026, 3, 16));
  const [selecting, setSelecting] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [viewYear, setViewYear] = useState(from.getFullYear());
  const [viewMonth, setViewMonth] = useState(from.getMonth());
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSelecting(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleDateClick(date) {
    if (!selecting || selecting === 'from') {
      setFrom(date);
      setTo(null);
      setSelecting('to');
    } else {
      if (date < from) {
        setTo(from);
        setFrom(date);
      } else {
        setTo(date);
      }
      setSelecting(null);
      setOpen(false);
      onChange?.({ from: date < from ? date : from, to: date < from ? from : date });
    }
  }

  function handleMonthChange(dir) {
    let newMonth = viewMonth + dir;
    let newYear = viewYear;
    if (newMonth > 11) { newMonth = 0; newYear++; }
    if (newMonth < 0) { newMonth = 11; newYear--; }
    setViewMonth(newMonth);
    setViewYear(newYear);
  }

  function applyPreset(days) {
    const end = new Date(2026, 3, 16);
    const start = new Date(end);
    start.setDate(start.getDate() - days + 1);
    setFrom(start);
    setTo(end);
    setOpen(false);
    onChange?.({ from: start, to: end });
  }

  const pillVariants = {
    glass: 'glass-pill',
    solid: 'bg-white/80 border border-black/10 shadow-sm',
    primary: 'primary-pill',
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open) { setViewYear(from.getFullYear()); setViewMonth(from.getMonth()); } }}
        className={cn(
          'flex items-center gap-2 h-9 px-3.5 rounded-pill cursor-pointer transition-all',
          pillVariants[variant],
          open && 'ring-2 ring-primary/30'
        )}
      >
        <Calendar size={11} stroke={variant === 'primary' ? '#fff' : '#BBB'} strokeWidth={2} />
        <div className="flex flex-col px-1">
          <span className={cn('text-[8px] leading-none', variant === 'primary' ? 'text-white/60' : 'text-text-lighter')}>From</span>
          <span className={cn('text-[11px] font-semibold leading-tight', variant === 'primary' ? 'text-white' : 'text-text-primary')}>{formatDate(from)}</span>
        </div>
        <div className={cn('w-px h-4', variant === 'primary' ? 'bg-white/20' : 'bg-black/[0.09]')} />
        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
          <ArrowRight size={9} stroke="#fff" strokeWidth={2.5} />
        </div>
        <div className={cn('w-px h-4', variant === 'primary' ? 'bg-white/20' : 'bg-black/[0.09]')} />
        <div className="flex flex-col px-1">
          <span className={cn('text-[8px] leading-none', variant === 'primary' ? 'text-white/60' : 'text-text-lighter')}>To</span>
          <span className={cn('text-[11px] font-semibold leading-tight', variant === 'primary' ? 'text-white' : 'text-text-primary')}>{to ? formatDate(to) : '...'}</span>
        </div>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 bg-white/[0.97] backdrop-blur-xl rounded-[20px] border border-white/90 shadow-[0_12px_50px_rgba(0,0,0,0.18)] z-30 p-5 animate-[scaleIn_0.15s_ease]">
          {selecting && (
            <div className="text-xs font-semibold text-primary mb-3">
              {selecting === 'from' ? 'Select start date' : 'Select end date'}
            </div>
          )}

          <MiniCalendar
            year={viewYear}
            month={viewMonth}
            onMonthChange={handleMonthChange}
            from={from}
            to={to}
            onDateClick={handleDateClick}
            hoverDate={selecting === 'to' ? hoverDate : null}
            onHover={setHoverDate}
          />

          {/* Presets */}
          <div className="border-t border-black/[0.06] mt-4 pt-3 flex flex-wrap gap-1.5">
            <button onClick={() => applyPreset(1)} className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg bg-black/[0.04] text-text-muted hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors">Today</button>
            <button onClick={() => applyPreset(7)} className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg bg-black/[0.04] text-text-muted hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors">Last 7 days</button>
            <button onClick={() => applyPreset(14)} className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg bg-black/[0.04] text-text-muted hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors">Last 14 days</button>
            <button onClick={() => applyPreset(30)} className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg bg-black/[0.04] text-text-muted hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors">Last 30 days</button>
          </div>

          {/* Selection display */}
          <div className="border-t border-black/[0.06] mt-3 pt-3 flex items-center justify-between">
            <div className="text-[10px] text-text-muted">
              <span className="font-semibold text-text-primary">{formatDate(from)}</span>
              {to && <> → <span className="font-semibold text-text-primary">{formatDate(to)}</span></>}
            </div>
            <button
              onClick={() => { setSelecting('from'); }}
              className="text-[10px] font-semibold text-primary cursor-pointer hover:text-primary-dark transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SingleDatePicker({ date: initialDate, onChange, variant = 'primary' }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(initialDate || new Date(2026, 3, 16));
  const [viewYear, setViewYear] = useState(date.getFullYear());
  const [viewMonth, setViewMonth] = useState(date.getMonth());
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleDateClick(d) {
    setDate(d);
    setOpen(false);
    onChange?.(d);
  }

  function handleMonthChange(dir) {
    let newMonth = viewMonth + dir;
    let newYear = viewYear;
    if (newMonth > 11) { newMonth = 0; newYear++; }
    if (newMonth < 0) { newMonth = 11; newYear--; }
    setViewMonth(newMonth);
    setViewYear(newYear);
  }

  const fullDate = `${MONTH_FULL[date.getMonth()].slice(0, 3)} ${date.getDate()}, ${date.getFullYear()}`;

  const pillVariants = {
    glass: 'glass-pill',
    solid: 'bg-white/80 border border-black/10 shadow-sm',
    primary: 'primary-pill text-white',
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open) { setViewYear(date.getFullYear()); setViewMonth(date.getMonth()); } }}
        className={cn(
          'flex items-center gap-1.5 py-2 px-4 rounded-pill text-sm font-semibold cursor-pointer transition-all',
          pillVariants[variant],
          open && 'ring-2 ring-primary/30'
        )}
      >
        <Calendar size={12} stroke={variant === 'primary' ? '#fff' : '#666'} strokeWidth={2} />
        {fullDate}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 bg-white/[0.97] backdrop-blur-xl rounded-[20px] border border-white/90 shadow-[0_12px_50px_rgba(0,0,0,0.18)] z-30 p-5 animate-[scaleIn_0.15s_ease]">
          <MiniCalendar
            year={viewYear}
            month={viewMonth}
            onMonthChange={handleMonthChange}
            from={date}
            to={null}
            onDateClick={handleDateClick}
            hoverDate={null}
            onHover={() => {}}
          />
        </div>
      )}
    </div>
  );
}
