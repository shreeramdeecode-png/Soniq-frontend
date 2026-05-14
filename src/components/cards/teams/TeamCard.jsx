import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

const CHIP_VARIANTS = {
  work: 'bg-surface-muted text-text-primary',
  privacy: 'bg-[#FFF8E8] text-[#B8860B]',
  offline: 'bg-[#F5F5F5] text-[#999]',
};

const STATUS_VARIANTS = {
  active: { bg: 'bg-surface-subtle', color: 'text-text-muted', dotColor: '#16A34A' },
  attention: { bg: 'bg-[#FFF8E8]', color: 'text-[#B8860B]', dotColor: '#D97706' },
};

function LiveChip({ label, variant, dotColor }) {
  return (
    <div className={cn('flex items-center gap-1 py-1 px-2.5 rounded-[20px] text-xs font-medium', CHIP_VARIANTS[variant])}>
      <div className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: dotColor }} />
      {label}
    </div>
  );
}

export default function TeamCard({ team }) {
  const navigate = useNavigate();
  const statusStyle = STATUS_VARIANTS[team.status] || STATUS_VARIANTS.active;

  return (
    <div
      className="glossy-card cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg overflow-hidden"
      onClick={() => navigate(`/teams/${team.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/teams/${team.id}`)}
    >
      <div className="h-[5px] w-full" style={{ background: team.stripBg }} />

      <div className="p-[18px_18px_14px]">
        {/* Top row: avatar + name + status */}
        <div className="flex items-start justify-between mb-3.5">
          <div className="flex items-center gap-3">
            <div
              className="w-[44px] h-[44px] rounded-[14px] flex items-center justify-center text-xl font-bold shrink-0"
              style={{ background: team.avatarBg, color: team.avatarColor }}
            >
              {team.abbr}
            </div>
            <div>
              <div className="text-lg font-bold text-text-primary mb-0.5">{team.name}</div>
              <div className="text-xs text-text-lighter">
                {team.createdDate} · {team.memberCount} members
              </div>
            </div>
          </div>
          <div className={cn('flex items-center gap-[5px] py-1 px-2.5 rounded-[20px] text-xs font-semibold', statusStyle.bg, statusStyle.color)}>
            <div className="w-[5px] h-[5px] rounded-full" style={{ background: statusStyle.dotColor }} />
            {team.statusLabel}
          </div>
        </div>

        {/* Live status chips */}
        <div className="flex gap-1.5 mb-3.5 flex-wrap">
          {team.liveStatus.map((chip, i) => (
            <LiveChip key={i} {...chip} />
          ))}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-3.5">
          {team.stats.map((stat) => (
            <div key={stat.label} className="bg-[#F8F8F5] rounded-[10px] p-[9px_10px]">
              <div className="text-[16px] font-bold text-text-primary tracking-tight leading-none">
                {stat.value}
              </div>
              <div className="text-2xs text-text-light mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Productivity bar */}
        <div className="flex justify-between text-xs-plus mb-1">
          <span className="text-xs text-text-muted">Productivity score</span>
          <span className="text-xs font-semibold" style={{ color: team.prodValColor }}>
            {team.productivity}%
          </span>
        </div>
        <div className="h-[5px] bg-surface-muted rounded-[3px] overflow-hidden">
          <div
            className="h-full rounded-[3px]"
            style={{ width: `${team.productivity}%`, background: team.prodBarBg }}
          />
        </div>

        {/* Member avatars + view button */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/5">
          <div className="flex">
            {team.members.map((member, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold"
                style={{
                  background: member.bg,
                  color: member.color,
                  marginLeft: i > 0 ? '-6px' : 0,
                }}
              >
                {member.initials}
              </div>
            ))}
            <div
              className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold bg-surface-muted text-text-muted"
              style={{ marginLeft: '-6px' }}
            >
              +{team.moreCount}
            </div>
          </div>
          <div className="flex items-center gap-[5px] text-[11px] font-semibold text-text-primary cursor-pointer">
            View Team
            <ChevronRight size={12} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CreateTeamCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="border-2 border-dashed border-black/10 bg-white/40 rounded-card flex items-center justify-center min-h-[280px] cursor-pointer transition-all hover:bg-white/60 hover:border-primary/30"
    >
      <div className="text-center">
        <div className="w-12 h-12 rounded-[16px] bg-black/[0.06] flex items-center justify-center mx-auto mb-2.5">
          <Plus size={20} stroke="#AAA" strokeWidth={2} />
        </div>
        <div className="text-md font-semibold text-text-light">Create New Team</div>
        <div className="text-[11px] text-text-lighter mt-[3px]">Add a new team to your org</div>
      </div>
    </div>
  );
}
