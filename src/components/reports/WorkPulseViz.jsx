import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import ReportShell from './shared/ReportShell';
import { ReportCard, CardActionButton } from './shared/ReportCard';
import { ReportGrid2 } from './shared/ReportGrids';
import ProductivityHeatmap from './shared/ProductivityHeatmap';
import ProductivityHourChart from './shared/ProductivityHourChart';
import ReportInsights from './shared/ReportInsights';
import { RT } from './shared/reportTheme';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

function deriveTeamRhythm(teams = []) {
  return teams.slice(0, 6).map((t, i) => ({
    name: t.name,
    pct: parseInt(t.score) || 0,
    color: t.color || RT.green,
    barMuted: i > 2,
  }));
}

function deriveDistractions(tools = []) {
  const totalHrs = tools.reduce((s, t) => s + t.hrs, 0.01);
  const maxHrs = Math.max(...tools.map((t) => t.hrs), 0.01);
  return tools
    .filter((t) => t.status === 'Unproductive')
    .slice(0, 5)
    .map((t) => ({
      name: t.name,
      time: `${t.hrs}h/day`,
      color: RT.greenDark,
      pct: Math.round((t.hrs / maxHrs) * 100),
      share: `${Math.round((t.hrs / totalHrs) * 100)}%`,
    }));
}

function deriveInsights(dayBreakdown = []) {
  if (!dayBreakdown.length) return [];
  const best = dayBreakdown.reduce((a, b) => (a.pct > b.pct ? a : b), dayBreakdown[0]);
  const worst = dayBreakdown.reduce((a, b) => (a.pct < b.pct ? a : b), dayBreakdown[0]);
  return [
    { title: `Peak day: ${best.day}`, body: `${best.day} shows the highest avg productivity at ${best.pct}%. Schedule deep-focus and high-priority work on this day.` },
    { title: `Watch ${worst.day}`, body: `${worst.day} has the lowest org-wide productivity at ${worst.pct}%. Consider reducing distractions or scheduling lighter tasks.` },
    { title: 'Monitor unproductive apps', body: 'Check the Tool Intelligence report to see top time-draining apps across your org.' },
  ].map((ins) => ({
    ...ins,
    titleColor: RT.green,
    bg: RT.greenSoft,
    border: RT.greenBorder,
    icon: <TrendingUp size={12} style={{ color: RT.green }} />,
  }));
}

