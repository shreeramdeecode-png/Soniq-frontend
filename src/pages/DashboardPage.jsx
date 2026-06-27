import { useState, useEffect } from 'react';
import { useAuth } from '@/context';
import StatsRow from '@/components/cards/dashboard/StatsRow';
import OrgProductivityScore from '@/components/cards/dashboard/OrgProductivityScore';
import OrgHealthCard from '@/components/cards/dashboard/OrgHealthCard';
import WorkSummaryCard from '@/components/cards/dashboard/WorkSummaryCard';
import AppUsageCard from '@/components/cards/dashboard/AppUsageCard';
import ScreenshotFeedCard from '@/components/cards/dashboard/ScreenshotFeedCard';
import TopProductiveCard from '@/components/cards/dashboard/TopProductiveCard';
import AttendanceCard from '@/components/cards/dashboard/AttendanceCard';
import LiveActivityCard from '@/components/cards/dashboard/LiveActivityCard';
import DateRangePicker from '@/components/ui/DateRangePicker';

function getWeekStart() {
  const d = new Date();
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState({ from: getWeekStart(), to: new Date() });
  const { profile: authProfile } = useAuth();
  const firstName = authProfile?.name ? authProfile.name.split(' ')[0] : 'there';

  return (
    <>
      <div className="flex items-center justify-between px-8 pt-4 pb-3 relative z-content font-poppins">
        <h1 className="text-7xl font-bold text-text-primary tracking-[-1.5px] leading-[1.05]">
          Welcome in, {firstName}
        </h1>
        <DateRangePicker
          from={dateRange.from}
          to={dateRange.to}
          onChange={setDateRange}
          variant="solid"
        />
      </div>

      <StatsRow from={dateRange.from} to={dateRange.to} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[270px_1fr_1fr_270px] gap-3 px-8 pb-6">
        {/* Column 1 */}
        <div className="flex flex-col gap-3">
          <OrgProductivityScore from={dateRange.from} to={dateRange.to} />
          <OrgHealthCard from={dateRange.from} to={dateRange.to} />
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-3">
          <WorkSummaryCard from={dateRange.from} to={dateRange.to} />
          <AppUsageCard from={dateRange.from} to={dateRange.to} />
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-3">
          <ScreenshotFeedCard />
          <TopProductiveCard from={dateRange.from} to={dateRange.to} />
        </div>

        {/* Column 4 */}
        <div className="flex flex-col gap-3">
          <AttendanceCard from={dateRange.from} to={dateRange.to} />
          <LiveActivityCard />
        </div>
      </div>
    </>
  );
}
