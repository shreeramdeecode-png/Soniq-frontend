import { cn } from '@/utils/cn';
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

const RISK_ACTION = {
  Overworked: 'Mandatory time-off review',
  'At Risk': 'Manager check-in recommended',
  Healthy: 'On track',
};

function deriveAtRiskByTeam(riskTable = []) {
  const teamMap = {};
  for (const row of riskTable) {
    if (!row.team) continue;
    if (!teamMap[row.team]) teamMap[row.team] = { total: 0, atRisk: 0 };
    teamMap[row.team].total++;
    if (row.risk !== 'Healthy') teamMap[row.team].atRisk++;
  }
  const COLORS = ['#0F6E56', '#1D9E75', '#085041', '#27C088', '#33A870', '#1E7A5C'];
  return Object.entries(teamMap).map(([team, v], i) => ({
    team,
    pct: v.total > 0 ? Math.round((v.atRisk / v.total) * 100) : 0,
    color: COLORS[i % COLORS.length],
  }));
}

function deriveWellbeingInsights(riskTable = []) {
  const overworked = riskTable.filter((r) => r.risk === 'Overworked').length;
  const atRisk = riskTable.filter((r) => r.risk === 'At Risk').length;
  const healthy = riskTable.filter((r) => r.risk === 'Healthy').length;
  return [
    {
      title: 'Overworked employees',
      body: overworked > 0
        ? `${overworked} employee${overworked > 1 ? 's are' : ' is'} consistently exceeding target hours. Schedule immediate manager reviews.`
        : 'No employees are currently overworked. Keep monitoring weekly overtime trends.',
      titleColor: RT.green, bg: RT.greenSoft, border: RT.greenBorder,
    },
    {
      title: 'At-risk employees',
      body: atRisk > 0
        ? `${atRisk} employee${atRisk > 1 ? 's show' : ' shows'} early burnout signals. Recommend a proactive 1:1 with their managers.`
        : 'No employees are currently at risk. Maintain current workload distribution.',
      titleColor: RT.green, bg: RT.greenSoft, border: RT.greenBorder,
    },
    {
      title: 'Healthy workforce',
      body: healthy > 0
        ? `${healthy} employee${healthy > 1 ? 's are' : ' is'} within normal work ranges. Celebrate this positive trend.`
        : 'Insufficient data to determine wellness levels for this period.',
      titleColor: RT.green, bg: RT.greenSoft, border: RT.greenBorder,
    },
  ];
}

export default function BurnoutViz({ report, onDateChange, liveData = {} }) {
  const overtimeDaily = liveData.overtimeDaily ?? [];
  const overtimeLabels = liveData.overtimeLabels ?? [];
  const riskTable = liveData.riskTable ?? [];
  const atRiskByTeam = deriveAtRiskByTeam(riskTable);
  const wellbeingInsights = deriveWellbeingInsights(riskTable);

  const kpis = [
    { label: 'Overworked', value: String(riskTable.filter((r) => r.risk === 'Overworked').length), sub: 'Avg daily OT > 2h' },
    { label: 'At Risk', value: String(riskTable.filter((r) => r.risk === 'At Risk').length), sub: '1–2 burnout signals' },
    { label: 'Healthy', value: String(riskTable.filter((r) => r.risk === 'Healthy').length), sub: 'Within normal ranges' },
  ];
  const { pageRows, paginationProps } = usePaginatedRows(riskTable, {
    pageSize: 5,
    totalCount: riskTable.length,
    totalPages: Math.ceil(riskTable.length / 5),
  });

  return (
    <ReportShell report={{ ...report, kpis }} onDateChange={onDateChange}>
      <ReportGrid2 className="mb-3">
        <ReportCard title="Overtime Trend — Last 3 Weeks" subtitle="Avg daily minutes beyond expected work threshold" className="mb-0">
          {overtimeDaily.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-[11px] text-[#AAA]">No overtime data for this period</div>
          ) : (
            <ReportBarChart data={overtimeDaily} labels={overtimeLabels} colors="rgba(15,110,86,0.55)" height={200} ySuffix="m" />
          )}
        </ReportCard>
        <ReportCard title="At-Risk Employees by Team" subtitle="% of team members flagged At Risk or Overworked" className="mb-0">
          {atRiskByTeam.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-[11px] text-[#AAA]">No team data for this period</div>
          ) : (
            <ReportBarChart
              horizontal
              data={atRiskByTeam.map((t) => t.pct)}
              labels={atRiskByTeam.map((t) => t.team)}
              colors={atRiskByTeam.map((t) => t.color)}
              height={200}
              max={100}
              xSuffix="%"
            />
          )}
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
                {['Employee', 'Team', 'Risk Level', 'Avg Daily Hrs', 'Overtime / Day', 'After-Hrs Sessions', 'Weekend Work', 'Consec. High Days', 'Risk Score', 'Recommended Action'].map((h) => (
                  <th key={h} className="py-2.5 px-3 text-[9px] font-bold text-text-light uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {riskTable.length === 0 ? (
                <tr><td colSpan={10} className="py-8 text-center text-[11px] text-[#AAA]">No employee data for this period</td></tr>
              ) : (
                pageRows.map((row) => (
                  <tr key={`${row.init}-${row.name}`} className="border-b border-black/[0.04] last:border-b-0 hover:bg-primary/[0.02]">
                    <td className="py-2.5 px-3">
                      <EmployeeCell init={row.init} name={row.name} role={row.designation} avatarStyle={{ background: 'rgba(15,110,86,.12)', color: RT.green }} />
                    </td>
                    <td className="px-3 text-text-muted">{row.team}</td>
                    <td className="px-3">
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-lg border', RISK_BADGE[row.risk ?? 'Healthy'])}>{row.risk}</span>
                    </td>
                    <td className="px-3 font-bold" style={{ color: row.risk === 'Healthy' ? RT.green : RT.danger }}>{row.avgWorkHrs ?? '—'}</td>
                    <td className="px-3" style={{ color: row.risk === 'Healthy' ? undefined : RT.danger }}>{row.otDaily}</td>
                    <td className="px-3" style={{ color: row.risk === 'Healthy' ? undefined : RT.warn }}>—</td>
                    <td className="px-3">—</td>
                    <td className="px-3 font-bold" style={{ color: row.risk === 'Healthy' ? RT.green : RT.danger }}>{row.days}d</td>
                    <td className="px-3 min-w-[80px]">
                      <div className="h-1.5 rounded-full bg-[#F0F0E8] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${row.score}%`, background: row.risk === 'Healthy' ? RT.green : RT.danger }}
                        />
                      </div>
                    </td>
                    <td className="px-3 text-[10px] font-medium whitespace-nowrap" style={{ color: row.risk === 'Healthy' ? RT.green : RT.danger }}>{RISK_ACTION[row.risk] ?? 'Review'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <ReportPagination
          {...paginationProps}
          info={`${paginationProps.info} · Sorted by risk (high first)`}
          pages={[1, 2, 3, '…']}
        />
      </ReportCard>

      <ReportCard title="Wellbeing Insights & Recommendations" subtitle="Auto-generated based on this period's patterns">
        <ReportInsights items={wellbeingInsights} />
      </ReportCard>
    </ReportShell>
  );
}