export default function WorkPulseViz({ report, onDateChange, liveData = {} }) {
  const [view, setView] = useState(null);
  const dayBreakdown = liveData.dayBreakdown ?? [];
  const teamRhythm = deriveTeamRhythm(liveData.leaderboardTeams ?? []);
  const distractions = deriveDistractions(liveData.tools ?? []);
  const insightItems = deriveInsights(dayBreakdown);

  const heatmapValues = liveData.heatmapValues ?? { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [] };
  const heatmapHours = liveData.heatmapHours ?? ['8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM','6PM','7PM'];
  const hourlyAvg = heatmapHours.map((_, i) => {
    const vals = DAYS.map(d => heatmapValues[d]?.[i] ?? 0).filter(v => v > 0);
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  });

  const peakDay = dayBreakdown.length ? dayBreakdown.reduce((a, b) => (a.pct > b.pct ? a : b), dayBreakdown[0]) : null;
  const kpis = [
    { label: 'Peak Day', value: peakDay ? peakDay.day : '—', sub: peakDay ? `${peakDay.pct}% avg productivity` : 'Avg productivity per day' },
    { label: 'Top Distraction', value: distractions[0]?.name ?? 'None', sub: 'Most unproductive time' },
  ];

  return (
    <ReportShell report={{ ...report, kpis }} onDateChange={onDateChange}>
      <ReportCard
        title="Hourly Productivity Heatmap"
        subtitle="Hour-by-hour productivity data requires agent-level telemetry. Showing day-of-week breakdown below."
        actions={
          <>
            <CardActionButton active={view === 'team'} onClick={() => setView(view === 'team' ? null : 'team')}>By Team</CardActionButton>
            <CardActionButton active={view === 'person'} onClick={() => setView(view === 'person' ? null : 'person')}>By Person</CardActionButton>
          </>
        }
      >
        <ProductivityHeatmap hours={heatmapHours} days={DAYS} values={heatmapValues} />
      </ReportCard>

      <ReportGrid2 className="mb-3">
        <ReportCard title="Day-of-Week Breakdown" subtitle="Avg productive vs unproductive split by weekday" className="mb-0">
          {dayBreakdown.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-[11px] text-[#AAA]">No data for this period</div>
          ) : (
            <>
              {dayBreakdown.map((d) => (
                <div key={d.day} className="flex items-center gap-2 py-2 border-b border-black/[0.04] last:border-b-0">
                  <span className="text-[10.5px] font-semibold text-text-primary w-[30px] shrink-0">{d.day}</span>
                  <div className="flex-1 h-2.5 rounded-[5px] bg-[#F0F0E8] overflow-hidden relative">
                    <div className="h-full rounded-l-[5px]" style={{ width: `${d.pct}%`, background: RT.barGradient }} />
                    {d.unprod && (
                      <div className="absolute top-0 right-0 h-full bg-[rgba(15,110,86,.35)] rounded-r-[5px]" style={{ width: `${d.unprod}%` }} />
                    )}
                  </div>
                  <span className="text-[10px] font-bold w-9 text-right shrink-0" style={{ color: d.color }}>{d.pct}%</span>
                </div>
              ))}
              <div className="flex gap-3 mt-2.5">
                <span className="flex items-center gap-1 text-[9px] text-[#888]">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: RT.barGradient }} />
                  Productive
                </span>
                <span className="flex items-center gap-1 text-[9px] text-[#888]">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'rgba(8,80,65,0.35)' }} />
                  Unproductive surge
                </span>
              </div>
            </>
          )}
        </ReportCard>

        <ReportCard title="Team Rhythm Comparison" subtitle="Avg productivity score by team" className="mb-0">
          {teamRhythm.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-[11px] text-[#AAA]">No team data for this period</div>
          ) : (
            <div className="flex flex-col gap-3">
              {teamRhythm.map((t) => (
                <div key={t.name} className="flex items-center gap-2 py-1">
                  <span className="text-[10.5px] font-medium text-text-primary w-[88px] shrink-0">{t.name}</span>
                  <div className="flex-1 h-[9px] rounded-[5px] bg-[#F0F0E8] overflow-hidden">
                    <div
                      className="h-full rounded-[5px]"
                      style={{ width: `${t.pct}%`, background: t.barMuted ? 'rgba(8,80,65,0.45)' : RT.barGradient }}
                    />
                  </div>
                  <span className="text-[10.5px] font-bold w-9 text-right" style={{ color: t.color }}>{t.pct}%</span>
                </div>
              ))}
            </div>
          )}
        </ReportCard>
      </ReportGrid2>

      <ReportGrid2 className="mb-3">
        <ReportCard title="Average Productivity by Hour" subtitle="Avg productivity % per hour of day (Mon–Fri)" className="mb-0">
          <ProductivityHourChart data={hourlyAvg} labels={heatmapHours} height={200} pointRadius={2} strokeWidth={2} />
        </ReportCard>
        <ReportCard title="Top Distraction Sources" subtitle="Apps/sites consuming most unproductive time this period" className="mb-0" bodyClassName="py-3.5">
          {distractions.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-[11px] text-[#AAA]">No unproductive app data for this period</div>
          ) : (
            <div className="space-y-1.5">
              {distractions.map((d) => (
                <div key={d.name} className="flex items-center gap-2 px-2.5 py-1.5 rounded-[10px] bg-[#F8F8F5] border border-black/[0.04]">
                  <div className="w-[26px] h-[26px] rounded-[6px] shrink-0" style={{ background: d.color }} />
                  <span className="text-[10.5px] font-semibold text-text-primary flex-1">{d.name}</span>
                  <div className="flex-1 max-w-[100px] h-[5px] rounded-[3px] bg-[#F0F0E8] overflow-hidden">
                    <div className="h-full rounded-[3px]" style={{ width: `${d.pct}%`, background: RT.greenDark }} />
                  </div>
                  <span className="text-[10px] font-semibold shrink-0" style={{ color: RT.greenDark }}>{d.time}</span>
                  <span className="text-[9px] shrink-0 w-7 text-right" style={{ color: RT.green }}>{d.share}</span>
                </div>
              ))}
            </div>
          )}
        </ReportCard>
      </ReportGrid2>

      <ReportCard title="Auto-Generated Insights" subtitle="Pattern-based observations for this reporting period">
        {insightItems.length === 0 ? (
          <div className="flex items-center justify-center h-16 text-[11px] text-[#AAA]">Insights will appear once data is loaded</div>
        ) : (
          <ReportInsights items={insightItems} />
        )}
      </ReportCard>
    </ReportShell>
  );
}
