import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Grid3X3, List, Code, Monitor, Clock, Globe } from 'lucide-react';
import GlossyCard from '@/components/ui/GlossyCard';
import { screenshots } from '@/mock/screenshots';
import { cn } from '@/utils/cn';

const CATEGORY_BADGE = {
  productive: { className: 'bg-primary/[0.12] text-[#0F6E56] border border-primary/20', label: 'Productive' },
  neutral: { className: 'bg-surface-subtle text-text-muted', label: 'Neutral' },
  unproductive: { className: 'bg-ink text-primary-light', label: 'Unproductive' },
  idle: { className: 'bg-[#FFF8E8] text-[#B8860B]', label: 'Idle' },
};

const ICON_MAP = {
  code: Code,
  monitor: Monitor,
  clock: Clock,
  chrome: Globe,
  slack: Monitor,
};

function ScreenshotThumb({ shot, onClick }) {
  const badge = CATEGORY_BADGE[shot.category];
  const Icon = ICON_MAP[shot.iconType] || Monitor;
  const isIdle = shot.idle;
  const isDark = shot.bgStyle.includes('#1A1A1A') || shot.bgStyle.includes('#1E1E1E') || shot.bgStyle.includes('#252520') || shot.bgStyle.includes('#3A3520');

  return (
    <div
      onClick={onClick}
      className="rounded-tile overflow-hidden cursor-pointer relative transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
    >
      {/* Image area */}
      <div className="w-full h-28 flex items-center justify-center relative overflow-hidden" style={{ background: shot.bgStyle }}>
        {shot.blurred ? (
          <>
            <div className="w-full h-full flex items-center justify-center blur-[12px] brightness-[0.85] scale-110">
              <Monitor size={40} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35">
              <span className="text-[22px] mb-1">🔒</span>
              <span className="text-2xs font-semibold text-white/85 bg-black/45 py-0.5 px-2 rounded-lg">Blur Enabled</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5">
            <Icon size={32} stroke={isDark ? 'rgba(29,158,117,0.5)' : isIdle ? '#C8B870' : '#888'} strokeWidth={1.5} />
            <span className={cn('text-[8px] font-semibold', isDark ? 'text-primary-light/40' : isIdle ? 'text-[#C8B870]' : 'text-text-light')}>
              {shot.app.split(' · ')[0].toUpperCase()}
            </span>
          </div>
        )}

        {/* OS badge */}
        <div className="absolute top-1.5 left-1.5 w-[18px] h-[18px] rounded-[5px] bg-black/55 flex items-center justify-center text-2xs text-white">
          ⊞
        </div>

        {/* Idle badge */}
        {isIdle && (
          <div className="absolute top-1.5 right-1.5 bg-[rgba(202,138,4,0.9)] rounded-[6px] py-0.5 px-1.5 text-[8.5px] font-semibold text-white">
            ⚠ Idle
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white p-[8px_10px]">
        <div className="text-xs-plus font-semibold text-text-primary">{shot.time}</div>
        <div className="text-2xs-plus text-text-muted mt-px whitespace-nowrap overflow-hidden text-ellipsis">{shot.app}</div>
        <span className={cn('inline-flex py-0.5 px-[7px] rounded-[6px] text-[8.5px] font-semibold mt-1', badge.className)}>
          {badge.label}
        </span>
      </div>
    </div>
  );
}

export default function ScreenshotGrid() {
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();

  return (
    <GlossyCard className="p-[16px_20px] flex-1">
      {/* Top row */}
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h3 className="text-md font-semibold text-text-primary">148 Screenshots — Today, Apr 16</h3>
          <p className="text-xs-plus text-text-light">Most recent first · Click to open full view</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="py-[5px] px-3 rounded-[20px] bg-white/60 border border-black/[0.07] text-[11px] text-text-secondary cursor-pointer">
            Newest first ▾
          </button>
          <div className="flex gap-0.5 bg-black/5 rounded-lg p-[3px]">
            <button
              onClick={() => setViewMode('grid')}
              className={cn('w-[26px] h-[26px] rounded-[6px] flex items-center justify-center cursor-pointer', viewMode === 'grid' && 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]')}
            >
              <Grid3X3 size={13} stroke={viewMode === 'grid' ? '#1A1A1A' : '#AAA'} strokeWidth={2} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn('w-[26px] h-[26px] rounded-[6px] flex items-center justify-center cursor-pointer', viewMode === 'list' && 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]')}
            >
              <List size={13} stroke={viewMode === 'list' ? '#1A1A1A' : '#AAA'} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-3">
        {screenshots.map((shot) => (
          <ScreenshotThumb key={shot.id} shot={shot} onClick={() => navigate(`/screenshots/${shot.id}`)} />
        ))}
      </div>

      {/* Load more row */}
      <div className="flex items-center justify-center gap-3 pt-4">
        <span className="text-xs-plus text-text-light">Showing 8 of 148</span>
        <div className="flex gap-[5px] items-center">
          {[true, true, false, false, false].map((active, i) => (
            <div key={i} className={cn('w-2 h-2 rounded-full', active ? 'bg-primary' : 'bg-[#E0E0D8]')} />
          ))}
        </div>
        <button className="flex items-center gap-[7px] py-2 px-[22px] rounded-pill bg-white/70 border-[1.5px] border-white/90 text-sm font-medium text-text-secondary cursor-pointer">
          <ChevronDown size={13} stroke="#666" strokeWidth={2} />
          Load more screenshots
        </button>
      </div>
    </GlossyCard>
  );
}
