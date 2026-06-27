import { cn } from '@/utils/cn';
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

const LATE_DOW_COLORS = ['rgba(15,110,86,0.45)', 'rgba(15,110,86,0.55)', 'rgba(15,110,86,0.65)', 'rgba(15,110,86,0.75)', '#085041'];
const DOW_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function deriveAbsenceByDay(labels = [], rates = []) {
  const dayMap = {};
  labels.forEach((lbl, i) => {
    const d = lbl.slice(0, 3);
    if (!dayMap[d]) dayMap[d] = { total: 0, absent: 0 };
    dayMap[d].total++;
    if ((rates[i] ?? 100) < 100) dayMap[d].absent++;
  });
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d) => ({
    day: d,
    count: dayMap[d]?.absent ?? 0,
  }));
}

function deriveAttendanceInsights(dailyRate = []) {
  if (!dailyRate.length) return [];
  const avg = Math.round(dailyRate.reduce((s, v) => s + v, 0) / dailyRate.length);
  const min = Math.min(...dailyRate);
  const max = Math.max(...dailyRate);
  return [
    {
      title: `Avg attendance: ${avg}%`,
      body: `Organisation averaged ${avg}% attendance over the selected period. ${avg >= 90 ? 'This is a strong result — keep celebrating punctuality.' : 'Consider investigating absenteeism patterns and running manager check-ins.'}`,
      titleColor: RT.green, bg: RT.greenSoft, border: RT.greenBorder,
    },
    {
      title: `Range: ${min}% – ${max}%`,
      body: `Attendance ranged from ${min}% (worst day) to ${max}% (best day). ${max - min > 15 ? 'High volatility detected — review days below 85% for patterns.' : 'Variance is within acceptable bounds.'}`,
      titleColor: RT.green, bg: RT.greenSoft, border: RT.greenBorder,
    },
  ];
}

