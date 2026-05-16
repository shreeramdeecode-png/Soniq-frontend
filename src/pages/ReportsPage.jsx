import { useState, lazy, Suspense } from 'react';
import { Download } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { reports } from '@/mock/reports';
import { downloadReportExport } from '@/utils/reportExport';
import { cn } from '@/utils/cn';

const WorkPulseViz = lazy(() => import('@/components/reports/WorkPulseViz'));
const BurnoutViz = lazy(() => import('@/components/reports/BurnoutViz'));
const FocusViz = lazy(() => import('@/components/reports/FocusViz'));
const ToolsViz = lazy(() => import('@/components/reports/ToolsViz'));
const AttendanceViz = lazy(() => import('@/components/reports/AttendanceViz'));
const LeaderboardViz = lazy(() => import('@/components/reports/LeaderboardViz'));

const VIZ_MAP = {
  workpulse: WorkPulseViz,
  burnout: BurnoutViz,
  focus: FocusViz,
  tools: ToolsViz,
  attendance: AttendanceViz,
  leaderboard: LeaderboardViz,
};

export default function ReportsPage() {
  const toast = useToast();
  const [activeIdx, setActiveIdx] = useState(0);

  const active = reports[activeIdx];
  const VizComponent = VIZ_MAP[active.id];

  const handleDateChange = () => {
    toast.info('Date range updated — report data refreshed');
  };

  const handleExport = (format) => {
    const ok = downloadReportExport(active.id, format);
    if (ok) {
      toast.success(
        format === 'csv' ? 'Report exported as CSV' : 'Report downloaded as Excel',
        'Export complete',
      );
    } else {
      toast.error('Could not export this report');
    }
  };

  return (
    <div className="relative z-[2] px-8 pb-8">
      <div className="flex items-end justify-between pt-3.5 pb-5">
        <div>
          <div className="text-xs-plus text-text-light mb-[3px]">Dashboard › Reports</div>
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">Intelligence Reports</h1>
          <p className="text-xs-plus text-text-light mt-1">6 reports · click a numbered tile to switch</p>
        </div>
      </div>

      <div className="glossy-card rounded-[22px] overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5 border-b border-black/[0.06] bg-white/50">
          <div>
            <div className="text-[15px] font-bold text-text-primary">{active.fullName}</div>
            <div className="text-xs text-text-light mt-1">{active.desc}</div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleExport('csv')}
              className="glass-pill flex items-center gap-1.5 text-xs font-semibold text-text-muted px-4 py-2 rounded-pill cursor-pointer hover:bg-white/90 transition-colors"
            >
              <Download size={12} /> Export CSV
            </button>
            <button
              type="button"
              onClick={() => handleExport('xls')}
              className="primary-pill text-white flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-pill cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Download size={12} /> Download Excel
            </button>
          </div>
        </div>

        <div className="border-b border-black/[0.06] overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-none">
            {reports.map((r, i) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveIdx(i)}
                className={cn(
                  'flex-1 min-w-[170px] px-5 py-5 border-r border-black/[0.05] last:border-r-0 cursor-pointer transition-colors flex flex-col text-left shrink-0 relative',
                  activeIdx === i ? 'bg-black/[0.03]' : 'hover:bg-black/[0.015]',
                )}
              >
                <div
                  className={cn(
                    'text-[28px] font-extrabold leading-none mb-2.5 tracking-tight transition-colors tabular-nums',
                    activeIdx === i ? 'text-text-primary' : 'text-[#E0E0D8]',
                  )}
                >
                  {r.num}
                </div>
                <div className="text-sm font-semibold text-text-primary leading-tight mb-1.5">{r.name}</div>
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-[20px] w-fit"
                  style={{ background: r.tagBg, color: r.tagColor }}
                >
                  {r.tag}
                </span>
                <div className="text-xs text-text-light mt-auto pt-2.5">{r.meta}</div>
                {activeIdx === i && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-sm" style={{ background: r.accent }} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-5 overflow-y-auto min-h-[520px] max-h-[calc(100vh-280px)]">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-16">
                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            }
          >
            {VizComponent && <VizComponent report={active} onDateChange={handleDateChange} />}
          </Suspense>
        </div>

        <div className="flex items-center justify-between px-6 py-3.5 border-t border-black/[0.05] bg-black/[0.02]">
          <div className="flex items-center gap-2.5 text-xs text-text-light">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>{active.exportInfo}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleExport('csv')}
              className="glass-pill text-xs font-semibold text-text-muted px-3.5 py-1.5 rounded-pill cursor-pointer hover:bg-white/90 transition-colors"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => handleExport('xls')}
              className="primary-pill text-white text-xs font-semibold px-3.5 py-1.5 rounded-pill cursor-pointer hover:opacity-90 transition-opacity"
            >
              Download Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
