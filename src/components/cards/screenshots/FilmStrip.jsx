import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Code, Globe, Clock, Play, Monitor } from 'lucide-react';
import { cn } from '@/utils/cn';

const ICON_MAP = {
  code: Code,
  globe: Globe,
  clock: Clock,
  video: Play,
  monitor: Monitor,
};

function getProdBarBg(category) {
  if (category === 'productive') return '#1D9E75';
  if (category === 'unproductive') return '#1A1A1A';
  if (category === 'idle') return '#D97706';
  return '#C8C8C0';
}

export default function FilmStrip({ items = [], activeId, onSelect }) {
  const stripRef = useRef(null);

  function scrollStrip(direction) {
    if (stripRef.current) {
      const scrollAmount = 200;
      stripRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  }

  return (
    <div className="glossy-card p-[12px_14px] rounded-[16px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <h4 className="text-sm-plus font-semibold text-text-primary">
          <span className="text-primary-light">◆</span> Film Strip — Jump to any screenshot
        </h4>
        <div className="flex gap-[5px]">
          <button
            onClick={() => scrollStrip(-1)}
            className="w-6 h-6 rounded-[7px] border border-black/[0.08] flex items-center justify-center cursor-pointer bg-white/60 hover:bg-white/90 transition-colors"
          >
            <ChevronLeft size={10} stroke="#888" strokeWidth={2} />
          </button>
          <button
            onClick={() => scrollStrip(1)}
            className="w-6 h-6 rounded-[7px] border border-black/[0.08] flex items-center justify-center cursor-pointer bg-white/60 hover:bg-white/90 transition-colors"
          >
            <ChevronRight size={10} stroke="#888" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Strip */}
      <div ref={stripRef} className="flex gap-[7px] overflow-x-auto scrollbar-hide scroll-smooth">
        {items.map((item) => {
          const Icon = ICON_MAP[item.iconType] || Monitor;
          const bg = item.bgStyle || 'linear-gradient(135deg, #1A1A1A, #2D2D2D)';
          const isDark = bg.includes('#1A1A1A') || bg.includes('#1E1E1E') || bg.includes('#252520');
          const isActive = String(item.id) === String(activeId);

          return (
            <div
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                'shrink-0 rounded-[9px] overflow-hidden cursor-pointer relative transition-transform hover:scale-[1.04]',
                isActive && 'outline-[2.5px] outline outline-primary outline-offset-2'
              )}
            >
              {/* Image */}
              <div
                className="w-[92px] h-[58px] flex items-center justify-center relative overflow-hidden"
                style={{ background: bg }}
              >
                {item.thumbnailUrl || item.imageUrl ? (
                  <img
                    src={item.thumbnailUrl || item.imageUrl}
                    alt={item.time}
                    className={cn("w-full h-full object-cover", item.blurred && "blur-[3px] scale-105")}
                  />
                ) : (
                  <div className={cn("w-full h-full flex items-center justify-center", item.blurred && "blur-[3px]")}>
                    {Icon && (
                      <Icon size={20} stroke={isDark ? 'rgba(29,158,117,0.4)' : '#AAA'} strokeWidth={1.5} />
                    )}
                  </div>
                )}

                {/* Blur overlay */}
                {item.blurred && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-[2]">
                    <span className="text-[12px]">🔒</span>
                  </div>
                )}
              </div>

              {/* Productivity bar */}
              <div className="h-[3px] w-full" style={{ background: getProdBarBg(item.category) }} />

              {/* Time */}
              <div className={cn(
                'text-[8.5px] font-medium text-center py-[3px] px-1 bg-white',
                isActive ? 'font-bold text-text-primary' : 'text-text-secondary'
              )}>
                {item.time}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
