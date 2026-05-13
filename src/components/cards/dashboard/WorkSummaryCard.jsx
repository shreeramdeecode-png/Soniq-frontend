import GlossyCard from '@/components/ui/GlossyCard';
import { workSummary } from '@/mock/dashboard';
import { cn } from '@/utils/cn';

const BAR_VARIANTS = {
  dark: 'bar-dark',
  gray: 'bar-gray',
  primary: 'bar-primary',
};

function BarColumn({ day, height, variant, tooltip, active }) {
  return (
    <div className="flex flex-col items-center gap-[5px] flex-1 min-w-0">
      <div className="self-stretch relative">
        <div
          className={cn('w-full rounded-t-[5px]', BAR_VARIANTS[variant])}
          style={{ height: `${height}px` }}
        />
        {tooltip && (
          <div className="bar-tooltip absolute -top-6 left-1/2 -translate-x-1/2 text-white text-2xs font-semibold py-0.5 px-1.5 rounded-md whitespace-nowrap">
            {tooltip}
          </div>
        )}
      </div>
      <div
        className={cn(
          'w-1 h-1 rounded-full',
          active ? 'bg-primary' : 'bg-ink'
        )}
      />
      <span className="text-2xs-plus text-text-light">{day}</span>
    </div>
  );
}

export default function WorkSummaryCard() {
  const { todayHours, weeklyData } = workSummary;

  return (
    <GlossyCard className="p-4.5">
      <div className="flex items-start justify-between mb-2.5">
        <h3 className="text-lg font-semibold text-text-primary">Work Summary</h3>
        <button className="w-[26px] h-[26px] rounded-full border border-black/10 flex items-center justify-center cursor-pointer text-sm-plus text-text-muted bg-white/60 shrink-0">
          ↗
        </button>
      </div>

      <div className="flex items-end gap-0 mb-3.5">
        <span className="text-5xl font-bold text-text-primary tracking-tight leading-none">
          {todayHours}<span className="text-3xl">h</span>
        </span>
        <span className="text-xs text-text-light ml-[7px] leading-[1.3]">
          Productive<br />today
        </span>
      </div>

      <div className="flex items-end gap-[7px] h-[85px] mt-5">
        {weeklyData.map((bar, i) => (
          <BarColumn key={i} {...bar} />
        ))}
      </div>
    </GlossyCard>
  );
}
