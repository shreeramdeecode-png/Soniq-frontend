import { cn } from '@/utils/cn';
import ReportShell from './shared/ReportShell';
import { ReportCard } from './shared/ReportCard';
import { ReportGrid2 } from './shared/ReportGrids';
import ReportLineChart from './shared/ReportLineChart';
import DoughnutChart from './shared/DoughnutChart';
import ReportPagination from './shared/ReportPagination';
import EmployeeCell from './shared/EmployeeCell';
import Sparkline from './shared/Sparkline';
import { RT } from './shared/reportTheme';
import { usePaginatedRows } from './shared/usePaginatedRows';

const BAND_BADGE = {
  'Deep Focus': 'bg-[rgba(15,110,86,.1)] text-[#085041] border-[rgba(15,110,86,.2)]',
  Moderate: 'bg-[rgba(29,158,117,.1)] text-[#0F6E56] border-[rgba(15,110,86,.2)]',
  Fragmented: 'bg-[rgba(133,196,176,.25)] text-[#0A5040] border-[rgba(15,110,86,.15)]',
  Scattered: 'bg-[rgba(15,110,86,.1)] text-[#085041] border-[rgba(15,110,86,.2)]',
};

const BAND_COLOR = {
  'Deep Focus': '#0F6E56',
  Moderate: '#1D9E75',
  Fragmented: '#27C088',
  Scattered: '#085041',
};

const COACHING_STYLE = {
  info: { bg: '#EAF2EE', border: 'rgba(15,110,86,.2)', title: RT.greenDark, body: RT.green },
  success: { bg: '#F0F9F4', border: 'rgba(15,110,86,.18)', title: '#27500A', body: '#3D6028' },
};

function deriveCoaching(distribution = []) {
  const deep = distribution.find((d) => d.band === 'Deep Focus')?.count ?? 0;
  const scattered = distribution.find((d) => d.band === 'Scattered')?.count ?? 0;
  const fragmented = distribution.find((d) => d.band === 'Fragmented')?.count ?? 0;
  return [
    {
      title: 'Protect deep focus blocks',
      body: deep > 0
        ? `${deep} employees are in Deep Focus. Block 2-hour uninterrupted windows in the mornings to preserve this.`
        : 'Schedule 2-hour focused blocks in the morning when distractions are lowest.',
      style: 'success',
    },
    {
      title: 'Reduce context switching',
      body: fragmented > 0
        ? `${fragmented} employees are Fragmented. Encourage batching similar tasks and turning off non-urgent notifications.`
        : 'Encourage grouping similar tasks together and minimising app-switching throughout the day.',
      style: 'info',
    },
    {
      title: 'Coach scattered employees',
      body: scattered > 0
        ? `${scattered} employees are Scattered. Consider time-boxing exercises and structured daily plans.`
        : 'No scattered employees this period. Keep reinforcing focus habits across the team.',
      style: 'info',
    },
  ];
}

