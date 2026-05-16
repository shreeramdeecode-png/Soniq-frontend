import { cn } from '@/utils/cn';
import { attendanceCalData } from '@/mock/reports';
import ReportShell from './shared/ReportShell';
import { ReportCard } from './shared/ReportCard';
import { ReportGrid2, ReportGrid3 } from './shared/ReportGrids';
import ReportLineChart from './shared/ReportLineChart';
import ReportBarChart from './shared/ReportBarChart';
import ReportInsights from './shared/ReportInsights';
import EmployeeCell from './shared/EmployeeCell';
import { RT } from './shared/reportTheme';

const STATUS_COLORS = {
  present: RT.green,
  absent: RT.greenDeep,
  late: RT.greenLight,
};

const ABSENCE_BAR_COLORS = [
  'rgba(15,110,86,0.6)',
  'rgba(15,110,86,0.4)',
  'rgba(15,110,86,0.4)',
  'rgba(15,110,86,0.4)',
  'rgba(15,110,86,0.45)',
];

export default function AttendanceViz({ report, onDateChange }) {
  const {
    days, cells, statuses, lateDistribution, dailyRate, dailyRateLabels, absenceByDay, offenders, attendanceInsights,
  } = attendanceCalData;

  return (
    <ReportShell report={report} onDateChange={onDateChange}>
      <ReportGrid3 className="mb-3">
        <ReportCard title="Daily Attendance Rate" subtitle="Present % across Apr 1–21" className="mb-0">
          <ReportLineChart
            data={dailyRate}
            labels={dailyRateLabels}
            height={180}
            min={80}
            max={100}
            yTickStep={5}
            color={RT.greenDark}
            fillColor="rgba(15,110,86,0.08)"
          />
        </ReportCard>
        <ReportCard title="Late Arrivals by Duration" subtitle="How late employees arrive (distribution)" className="mb-0">
          <ReportBarChart
            data={lateDistribution.map((d) => d.count)}
            labels={lateDistribution.map((d) => d.range)}
            colors={lateDistribution.map((d) => d.color)}
            height={180}
            max={32}
          />
        </ReportCard>
        <ReportCard title="Absence by Day of Week" subtitle="Which days see the most no-shows" className="mb-0">
          <ReportBarChart
            data={absenceByDay.map((d) => d.count)}
            labels={absenceByDay.map((d) => d.day)}
            colors={ABSENCE_BAR_COLORS}
            height={180}
            max={16}
          />
        </ReportCard>
      </ReportGrid3>

      <ReportCard
        title="Habitual Patterns — Repeat Offenders"
        subtitle="Employees with 3+ late arrivals or 2+ unexplained absences in this period"
        actions={
          <span className="text-[9px] font-semibold px-2.5 py-1 bg-[#F0F9F4] text-[#085041] rounded-lg border border-[rgba(15,110,86,.15)]">
            Needs HR attention
          </span>
        }
        bodyClassName="p-0"
        className="mb-3"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="bg-black/[0.02] border-b border-black/5">
                {['Employee', 'Team', 'Late Arrivals', 'Avg Delay', 'Worst Day Pattern', 'Early Exits', 'Absences', 'Absence Streak', 'Last 21 Days', 'Risk Flag'].map((h) => (
                  <th key={h} className="py-2.5 px-3 text-[9px] font-bold text-text-light uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {offenders.map((row) => (
                <tr key={row.init} className="border-b border-black/[0.04] last:border-b-0">
                  <td className="py-2.5 px-3">
                    <EmployeeCell
                      init={row.init}
                      name={row.name}
                      role={row.role}
                      avatarStyle={{ background: row.risk.includes('High') ? 'rgba(15,110,86,.12)' : 'rgba(29,158,117,.15)', color: row.risk.includes('High') ? RT.danger : RT.warn }}
                    />
                  </td>
                  <td className="px-3 text-text-muted">{row.team}</td>
                  <td className="px-3 font-bold" style={{ color: RT.danger }}>{row.lates}</td>
                  <td className="px-3" style={{ color: row.risk.includes('High') ? RT.danger : RT.warn }}>{row.delay}</td>
                  <td className="px-3">{row.pattern}</td>
                  <td className="px-3" style={{ color: RT.warn }}>{row.earlyExits}</td>
                  <td className="px-3">{row.absences}</td>
                  <td className="px-3">{row.streak}</td>
                  <td className="px-3">
                    <div className="flex gap-[2px] flex-wrap max-w-[140px]">
                      {row.pips.slice(0, 21).map((c, i) => (
                        <span key={i} className="w-[5px] h-[5px] rounded-[1px]" style={{ background: c }} />
                      ))}
                    </div>
                  </td>
                  <td className="px-3">
                    <span className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-lg border',
                      row.risk.includes('High') ? 'bg-[rgba(15,110,86,.1)] text-[#085041] border-[rgba(15,110,86,.2)]' : 'bg-[rgba(29,158,117,.1)] text-[#085041] border-[rgba(29,158,117,.25)]',
                    )}>
                      {row.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ReportCard>

      <ReportGrid2 className="mb-3">
        <ReportCard title="April 2026 — Org Attendance Calendar" subtitle="Colour coded by status · sample week view" className="mb-0">
          <div className="grid grid-cols-7 gap-1 max-w-md">
            {days.map((d, i) => (
              <div key={`${d}-${i}`} className="text-[10px] font-bold text-text-light text-center pb-1">{d}</div>
            ))}
            {cells.map((cell, i) => {
              const status = cell ? statuses[+cell] : null;
              const bg = status ? STATUS_COLORS[status] : (cell ? 'rgba(0,0,0,.04)' : 'transparent');
              return (
                <div key={i} className="h-6 rounded-[5px] flex items-center justify-center" style={{ background: bg, opacity: status ? 0.85 : 1 }}>
                  {cell && <span className="text-[9px] font-semibold text-white/80">{cell}</span>}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-5 mt-3">
            {[
              { color: STATUS_COLORS.present, label: 'Present' },
              { color: STATUS_COLORS.absent, label: 'Absent' },
              { color: STATUS_COLORS.late, label: 'Late' },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1.5 text-[10px] text-text-muted">
                <span className="w-2.5 h-2.5 rounded-sm opacity-85" style={{ background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        </ReportCard>
        <ReportCard title="Attendance Insights" subtitle="Pattern-based observations for Apr 1–21" className="mb-0" bodyClassName="py-3">
          <ReportInsights items={attendanceInsights} />
        </ReportCard>
      </ReportGrid2>
    </ReportShell>
  );
}
