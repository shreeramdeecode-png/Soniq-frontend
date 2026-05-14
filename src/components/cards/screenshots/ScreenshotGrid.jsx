import { useState, useMemo, useEffect } from 'react';
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

export default function ScreenshotGrid({ categoryFilter = 'all', searchQuery = '', employeeId }) {
  const [viewMode, setViewMode] = useState('grid');
  const [sortOrder, setSortOrder] = useState('newest');
  const [sortOpen, setSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const navigate = useNavigate();

  useEffect(() => {
    setVisibleCount(8);
  }, [employeeId]);

  const filteredScreenshots = useMemo(() => {
    let result = [...screenshots];

    if (employeeId) {
      result = result.filter((s) => s.employeeId === employeeId);
    }

    if (categoryFilter !== 'all') {
      result = result.filter((s) => s.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) =>
        s.app.toLowerCase().includes(q) || s.time.toLowerCase().includes(q)
      );
    }

    if (sortOrder === 'oldest') result.reverse();

    return result;
  }, [categoryFilter, searchQuery, sortOrder, employeeId]);

  return (
    <GlossyCard className="p-[16px_20px] flex-1">
      {/* Top row */}
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h3 className="text-md font-semibold text-text-primary">{filteredScreenshots.length} Screenshots — Today, Apr 16</h3>
          <p className="text-xs-plus text-text-light">
            {categoryFilter !== 'all' ? `Filtered by: ${categoryFilter}` : 'Most recent first'} · Click to open full view
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="py-[5px] px-3 rounded-[20px] bg-white/60 border border-black/[0.07] text-[11px] text-text-secondary cursor-pointer"
            >
              {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'} ▾
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <div className="absolute top-full right-0 mt-1 bg-white/95 backdrop-blur-xl rounded-[10px] border border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.1)] overflow-hidden z-20 min-w-[120px]">
                  <button onClick={() => { setSortOrder('newest'); setSortOpen(false); }} className={cn('w-full text-left px-3 py-2 text-xs font-medium cursor-pointer', sortOrder === 'newest' ? 'bg-primary/10 text-[#0F6E56]' : 'text-text-secondary hover:bg-black/5')}>
                    Newest first
                  </button>
                  <button onClick={() => { setSortOrder('oldest'); setSortOpen(false); }} className={cn('w-full text-left px-3 py-2 text-xs font-medium cursor-pointer', sortOrder === 'oldest' ? 'bg-primary/10 text-[#0F6E56]' : 'text-text-secondary hover:bg-black/5')}>
                    Oldest first
                  </button>
                </div>
              </>
            )}
          </div>
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

      {/* Grid / List */}
      {filteredScreenshots.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-3">
            {filteredScreenshots.slice(0, visibleCount).map((shot) => (
              <ScreenshotThumb key={shot.id} shot={shot} onClick={() => navigate(`/screenshots/${shot.id}`)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {filteredScreenshots.slice(0, visibleCount).map((shot) => {
              const badge = CATEGORY_BADGE[shot.category];
              const Icon = ICON_MAP[shot.iconType] || Monitor;
              return (
                <div
                  key={shot.id}
                  onClick={() => navigate(`/screenshots/${shot.id}`)}
                  className="flex items-center gap-3 p-2.5 rounded-tile bg-white/60 border border-black/[0.05] cursor-pointer hover:bg-white/80 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: shot.bgStyle }}>
                    <Icon size={18} stroke="#888" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs-plus font-semibold text-text-primary w-16 shrink-0">{shot.time}</span>
                  <span className="text-xs-plus text-text-muted flex-1 truncate">{shot.app}</span>
                  <span className={cn('text-[8.5px] font-semibold py-0.5 px-[7px] rounded-[6px] shrink-0', badge.className)}>
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm font-semibold text-text-muted">No screenshots match your criteria</p>
          <p className="text-xs text-text-light mt-1">Try changing filters or search terms</p>
        </div>
      )}

      {/* Load more row */}
      {filteredScreenshots.length > 0 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <span className="text-xs-plus text-text-light">Showing {Math.min(visibleCount, filteredScreenshots.length)} of {filteredScreenshots.length}</span>
          <div className="flex gap-[5px] items-center">
            {[true, true, false, false, false].map((active, i) => (
              <div key={i} className={cn('w-2 h-2 rounded-full', active ? 'bg-primary' : 'bg-[#E0E0D8]')} />
            ))}
          </div>
          {visibleCount < filteredScreenshots.length && (
            <button
              onClick={() => setVisibleCount(prev => Math.min(prev + 8, filteredScreenshots.length))}
              className="flex items-center gap-[7px] py-2 px-[22px] rounded-pill bg-white/70 border-[1.5px] border-white/90 text-sm font-medium text-text-secondary cursor-pointer hover:bg-white/90 transition-colors"
            >
              <ChevronDown size={13} stroke="#666" strokeWidth={2} />
              Load more screenshots
            </button>
          )}
        </div>
      )}
    </GlossyCard>
  );
}
