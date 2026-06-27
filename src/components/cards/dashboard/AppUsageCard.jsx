import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlossyCard from '@/components/ui/GlossyCard';
import Badge from '@/components/ui/Badge';
import TabSwitcher from '@/components/ui/TabSwitcher';
import AppIcon from '@/components/ui/AppIcon';
import api from '@/utils/api';

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

function AppRow({ name, abbr, time, percentage, category, iconBg, iconColor, barColor, iconUrl }) {
  return (
    <div className="flex items-center gap-[9px] py-2 border-b border-black/[0.04] last:border-b-0 font-poppins">
      <AppIcon iconUrl={iconUrl} abbr={abbr} iconBg={iconBg} iconColor={iconColor} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-sm font-medium text-text-primary truncate mr-2">{name}</span>
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
      <div className="text-xs-plus font-semibold text-text-primary whitespace-nowrap shrink-0 ml-2">
        {time}
      </div>
    </div>
  );
}

export default function AppUsageCard({ from: propFrom, to: propTo }) {
  const [activeTab, setActiveTab] = useState('apps');
  const [data, setData] = useState({ apps: [], websites: [] });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAppUsage() {
      try {
        const to = propTo ? new Date(propTo) : new Date();
        const from = propFrom ? new Date(propFrom) : (() => { const d = new Date(); d.setDate(d.getDate() - 30); return d; })();

        const fromStr = from.toISOString().slice(0, 10);
        const toStr = to.toISOString().slice(0, 10);

        const res = await api.get(`/api/client/dashboard/top-apps?from=${fromStr}&to=${toStr}&limit=20`);
        const items = res.data || [];

        const rawApps = [];
        const rawWebs = [];

        items.forEach((item) => {
          const category = (item.productivityStatus || 'Neutral').toLowerCase();

          let iconBg = 'linear-gradient(135deg, #E8E0C8, #D8CEB0)';
          let iconColor = '#1A1A1A';
          let barColor = '#C8C8C0';

          if (category === 'productive') {
            iconBg = 'linear-gradient(135deg, #162E24, #0F6E56)';
            iconColor = '#1D9E75';
            barColor = '#0F6E56';
          } else if (category === 'unproductive') {
            iconBg = 'linear-gradient(135deg, #D8D8D0, #C0C0B8)';
            iconColor = '#1A1A1A';
            barColor = '#E53E3E';
          }

          const hours = Math.floor(item.totalDurationSeconds / 3600);
          const mins = Math.round((item.totalDurationSeconds % 3600) / 60);
          const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

          const name = item.appName || 'Unknown';
          const abbr = name.slice(0, 2).toUpperCase();

          const mappedItem = {
            name,
            abbr,
            time: timeStr,
            duration: item.totalDurationSeconds,
            category,
            iconBg,
            iconColor,
            barColor,
            iconUrl: item.appIconUrl || null,
          };

          // Trackpilots flags browser visits as type "Website" with a domain
          if (item.appType === 'Website' || item.appDomain) {
            rawWebs.push(mappedItem);
          } else {
            rawApps.push(mappedItem);
          }
        });

        // Set percentages based on max duration in each category
        const processPercentages = (list) => {
          const maxDur = Math.max(...list.map(d => d.duration), 1);
          return list.map(d => ({
            ...d,
            percentage: Math.round((d.duration / maxDur) * 100),
          })).slice(0, 4); // Limit to top 4 for widget UI
        };

        setData({
          apps: processPercentages(rawApps),
          websites: processPercentages(rawWebs),
        });
      } catch (err) {
        console.error('Error fetching app usage stats:', err);
      }
    }

    fetchAppUsage();
  }, [propFrom, propTo]);

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

      {(activeTab === 'apps' ? data.apps : data.websites).map((app) => (
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

