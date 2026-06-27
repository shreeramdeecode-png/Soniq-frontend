import { useState, useEffect } from 'react';
import { Users, User, Monitor } from 'lucide-react';
import api from '@/utils/api';

function BigNumber({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-col items-center gap-px">
      <Icon size={18} strokeWidth={1.8} className="text-text-secondary opacity-45 mb-px" />
      <span className="text-7xl font-bold text-text-primary leading-none tracking-[-2px]">
        {value}
      </span>
      <span className="text-xs-plus text-text-muted">{label}</span>
    </div>
  );
}

export default function StatsRow({ from: propFrom, to: propTo }) {
  const [stats, setStats] = useState({
    activeNow: 0,
    checkedIn: 0,
    absent: 0,
    avgProductivity: '0%',
    totalEmployees: 0,
    totalTeams: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const params = new URLSearchParams();
        if (propFrom) params.set('from', propFrom instanceof Date ? propFrom.toISOString().slice(0, 10) : propFrom);
        if (propTo) params.set('to', propTo instanceof Date ? propTo.toISOString().slice(0, 10) : propTo);
        const qs = params.toString() ? `?${params}` : '';
        const [statsRes, teamsRes] = await Promise.all([
          api.get(`/api/client/dashboard/stats${qs}`),
          api.get('/api/client/teams'),
        ]);
        const data = statsRes.data;
        const totalTeams = Array.isArray(teamsRes.data) ? teamsRes.data.length : 0;

        setStats({
          activeNow: data.activeNow || 0,
          checkedIn: data.presentToday || 0,
          absent: (data.totalEmployees || 0) - (data.presentToday || 0),
          avgProductivity: `${Math.round(Number(data.avgProductivityScore) || 0)}%`,
          totalEmployees: data.totalEmployees || 0,
          totalTeams: totalTeams,
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [propFrom, propTo]);

  return (
    <div className="flex items-center justify-between px-8 pb-3">
      <div className="flex items-center gap-[9px] flex-1 flex-wrap">
        <span className="text-sm text-text-muted whitespace-nowrap">Working Mode</span>
        <div className="dark-pill rounded-pill py-2 px-4 text-sm font-medium text-white flex items-center gap-[5px] whitespace-nowrap">
          {stats.activeNow}{' '}
          <span className="opacity-50 font-normal text-xs-plus">Active Now</span>
        </div>

        <span className="text-sm text-text-muted whitespace-nowrap">Checked In</span>
        <div className="primary-pill rounded-pill py-2 px-4 text-sm font-semibold text-white whitespace-nowrap">
          {stats.checkedIn}
        </div>

        <span className="text-sm text-text-muted whitespace-nowrap">Absent</span>
        <div className="striped-bar h-[38px] rounded-pill flex items-center px-3.5 text-sm text-text-muted whitespace-nowrap">
          {stats.absent} employees
        </div>

        <span className="text-sm text-text-muted whitespace-nowrap">Avg Productivity</span>
        <div className="outline-pill h-[38px] rounded-pill px-4 flex items-center text-sm text-text-muted whitespace-nowrap">
          {stats.avgProductivity}
        </div>
      </div>

      <div className="flex gap-[22px] items-end shrink-0 ml-5">
        <BigNumber icon={Users} value={stats.totalEmployees} label="Employees" />
        <BigNumber icon={User} value={stats.checkedIn} label="Checked In" />
        <BigNumber icon={Monitor} value={stats.totalTeams} label="Teams" />
      </div>
    </div>
  );
}

