import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlossyCard from '@/components/ui/GlossyCard';
import TabSwitcher from '@/components/ui/TabSwitcher';
import api from '@/utils/api';

const TABS = [
  { id: 'employee', label: 'Employee' },
  { id: 'app', label: 'App' },
];

function ProductiveRow({ rank, name, initials, hours, percentage, avatarBg, avatarColor, barBg, hoursColor }) {
  return (
    <div className="flex items-center gap-[9px] py-2 border-b border-black/[0.04] last:border-b-0 font-poppins">
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
        <div className="text-sm font-medium text-text-primary truncate">{name}</div>
        <div className="h-[3px] bg-surface-muted rounded-sm mt-1 overflow-hidden">
          <div
            className="h-full rounded-sm"
            style={{ width: `${percentage}%`, background: barBg }}
          />
        </div>
      </div>
      <div
        className="text-[11px] font-semibold whitespace-nowrap ml-2"
        style={{ color: hoursColor }}
      >
        {hours}
      </div>
    </div>
  );
}

export default function TopProductiveCard({ from: propFrom, to: propTo }) {
  const [activeTab, setActiveTab] = useState('employee');
  const [data, setData] = useState({ employee: [], app: [] });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTopData() {
      try {
        const to = propTo ? new Date(propTo) : new Date();
        const from = propFrom ? new Date(propFrom) : (() => { const d = new Date(); d.setDate(d.getDate() - 6); return d; })();
        const fromStr = from.toISOString().slice(0, 10);
        const toStr = to.toISOString().slice(0, 10);

        const [empRes, appRes] = await Promise.all([
          api.get(`/api/client/dashboard/top-productive?from=${fromStr}&to=${toStr}&limit=3`),
          api.get(`/api/client/dashboard/top-apps?from=${fromStr}&to=${toStr}&limit=3`),
        ]);

        const employees = empRes.data || [];
        const apps = appRes.data || [];

        // Map employees
        const maxEmpSec = Math.max(...employees.map(e => e.productiveSeconds), 1);
        const mappedEmployees = employees.map((emp, index) => {
          const rank = index + 1;
          const initials = emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
          
          const hoursVal = emp.productiveSeconds / 3600;
          const hoursStr = Math.floor(hoursVal);
          const minsStr = Math.round((hoursVal % 1) * 60);
          const timeLabel = hoursStr > 0 ? `${hoursStr}h ${minsStr}m` : `${minsStr}m`;

          return {
            rank,
            name: emp.name,
            initials,
            hours: timeLabel,
            percentage: Math.round((emp.productiveSeconds / maxEmpSec) * 100),
            avatarBg: rank === 1 ? 'linear-gradient(135deg, #1D9E75, #0F6E56)' : 'linear-gradient(135deg, #E8E0C8, #D8CEB0)',
            avatarColor: rank === 1 ? '#fff' : '#1A1A1A',
            barBg: rank === 1 ? 'linear-gradient(135deg, #162E24, #0F6E56)' : '#C8C8C0',
            hoursColor: rank === 1 ? '#1A1A1A' : '#888',
          };
        });

        // Map apps
        const maxAppSec = Math.max(...apps.map(a => a.totalDurationSeconds), 1);
        const mappedApps = apps.map((app, index) => {
          const rank = index + 1;
          const initials = app.appName.slice(0, 2).toUpperCase();
          
          const hoursVal = app.totalDurationSeconds / 3600;
          const hoursStr = Math.floor(hoursVal);
          const minsStr = Math.round((hoursVal % 1) * 60);
          const timeLabel = hoursStr > 0 ? `${hoursStr}h ${minsStr}m` : `${minsStr}m`;

          return {
            rank,
            name: app.appName,
            initials,
            hours: timeLabel,
            percentage: Math.round((app.totalDurationSeconds / maxAppSec) * 100),
            avatarBg: rank === 1 ? 'linear-gradient(135deg, #1D9E75, #0F6E56)' : 'linear-gradient(135deg, #E8E0C8, #D8CEB0)',
            avatarColor: rank === 1 ? '#fff' : '#1A1A1A',
            barBg: rank === 1 ? 'linear-gradient(135deg, #162E24, #0F6E56)' : '#C8C8C0',
            hoursColor: rank === 1 ? '#1A1A1A' : '#888',
          };
        });

        setData({
          employee: mappedEmployees,
          app: mappedApps,
        });
      } catch (err) {
        console.error('Error fetching top productive lists:', err);
      }
    }

    fetchTopData();
  }, [propFrom, propTo]);

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

      {(activeTab === 'employee' ? data.employee : data.app).map((emp) => (
        <ProductiveRow key={emp.rank} {...emp} />
      ))}

      <div
        onClick={() => navigate('/reports')}
        className="text-xs-plus text-text-light cursor-pointer text-right mt-2.5 pt-2 border-t border-black/5 hover:text-primary transition-colors font-poppins"
      >
        View All →
      </div>
    </GlossyCard>
  );
}
