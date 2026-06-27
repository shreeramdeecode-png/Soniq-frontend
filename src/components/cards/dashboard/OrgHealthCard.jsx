import { useState, useEffect } from 'react';
import GlossyCard from '@/components/ui/GlossyCard';
import api from '@/utils/api';
import { cn } from '@/utils/cn';

function HealthTile({ value, label, change, positive, variant }) {
  return (
    <div
      className={cn(
        'rounded-tile p-[11px_12px]',
        variant === 'primary'
          ? 'bg-gradient-to-br from-primary/10 to-primary/[0.04] border border-primary/[0.18]'
          : 'bg-gradient-to-br from-ink/[0.06] to-ink/[0.02] border border-ink/10'
      )}
    >
      <div className="text-2xl font-bold text-text-primary tracking-tight leading-none">
        {value}
      </div>
      <div className="text-2xs-plus text-text-light mt-[3px]">{label}</div>
      <div
        className={cn(
          'text-2xs-plus font-semibold mt-0.5',
          positive ? 'text-primary-light' : 'text-text-muted'
        )}
      >
        {change}
      </div>
    </div>
  );
}

export default function OrgHealthCard({ from: propFrom, to: propTo }) {
  const [health, setHealth] = useState({
    status: 'Good',
    tiles: [
      { value: '0%', label: 'Productivity rate', change: '→ stable', positive: false, variant: 'primary' },
      { value: '0%', label: 'Attendance rate', change: '→ stable', positive: false, variant: 'dark' },
      { value: '0h 0m', label: 'Avg work time', change: 'target 8h', positive: false, variant: 'dark' },
      { value: '0%', label: 'App compliance', change: 'stable', positive: true, variant: 'primary' },
    ],
  });

  useEffect(() => {
    async function fetchHealth() {
      try {
        const params = new URLSearchParams();
        if (propFrom) params.set('from', propFrom instanceof Date ? propFrom.toISOString().slice(0, 10) : propFrom);
        if (propTo) params.set('to', propTo instanceof Date ? propTo.toISOString().slice(0, 10) : propTo);
        const qs = params.toString() ? `?${params}` : '';
        const statsRes = await api.get(`/api/client/dashboard/stats${qs}`);
        const stats = statsRes.data;

        const prodRate = Math.round(stats.avgProductivityScore || 0);
        const attendanceRate = stats.totalEmployees > 0
          ? Math.round((stats.presentToday / stats.totalEmployees) * 100)
          : 0;

        const avgWorkSeconds = stats.avgWorkSecondsPerDay ?? 0;
        const workHours = Math.floor(avgWorkSeconds / 3600);
        const workMins = Math.floor((avgWorkSeconds % 3600) / 60);
        const avgWorkTimeStr = `${workHours}h ${workMins}m`;

        const activeNow = stats.activeNow ?? 0;

        let status = 'Good';
        if (prodRate < 60) status = 'Needs Attention';
        else if (prodRate < 75) status = 'Average';

        setHealth({
          status,
          tiles: [
            {
              value: `${prodRate}%`,
              label: 'Productivity rate',
              change: prodRate >= 80 ? '↑ above target' : '↓ below 80% target',
              positive: prodRate >= 80,
              variant: 'primary',
            },
            {
              value: `${attendanceRate}%`,
              label: 'Attendance rate',
              change: `${stats.presentToday ?? 0} of ${stats.totalEmployees ?? 0} present`,
              positive: attendanceRate >= 85,
              variant: 'dark',
            },
            {
              value: avgWorkTimeStr,
              label: 'Avg work time / day',
              change: 'target 8h / day',
              positive: false,
              variant: 'dark',
            },
            {
              value: String(activeNow),
              label: 'Active now',
              change: `of ${stats.presentToday ?? 0} checked in`,
              positive: activeNow > 0,
              variant: 'primary',
            },
          ],
        });
      } catch (err) {
        console.error('Error fetching org health stats:', err);
      }
    }

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, [propFrom, propTo]);

  return (
    <GlossyCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-text-primary">Org Health</h3>
        <span className={`rounded-[20px] py-[3px] px-[11px] text-xs-plus font-bold text-white ${
          health.status === 'Good' ? 'primary-badge' :
          health.status === 'Average' ? 'bg-ink/80' : 'bg-ink'
        }`}>
          {health.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {health.tiles.map((tile) => (
          <HealthTile key={tile.label} {...tile} />
        ))}
      </div>
    </GlossyCard>
  );
}

