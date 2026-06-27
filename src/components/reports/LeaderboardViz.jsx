import { Fragment } from 'react';
import { cn } from '@/utils/cn';
import ReportShell from './shared/ReportShell';
import { ReportCard } from './shared/ReportCard';
import { ReportGrid2 } from './shared/ReportGrids';
import ReportPagination from './shared/ReportPagination';
import EmployeeCell from './shared/EmployeeCell';
import Sparkline from './shared/Sparkline';
import { RT } from './shared/reportTheme';
import { usePaginatedRows } from './shared/usePaginatedRows';

const MEDALS = ['🥇', '🥈', '🥉', '4th', '5th', '6th'];

export default function LeaderboardViz({ report, onDateChange, liveData = {} }) {
  const teams = liveData.leaderboardTeams ?? [];
  const leaderboard = liveData.leaderboardRows ?? [];
  const totalCount = leaderboard.length;
  const { pageRows, paginationProps } = usePaginatedRows(leaderboard, {
    pageSize: 6,
    totalCount,
    totalPages: Math.ceil(totalCount / 6),
  });

  const kpis = [
    { label: 'Rank #1', value: leaderboard[0]?.name ?? '—', sub: leaderboard[0] ? `${leaderboard[0].score} score` : 'Top productivity score' },
    { label: 'Top Team', value: teams[0]?.name ?? '—', sub: teams[0] ? `${teams[0].score} avg` : 'Highest avg score' },
  ];

  return (
    <ReportShell report={{ ...report, kpis }} onDateChange={onDateChange}>
      <ReportCard title="Team Productivity Rankings — This Period" subtitle="Average productivity score per team · sorted highest to lowest" className="mb-3">
        {teams.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-[11px] text-[#AAA]">No team data for this period</div>
        ) : (
          <div className="grid grid-cols-5 gap-2.5">
            {teams.map((t, i) => (
              <div
                key={t.name}
                className="rounded-[14px] p-3.5 text-center border"
                style={{
                  background: i === 0 ? 'rgba(15,110,86,.1)' : 'rgba(0,0,0,.02)',
                  borderColor: i === 0 ? 'rgba(15,110,86,.3)' : 'rgba(0,0,0,.07)',
                }}
              >
                <div className="text-xl font-extrabold mb-1" style={{ color: i === 0 ? RT.green : '#888' }}>
                  {MEDALS[i] ?? `${i + 1}`}
                </div>
                <div className="text-sm font-semibold text-text-primary">{t.name}</div>
                <div className="text-lg font-extrabold my-1" style={{ color: t.color }}>{t.score}</div>
                <div className="h-1 rounded-full bg-[#F0F0E8] overflow-hidden mb-1">
                  <div className="h-full rounded-full" style={{ width: t.score, background: t.color }} />
                </div>
                <div className="text-[10px] text-text-light">{t.members} members</div>
              </div>
            ))}
          </div>
        )}
      </ReportCard>

      <ReportGrid2 className="mb-3">
        <ReportCard title="Team Score Trend — Last 4 Weeks" subtitle="Weekly avg productivity by team" className="mb-0">
          <div className="flex items-center justify-center h-48 text-[11px] text-[#AAA]">
            Multi-week trend data not available — requires historical weekly aggregation
          </div>
        </ReportCard>
        <ReportCard title="Most Improved vs Biggest Drop" subtitle="Individual rank movement this period vs last period" className="mb-0">
          <div className="flex items-center justify-center h-48 text-[11px] text-[#AAA]">
            Rank movement data not available — requires comparison with prior period
          </div>
        </ReportCard>
      </ReportGrid2>

      <ReportCard
        title="Individual Productivity Leaderboard"
        subtitle="Employees ranked by avg productivity score"
        actions={
          <span className="text-[9px] font-semibold px-2.5 py-1 rounded-lg border" style={{ background: 'rgba(15,110,86,.1)', color: RT.greenDark, borderColor: RT.greenBorder }}>
            Top 10 highlighted
          </span>
        }
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="bg-black/[0.02] border-b border-black/5">
                {['Rank', 'Employee', 'Team', 'Score', 'Score Bar', 'Prod Time/Day', 'Days Present', 'Rank Change', '7d Trend', 'Percentile'].map((h) => (
                  <th key={h} className="py-2.5 px-3 text-[9px] font-bold text-text-light uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr><td colSpan={10} className="py-8 text-center text-[11px] text-[#AAA]">No leaderboard data for this period</td></tr>
              ) : (
                pageRows.map((e, idx) => {
                  const scoreNum = parseInt(e.score) || 0;
                  const isTop = e.rank <= 10;
                  const isBottom = e.rank > totalCount - 10 && totalCount > 10;
                  const percentile = Math.round(((totalCount - e.rank + 1) / totalCount) * 100);
                  return (
                    <Fragment key={`${e.init}-${e.rank}`}>
                      <tr className={cn('border-b border-black/[0.04] last:border-b-0 hover:bg-primary/[0.02]', isTop && 'bg-[rgba(15,110,86,.03)]')}>
                        <td className="py-2.5 px-3">
                          <span className="font-extrabold" style={{ color: isTop ? RT.green : '#888' }}>
                            {e.rank}
                            {e.rank <= 3 && <span className="ml-1">{['🥇', '🥈', '🥉'][e.rank - 1]}</span>}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <EmployeeCell init={e.init} name={e.name} role={e.designation} avatarStyle={{ background: 'rgba(15,110,86,.12)', color: RT.green }} />
                        </td>
                        <td className="px-3 text-text-muted">{e.team}</td>
                        <td className="px-3 font-extrabold text-base" style={{ color: isTop ? RT.green : RT.greenDark }}>{scoreNum}%</td>
                        <td className="px-3 min-w-[90px]">
                          <div className="h-2 rounded-full bg-[#F0F0E8] overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${scoreNum}%`, background: isTop ? RT.barGradient : RT.greenLight }} />
                          </div>
                        </td>
                        <td className="px-3">{e.hrs}</td>
                        <td className="px-3 text-text-secondary">{e.days}d</td>
                        <td className="px-3">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ background: 'rgba(0,0,0,.04)', color: '#888' }}>—</span>
                        </td>
                        <td className="px-3"><Sparkline values={e.sparkScore ?? []} /></td>
                        <td className="px-3 font-bold" style={{ color: RT.green }}>{percentile}th</td>
                      </tr>
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {leaderboard.length > 0 && (
          <ReportPagination {...paginationProps} pages={[1, 2, 3, '…']} />
        )}
      </ReportCard>
    </ReportShell>
  );
}
