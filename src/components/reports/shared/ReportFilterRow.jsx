import { useState } from 'react';
import { Search } from 'lucide-react';
import DateRangePicker from '@/components/ui/DateRangePicker';
import { cn } from '@/utils/cn';

export default function ReportFilterRow({ filters, onDateChange }) {
  const [scope, setScope] = useState(filters.scopeTabs[0]);
  const [activeChip, setActiveChip] = useState(filters.chips?.[0]?.label ?? null);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-3.5">
      <div className="flex gap-[2px] bg-black/[0.06] rounded-[30px] p-[3px]">
        {filters.scopeTabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setScope(t)}
            className={cn(
              'px-3.5 py-1.5 rounded-[20px] text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap',
              scope === t
                ? 'bg-white text-text-primary shadow-[0_1px_4px_rgba(0,0,0,.1)]'
                : 'text-text-muted hover:text-text-secondary',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <DateRangePicker
        from={new Date(2026, 3, 1)}
        to={new Date(2026, 3, 21)}
        variant="solid"
        onChange={onDateChange}
      />

      {filters.chips?.map((chip) => (
        <button
          key={chip.label}
          type="button"
          onClick={() => setActiveChip(chip.label)}
          className={cn(
            'h-[34px] px-3.5 rounded-[50px] text-[10.5px] font-medium cursor-pointer whitespace-nowrap border transition-colors',
            activeChip === chip.label && !chip.variant
              ? 'bg-gradient-to-br from-[#0F6E56] to-[#1D9E75] text-white border-[#0F6E56] shadow-sm'
              : chip.variant === 'red' || chip.variant === 'amb'
                ? activeChip === chip.label
                  ? 'bg-[rgba(15,110,86,.18)] text-[#085041] border-[rgba(15,110,86,.3)]'
                  : 'bg-[rgba(15,110,86,.08)] text-[#0F6E56] border-[rgba(15,110,86,.2)]'
                : chip.variant === 'grn'
                    ? activeChip === chip.label
                      ? 'bg-[rgba(15,110,86,.18)] text-[#085041] border-[rgba(15,110,86,.3)]'
                      : 'bg-[rgba(15,110,86,.08)] text-[#0F6E56] border-[rgba(15,110,86,.2)]'
                    : chip.variant === 'grey'
                      ? 'bg-[rgba(88,88,88,.08)] text-[#444] border-[rgba(88,88,88,.18)]'
                      : 'bg-white/62 border-white/88 text-text-muted hover:bg-white/90',
          )}
        >
          {chip.label}
        </button>
      ))}

      {filters.searchPlaceholder && (
        <label className="flex items-center gap-1.5 h-[34px] px-3.5 ml-auto min-w-[170px] bg-white/75 border border-white/95 rounded-[50px] text-[10.5px] text-[#CCCCAA]">
          <Search size={11} className="shrink-0 text-[#CCC]" />
          <input
            type="search"
            placeholder={filters.searchPlaceholder}
            className="border-none bg-transparent outline-none text-[10.5px] text-text-primary w-full placeholder:text-[#CCCCAA]"
          />
        </label>
      )}
    </div>
  );
}
