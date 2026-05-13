import GlossyCard from '@/components/ui/GlossyCard';
import { weeklyPerformance } from '@/mock/teamDetail';

export default function WeeklyPerformancePanel() {
  return (
    <GlossyCard className="p-4">
      <h4 className="text-md font-semibold text-text-primary mb-1">This Week's Performance</h4>
      <p className="text-xs text-text-light mb-3">Avg productive hours / day</p>
      <div className="flex items-end gap-1 h-[50px]">
        {weeklyPerformance.map((bar, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-[3px]">
            <div
              className="w-full rounded-t-[3px]"
              style={{ height: `${bar.height}px`, background: bar.bg }}
            />
            <span className="text-[8.5px] text-text-lighter">{bar.day}</span>
          </div>
        ))}
      </div>
    </GlossyCard>
  );
}
