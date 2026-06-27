import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Zap, Clock, User, Heart } from 'lucide-react';
import DarkCard from '@/components/ui/DarkCard';
import api from '@/utils/api';
import { isLiveActive } from '@/utils/liveStatus';

const ICON_MAP = {
  monitor: Monitor,
  zap: Zap,
  clock: Clock,
  user: User,
  heart: Heart,
};

function ActivityItem({ name, status, icon }) {
  const Icon = ICON_MAP[icon] || Monitor;

  return (
    <div className="flex items-center gap-[9px] py-[7px] border-b border-white/5 last:border-b-0 last:pb-0 font-poppins">
      <div className="w-[26px] h-[26px] rounded-[7px] bg-white/[0.07] flex items-center justify-center shrink-0">
        <Icon size={12} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate text-white/85">{name}</div>
        <div className="text-2xs-plus text-white/30 mt-px truncate">{status}</div>
      </div>
    </div>
  );
}

export default function LiveActivityCard() {
  const [data, setData] = useState({
    active: 0,
    total: 0,
    items: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLiveActivity() {
      try {
        const [statsRes, activityRes] = await Promise.all([
          api.get('/api/client/dashboard/stats'),
          api.get('/api/client/dashboard/activity-table'),
        ]);

        const stats = statsRes.data;
        const activities = activityRes.data || [];

        // Sort: currently working first, then present, then others
        const sorted = [...activities].sort((a, b) => {
          if (isLiveActive(a) && !isLiveActive(b)) return -1;
          if (!isLiveActive(a) && isLiveActive(b)) return 1;
          if (a.isPresent && !b.isPresent) return -1;
          if (!a.isPresent && b.isPresent) return 1;
          return 0;
        });

        const mappedItems = sorted.slice(0, 5).map((act, index) => {
          let statusText = 'Offline';
          let icon = 'user';

          if (isLiveActive(act)) {
            const timeStr = act.lastSeenAt
              ? new Date(act.lastSeenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Active';
            statusText = `Work Mode · ${timeStr}`;
            icon = 'monitor';
          } else if (act.isPresent) {
            const timeStr = act.lastCheckout 
              ? `Left at ${new Date(act.lastCheckout).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
              : 'Idle';
            statusText = `Idle · ${timeStr}`;
            icon = 'clock';
          }

          return {
            id: act.employeeId || index,
            name: act.name,
            status: statusText,
            icon,
          };
        });

        setData({
          active: stats.activeNow || 0,
          total: stats.totalEmployees || 0,
          items: mappedItems,
        });
      } catch (err) {
        console.error('Error fetching live activity stats:', err);
      }
    }

    fetchLiveActivity();
    const interval = setInterval(fetchLiveActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DarkCard variant="task" className="p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-semibold text-white">Live Activity</span>
        <span className="text-3xl font-bold text-white tracking-tight font-poppins">
          {data.active}/{data.total}
        </span>
      </div>
      {data.items.length > 0 ? (
        data.items.map((item) => (
          <ActivityItem key={item.id} {...item} />
        ))
      ) : (
        <div className="text-xs text-white/30 py-8 text-center font-poppins">
          No live activity reported.
        </div>
      )}
      <div className="mt-2.5 pt-2 border-t border-white/5 text-right font-poppins">
        <span
          onClick={() => navigate('/attendance')}
          className="text-xs text-white/40 cursor-pointer hover:text-white/70 transition-colors"
        >
          View All →
        </span>
      </div>
    </DarkCard>
  );
}