export default function AttendanceViz({ report, onDateChange, liveData = {} }) {
  const dailyRate = liveData.attendanceDailyRate ?? [];
  const dailyRateLabels = liveData.attendanceDailyRateLabels ?? [];
  const lateByDow = liveData.lateByDow ?? [{ day: 'Mon', count: 0 }, { day: 'Tue', count: 0 }, { day: 'Wed', count: 0 }, { day: 'Thu', count: 0 }, { day: 'Fri', count: 0 }];
  const habitualOffenders = liveData.habitualOffenders ?? [];
  const absenceByDay = deriveAbsenceByDay(dailyRateLabels, dailyRate);
  const attendanceInsights = deriveAttendanceInsights(dailyRate);

  // Live KPI tiles
  const avgAttendance = dailyRate.length ? Math.round(dailyRate.reduce((s, v) => s + v, 0) / dailyRate.length) : null;
  const worstAbsence = absenceByDay.reduce((a, b) => (b.count > (a?.count ?? -1) ? b : a), null);
  const kpis = [
    { label: 'Attendance Rate', value: avgAttendance != null ? `${avgAttendance}%` : '—', sub: 'Avg across period' },
    { label: 'Absences by Day', value: worstAbsence && worstAbsence.count > 0 ? worstAbsence.day : 'None', sub: 'Most no-shows' },
  ];

  // Build a simple current-month calendar from liveData rate
  const now = new Date();
  const calYear = now.getFullYear();
  const calMonth = now.getMonth();
  const calDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const firstDow = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calCells = Array(firstDow).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  // Map daily rate labels (day-of-week names) to simple presence indicator
  const avgRate = dailyRate.length ? Math.round(dailyRate.reduce((s, v) => s + v, 0) / dailyRate.length) : 0;

  return (
    <ReportShell report={{ ...report, kpis }} onDateChange={onDateChange}>
      <ReportGrid3 className="mb-3">
        <ReportCard title="Daily Attendance Rate" subtitle="Present % across selected period" className="mb-0">
          {dailyRate.length === 0 ? (
            <div className="flex items-center justify-center h-44 text-[11px] text-[#AAA]">No attendance data for this period</div>
          ) : (
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
          )}
        </ReportCard>
        <ReportCard title="Late Arrivals by Day of Week" subtitle="Total late check-ins per weekday across selected period" className="mb-0">
          <ReportBarChart
            data={lateByDow.map((d) => d.count)}
            labels={lateByDow.map((d) => d.day)}
            colors={LATE_DOW_COLORS}
            height={180}
            max={Math.max(...lateByDow.map((d) => d.count), 5)}
          />
        </ReportCard>
        <ReportCard title="Absence by Day of Week" subtitle="Which days see the most no-shows" className="mb-0">
          <ReportBarChart
            data={absenceByDay.map((d) => d.count)}
            labels={absenceByDay.map((d) => d.day)}
            colors={ABSENCE_BAR_COLORS}
            height={180}
            max={Math.max(...absenceByDay.map((d) => d.count), 5)}
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
              {habitualOffenders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-[11px] text-[#AAA]">
                    No habitual offenders this period — attendance patterns look good
                  </td>
                </tr>
              ) : (
                habitualOffenders.map((e) => (
                  <tr key={`${e.init}-${e.name}`} className="border-b border-black/[0.04] last:border-b-0 hover:bg-primary/[0.02]">
                    <td className="py-2.5 px-3">
                      <EmployeeCell init={e.init} name={e.name} role={e.designation} avatarStyle={{ background: 'rgba(15,110,86,.12)', color: RT.green }} />
                    </td>
                    <td className="px-3 text-text-muted">{e.team}</td>
                    <td className="px-3 font-bold" style={{ color: e.lateDays >= 5 ? RT.danger : RT.greenDark }}>{e.lateDays}</td>
                    <td className="px-3 text-text-secondary">—</td>
                    <td className="px-3 text-text-secondary">{e.worstDay}</td>
                    <td className="px-3 text-text-secondary">—</td>
                    <td className="px-3 font-bold" style={{ color: e.absentDays >= 4 ? RT.danger : RT.greenDark }}>{e.absentDays}</td>
                    <td className="px-3 font-bold" style={{ color: e.maxStreak >= 3 ? RT.danger : undefined }}>{e.maxStreak}d</td>
                    <td className="px-3 text-text-secondary">—</td>
                    <td className="px-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg border"
                        style={{ background: e.risk === 'High' ? 'rgba(15,110,86,.1)' : 'rgba(29,158,117,.1)', color: '#085041', borderColor: 'rgba(15,110,86,.2)' }}>
                        {e.risk}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ReportCard>

      <ReportGrid2 className="mb-3">
        <ReportCard title={`${now.toLocaleString('default', { month: 'long' })} ${calYear} — Org Attendance Calendar`} subtitle="Colour coded by avg org attendance rate" className="mb-0">
          <div className="grid grid-cols-7 gap-1 max-w-md">
            {calDays.map((d) => (
              <div key={d} className="text-[10px] font-bold text-text-light text-center pb-1">{d}</div>
            ))}
            {calCells.map((cell, i) => {
              const dow = (firstDow + (cell ? cell - 1 : 0)) % 7;
              const isWeekend = dow === 0 || dow === 6;
              const bg = !cell ? 'transparent' : isWeekend ? 'rgba(0,0,0,.03)' : avgRate >= 90 ? STATUS_COLORS.present : avgRate >= 75 ? STATUS_COLORS.late : STATUS_COLORS.absent;
              return (
                <div key={i} className="h-6 rounded-[5px] flex items-center justify-center" style={{ background: bg, opacity: cell ? 0.85 : 1 }}>
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
        <ReportCard title="Attendance Insights" subtitle="Pattern-based observations for selected period" className="mb-0" bodyClassName="py-3">
          {attendanceInsights.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-[11px] text-[#AAA]">Insights will appear once data is loaded</div>
          ) : (
            <ReportInsights items={attendanceInsights} />
          )}
        </ReportCard>
      </ReportGrid2>
    </ReportShell>
  );
}
