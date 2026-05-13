import { Plus, Edit3, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { settingsTeams } from '@/mock/settings';

function TeamCard({ team }) {
  return (
    <div className="glossy-card flex flex-col">
      <div className="p-4 flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-tile flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: team.bgColor, color: team.textColor }}
        >
          {team.init}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-text-primary truncate">{team.name}</h4>
          <p className="text-2xs-plus text-text-muted mt-0.5">{team.desc}</p>
        </div>
        <div className="relative w-12 h-12 shrink-0">
          <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#E5E5DC" strokeWidth="3" />
            <circle
              cx="24" cy="24" r="20" fill="none"
              stroke={team.ringColor} strokeWidth="3" strokeLinecap="round"
              strokeDasharray={team.ringDash}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-2xs font-bold text-text-primary">
            {team.members}
          </span>
        </div>
      </div>

      <div className="px-4 pb-3 flex items-center gap-4 text-2xs-plus text-text-muted">
        <span><span className="font-semibold text-text-secondary">{team.members}</span> Members</span>
        <span>
          Avg Score{' '}
          <span className="font-semibold" style={{ color: team.scoreColor }}>{team.score}%</span>
        </span>
      </div>

      <div className="border-t border-black/[0.05] px-4 py-2.5 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-2xs font-semibold text-primary bg-primary/10 rounded-pill px-2 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Active
        </span>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors cursor-pointer">
            <Edit3 size={12} className="text-text-muted" />
          </button>
          <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer">
            <Trash2 size={12} className="text-text-muted" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateTeamCard() {
  return (
    <button className="rounded-card border-2 border-dashed border-neutral-warm/60 flex flex-col items-center justify-center gap-2 min-h-[160px] hover:border-primary/40 hover:bg-primary/[0.03] transition-colors cursor-pointer">
      <div className="w-10 h-10 rounded-full border-2 border-dashed border-neutral-cool flex items-center justify-center">
        <Plus size={18} className="text-text-light" />
      </div>
      <span className="text-xs font-medium text-text-muted">Create New Team</span>
    </button>
  );
}

export default function TeamsDrawer() {
  return (
    <div className="p-5">
      <div className="grid grid-cols-3 gap-4">
        {settingsTeams.map((team) => (
          <TeamCard key={team.name} team={team} />
        ))}
        <CreateTeamCard />
      </div>
    </div>
  );
}
