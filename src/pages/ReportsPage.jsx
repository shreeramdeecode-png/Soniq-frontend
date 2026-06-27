import { useState, useEffect, lazy, Suspense } from 'react';
import { Download } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { downloadReportExport } from '@/utils/reportExport';
import DateRangePicker from '@/components/ui/DateRangePicker';

const reports = [
  {
    id: 'workpulse', num: '01', name: 'Work Pulse', fullName: 'Work Pulse Report',
    desc: 'Hour-by-hour productivity rhythm · peak windows · dead zones · distraction patterns',
    accent: '#0F6E56', tag: 'Rhythm', tagBg: 'rgba(15,110,86,.12)', tagColor: '#085041',
    meta: 'Org productivity trend', exportInfo: 'Work Pulse Report · Updated live',
    kpis: [
      { label: 'Day-of-Week', value: 'Mon–Fri', sub: 'Avg productivity per day' },
      { label: 'Top Distraction', value: 'Unproductive apps', sub: 'By total time spent' },
    ],
  },
  {
    id: 'burnout', num: '02', name: 'Burnout & Wellbeing', fullName: 'Burnout & Wellbeing',
    desc: 'Flags overworked employees before they burn out · overtime trends · after-hours activity',
    accent: '#085041', tag: 'Wellbeing', tagBg: 'rgba(15,110,86,.1)', tagColor: '#085041',
    meta: 'Risk distribution', exportInfo: 'Burnout & Wellbeing Report · Updated live',
    kpis: [
      { label: 'Overworked', value: '—', sub: 'Avg daily OT > 2h' },
      { label: 'At Risk', value: '—', sub: '1–2 burnout signals' },
      { label: 'Healthy', value: '—', sub: 'Within normal ranges' },
    ],
  },
  {
    id: 'focus', num: '03', name: 'Focus Score', fullName: 'Focus Score Report',
    desc: 'Deep work quality · focus streaks · context-switching · session depth · score 0–100',
    accent: '#0F6E56', tag: 'Concentration', tagBg: 'rgba(15,110,86,.1)', tagColor: '#085041',
    meta: 'Focus bands', exportInfo: 'Focus Score Report · Updated live',
    kpis: [
      { label: 'Deep Focus', value: '≥75%', sub: 'Employees in top band' },
      { label: 'Scattered', value: '<25%', sub: 'Employees needing coaching' },
    ],
  },
  {
    id: 'tools', num: '04', name: 'Tool Intelligence', fullName: 'Tool Intelligence',
    desc: 'App and website productivity · software ROI · underused licenses · wasted seat costs',
    accent: '#0F6E56', tag: 'Software ROI', tagBg: 'rgba(29,158,117,.1)', tagColor: '#085041',
    meta: 'App usage tracked', exportInfo: 'Tool Intelligence Report · Updated live',
    kpis: [
      { label: 'Productive Split', value: '—', sub: '% of total tracked time' },
      { label: 'Top App', value: '—', sub: 'Most used productive app' },
    ],
  },
  {
    id: 'attendance', num: '05', name: 'Attendance', fullName: 'Attendance & Punctuality',
    desc: 'Beyond present/absent · late arrivals · early exits · habitual patterns · streak records',
    accent: '#0F6E56', tag: 'Punctuality', tagBg: 'rgba(88,88,88,.08)', tagColor: '#0F6E56',
    meta: 'Attendance rate', exportInfo: 'Attendance Report · Updated live',
    kpis: [
      { label: 'Attendance Rate', value: '—', sub: 'Last 21 working days' },
      { label: 'Absences by Day', value: 'Mon–Fri', sub: 'Pattern analysis' },
    ],
  },
  {
    id: 'leaderboard', num: '06', name: 'Team Leaderboard', fullName: 'Team Leaderboard',
    desc: 'Live productivity rankings · top performer patterns · coaching opportunities · rank movement',
    accent: '#0F6E56', tag: 'Rankings', tagBg: 'rgba(15,110,86,.1)', tagColor: '#085041',
    meta: 'Employee rankings', exportInfo: 'Team Leaderboard · Updated live',
    kpis: [
      { label: 'Rank #1', value: '—', sub: 'Top productivity score' },
      { label: 'Top Team', value: '—', sub: 'Highest avg score' },
    ],
  },
];
import { transformReportData } from '@/utils/reportTransform';
import { cn } from '@/utils/cn';
import api from '@/utils/api';

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

