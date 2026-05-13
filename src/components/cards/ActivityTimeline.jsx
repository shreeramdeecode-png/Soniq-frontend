import GlossyCard from '@/components/ui/GlossyCard';
import { timelineSegments, timelineTicks, timelineLegend } from '@/mock/employeeProfile';

export default function ActivityTimeline() {
  return (
    <GlossyCard className="p-4.5">
      <h4 className="text-sm-plus font-semibold text-text-primary mb-2.5">
        Activity Timeline — Today, Apr 16
      </h4>

      <div className="relative h-8 bg-surface-muted rounded-lg overflow-hidden mb-1.5">
        {timelineSegments.map((seg, i) => (
          <div
            key={i}
            className="absolute top-0 h-full rounded-[4px]"
            style={{ left: seg.left, width: seg.width, background: seg.bg }}
          />
        ))}
      </div>

      <div className="flex justify-between px-0.5">
        {timelineTicks.map((tick) => (
          <span key={tick} className="text-2xs text-[#CCC]">{tick}</span>
        ))}
      </div>

      <div className="flex gap-3.5 mt-2 flex-wrap">
        {timelineLegend.map((leg) => (
          <div key={leg.label} className="flex items-center gap-[5px] text-xs text-text-muted">
            <div className="w-2 h-2 rounded-[3px] shrink-0" style={{ background: leg.bg }} />
            {leg.label}
          </div>
        ))}
      </div>
    </GlossyCard>
  );
}
