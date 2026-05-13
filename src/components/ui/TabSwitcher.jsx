import { cn } from '@/utils/cn';

export default function TabSwitcher({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex gap-[5px]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange?.(tab.id)}
          className={cn(
            'py-[3px] px-2.5 rounded-[20px] text-xs-plus transition-all duration-200 cursor-pointer',
            activeTab === tab.id
              ? 'dark-pill text-white'
              : 'bg-black/5 text-text-muted hover:bg-black/10'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
