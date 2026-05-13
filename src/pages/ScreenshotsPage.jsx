import { useState } from 'react';
import { Search, Calendar, ArrowRight, ChevronLeft } from 'lucide-react';
import ScreenshotSidebar from '@/components/cards/ScreenshotSidebar';
import ScreenshotPersonHeader from '@/components/cards/ScreenshotPersonHeader';
import ScreenshotGrid from '@/components/cards/ScreenshotGrid';
import { filterChips, screenshotPageStats } from '@/mock/screenshots';
import { cn } from '@/utils/cn';

export default function ScreenshotsPage() {
  const [selectedEmployee, setSelectedEmployee] = useState('ravi');
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="relative z-[2] pb-6">
      {/* Page Header */}
      <div className="flex items-end justify-between px-8 pt-3.5 pb-3">
        <div>
          <div className="text-xs-plus text-text-light mb-1">Dashboard → Screenshots</div>
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">Screenshots</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] text-text-light">{screenshotPageStats.total} {screenshotPageStats.subtitle}</span>
          <span className="w-2 h-2 rounded-full bg-primary-light animate-pulse" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2.5 px-8 pb-3.5">
        {/* Date range pill */}
        <div className="glass-pill flex items-center gap-2 h-9 px-3.5 rounded-pill cursor-pointer">
          <Calendar size={11} stroke="#BBB" strokeWidth={2} />
          <div className="flex flex-col px-1">
            <span className="text-[8px] text-text-lighter leading-none">From</span>
            <span className="text-[11px] font-semibold text-text-primary">Apr 16</span>
          </div>
          <div className="w-px h-4 bg-black/[0.09]" />
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
            <ArrowRight size={9} stroke="#fff" strokeWidth={2.5} />
          </div>
          <div className="w-px h-4 bg-black/[0.09]" />
          <div className="flex flex-col px-1">
            <span className="text-[8px] text-text-lighter leading-none">To</span>
            <span className="text-[11px] font-semibold text-text-primary">Apr 16</span>
          </div>
        </div>

        {/* Filter chips */}
        {filterChips.map((chip) => (
          <button
            key={chip.id}
            onClick={() => setActiveFilter(chip.id)}
            className={cn(
              'h-9 px-3.5 rounded-pill flex items-center text-sm font-medium cursor-pointer whitespace-nowrap transition-all',
              activeFilter === chip.id && chip.id === 'all'
                ? 'dark-pill text-white'
                : activeFilter === chip.id
                  ? 'primary-pill text-white'
                  : 'bg-white/60 border-[1.5px] border-white/85 text-text-secondary shadow-[0_1px_0_rgba(255,255,255,0.9)_inset]'
            )}
          >
            {chip.label}
          </button>
        ))}

        {/* Search */}
        <div className="glass-pill flex items-center gap-[7px] h-9 px-3.5 rounded-pill ml-auto text-sm text-text-lighter">
          <Search size={12} stroke="#CCC" strokeWidth={2} />
          Search by app or time...
        </div>
      </div>

      {/* Main Body: Sidebar + Content */}
      <div className="grid grid-cols-[240px_1fr] gap-3.5 px-8">
        <ScreenshotSidebar selectedId={selectedEmployee} onSelect={setSelectedEmployee} />
        <div className="flex flex-col gap-3">
          <ScreenshotPersonHeader />
          <ScreenshotGrid />
        </div>
      </div>
    </div>
  );
}
