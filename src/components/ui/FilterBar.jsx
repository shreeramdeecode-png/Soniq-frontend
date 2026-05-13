import { useState } from 'react';
import { Search, List } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function FilterBar({ chips, placeholder = 'Search...', sortLabel = 'Sort: Productivity' }) {
  const [activeChip, setActiveChip] = useState(chips[0]?.id);
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="flex items-center gap-2.5 px-8 pb-4">
      <div className="glass-pill flex items-center gap-2 px-3.5 h-[38px] rounded-pill flex-1 max-w-[260px]">
        <Search size={13} stroke="#BBB" strokeWidth={2} />
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="border-none bg-transparent outline-none text-sm-plus font-poppins text-text-primary w-full placeholder:text-text-lighter"
        />
      </div>
      {chips.map((chip) => (
        <button
          key={chip.id}
          onClick={() => setActiveChip(chip.id)}
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
      <button className="glass-pill h-[38px] px-4 rounded-pill flex items-center gap-1.5 text-sm-plus font-medium text-text-secondary cursor-pointer whitespace-nowrap ml-auto">
        <List size={12} stroke="#666" strokeWidth={2} />
        {sortLabel}
      </button>
    </div>
  );
}
