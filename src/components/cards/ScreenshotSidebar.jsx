import { useState } from 'react';
import { Search } from 'lucide-react';
import { sidebarTeams } from '@/mock/screenshots';
import { cn } from '@/utils/cn';

export default function ScreenshotSidebar({ selectedId, onSelect }) {
  const [search, setSearch] = useState('');

  return (
    <div className="glossy-card max-h-[620px] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-[14px_16px_10px] border-b border-black/5">
        <h3 className="text-sm-plus font-semibold text-text-primary mb-2">Select Employee</h3>
        <div className="flex items-center gap-1.5 px-2.5 h-[30px] bg-[#F8F8F5] rounded-[20px] border border-black/[0.06]">
          <Search size={11} stroke="#CCC" strokeWidth={2} />
          <input
            type="text"
            placeholder="Find employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none bg-transparent outline-none text-[11px] font-[Poppins] text-text-primary w-full placeholder:text-[#CCC]"
          />
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        {sidebarTeams.map((team) => (
          <div key={team.name}>
            <div className="flex items-center justify-between px-4 pt-2 pb-1">
              <span className="text-2xs-plus font-bold text-text-lighter uppercase tracking-wider">
                {team.name}
              </span>
              <span className="text-2xs font-semibold bg-surface-muted text-text-muted py-px px-[7px] rounded-[10px]">
                {team.count}
              </span>
            </div>
            {team.employees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => onSelect(emp.id)}
                className={cn(
                  'flex items-center gap-[9px] py-2 px-4 cursor-pointer transition-colors relative',
                  emp.id === selectedId
                    ? 'bg-primary/[0.08] border-r-[3px] border-r-primary'
                    : 'hover:bg-primary/[0.04]'
                )}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-2xs-plus font-bold shrink-0"
                  style={{ background: emp.avatarBg, color: emp.avatarColor }}
                >
                  {emp.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary whitespace-nowrap overflow-hidden text-ellipsis">
                    {emp.name}
                  </div>
                  <div className="text-2xs-plus text-text-light">{emp.shots}</div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: emp.dotColor }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
