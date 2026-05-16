import { cn } from '@/utils/cn';
import { burnoutData } from '@/mock/reports';
import ReportShell from './shared/ReportShell';
import { ReportCard } from './shared/ReportCard';
import { ReportGrid2 } from './shared/ReportGrids';
import ReportBarChart from './shared/ReportBarChart';
import ReportPagination from './shared/ReportPagination';
import ReportInsights from './shared/ReportInsights';
import EmployeeCell from './shared/EmployeeCell';
import { RT } from './shared/reportTheme';
import { usePaginatedRows } from './shared/usePaginatedRows';

const RISK_BADGE = {
  Overworked: 'bg-[rgba(15,110,86,.1)] text-[#085041] border-[rgba(15,110,86,.2)]',
  'At Risk': 'bg-[rgba(29,158,117,.1)] text-[#085041] border-[rgba(29,158,117,.25)]',
  Healthy: 'bg-[rgba(15,110,86,.1)] text-[#085041] border-[rgba(15,110,86,.2)]',
};

export default function BurnoutViz({ report, onDateChange }) {
  const { overtimeDaily, overtimeLabels, afterHoursByTeam, riskTable, wellbeingInsights } = burnoutData;
  const { pageRows, paginationProps } = usePaginatedRows(riskTable, {
    pageSize: 5,
    totalCount: 128,
    totalPages: 6,
  });

  return (
    <ReportShell report={report} onDateChange={onDateChange}>
      <ReportGrid2 className="mb-3">
        <ReportCard title="Overtime Trend — Last 3 Weeks" subtitle="Avg daily minutes beyond expected 8h threshold" className="mb-0">
          <ReportBarChart
            data={overtimeDaily}
            labels={overtimeLabels}
            colors="rgba(15,110,86,0.55)"
            height={200}
            max={70}
            ySuffix="m"
          />
        </ReportCard>
        <ReportCard title="After-Hours Activity by Team" subtitle="% of employees logging sessions after 7 PM" className="mb-0">
          <ReportBarChart
            horizontal
            data={afterHoursByTeam.map((t) => t.pct)}
            labels={afterHoursByTeam.map((t) => t.team)}
            colors={afterHoursByTeam.map((t) => t.color)}
            height={200}
            max={50}
            xSuffix="%"
          />
        </ReportCard>
      </ReportGrid2>

      <ReportCard
        title="Employee Wellbeing Index"
        subtitle="Ranked by risk level — overworked employees flagged first"
        actions={
          <span className="text-[9.5px] text-[#AAA] px-2.5 py-1 bg-[#F0F9F4] rounded-lg border border-[rgba(15,110,86,.12)]">
            Risk score = OT + after-hrs + weekend + consecutive-high-days
          </span>
        }
        bodyClassName="p-0"
        className="mb-3"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="bg-black/[0.02] border-b border-black/5">
                {['Employee', 'Team', 'Risk Level', 'Avg Daily Hrs', 'Overtime / Week', 'After-Hrs Sessions', 'Weekend Work', 'Consec. High Days', 'Risk Score', 'Recommended Action'].map((h) => (
                  <th key={h} className="py-2.5 px-3 text-[9px] font-bold text-text-light uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={`${row.init}-${row.name}`} className="border-b border-black/[0.04] last:border-b-0 hover:bg-primary/[0.02]">
                  <td className="py-2.5 px-3">
                    <EmployeeCell init={row.init} name={row.name} role={row.role} avatarStyle={row.avatar} />
                  </td>
                  <td className="px-3 text-text-muted">{row.team}</td>
                  <td className="px-3">
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-lg border', RISK_BADGE[row.risk])}>{row.risk}</span>
                  </td>
                  <td className="px-3 font-bold" style={{ color: row.risk === 'Healthy' ? RT.green : RT.danger }}>{row.hours}</td>
                  <td className="px-3" style={{ color: row.risk === 'Healthy' ? undefined : RT.danger }}>{row.ot}</td>
                  <td className="px-3" style={{ color: row.risk === 'Healthy' ? undefined : row.risk === 'At Risk' ? RT.warn : RT.danger }}>{row.afterHrs}</td>
                  <td className="px-3">{row.weekend}</td>
                  <td className="px-3 font-bold" style={{ color: row.risk === 'Healthy' ? RT.green : RT.danger }}>{row.consec}</td>
                  <td className="px-3 min-w-[80px]">
                    <div className="h-1.5 rounded-full bg-[#F0F0E8] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${row.riskPct}%`,
                          background: row.risk === 'Healthy' ? RT.green : row.risk === 'At Risk' ? RT.warn : RT.danger,
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-3 text-[10px] font-medium whitespace-nowrap" style={{ color: row.risk === 'Healthy' ? RT.green : RT.danger }}>{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ReportPagination
          {...paginationProps}
          info={`${paginationProps.info} · Sorted by risk (high first)`}
          pages={[1, 2, 3, '…', 6]}
        />
      </ReportCard>

      <ReportCard title="Wellbeing Insights & Recommendations" subtitle="Auto-generated based on this period's patterns">
        <ReportInsights items={wellbeingInsights} />
      </ReportCard>
    </ReportShell>
  );
}
