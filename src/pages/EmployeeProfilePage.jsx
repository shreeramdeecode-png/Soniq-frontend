import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ProfileCard from '@/components/cards/employee/ProfileCard';
import ActivityTimeline from '@/components/cards/employee/ActivityTimeline';
import AppUsageTable from '@/components/cards/employee/AppUsageTable';
import AttendanceSummary from '@/components/cards/employee/AttendanceSummary';
import DailyRecordsTable from '@/components/cards/employee/DailyRecordsTable';
import { employeeTabs, miniStats } from '@/mock/employeeProfile';
import { cn } from '@/utils/cn';

export default function EmployeeProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { teamId } = useParams();

  return (
    <div className="relative z-[2] pb-7">
      {/* Breadcrumb */}
      <div className="px-8 pt-3.5 pb-3">
        <button
          onClick={() => navigate(`/teams/${teamId}`)}
          className="flex items-center gap-1.5 text-sm text-text-light cursor-pointer"
        >
          <ChevronLeft size={13} stroke="#AAA" strokeWidth={2} />
          Dashboard → Teams → Engineering → Ravi Shankar
        </button>
      </div>

      {/* Main layout: left profile + right content */}
      <div className="grid grid-cols-[280px_1fr] gap-3.5 px-8">
        {/* Left: Dark profile card */}
        <ProfileCard />

        {/* Right: Tabs + Content */}
        <div className="flex flex-col gap-3.5">
          {/* Tab bar */}
          <div className="flex items-center gap-0.5 bg-black/5 rounded-[12px] p-[3px] w-fit">
            {employeeTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'py-[7px] px-4 rounded-[9px] text-sm-plus font-medium cursor-pointer transition-all',
                  activeTab === tab.id
                    ? 'bg-white text-text-primary shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                    : 'text-text-muted'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mini stat cards */}
          <div className="grid grid-cols-4 gap-2.5">
            {miniStats.map((stat) => (
              <div
                key={stat.id}
                className="rounded-tile p-[12px_14px]"
                style={{ background: stat.bg, border: stat.border }}
              >
                <div className="text-2xl font-bold text-text-primary tracking-tight leading-none">
                  {stat.value}
                </div>
                <div className="text-2xs-plus text-text-light mt-[3px]">{stat.label}</div>
              </div>
            ))}
          </div>

          {activeTab === 'overview' && (
            <>
              <ActivityTimeline />
              <div className="grid grid-cols-2 gap-3.5">
                <AppUsageTable />
                <AttendanceSummary />
              </div>
              <DailyRecordsTable />
            </>
          )}

          {activeTab === 'screenshots' && (
            <div className="rounded-tile bg-white/60 backdrop-blur-sm border border-black/[0.04] p-8 text-center text-text-muted">
              Employee screenshots will appear here
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="rounded-tile bg-white/60 backdrop-blur-sm border border-black/[0.04] p-8 text-center text-text-muted">
              Employee reports and analytics will appear here
            </div>
          )}

          {activeTab === 'attendance' && (
            <>
              <AttendanceSummary />
              <DailyRecordsTable />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
