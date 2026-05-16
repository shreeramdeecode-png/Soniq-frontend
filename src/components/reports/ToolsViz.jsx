import { cn } from '@/utils/cn';
import { toolsData } from '@/mock/reports';
import ReportShell from './shared/ReportShell';
import { ReportCard } from './shared/ReportCard';
import { ReportGrid2 } from './shared/ReportGrids';
import ReportBarChart from './shared/ReportBarChart';
import DoughnutChart from './shared/DoughnutChart';
import ReportPagination from './shared/ReportPagination';
import { RT } from './shared/reportTheme';
import { usePaginatedRows } from './shared/usePaginatedRows';

const TYPE_BADGE = {
  Productive: 'bg-[rgba(15,110,86,.1)] text-[#085041] border-[rgba(15,110,86,.2)]',
  Neutral: 'bg-[rgba(29,158,117,.1)] text-[#085041] border-[rgba(29,158,117,.25)]',
  Unproductive: 'bg-[rgba(15,110,86,.1)] text-[#085041] border-[rgba(15,110,86,.2)]',
};

const topTools = (tools) => tools.slice(0, 7);

export default function ToolsViz({ report, onDateChange }) {
  const { tools, maxHrs, split, underused } = toolsData;
  const { pageRows, paginationProps } = usePaginatedRows(tools, {
    pageSize: 7,
    totalCount: 184,
    totalPages: 8,
  });
  const top = topTools(tools);
  const doughnutSegments = [
    { label: 'Productive', value: split.productive, color: RT.greenDark },
    { label: 'Neutral', value: split.neutral, color: RT.accentMuted },
    { label: 'Unproductive', value: split.unproductive, color: RT.danger },
  ];

  return (
    <ReportShell report={report} onDateChange={onDateChange}>
      <ReportGrid2 className="mb-3">
        <ReportCard title="Top Tools by Productive Time" subtitle="Avg hrs/user/day across Apr 1–21" className="mb-0">
          <ReportBarChart
            horizontal
            data={top.map((t) => t.hrs)}
            labels={top.map((t) => t.name)}
            colors={top.map((t) => t.barColor)}
            height={200}
            max={maxHrs + 0.2}
            xSuffix="h"
          />
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
              {pageRows.map((t, i) => (
                <tr key={`${t.name}-${i}`} className={cn('border-b border-black/[0.04] last:border-b-0 hover:bg-primary/[0.02]', t.name.startsWith('Notion') && 'bg-[rgba(15,110,86,.04)]')}>
                  <td className="py-2.5 px-3 font-semibold text-text-primary">
                    {t.name}
                    {t.name === 'Notion' && <span className="text-[8.5px] font-normal text-[#1D9E75] ml-1">⚠ Underused</span>}
                  </td>
                  <td className="px-3 text-text-muted">{t.category}</td>
                  <td className="px-3">
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-lg border', TYPE_BADGE[t.type])}>{t.type}</span>
                  </td>
                  <td className="px-3 font-bold" style={{ color: t.type === 'Unproductive' ? RT.danger : RT.greenDark }}>{t.hrs}h</td>
                  <td className="px-3 text-text-secondary">{t.users}</td>
                  <td className="px-3 font-semibold" style={{ color: t.roiColor }}>{t.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ReportPagination {...paginationProps} pages={[1, 2, '…', 8]} />
      </ReportCard>

      <ReportCard title="Underused Licensed Tools — Cost Alert" subtitle="Tools where your org pays for seats but adoption is below 15%">
        <div className="grid grid-cols-4 gap-2.5">
          {underused.map((u) => (
            <div key={u.name} className="p-3 rounded-xl border" style={{ background: RT.greenSoft, borderColor: RT.greenBorder }}>
              <div className="text-[11px] font-bold text-text-primary mb-1">{u.name}</div>
              <div className="text-[9.5px] text-[#888] mb-1.5">{u.adoption}</div>
              <div className="text-base font-extrabold" style={{ color: RT.warn }}>{u.cost}</div>
              <div className="text-[9px] text-text-light mt-1">{u.note}</div>
            </div>
          ))}
        </div>
      </ReportCard>
    </ReportShell>
  );
}
