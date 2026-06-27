import { cn } from '@/utils/cn';
import ReportShell from './shared/ReportShell';
import { ReportCard } from './shared/ReportCard';
import { ReportGrid2 } from './shared/ReportGrids';
import ReportBarChart from './shared/ReportBarChart';
import DoughnutChart from './shared/DoughnutChart';
import ReportPagination from './shared/ReportPagination';
import { RT } from './shared/reportTheme';
import { usePaginatedRows } from './shared/usePaginatedRows';

const STATUS_BADGE = {
  Productive: 'bg-[rgba(15,110,86,.1)] text-[#085041] border-[rgba(15,110,86,.2)]',
  Neutral: 'bg-[rgba(29,158,117,.1)] text-[#085041] border-[rgba(29,158,117,.25)]',
  Unproductive: 'bg-[rgba(15,110,86,.1)] text-[#085041] border-[rgba(15,110,86,.2)]',
};

const STATUS_BAR_COLOR = {
  Productive: RT.greenDark,
  Neutral: RT.accentMuted,
  Unproductive: RT.danger,
};

export default function ToolsViz({ report, onDateChange, liveData = {} }) {
  const tools = liveData.tools ?? [];
  const maxHrs = liveData.maxHrs ?? 1;
  const split = liveData.toolsSplit ?? { productive: 0, neutral: 0, unproductive: 0 };
  const { pageRows, paginationProps } = usePaginatedRows(tools, {
    pageSize: 7,
    totalCount: tools.length,
    totalPages: Math.ceil(tools.length / 7),
  });
  const top = tools.slice(0, 7);
  const topApp = tools.find((t) => t.status === 'Productive') ?? tools[0];
  const kpis = [
    { label: 'Productive Split', value: `${split.productive}%`, sub: '% of total tracked time' },
    { label: 'Top App', value: topApp ? topApp.name : '—', sub: 'Most used app' },
  ];
  const doughnutSegments = [
    { label: 'Productive', value: split.productive, color: RT.greenDark },
    { label: 'Neutral', value: split.neutral, color: RT.accentMuted },
    { label: 'Unproductive', value: split.unproductive, color: RT.danger },
  ];

  return (
    <ReportShell report={{ ...report, kpis }} onDateChange={onDateChange}>
      <ReportGrid2 className="mb-3">
        <ReportCard title="Top Tools by Time Spent" subtitle="Avg hrs/day across selected period" className="mb-0">
          {top.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-[11px] text-[#AAA]">No app usage data for this period</div>
          ) : (
            <ReportBarChart
              horizontal
              data={top.map((t) => t.hrs)}
              labels={top.map((t) => t.name)}
              colors={top.map((t) => STATUS_BAR_COLOR[t.status] ?? RT.green)}
              height={200}
              max={maxHrs + 0.2}
              xSuffix="h"
            />
          )}
        </ReportCard>

        <ReportCard title="Productive vs Unproductive Tool Split" subtitle="% of total tracked time · all employees" className="mb-0">
          <DoughnutChart segments={doughnutSegments} centerValue={split.productive} />
        </ReportCard>
      </ReportGrid2>

      <ReportCard title="Full Tool Intelligence Table" subtitle="All tracked apps and websites with adoption %, avg usage time, ROI classification" bodyClassName="p-0" className="mb-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="bg-black/[0.02] border-b border-black/5">
                {['Tool / App', 'Category', 'Type', 'Avg hrs/user/day', 'Users', 'ROI Signal'].map((h) => (
                  <th key={h} className="py-2.5 px-3 text-[9px] font-bold text-text-light uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tools.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-[11px] text-[#AAA]">No app usage data for this period</td></tr>
              ) : (
                pageRows.map((t, i) => (
                  <tr key={`${t.name}-${i}`} className="border-b border-black/[0.04] last:border-b-0 hover:bg-primary/[0.02]">
                    <td className="py-2.5 px-3 font-semibold text-text-primary">{t.name}</td>
                    <td className="px-3 text-text-muted">{t.category ?? t.type ?? '—'}</td>
                    <td className="px-3">
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-lg border', STATUS_BADGE[t.status] ?? STATUS_BADGE.Neutral)}>{t.status}</span>
                    </td>
                    <td className="px-3 font-bold" style={{ color: t.status === 'Unproductive' ? RT.danger : RT.greenDark }}>{t.hrs}h</td>
                    <td className="px-3 text-text-secondary">—</td>
                    <td className="px-3 font-semibold" style={{ color: STATUS_BAR_COLOR[t.status] ?? RT.green }}>{t.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <ReportPagination {...paginationProps} pages={[1, 2, '…']} />
      </ReportCard>

      <ReportCard title="Underused Licensed Tools — Cost Alert" subtitle="Tools where your org pays for seats but adoption is below 15%">
        <div className="flex items-center justify-center h-16 text-[11px] text-[#AAA]">
          License seat data not available — connect your license management system to enable this insight.
        </div>
      </ReportCard>
    </ReportShell>
  );
}
