import { Monitor } from 'lucide-react';
import GlossyCard from '@/components/ui/GlossyCard';
import { screenshotFeed } from '@/mock/dashboard';

const STATUS_COLOR = {
  productive: '#0F6E56',
  idle: '#C8C8C0',
  unproductive: '#1A1A1A',
};

function FeedItem({ name, app, time, status, thumbBg, thumbStroke }) {
  const dotColor = STATUS_COLOR[status];
  const showGlow = status === 'productive';

  return (
    <div className="flex items-center gap-[9px] py-2 border-b border-black/[0.04] last:border-b-0 last:pb-0">
      <div
        className="thumb-sheen w-12 h-[34px] rounded-lg shrink-0 flex items-center justify-center relative overflow-hidden"
        style={{ background: thumbBg }}
      >
        <Monitor size={16} stroke={thumbStroke} strokeWidth={2} className="relative z-10" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-text-primary">{name}</div>
        <div className="text-xs text-text-light mt-px">{app}</div>
      </div>
      <div className="flex flex-col items-end gap-[3px]">
        <span className="text-2xs-plus text-text-lighter">{time}</span>
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: dotColor,
            boxShadow: showGlow ? '0 0 4px rgba(0,0,0,0.2)' : 'none',
          }}
        />
      </div>
    </div>
  );
}

export default function ScreenshotFeedCard() {
  return (
    <GlossyCard className="p-4">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-text-primary">Screenshot Feed</h3>
        <div className="flex items-center gap-[5px]">
          <div className="w-[5px] h-[5px] rounded-full bg-primary animate-pulse" />
          <span className="text-xs-plus text-text-muted">Live</span>
        </div>
      </div>

      {screenshotFeed.map((item) => (
        <FeedItem key={item.id} {...item} />
      ))}

      <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-black/5">
        <div className="flex gap-2.5">
          {[
            { label: 'Productive', color: '#0F6E56' },
            { label: 'Idle', color: '#C8C8C0' },
            { label: 'Unproductive', color: '#1A1A1A' },
          ].map((legend) => (
            <div key={legend.label} className="flex items-center gap-1 text-2xs-plus text-text-muted">
              <div className="w-[5px] h-[5px] rounded-full" style={{ background: legend.color }} />
              {legend.label}
            </div>
          ))}
        </div>
        <span className="text-xs text-text-light cursor-pointer">View All →</span>
      </div>
    </GlossyCard>
  );
}
