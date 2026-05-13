import { Calendar, ChevronRight } from 'lucide-react';
import StatsRow from '@/components/cards/dashboard/StatsRow';
import OrgProductivityScore from '@/components/cards/dashboard/OrgProductivityScore';
import OrgHealthCard from '@/components/cards/dashboard/OrgHealthCard';
import WorkSummaryCard from '@/components/cards/dashboard/WorkSummaryCard';
import AppUsageCard from '@/components/cards/dashboard/AppUsageCard';
import ScreenshotFeedCard from '@/components/cards/dashboard/ScreenshotFeedCard';
import TopProductiveCard from '@/components/cards/dashboard/TopProductiveCard';
import AttendanceCard from '@/components/cards/dashboard/AttendanceCard';
import LiveActivityCard from '@/components/cards/dashboard/LiveActivityCard';

export default function DashboardPage() {
  return (
    <>
      <div className="flex items-center justify-between px-8 pt-4 pb-3 relative z-content">
        <h1 className="text-7xl font-bold text-text-primary tracking-[-1.5px] leading-[1.05]">
          Welcome in, Kiran
        </h1>
        <div className="flex items-center h-9 bg-white/80 border border-black/10 rounded-[50px] px-3 gap-2 shadow-sm">
          <Calendar size={12} className="text-text-lighter shrink-0" />
          <div className="flex flex-col px-1">
            <span className="text-[7.5px] text-text-lighter leading-none">From</span>
            <span className="text-xs font-semibold text-text-primary leading-tight">Apr 16</span>
          </div>
          <div className="w-px h-[14px] bg-black/[0.08]" />
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <ChevronRight size={9} className="text-white" />
          </div>
          <div className="w-px h-[14px] bg-black/[0.08]" />
          <div className="flex flex-col px-1">
            <span className="text-[7.5px] text-text-lighter leading-none">To</span>
            <span className="text-xs font-semibold text-text-primary leading-tight">Apr 22</span>
          </div>
        </div>
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
