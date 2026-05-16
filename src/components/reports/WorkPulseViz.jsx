import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { heatmapData } from '@/mock/reports';
import ReportShell from './shared/ReportShell';
import { ReportCard, CardActionButton } from './shared/ReportCard';
import { ReportGrid2 } from './shared/ReportGrids';
import ProductivityHeatmap from './shared/ProductivityHeatmap';
import ProductivityHourChart from './shared/ProductivityHourChart';
import ReportInsights from './shared/ReportInsights';
import { RT } from './shared/reportTheme';

export default function WorkPulseViz({ report, onDateChange }) {
  const [view, setView] = useState(null);
  const {
    hours, hourChartLabels, days, values, teamValues, personValues,
    distractions, hourlyTrend, dayBreakdown, teamRhythm, insights,
  } = heatmapData;

  const heatmapValues =
    view === 'team' ? teamValues : view === 'person' ? personValues : values;

  const insightItems = insights.map((ins) => ({
    ...ins,
    titleColor: RT.green,
    bg: ins.bg?.includes('F0F9F4') || ins.bg?.includes('EAF2EE') ? ins.bg : RT.greenSoft,
    border: RT.greenBorder,
    icon: <TrendingUp size={12} style={{ color: RT.green }} />,
  }));

  return (
    <ReportShell report={report} onDateChange={onDateChange}>
      <ReportCard
        title="Hourly Productivity Heatmap — Apr 1–21"
        subtitle="Each cell = avg productivity score for that hour across all employees. Darker = higher. Hover for details."
        actions={
          <>
            <CardActionButton active={view === 'team'} onClick={() => setView(view === 'team' ? null : 'team')}>By Team</CardActionButton>
            <CardActionButton active={view === 'person'} onClick={() => setView(view === 'person' ? null : 'person')}>By Person</CardActionButton>
          </>
        }
      >
        <ProductivityHeatmap hours={hours} days={days} values={heatmapValues} />
      </ReportCard>

      <ReportGrid2 className="mb-3">
        <ReportCard title="Day-of-Week Breakdown" subtitle="Avg productive vs unproductive split by weekday" className="mb-0">
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
        </ReportCard>

        <ReportCard title="Team Rhythm Comparison" subtitle="Avg peak-hour productivity score by team" className="mb-0">
          <div className="flex flex-col gap-3">
            {teamRhythm.map((t) => (
              <div key={t.name} className="flex items-center gap-2 py-1">
                <span className="text-[10.5px] font-medium text-text-primary w-[88px] shrink-0">{t.name}</span>
                <div className="flex-1 h-[9px] rounded-[5px] bg-[#F0F0E8] overflow-hidden">
                  <div
                    className="h-full rounded-[5px]"
                    style={{
                      width: `${t.pct}%`,
                      background: t.barMuted ? 'rgba(8,80,65,0.45)' : RT.barGradient,
                    }}
                  />
                </div>
                <span className="text-[10.5px] font-bold w-9 text-right" style={{ color: t.color }}>{t.pct}%</span>
              </div>
            ))}
            <div className="mt-3 px-2.5 py-2 rounded-[10px] border" style={{ background: RT.greenPale, borderColor: RT.greenBorder }}>
              <div className="text-[9.5px] font-semibold mb-0.5" style={{ color: RT.green }}>Insight</div>
              <p className="text-[9.5px] text-[#888] leading-relaxed">
                Sales team shows a 2:30–4:30 PM dead zone. Consider shifting non-client work to morning blocks.
              </p>
            </div>
          </div>
        </ReportCard>
      </ReportGrid2>

      <ReportGrid2 className="mb-3">
        <ReportCard title="Average Productivity by Hour" subtitle="Org-wide average across Apr 1–21" className="mb-0">
          <ProductivityHourChart
            data={hourlyTrend}
            labels={hourChartLabels ?? hours}
            height={200}
          />
        </ReportCard>
        <ReportCard title="Top Distraction Sources" subtitle="Apps/sites consuming most unproductive time this period" className="mb-0" bodyClassName="py-3.5">
          <div className="space-y-1.5">
            {distractions.map((d) => (
              <div key={d.name} className="flex items-center gap-2 px-2.5 py-1.5 rounded-[10px] bg-[#F8F8F5] border border-black/[0.04]">
                <div className="w-[26px] h-[26px] rounded-[6px] shrink-0" style={{ background: d.color }} />
                <span className="text-[10.5px] font-semibold text-text-primary flex-1">{d.name}</span>
                <div className="flex-1 max-w-[100px] h-[5px] rounded-[3px] bg-[#F0F0E8] overflow-hidden">
                  <div className="h-full rounded-[3px]" style={{ width: `${d.pct}%`, background: d.barColor ?? RT.greenDark }} />
                </div>
                <span className="text-[10px] font-semibold shrink-0" style={{ color: RT.greenDark }}>{d.time}</span>
                <span className="text-[9px] shrink-0 w-7 text-right" style={{ color: d.barColor ?? RT.green }}>{d.share}</span>
              </div>
            ))}
          </div>
        </ReportCard>
      </ReportGrid2>

      <ReportCard title="Auto-Generated Insights" subtitle="Pattern-based observations for this reporting period">
        <ReportInsights items={insightItems} />
      </ReportCard>
    </ReportShell>
  );
}
