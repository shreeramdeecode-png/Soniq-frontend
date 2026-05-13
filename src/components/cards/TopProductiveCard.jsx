import { useState } from 'react';
import GlossyCard from '@/components/ui/GlossyCard';
import TabSwitcher from '@/components/ui/TabSwitcher';
import { topProductive } from '@/mock/dashboard';

const TABS = [
  { id: 'employee', label: 'Employee' },
  { id: 'app', label: 'App' },
];

function ProductiveRow({ rank, name, initials, hours, percentage, avatarBg, avatarColor, barBg, hoursColor }) {
  return (
    <div className="flex items-center gap-[9px] mb-3.5 last:mb-0">
      <div className="text-xs-plus font-semibold text-text-light w-[13px]">{rank}</div>
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-2xs font-bold shrink-0"
        style={{
          background: avatarBg,
          color: avatarColor,
          boxShadow: rank === 1 ? '0 2px 6px rgba(0,0,0,0.2)' : 'none',
        }}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-text-primary">{name}</div>
        <div className="h-[3px] bg-surface-muted rounded-sm mt-1 overflow-hidden">
          <div
            className="h-full rounded-sm"
            style={{ width: `${percentage}%`, background: barBg }}
          />
        </div>
      </div>
      <div
        className="text-[11px] font-semibold whitespace-nowrap"
        style={{ color: hoursColor }}
      >
        {hours}
      </div>
    </div>
  );
}

export default function TopProductiveCard() {
  const [activeTab, setActiveTab] = useState('employee');

  return (
    <GlossyCard className="p-4">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-text-primary">Top Productive</h3>
        <TabSwitcher
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {topProductive.map((emp) => (
        <ProductiveRow key={emp.rank} {...emp} />
      ))}

      <div className="text-xs-plus text-text-light cursor-pointer text-right mt-2.5 pt-2 border-t border-black/5">
        View All →
      </div>
    </GlossyCard>
  );
}
