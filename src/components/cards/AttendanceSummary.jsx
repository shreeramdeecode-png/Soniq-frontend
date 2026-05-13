import GlossyCard from '@/components/ui/GlossyCard';
import { attendanceData } from '@/mock/employeeProfile';

export default function AttendanceSummary() {
  const { tiles, monthlyPct, avgCheckIn, avgCheckOut, onTimeRate } = attendanceData;

  return (
    <GlossyCard className="p-4">
      <h4 className="text-md font-semibold text-text-primary mb-3.5">Attendance — This Month</h4>

      <div className="grid grid-cols-3 gap-2.5">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="rounded-tile p-3 text-center"
            style={{ background: tile.bg, border: tile.border }}
          >
            <div className="text-[20px] font-bold text-text-primary tracking-tight">{tile.value}</div>
            <div className="text-xs text-text-light mt-[3px]">{tile.label}</div>
          </div>
        ))}
      </div>

      {/* Monthly attendance progress */}
      <div className="mt-3.5">
        <div className="flex justify-between text-xs-plus text-text-muted mb-1">
          <span>Monthly attendance</span>
          <span className="font-semibold text-text-primary">{monthlyPct}%</span>
        </div>
        <div className="h-1.5 bg-surface-muted rounded-[3px] overflow-hidden">
          <div
            className="h-full rounded-[3px]"
            style={{ width: `${monthlyPct}%`, background: 'linear-gradient(90deg, #1D9E75, #0F6E56)' }}
          />
        </div>
      </div>

      {/* Stats rows */}
      <div className="mt-3">
        <div className="flex justify-between text-xs-plus text-text-muted mb-1">
          <span>Avg check-in time</span>
          <span className="font-semibold text-text-primary">{avgCheckIn}</span>
        </div>
        <div className="flex justify-between text-xs-plus text-text-muted mb-1 mt-1.5">
          <span>Avg check-out time</span>
          <span className="font-semibold text-text-primary">{avgCheckOut}</span>
        </div>
        <div className="flex justify-between text-xs-plus text-text-muted mt-1.5">
          <span>On-time rate</span>
          <span className="font-semibold text-primary-light">{onTimeRate}</span>
        </div>
      </div>
    </GlossyCard>
  );
}
