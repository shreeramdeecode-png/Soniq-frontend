import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlossyCard from '@/components/ui/GlossyCard';
import Badge from '@/components/ui/Badge';
import TabSwitcher from '@/components/ui/TabSwitcher';
import { appUsage } from '@/mock/dashboard';

const CATEGORY_BADGE = {
  productive: 'productive',
  unproductive: 'unproductive',
  neutral: 'neutral',
};

const CATEGORY_LABEL = {
  productive: 'Productive',
  unproductive: 'Unproductive',
  neutral: 'Neutral',
};

const TABS = [
  { id: 'apps', label: 'Apps' },
  { id: 'websites', label: 'Websites' },
];

function AppRow({ name, abbr, time, percentage, category, iconBg, iconColor, barColor }) {
  return (
    <div className="flex items-center gap-[9px] mb-3 last:mb-0">
      <div
        className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center text-xs font-bold shrink-0"
        style={{ background: iconBg, color: iconColor }}
      >
        {abbr}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-sm font-medium text-text-primary">{name}</span>
          <Badge variant={CATEGORY_BADGE[category]}>
            {CATEGORY_LABEL[category]}
          </Badge>
        </div>
        <div className="h-[3px] bg-surface-muted rounded-sm overflow-hidden">
          <div
            className="h-full rounded-sm"
            style={{ width: `${percentage}%`, background: barColor }}
          />
        </div>
      </div>
      <div className="text-xs-plus font-semibold text-text-primary whitespace-nowrap shrink-0">
        {time}
      </div>
    </div>
  );
}

export default function AppUsageCard() {
  const [activeTab, setActiveTab] = useState('apps');
  const navigate = useNavigate();

  return (
    <GlossyCard className="p-4">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-text-primary">
          App & Website Usage
        </h3>
        <TabSwitcher
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {(activeTab === 'apps' ? appUsage.apps : appUsage.websites).map((app) => (
        <AppRow key={app.name} {...app} />
      ))}

      <div
        onClick={() => navigate('/reports')}
        className="text-xs-plus text-text-light cursor-pointer text-right mt-2.5 pt-2 border-t border-black/5 hover:text-primary transition-colors"
      >
        View Full Report →
      </div>
    </GlossyCard>
  );
}
