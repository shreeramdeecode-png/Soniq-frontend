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

export default function DashboardPage() {
  return (
    <>
      <div className="flex items-center justify-between px-8 pt-4 pb-3 relative z-content">
        <h1 className="text-7xl font-bold text-text-primary tracking-[-1.5px] leading-[1.05]">
          Welcome in, Kiran
        </h1>
        <DateRangePicker
          from={new Date(2026, 3, 16)}
          to={new Date(2026, 3, 22)}
          variant="solid"
        />
      </div>

      <StatsRow />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[270px_1fr_1fr_270px] gap-3 px-8 pb-6">
        {/* Column 1 */}
        <div className="flex flex-col gap-3">
          <OrgProductivityScore />
          <OrgHealthCard />
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-3">
          <WorkSummaryCard />
          <AppUsageCard />
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-3">
          <ScreenshotFeedCard />
          <TopProductiveCard />
        </div>

        {/* Column 4 */}
        <div className="flex flex-col gap-3">
          <AttendanceCard />
          <LiveActivityCard />
        </div>
      </div>
    </>
  );
}
