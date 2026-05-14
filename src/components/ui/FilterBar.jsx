import { useState } from 'react';
import { Search, List, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

const SORT_OPTIONS = [
  { id: 'productivity', label: 'Productivity' },
  { id: 'name', label: 'Name' },
  { id: 'members', label: 'Members' },
  { id: 'worktime', label: 'Work Time' },
];

export default function FilterBar({
  chips,
  placeholder = 'Search...',
  sortLabel = 'Sort: Productivity',
  onSearchChange,
  onFilterChange,
  onSortChange,
  activeFilter: controlledFilter,
  searchValue: controlledSearch,
}) {
  const [internalChip, setInternalChip] = useState(chips[0]?.id);
  const [internalSearch, setInternalSearch] = useState('');
  const [sortOpen, setSortOpen] = useState(false);
  const [activeSort, setActiveSort] = useState('productivity');

  const activeChip = controlledFilter ?? internalChip;
  const searchValue = controlledSearch ?? internalSearch;

  function handleChipClick(id) {
    setInternalChip(id);
    onFilterChange?.(id);
  }

  function handleSearchChange(e) {
    setInternalSearch(e.target.value);
    onSearchChange?.(e.target.value);
  }

  function handleSortSelect(id) {
    setActiveSort(id);
    setSortOpen(false);
    onSortChange?.(id);
  }

  return (
    <div className="flex items-center gap-2.5 px-8 pb-4">
      <div className="glass-pill flex items-center gap-2 px-3.5 h-[38px] rounded-pill flex-1 max-w-[260px]">
        <Search size={13} stroke="#BBB" strokeWidth={2} />
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleSearchChange}
          className="border-none bg-transparent outline-none text-sm-plus font-poppins text-text-primary w-full placeholder:text-text-lighter"
        />
      </div>
      {chips.map((chip) => (
        <button
          key={chip.id}
          onClick={() => handleChipClick(chip.id)}
          className={cn(
            'h-[38px] px-4 rounded-pill flex items-center text-sm-plus font-medium cursor-pointer whitespace-nowrap transition-all',
            activeChip === chip.id
              ? 'dark-pill text-white'
              : 'glass-pill text-text-secondary'
          )}
        >
          {chip.label}
        </button>
      ))}
      <div className="relative ml-auto">
        <button
          onClick={() => setSortOpen(!sortOpen)}
          className="glass-pill h-[38px] px-4 rounded-pill flex items-center gap-1.5 text-sm-plus font-medium text-text-secondary cursor-pointer whitespace-nowrap"
        >
          <List size={12} stroke="#666" strokeWidth={2} />
          Sort: {SORT_OPTIONS.find((o) => o.id === activeSort)?.label}
          <ChevronDown size={10} stroke="#666" strokeWidth={2} className={cn('transition-transform', sortOpen && 'rotate-180')} />
        </button>
        {sortOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
            <div className="absolute top-full right-0 mt-1.5 bg-white/95 backdrop-blur-xl rounded-[14px] border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden z-20 min-w-[160px]">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSortSelect(opt.id)}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer',
                    activeSort === opt.id ? 'bg-primary/10 text-[#0F6E56]' : 'text-text-secondary hover:bg-black/5'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
