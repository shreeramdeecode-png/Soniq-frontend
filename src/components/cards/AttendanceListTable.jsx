import { teams } from '@/mock/attendance';
import { Users } from 'lucide-react';
import { cn } from '@/utils/cn';

const SEG_STYLES = {
  productive: 'bg-gradient-to-r from-primary-light to-primary',
  neutral: 'bg-gradient-to-r from-neutral-cool to-neutral-bone',
  unproductive: 'bg-gradient-to-r from-ink-mid to-ink',
  idle: 'bg-gradient-to-r from-[#E8D870] to-[#D8C860]',
  away: 'bg-gradient-to-r from-[#E0E0D8] to-[#D0D0C8]',
  break: 'bg-gradient-to-r from-[#F0E8C8] to-[#E8D8A8]',
};

const STATUS_STYLES = {
  present: 'bg-primary/10 text-[#0F6E56] border border-primary/20',
  absent: 'bg-[#FFF5F5] text-[#CC4444] border border-[rgba(204,68,68,0.15)]',
  late: 'bg-[#FFF8E8] text-[#D97706] border border-[rgba(217,119,6,0.2)]',
};

const SCORE_STYLES = {
  high: 'bg-primary/[0.12] text-[#0F6E56] border border-primary/20',
  med: 'bg-surface-muted text-text-muted',
  low: 'bg-[#FFF5F5] text-[#CC4444]',
};

function TimelineBar({ segments }) {
  if (!segments.length) {
    return (
      <div className="relative h-7 rounded-[6px] overflow-hidden" style={{ background: 'repeating-linear-gradient(45deg, #F5F5F0, #F5F5F0 4px, #EEEEE8 4px, #EEEEE8 10px)' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-[#CCC] font-medium">No activity recorded</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-7 bg-surface-muted rounded-[6px] overflow-visible group">
      <div className="absolute top-[-4px] bottom-[-4px] w-[2px] bg-ink rounded-[1px] z-[2]" style={{ left: '0%' }} />
      {segments.map((seg, i) => (
        <div key={i} className="absolute top-0 h-full" style={{ left: seg.left, width: seg.width }}>
          <div className={cn('w-full h-full rounded-[3px] cursor-pointer transition-all hover:opacity-80 hover:brightness-110', SEG_STYLES[seg.type])} />
        </div>
      ))}
      <div className="absolute top-[-4px] bottom-[-4px] border-l-2 border-dashed border-text-muted/40 z-[2]" style={{ left: '75%' }} />
    </div>
  );
}

export default function AttendanceListTable() {
  return (
    <div className="px-8 pb-6">
      <div className="glossy-card overflow-hidden rounded-card">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[rgba(248,248,245,0.8)]">
              <th className="text-2xs-plus font-semibold text-text-light uppercase tracking-wide py-2.5 px-3.5 text-left w-[190px]">Employee</th>
              <th className="text-2xs-plus font-semibold text-text-light uppercase tracking-wide py-2.5 px-3.5 text-left w-[84px]">Status</th>
              <th className="text-2xs-plus font-semibold text-text-light uppercase tracking-wide py-2.5 px-3.5 text-left w-[80px]">Shift</th>
              <th className="text-2xs-plus font-semibold text-text-light uppercase tracking-wide py-2.5 px-3.5 text-left w-[340px]">Activity Timeline (8AM → 7PM)</th>
              <th className="text-2xs-plus font-semibold text-text-light uppercase tracking-wide py-2.5 px-3.5 text-left w-[72px]">Check In</th>
              <th className="text-2xs-plus font-semibold text-text-light uppercase tracking-wide py-2.5 px-3.5 text-left w-[72px]">Check Out</th>
              <th className="text-2xs-plus font-semibold text-text-light uppercase tracking-wide py-2.5 px-3.5 text-left w-[70px]">Total Hrs</th>
              <th className="text-2xs-plus font-semibold text-text-light uppercase tracking-wide py-2.5 px-3.5 text-left w-[68px]">Productive</th>
              <th className="text-2xs-plus font-semibold text-text-light uppercase tracking-wide py-2.5 px-3.5 text-left w-[56px]">Score</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <TeamSection key={team.name} team={team} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TeamSection({ team }) {
  return (
    <>
      <tr>
        <td colSpan={9} className="py-2 px-4 bg-primary/[0.05] border-b border-primary/[0.1]">
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#0F6E56] uppercase tracking-wider">
            <Users size={12} stroke="#0F6E56" strokeWidth={2} />
            {team.name} — {team.totalMembers} members · {team.present} present
          </div>
        </td>
      </tr>
      {team.employees.map((emp) => (
        <tr key={emp.id} className="hover:bg-primary/[0.02] transition-colors">
          <td className="py-2.5 px-3.5 border-b border-black/[0.04]">
            <div className="flex items-center gap-[9px]">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-2xs-plus font-bold shrink-0" style={{ background: emp.avatarBg, color: emp.avatarColor }}>
                {emp.initials}
              </div>
              <div>
                <div className="text-sm font-semibold text-text-primary">{emp.name}</div>
                <div className="text-2xs-plus text-text-light">{emp.role}</div>
              </div>
            </div>
          </td>
          <td className="py-2.5 px-3.5 border-b border-black/[0.04]">
            <span className={cn('inline-flex items-center gap-1 py-[3px] px-[9px] rounded-[20px] text-xs font-semibold whitespace-nowrap', STATUS_STYLES[emp.status])}>
              {emp.statusLabel}
            </span>
          </td>
          <td className="py-2.5 px-3.5 border-b border-black/[0.04] text-xs text-text-muted leading-tight whitespace-pre-line">
            {emp.shift}
          </td>
          <td className="py-2.5 px-3.5 border-b border-black/[0.04]">
            <TimelineBar segments={emp.segments} />
          </td>
          <td className="py-2.5 px-3.5 border-b border-black/[0.04]">
            <div className="text-[11px] font-semibold text-text-primary">{emp.checkIn}</div>
            <div className="text-2xs-plus text-text-light">{emp.checkInSub}</div>
          </td>
          <td className="py-2.5 px-3.5 border-b border-black/[0.04]">
            <div className="text-[11px] font-semibold" style={{ color: emp.checkOutColor }}>{emp.checkOut}</div>
          </td>
          <td className="py-2.5 px-3.5 border-b border-black/[0.04] text-[11px] font-semibold text-text-primary">{emp.totalHrs}</td>
          <td className="py-2.5 px-3.5 border-b border-black/[0.04] text-[11px] font-semibold text-text-primary">{emp.productive}</td>
          <td className="py-2.5 px-3.5 border-b border-black/[0.04]">
            <span className={cn('inline-flex py-0.5 px-2 rounded-lg text-xs font-bold', SCORE_STYLES[emp.scoreClass])}>
              {emp.score}
            </span>
          </td>
        </tr>
      ))}
    </>
  );
}
