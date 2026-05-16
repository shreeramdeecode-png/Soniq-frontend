import { Fragment } from 'react';
import { cn } from '@/utils/cn';
import { leaderboardData } from '@/mock/reports';
import ReportShell from './shared/ReportShell';
import { ReportCard } from './shared/ReportCard';
import { ReportGrid2 } from './shared/ReportGrids';
import ReportMultiLineChart from './shared/ReportMultiLineChart';
import ReportBarChart from './shared/ReportBarChart';
import ReportPagination from './shared/ReportPagination';
import EmployeeCell from './shared/EmployeeCell';
import Sparkline from './shared/Sparkline';
import { RT } from './shared/reportTheme';
import { usePaginatedRows } from './shared/usePaginatedRows';

export default function LeaderboardViz({ report, onDateChange }) {
  const { teams, teamDeltas, medals, rankMovement, leaderboard, teamTrendLegend, teamTrend } = leaderboardData;
  const { pageRows, paginationProps } = usePaginatedRows(leaderboard, {
    pageSize: 6,
    totalCount: 128,
    totalPages: 13,
  });

  return (
    <ReportShell report={report} onDateChange={onDateChange}>
      <ReportCard title="Team Productivity Rankings — This Period" subtitle="Average productivity score per team · sorted highest to lowest" className="mb-3">
        <div className="grid grid-cols-5 gap-2.5">
          {teams.map((t, i) => (
            <div
              key={t.name}
              className="rounded-[14px] p-3.5 text-center border"
              style={{
                background: i === 0 ? 'rgba(15,110,86,.1)' : i === 4 ? 'rgba(15,110,86,.06)' : '#F8F8F5',
                borderColor: i === 0 ? 'rgba(15,110,86,.3)' : i === 4 ? 'rgba(15,110,86,.18)' : 'rgba(0,0,0,.07)',
              }}
            >
              <div className="text-xl font-extrabold mb-1" style={{ color: i === 0 ? RT.green : i === 4 ? RT.danger : '#888' }}>
                {medals[i]}
              </div>
              <div className="text-sm font-semibold text-text-primary">{t.name}</div>
              <div className="text-lg font-extrabold my-1" style={{ color: t.color }}>{t.score}</div>
              <div className="h-1 rounded-full bg-[#F0F0E8] overflow-hidden mb-1">
                <div className="h-full rounded-full" style={{ width: t.score, background: t.color }} />
              </div>
              <div className="text-[10px] text-text-light">{t.members} members</div>
              <span
                className="inline-block mt-1 text-[9px] font-semibold px-2 py-0.5 rounded-md"
                style={{
                  background: teamDeltas[i]?.startsWith('+') ? 'rgba(15,110,86,.1)' : 'rgba(15,110,86,.1)',
                  color: teamDeltas[i]?.startsWith('+') ? RT.greenDark : '#085041',
                }}
              >
                {teamDeltas[i]?.startsWith('+') ? '↑' : '↓'} {teamDeltas[i]}
              </span>
            </div>
          ))}
        </div>
      </ReportCard>

      <ReportGrid2 className="mb-3">
        <ReportCard title="Team Score Trend — Last 4 Weeks" subtitle="Weekly avg productivity by team" className="mb-0">
          <div className="flex flex-wrap gap-3 mb-2 text-[10px] text-[#888]">
            {teamTrendLegend.map((l) => (
              <span key={l.label} className="flex items-center gap-1">
                <span className="w-2.5 h-[3px] rounded-sm" style={{ background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
          <ReportMultiLineChart
            labels={teamTrend.labels}
            series={teamTrend.series}
            height={200}
          />
        </ReportCard>
        <ReportCard title="Most Improved vs Biggest Drop" subtitle="Individual rank movement this period vs last period" className="mb-0">
          <ReportBarChart
            horizontal
            signed
            data={rankMovement.map((r) => r.delta)}
            labels={rankMovement.map((r) => r.name)}
            height={230}
            max={18}
          />
        </ReportCard>
      </ReportGrid2>

      <ReportCard
        title="Individual Productivity Leaderboard"
        subtitle="All 128 employees ranked by avg productivity score · Apr 1–21"
        actions={
          <>
            <span className="text-[9px] font-semibold px-2.5 py-1 rounded-lg border" style={{ background: 'rgba(15,110,86,.1)', color: RT.greenDark, borderColor: RT.greenBorder }}>
              Top 10 highlighted
            </span>
            <span className="text-[9px] font-semibold px-2.5 py-1 bg-[#F0F9F4] text-[#085041] rounded-lg border border-[rgba(15,110,86,.18)]">
              Bottom 10 flagged
            </span>
          </>
        }
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="bg-black/[0.02] border-b border-black/5">
                {['Rank', 'Employee', 'Team', 'Score', 'Score Bar', 'Prod Time/Day', 'Focus', 'Attendance', 'Rank Change', '7d Trend', 'Percentile'].map((h) => (
                  <th key={h} className="py-2.5 px-3 text-[9px] font-bold text-text-light uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((e, idx) => (
                <Fragment key={`${e.init}-${e.rank}`}>
                  {idx === 4 && pageRows.length > 4 && (
                    <tr>
                      <td colSpan={11} className="py-1.5 px-3 bg-[rgba(15,110,86,.03)] border-b border-[rgba(15,110,86,.08)]">
                        <span className="text-[9.5px] font-bold" style={{ color: RT.danger }}>⚠ Below Average — Coaching Recommended</span>
                      </td>
                    </tr>
                  )}
                  <tr
                    className={cn(
                      'border-b border-black/[0.04] last:border-b-0 hover:bg-primary/[0.02]',
                      e.top && 'bg-[rgba(15,110,86,.03)]',
                      e.bottom && 'bg-[rgba(15,110,86,.03)]',
                    )}
                  >
                    <td className="py-2.5 px-3">
                      <span className="font-extrabold" style={{ color: e.top ? RT.green : e.bottom ? RT.danger : '#888' }}>
                        {e.rank}
                        {e.top && e.rank <= 3 && <span className="ml-1">{['🥇', '🥈', '🥉'][e.rank - 1]}</span>}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <EmployeeCell init={e.init} name={e.name} role={e.role} avatarStyle={{ background: e.bg, color: e.fc }} />
                    </td>
                    <td className="px-3 text-text-muted">{e.team}</td>
                    <td className="px-3 font-extrabold text-base" style={{ color: e.top ? RT.green : e.bottom ? RT.danger : RT.greenDark }}>{e.pct}%</td>
                    <td className="px-3 min-w-[90px]">
                      <div className="h-2 rounded-full bg-[#F0F0E8] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${e.pct}%`, background: e.top ? RT.barGradient : e.bottom ? RT.danger : RT.greenLight }} />
                      </div>
                    </td>
                    <td className="px-3">{e.prodTime}</td>
                    <td className="px-3 font-semibold" style={{ color: RT.greenDark }}>{e.focus}</td>
                    <td className="px-3" style={{ color: parseInt(e.attendance, 10) >= 95 ? RT.green : RT.warn }}>{e.attendance}</td>
                    <td className="px-3">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                        style={{
                          background: e.delta.includes('+') ? 'rgba(15,110,86,.08)' : e.delta.includes('-') ? 'rgba(15,110,86,.1)' : 'rgba(0,0,0,.04)',
                          color: e.delta.includes('+') ? RT.greenDark : e.delta.includes('-') ? RT.danger : '#888',
                        }}
                      >
                        {e.delta}
                      </span>
                    </td>
                    <td className="px-3"><Sparkline values={e.spark} /></td>
                    <td className="px-3 font-bold" style={{ color: e.bottom ? RT.danger : RT.green }}>{e.percentile}</td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <ReportPagination {...paginationProps} pages={[1, 2, 3, '…', 13]} />
      </ReportCard>
    </ReportShell>
  );
}
