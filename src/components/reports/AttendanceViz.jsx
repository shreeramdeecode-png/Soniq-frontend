import { cn } from '@/utils/cn';
import { attendanceCalData } from '@/mock/reports';

const STATUS_COLORS = {
  present: 'rgba(15,110,86,.7)',
  absent: 'rgba(153,53,53,.6)',
  late: 'rgba(184,134,11,.65)',
};

export default function AttendanceViz() {
  const { days, cells, statuses, lateDistribution } = attendanceCalData;
  const maxLate = Math.max(...lateDistribution.map((d) => d.count));

  return (
    <div className="space-y-5">
      {/* Calendar */}
      <div>
        <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">April 2026 — Attendance Calendar</div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => (
            <div key={d} className="text-xs font-bold text-text-light text-center pb-1.5">{d}</div>
          ))}
          {cells.map((cell, i) => {
            const status = cell ? statuses[+cell] : null;
            const bg = status ? STATUS_COLORS[status] : (cell ? 'rgba(0,0,0,.03)' : 'transparent');
            return (
              <div
                key={i}
                className="h-6 rounded-[5px] flex items-center justify-center"
                style={{ background: bg }}
              >
                {cell && <span className="text-2xs font-semibold text-white/70">{cell}</span>}
              </div>
            );
          })}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-5 mt-3">
          {[
            { color: STATUS_COLORS.present, label: 'Present' },
            { color: STATUS_COLORS.absent, label: 'Absent' },
            { color: STATUS_COLORS.late, label: 'Late' },
          ].map((l) => (
            <span key={l.label} className="flex items-center gap-2 text-xs text-text-muted">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      {/* Late distribution bar chart */}
      <div>
        <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Late Arrival Distribution (Apr 1–21)</div>
        <div className="flex items-end gap-2 h-[140px] bg-surface-subtle rounded-[14px] p-4">
          {lateDistribution.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
              <span className="text-xs font-bold text-text-muted">{d.count}</span>
              <div
                className="w-full rounded-t-[5px] transition-all hover:opacity-80"
                style={{
                  height: `${(d.count / maxLate) * 85}%`,
                  background: d.color,
                }}
              />
              <span className="text-2xs text-text-light font-medium whitespace-nowrap">{d.range}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
