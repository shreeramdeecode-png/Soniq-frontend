import { cn } from '@/utils/cn';
import { focusData } from '@/mock/reports';
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

const COACHING_STYLE = {
  info: { bg: '#EAF2EE', border: 'rgba(15,110,86,.2)', title: RT.greenDark, body: RT.green },
  success: { bg: '#F0F9F4', border: 'rgba(15,110,86,.18)', title: '#27500A', body: '#3D6028' },
};

export default function FocusViz({ report, onDateChange }) {
  const { distribution, trendData, trendLabels, table, coaching } = focusData;
  const { pageRows, paginationProps } = usePaginatedRows(table, {
    pageSize: 5,
    totalCount: 128,
    totalPages: Math.ceil(128 / 5),
  });

  const doughnutSegments = distribution.map((d) => ({
    label: d.band,
    value: d.count,
    color: d.color,
  }));

  return (
    <ReportShell report={report} onDateChange={onDateChange}>
      <ReportGrid2 className="mb-3">
        <ReportCard title="Focus Score Trend — Apr 1–21" subtitle="Org-wide average daily focus score" className="mb-0">
          <ReportLineChart
            data={trendData}
            labels={trendLabels}
            color={RT.green}
            fillColor={RT.greenFill}
            height={200}
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
              {pageRows.map((e) => (
                <tr key={`${e.init}-${e.name}`} className="border-b border-black/[0.04] last:border-b-0 hover:bg-primary/[0.02]">
                  <td className="py-2.5 px-3">
                    <EmployeeCell init={e.init} name={e.name} role={e.role} avatarStyle={{ background: e.bg, color: e.fc }} />
                  </td>
                  <td className="px-3 text-text-muted">{e.team}</td>
                  <td className="px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-extrabold" style={{ color: e.bandColor }}>{e.score}</span>
                      <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: RT.greenPale }}>
                        <div className="h-full rounded-full" style={{ width: `${e.score}%`, background: e.bandColor }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-3">
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-lg border', BAND_BADGE[e.band])}>{e.band}</span>
                  </td>
                  <td className="px-3 text-text-secondary">{e.streak}</td>
                  <td className="px-3 text-text-secondary">{e.switches}</td>
                  <td className="px-3 text-text-secondary">{e.deep}</td>
                  <td className="px-3 text-text-secondary">{e.longest}</td>
                  <td className="px-3"><Sparkline values={e.spark} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ReportPagination {...paginationProps} pages={[1, 2, 3, '…', 26]} />
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
