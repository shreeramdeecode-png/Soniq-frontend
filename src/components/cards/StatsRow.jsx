import { Users, User, Monitor } from 'lucide-react';
import { dashboardStats } from '@/mock/dashboard';

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

export default function StatsRow() {
  const {
    activeNow,
    checkedIn,
    absent,
    avgProductivity,
    totalEmployees,
    totalTeams,
  } = dashboardStats;

  return (
    <div className="flex items-center justify-between px-8 pb-3">
      <div className="flex items-center gap-[9px] flex-1 flex-wrap">
        <span className="text-sm text-text-muted whitespace-nowrap">Working Mode</span>
        <div className="dark-pill rounded-pill py-2 px-4 text-sm font-medium text-white flex items-center gap-[5px] whitespace-nowrap">
          {activeNow}{' '}
          <span className="opacity-50 font-normal text-xs-plus">Active Now</span>
        </div>

        <span className="text-sm text-text-muted whitespace-nowrap">Checked In</span>
        <div className="primary-pill rounded-pill py-2 px-4 text-sm font-semibold text-white whitespace-nowrap">
          {checkedIn}
        </div>

        <span className="text-sm text-text-muted whitespace-nowrap">Absent</span>
        <div className="striped-bar h-[38px] rounded-pill flex items-center px-3.5 text-sm text-text-muted whitespace-nowrap">
          {absent} employees
        </div>

        <span className="text-sm text-text-muted whitespace-nowrap">Avg Productivity</span>
        <div className="outline-pill h-[38px] rounded-pill px-4 flex items-center text-sm text-text-muted whitespace-nowrap">
          {avgProductivity}
        </div>
      </div>

      <div className="flex gap-[22px] items-end shrink-0 ml-5">
        <BigNumber icon={Users} value={totalEmployees} label="Employees" />
        <BigNumber icon={User} value={checkedIn} label="Checked In" />
        <BigNumber icon={Monitor} value={totalTeams} label="Teams" />
      </div>
    </div>
  );
}