// Map report id → export type accepted by the backend
const EXPORT_TYPE_MAP = {
  workpulse: 'productivity',
  burnout: 'effort',
  focus: 'productivity',
  tools: 'app-usage',
  attendance: 'attendance',
  leaderboard: 'productivity',
};

function toDateStr(d) {
  return d.toISOString().slice(0, 10);
}

function getDefaultFrom() {
  const d = new Date();
  d.setDate(d.getDate() - 29);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function ReportsPage() {
  const toast = useToast();
  const [activeIdx, setActiveIdx] = useState(0);
  const [liveData, setLiveData] = useState({});
  const [dataLoading, setDataLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ from: getDefaultFrom(), to: new Date() });

  const from = toDateStr(dateRange.from);
  const to = toDateStr(dateRange.to);

  useEffect(() => {
    let cancelled = false;
    setDataLoading(true);
    Promise.all([
      api.get(`/api/client/reports/productivity-trend?from=${from}&to=${to}`).then(r => r.data).catch(() => []),
      api.get(`/api/client/reports/app-usage?from=${from}&to=${to}`).then(r => r.data).catch(() => []),
      api.get(`/api/client/reports/effort?from=${from}&to=${to}`).then(r => r.data).catch(() => []),
      api.get(`/api/client/reports/attendance?from=${from}&to=${to}`).then(r => r.data).catch(() => []),
      api.get(`/api/client/reports/hourly-heatmap?from=${from}&to=${to}`).then(r => r.data).catch(() => ({})),
    ]).then(([trend, apps, effort, attendance, hourly]) => {
      if (!cancelled) {
        setLiveData(transformReportData({ trend, apps, effort, attendance, hourly }));
      }
    }).catch(console.error).finally(() => {
      if (!cancelled) setDataLoading(false);
    });
    return () => { cancelled = true; };
  }, [from, to]);

  const active = reports[activeIdx];
  const VizComponent = VIZ_MAP[active.id];

  const handleDateChange = (range) => {
    setDateRange(range);
  };

  const handleExport = async (format) => {
    if (format === 'csv') {
      try {
        const exportType = EXPORT_TYPE_MAP[active.id] ?? 'productivity';
        const response = await api.get(
          `/api/client/reports/export?type=${exportType}&from=${from}&to=${to}`,
          { responseType: 'blob' },
        );
        const url = URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${active.id}-report-${from}-${to}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast.success('Report exported as CSV', 'Export complete');
      } catch {
        toast.error('Could not export this report');
      }
    } else {
      const ok = downloadReportExport(active.id, format);
      if (ok) {
        toast.success('Report downloaded as Excel', 'Export complete');
      } else {
        toast.error('Could not export this report');
      }
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
        <DateRangePicker
          from={dateRange.from}
          to={dateRange.to}
          onChange={handleDateChange}
          variant="solid"
        />
      </div>

      <div className="glossy-card rounded-[22px] overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5 border-b border-black/[0.06] bg-white/50">
          <div>
            <div className="text-[15px] font-bold text-text-primary">{active.fullName}</div>
            <div className="text-xs text-text-light mt-1">{active.desc}</div>
          </div>
          <div className="flex items-center gap-2.5">
            {dataLoading && (
              <div className="flex items-center gap-1.5 text-xs text-text-light mr-2">
                <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span>Loading live data…</span>
              </div>
            )}
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
            {VizComponent && (
              <VizComponent
                report={active}
                onDateChange={handleDateChange}
                liveData={liveData}
              />
            )}
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
