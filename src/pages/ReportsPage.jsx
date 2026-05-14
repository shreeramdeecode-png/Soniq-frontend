import { useState, lazy, Suspense } from 'react';
import { Download } from 'lucide-react';
import DateRangePicker from '@/components/ui/DateRangePicker';
import { useToast } from '@/components/ui/Toast';
import { reports } from '@/mock/reports';
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

const STAT_COLORS = {
  up: 'text-[#0F6E56]',
  dn: 'text-[#993535]',
  warn: 'text-[#B8860B]',
};

const SCOPE_TABS = ['Org-wide', 'By Team', 'By Employee'];

export default function ReportsPage() {
  const toast = useToast();
  const [activeIdx, setActiveIdx] = useState(0);
  const [scope, setScope] = useState('Org-wide');
  const [activeAction, setActiveAction] = useState(null);

  const active = reports[activeIdx];
  const VizComponent = VIZ_MAP[active.id];

  return (
    <div className="relative z-[2] px-8 pb-8">
      {/* Page header */}
      <div className="flex items-end justify-between pt-3.5 pb-5">
        <div>
          <div className="text-xs-plus text-text-light mb-[3px]">Dashboard › Reports</div>
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">Intelligence Reports</h1>
          <p className="text-xs-plus text-text-light mt-1">6 reports · click a numbered tile to switch</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Scope tabs */}
          <div className="flex gap-[2px] bg-black/[0.05] rounded-[30px] p-[3px]">
            {SCOPE_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setScope(t)}
                className={cn(
                  'px-4 py-2 rounded-[20px] text-xs font-medium transition-all cursor-pointer',
                  scope === t
                    ? 'bg-white text-text-primary shadow-[0_1px_4px_rgba(0,0,0,.1)]'
                    : 'text-text-muted hover:text-text-secondary',
                )}
              >
                {t}
              </button>
            ))}
          </div>
          {/* Date picker */}
          <DateRangePicker
            from={new Date(2026, 3, 1)}
            to={new Date(2026, 3, 21)}
            variant="solid"
            onChange={() => toast.info('Date range updated — report data refreshed')}
          />
        </div>
      </div>

      {/* Main report card */}
      <div className="glossy-card rounded-[22px] overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-black/[0.06] bg-white/50">
          <div>
            <div className="text-[15px] font-bold text-text-primary">{active.fullName}</div>
            <div className="text-xs text-text-light mt-1">{active.desc}</div>
          </div>
          <div className="flex items-center gap-2.5">
            <button onClick={() => toast.success('Report exported as CSV', 'Export Complete')} className="glass-pill flex items-center gap-1.5 text-xs font-semibold text-text-muted px-4 py-2 rounded-pill cursor-pointer hover:bg-white/90 transition-colors">
              <Download size={12} /> Export CSV
            </button>
            <button onClick={() => toast.success('Report downloaded as Excel', 'Download Complete')} className="primary-pill text-white flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-pill cursor-pointer hover:opacity-90 transition-opacity">
              <Download size={12} /> Download Excel
            </button>
          </div>
        </div>

        {/* Numbered strip */}
        <div className="border-b border-black/[0.06] overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-none">
            {reports.map((r, i) => (
              <button
                key={r.id}
                onClick={() => setActiveIdx(i)}
                className={cn(
                  'flex-1 min-w-[170px] px-5 py-5 border-r border-black/[0.05] last:border-r-0 cursor-pointer transition-colors flex flex-col text-left shrink-0 relative',
                  activeIdx === i ? 'bg-black/[0.03]' : 'hover:bg-black/[0.015]',
                )}
              >
                <div className={cn(
                  'text-[28px] font-extrabold leading-none mb-2.5 tracking-tight transition-colors tabular-nums',
                  activeIdx === i ? 'text-text-primary' : 'text-[#E0E0D8]',
                )}>
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

        {/* Content: sidebar + main */}
        <div className="flex min-h-[480px]">
          {/* Sidebar */}
          <div className="w-[250px] shrink-0 border-r border-black/[0.05] flex flex-col">
            <div className="px-5 py-4 border-b border-black/[0.05]">
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider">{active.sidebarTitle}</div>
            </div>
            <div className="flex flex-col py-2">
              {active.stats.map((s, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-black/[0.04] last:border-b-0">
                  <span className="text-xs-plus text-text-muted">{s.l}</span>
                  <span className={cn('text-xs-plus font-semibold text-text-primary', s.c && STAT_COLORS[s.c])}>{s.v}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto px-5 py-4 border-t border-black/[0.05]">
              <p className="text-xs-plus text-text-light leading-[1.7]">{active.desc2}</p>
            </div>
          </div>

          {/* Main viz */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.05]">
              <div>
                <div className="text-sm font-bold text-text-primary">{active.mainTitle}</div>
                <div className="text-xs text-text-light mt-0.5">{active.mainSub}</div>
              </div>
              <div className="flex items-center gap-2">
                {active.actions.map((a) => (
                  <button
                    key={a}
                    onClick={() => setActiveAction(activeAction === a ? null : a)}
                    className={cn(
                      'text-xs font-semibold px-3.5 py-1.5 rounded-pill cursor-pointer transition-colors',
                      activeAction === a
                        ? 'bg-primary text-white shadow-sm'
                        : 'glass-pill text-text-muted hover:bg-white/90',
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 px-6 py-5 overflow-y-auto">
              <Suspense fallback={<div className="flex items-center justify-center py-8"><div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
                {VizComponent && <VizComponent />}
              </Suspense>
            </div>
          </div>
        </div>

        {/* Export strip */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-black/[0.05] bg-black/[0.02]">
          <div className="flex items-center gap-2.5 text-xs text-text-light">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>{active.exportInfo}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => toast.success('Report exported as CSV', 'Export Complete')} className="glass-pill text-xs font-semibold text-text-muted px-3.5 py-1.5 rounded-pill cursor-pointer hover:bg-white/90 transition-colors">
              Export CSV
            </button>
            <button onClick={() => toast.success('Report downloaded as Excel', 'Download Complete')} className="primary-pill text-white text-xs font-semibold px-3.5 py-1.5 rounded-pill cursor-pointer hover:opacity-90 transition-opacity">
              Download Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