export default function FocusViz({ report, onDateChange, liveData = {} }) {
  const distribution = liveData.focusDistribution ?? [];
  const trendData = liveData.focusTrendData ?? [];
  const trendLabels = liveData.focusTrendLabels ?? [];
  const table = liveData.focusTable ?? [];
  const coaching = deriveCoaching(distribution);
  const { pageRows, paginationProps } = usePaginatedRows(table, {
    pageSize: 5,
    totalCount: table.length,
    totalPages: Math.ceil(table.length / 5),
  });

  const doughnutSegments = distribution.map((d) => ({
    label: d.band,
    value: d.count,
    color: d.color,
  }));

  const kpis = [
    { label: 'Deep Focus', value: String(distribution.find((d) => d.band === 'Deep Focus')?.count ?? 0), sub: 'Employees in top band (≥75%)' },
    { label: 'Scattered', value: String(distribution.find((d) => d.band === 'Scattered')?.count ?? 0), sub: 'Needing coaching (<25%)' },
  ];

  return (
    <ReportShell report={{ ...report, kpis }} onDateChange={onDateChange}>
      <ReportGrid2 className="mb-3">
        <ReportCard title="Focus Score Trend — Last 7 Days" subtitle="Org-wide average daily focus score" className="mb-0">
          <ReportLineChart
            data={trendData}
            labels={trendLabels}
            color={RT.green}
            fillColor={RT.greenFill}
            height={200}
            yTickStep={20}
          />
        </ReportCard>
        <ReportCard title="Focus Distribution" subtitle="How employees are distributed across score bands" className="mb-0">
          <DoughnutChart segments={doughnutSegments} showCenter={false} hideLegend />
          <div className="flex flex-wrap gap-2.5 mt-1 text-[10px] text-[#888] justify-center">
            {distribution.map((d) => (
              <span key={d.band} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
                {d.band} · {d.count}
              </span>
            ))}
          </div>
        </ReportCard>
      </ReportGrid2>

      <ReportCard
        title="Employee Focus Score Table"
        subtitle="Sorted by avg focus score (high to low). Score = (streak × 0.4) + (1/switches × 0.4) + (deep sessions × 0.2), normalized 0–100."
        actions={
          <span className="text-[9px] font-semibold px-2.5 py-1 rounded-lg border" style={{ background: RT.greenPale, color: RT.greenDark, borderColor: RT.greenBorder }}>
            Longer streaks + fewer switches + more 30min blocks = higher score
          </span>
        }
        bodyClassName="p-0"
        className="mb-3"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="bg-black/[0.02] border-b border-black/5">
                {['Employee', 'Team', 'Focus Score', 'Score Band', 'Avg Streak', 'Switches/hr', 'Deep Sessions/day', 'Longest Streak', '7d Trend'].map((h) => (
                  <th key={h} className="py-2.5 px-3 text-[9px] font-bold text-text-light uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.length === 0 ? (
                <tr><td colSpan={9} className="py-8 text-center text-[11px] text-[#AAA]">No focus data for this period</td></tr>
              ) : (
                pageRows.map((e) => {
                  const scoreNum = parseInt(e.score) || 0;
                  const bandColor = BAND_COLOR[e.band] ?? RT.green;
                  return (
                    <tr key={`${e.init}-${e.name}`} className="border-b border-black/[0.04] last:border-b-0 hover:bg-primary/[0.02]">
                      <td className="py-2.5 px-3">
                        <EmployeeCell init={e.init} name={e.name} role={e.designation} avatarStyle={{ background: 'rgba(15,110,86,.12)', color: RT.green }} />
                      </td>
                      <td className="px-3 text-text-muted">{e.team}</td>
                      <td className="px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-extrabold" style={{ color: bandColor }}>{scoreNum}%</span>
                          <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: RT.greenPale }}>
                            <div className="h-full rounded-full" style={{ width: `${scoreNum}%`, background: bandColor }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-3">
                        <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-lg border', BAND_BADGE[e.band])}>{e.band}</span>
                      </td>
                      <td className="px-3 text-text-secondary">{e.streak ? `${e.streak}m` : '—'}</td>
                      <td className="px-3 text-text-secondary">{e.switchesHr ? `${e.switchesHr}/hr` : '—'}</td>
                      <td className="px-3 text-text-secondary">—</td>
                      <td className="px-3 text-text-secondary">—</td>
                      <td className="px-3"><Sparkline values={e.sparkScore ?? []} /></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <ReportPagination {...paginationProps} pages={[1, 2, 3, '…']} />
      </ReportCard>

      <ReportCard title="Focus Coaching Recommendations" subtitle="Automated suggestions based on individual patterns">
        <div className="grid grid-cols-3 gap-2.5">
          {coaching.map((c) => {
            const s = COACHING_STYLE[c.style];
            return (
              <div key={c.title} className="p-3 rounded-xl border" style={{ background: s.bg, borderColor: s.border }}>
                <div className="text-[10px] font-bold mb-1.5" style={{ color: s.title }}>{c.title}</div>
                <p className="text-[10px] leading-relaxed" style={{ color: s.body }}>{c.body}</p>
              </div>
            );
          })}
        </div>
      </ReportCard>
    </ReportShell>
  );
}
