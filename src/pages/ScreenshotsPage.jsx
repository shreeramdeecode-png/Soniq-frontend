import { useState } from 'react';
import { Search } from 'lucide-react';
import ScreenshotSidebar from '@/components/cards/screenshots/ScreenshotSidebar';
import ScreenshotPersonHeader from '@/components/cards/screenshots/ScreenshotPersonHeader';
import ScreenshotGrid from '@/components/cards/screenshots/ScreenshotGrid';
import DateRangePicker from '@/components/ui/DateRangePicker';
import { filterChips, screenshotPageStats } from '@/mock/screenshots';
import { cn } from '@/utils/cn';

export default function ScreenshotsPage() {
  const [selectedEmployee, setSelectedEmployee] = useState('ravi');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
        {/* Date range picker */}
        <DateRangePicker
          from={new Date(2026, 3, 16)}
          to={new Date(2026, 3, 16)}
          variant="glass"
        />

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
        <div className="glass-pill flex items-center gap-[7px] h-9 px-3.5 rounded-pill ml-auto">
          <Search size={12} stroke="#CCC" strokeWidth={2} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by app or time..."
            className="border-none bg-transparent outline-none text-sm font-poppins text-text-primary w-[160px] placeholder:text-text-lighter"
          />
        </div>
      </div>

      {/* Main Body: Sidebar + Content */}
      <div className="grid grid-cols-[240px_1fr] gap-3.5 px-8">
        <ScreenshotSidebar selectedId={selectedEmployee} onSelect={setSelectedEmployee} />
        <div className="flex flex-col gap-3">
          <ScreenshotPersonHeader employeeId={selectedEmployee} />
          <ScreenshotGrid categoryFilter={activeFilter} searchQuery={searchQuery} employeeId={selectedEmployee} />
        </div>
      </div>
    </div>
  );
}
