import { teams, ganttHours, currentTimePosition } from '@/mock/attendance';
import { cn } from '@/utils/cn';

const BLOCK_STYLES = {
  productive: 'bg-gradient-to-r from-primary-light to-primary',
  neutral: 'bg-gradient-to-r from-neutral-cool to-neutral-bone',
  unproductive: 'bg-gradient-to-r from-ink-mid to-ink',
  idle: 'bg-gradient-to-r from-[#E8D870] to-[#D8C860]',
  break: 'bg-gradient-to-r from-[#F0E8C8] to-[#E8D8A8]',
};

const hourPositions = [0, 9.09, 18.18, 27.27, 36.36, 45.45, 54.54, 63.63, 72.72, 81.81, 90.90];

function GanttBlock({ block }) {
  return (
    <div
      className={cn('absolute top-0 h-full rounded-[5px] cursor-pointer z-[5] transition-all hover:brightness-110 hover:scale-y-110 hover:z-[15] group/block', BLOCK_STYLES[block.type])}
      style={{ left: block.left, width: block.width }}
    >
      <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 bg-gradient-to-br from-ink to-[#252525] rounded-[14px] p-[13px_16px] z-50 shadow-[0_10px_30px_rgba(0,0,0,0.4)] border border-white/[0.08] whitespace-nowrap opacity-0 pointer-events-none transition-opacity group-hover/block:opacity-100 min-w-[200px]">
        <div className="flex items-center gap-2 mb-2.5 pb-[9px] border-b border-white/[0.07]">
          <span className="text-[12.5px] font-semibold text-white">{block.app}</span>
        </div>
        {block.time && (
          <div className="flex items-center justify-between gap-[22px] mb-[5px]">
            <span className="text-2xs-plus text-white/30">Time range</span>
            <span className="text-xs font-medium text-white/80">{block.time}</span>
          </div>
        )}
        <div className="flex items-center justify-between gap-[22px]">
          <span className="text-2xs-plus text-white/30">Duration</span>
          <span className="text-xs font-bold text-primary-light">{block.dur}</span>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[7px] border-transparent border-t-ink" />
      </div>
    </div>
  );
}

function EmployeeRow({ emp }) {
  return (
    <div className="grid grid-cols-[190px_1fr] border-b border-black/[0.04] last:border-b-0 group/row">
      {/* Left: employee info */}
      <div className="flex items-center gap-2 py-2 px-3 border-r border-black/[0.06] cursor-pointer group-hover/row:bg-primary/[0.03] transition-colors">
        <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-2xs font-bold shrink-0" style={{ background: emp.avatarBg, color: emp.avatarColor }}>
          {emp.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs-plus font-semibold text-text-primary whitespace-nowrap overflow-hidden text-ellipsis">{emp.name}</div>
          <div className="text-2xs text-text-light" style={{ color: emp.ganttSubtextColor }}>{emp.ganttSubtext}</div>
        </div>
        <div className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: emp.dotColor }} />
      </div>

      {/* Right: gantt bar */}
      <div className="relative h-[42px] flex items-center py-1.5 group-hover/row:bg-primary/[0.01] transition-colors">
        <div className="relative w-full h-[26px]">
          {/* Hour grid lines */}
          {hourPositions.map((pos) => (
            <div key={pos} className="absolute top-0 bottom-0 w-px bg-black/5 z-[1]" style={{ left: `${pos}%` }} />
          ))}
          {/* Current time line */}
          <div className="absolute top-[-3px] bottom-[-3px] w-0.5 rounded-[1px] z-[20]" style={{ left: currentTimePosition, background: 'linear-gradient(180deg, #1D9E75, rgba(29,158,117,0.3))' }} />
          {/* Shift start */}
          <div className="absolute top-[-4px] bottom-[-4px] w-[2.5px] bg-ink rounded-[1px] z-10" style={{ left: '9.09%' }} />

          {/* Late gap */}
          {emp.lateGap && (
            <div className="absolute top-0 h-full rounded-[3px] bg-[rgba(217,119,6,0.08)] border-l-2 border-[rgba(217,119,6,0.3)]" style={{ left: emp.lateGap.left, width: emp.lateGap.width }} />
          )}

          {/* Absent state */}
          {emp.absent ? (
            <div className="w-full h-full rounded flex items-center pl-2.5" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(0,0,0,0.025) 6px, rgba(0,0,0,0.025) 12px)' }}>
              <span className="text-2xs-plus text-[#CCC] font-medium">No activity — Absent</span>
            </div>
          ) : (
            emp.ganttBlocks.map((block, i) => (
              <GanttBlock key={i} block={block} />
            ))
          )}

          {/* Shift end */}
          {!emp.absent && (
            <div className="absolute top-[-4px] bottom-[-4px] border-l-[2.5px] border-dashed border-[rgba(100,100,100,0.5)] z-10" style={{ left: '81.81%' }} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function AttendanceGantt() {
  return (
    <div className="mx-8 mb-7 glossy-card rounded-[20px] overflow-hidden">
      {/* Header row with time axis */}
      <div className="grid grid-cols-[190px_1fr] border-b border-black/[0.06]">
        <div className="py-3 px-4 text-2xs font-semibold text-text-light uppercase tracking-wide border-r border-black/[0.06] bg-[rgba(248,248,245,0.9)]">
          Employee
        </div>
        <div className="bg-[rgba(248,248,245,0.9)] relative">
          {/* Now label */}
          <div className="absolute top-1.5 z-30 -translate-x-1/2 bg-primary rounded-[6px] py-0.5 px-1.5 text-[8px] font-bold text-white whitespace-nowrap shadow-[0_2px_6px_rgba(29,158,117,0.4)]" style={{ left: currentTimePosition }}>
            Now 2:41 PM
          </div>
          <div className="flex h-[42px] relative">
            {ganttHours.map((hour) => (
              <div key={hour} className="flex-1 flex flex-col justify-end pb-1.5 pl-1 border-l border-black/[0.06]">
                <span className="text-2xs-plus font-semibold text-text-muted">{hour}</span>
              </div>
            ))}
            <div className="absolute right-0 bottom-1.5 text-2xs-plus font-semibold text-text-muted pr-1">7 PM</div>
          </div>
        </div>
      </div>

      {/* Team groups + employee rows */}
      {teams.map((team) => (
        <div key={team.name}>
          {/* Team header */}
          <div className="grid grid-cols-[190px_1fr] border-b border-primary/[0.1]">
            <div className="py-[7px] px-3.5 bg-primary/[0.05] border-r border-black/[0.06] flex items-center gap-[7px]">
              <span className="text-2xs-plus font-bold text-[#0F6E56] uppercase tracking-wider">{team.name}</span>
              <span className="text-2xs font-semibold bg-primary/[0.12] text-[#0F6E56] py-px px-[7px] rounded-[10px]">{team.present} present</span>
            </div>
            <div className="bg-primary/[0.02] relative h-[26px]">
              <div className="absolute top-0 bottom-0 w-0.5 rounded-[1px] z-[20]" style={{ left: currentTimePosition, background: 'linear-gradient(180deg, #1D9E75, rgba(29,158,117,0.3))' }} />
            </div>
          </div>

          {/* Employee rows */}
          {team.employees.map((emp) => (
            <EmployeeRow key={emp.id} emp={emp} />
          ))}
        </div>
      ))}
    </div>
  );
}
