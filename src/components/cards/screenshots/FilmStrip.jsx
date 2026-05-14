import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Code, Globe, Clock, Play } from 'lucide-react';
import { filmStripItems } from '@/mock/screenshotDetail';
import { cn } from '@/utils/cn';

const ICON_MAP = {
  code: Code,
  globe: Globe,
  clock: Clock,
  video: Play,
};

export default function FilmStrip() {
  const [activeId, setActiveId] = useState(2);
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
        {filmStripItems.map((item) => {
          const Icon = ICON_MAP[item.iconType] || null;
          const isDark = item.bg.includes('#1A1A1A') || item.bg.includes('#1E1E1E');
          const isActive = item.id === activeId;

          return (
            <div
              key={item.id}
              onClick={() => setActiveId(item.id)}
              className={cn(
                'shrink-0 rounded-[9px] overflow-hidden cursor-pointer relative transition-transform hover:scale-[1.04]',
                isActive && 'outline-[2.5px] outline outline-primary outline-offset-2'
              )}
            >
              {/* Image */}
              <div
                className="w-[92px] h-[58px] flex items-center justify-center"
                style={{ background: item.bg, ...(item.blurred ? { filter: 'blur(5px)', transform: 'scale(1.08)' } : {}) }}
              >
                {!item.blurred && Icon && (
                  <Icon size={24} stroke={isDark ? 'rgba(29,158,117,0.4)' : '#AAA'} strokeWidth={1.5} />
                )}
              </div>

              {/* Blur overlay */}
              {item.blurred && (
                <div className="absolute top-0 left-0 right-0 h-[58px] flex items-center justify-center bg-[rgba(20,20,20,0.4)]">
                  <span className="text-[16px]">🔒</span>
                </div>
              )}

              {/* Productivity bar */}
              <div className="h-[3px] w-full" style={{ background: item.prodBarBg }} />

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
