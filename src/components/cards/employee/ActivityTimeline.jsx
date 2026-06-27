import { useState } from 'react';
import GlossyCard from '@/components/ui/GlossyCard';

const timelineTicks = ['9 AM', '10', '11', '12', '1 PM', '2', '3', '4', '5 PM'];
const timelineLegend = [
  { label: 'Productive', bg: '#0F6E56' },
  { label: 'Neutral', bg: 'rgba(29,158,117,0.35)' },
  { label: 'Idle', bg: 'rgba(29,158,117,0.12)' },
  { label: 'Unproductive', bg: '#1A1A1A' },
];

export default function ActivityTimeline({ segments = [], dateLabel = 'Today' }) {
  const [hovered, setHovered] = useState(null);

  return (
    <GlossyCard className="p-4.5">
      <h4 className="text-sm-plus font-semibold text-text-primary mb-2.5 font-poppins">
        Activity Timeline — {dateLabel}
      </h4>

      <div className="relative mb-1.5">
        <div className="relative h-8 bg-surface-muted rounded-lg overflow-hidden">
          {segments.length > 0 ? (
            segments.map((seg, i) => (
              <div
                key={i}
                className="absolute top-0 h-full rounded-[1px] cursor-pointer transition-opacity hover:opacity-80"
                style={{ left: seg.left, width: seg.width, background: seg.bg }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-text-light font-poppins">
              No activity tracked yet.
            </div>
          )}
        </div>
        {hovered != null && segments[hovered] && (
          <div
            className="absolute -top-7 z-20 -translate-x-1/2 px-2 py-1 rounded-md bg-ink text-white text-2xs font-medium whitespace-nowrap pointer-events-none font-poppins"
            style={{ left: `calc(${segments[hovered].left} + (${segments[hovered].width}) / 2)` }}
          >
            {segments[hovered].tooltip || segments[hovered].label || 'Activity'}
          </div>
        )}
      </div>

      <div className="flex justify-between px-0.5 font-poppins">
        {timelineTicks.map((tick) => (
          <span key={tick} className="text-2xs text-[#CCC]">{tick}</span>
        ))}
      </div>

      <div className="flex gap-3.5 mt-2 flex-wrap font-poppins">
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
