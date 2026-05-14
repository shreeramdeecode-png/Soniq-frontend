import { Users, EyeOff } from 'lucide-react';
import { employeeProfiles, selectedPerson } from '@/mock/screenshots';

export default function ScreenshotPersonHeader({ employeeId }) {
  const p = employeeProfiles[employeeId] || selectedPerson;

  return (
    <div className="glossy-card p-[16px_20px] flex items-center gap-4">
      {/* Avatar */}
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold shrink-0 shadow-[0_2px_8px_rgba(29,158,117,0.35)]"
        style={{ background: p.avatarBg, color: p.avatarColor }}
      >
        {p.initials}
      </div>

      {/* Name + meta */}
      <div>
        <div className="text-[16px] font-bold text-text-primary tracking-tight">{p.name}</div>
        <div className="flex items-center gap-2.5 mt-[3px]">
          <span className="flex items-center gap-1 text-xs-plus text-text-muted">
            <Users size={10} stroke="#AAA" strokeWidth={2} />
            {p.team}
          </span>
          <span className="w-[3px] h-[3px] rounded-full bg-[#DDD]" />
          <span className="flex items-center gap-1 text-xs-plus text-text-muted">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.statusDotColor }} />
            {p.status}
          </span>
          <span className="w-[3px] h-[3px] rounded-full bg-[#DDD]" />
          <span className="text-xs-plus text-text-muted">{p.os}</span>
          <span className="w-[3px] h-[3px] rounded-full bg-[#DDD]" />
          <span className="text-xs-plus text-text-muted">Last: {p.lastActive}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-5 ml-auto">
        {p.stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`text-[16px] font-bold tracking-tight ${stat.highlight ? 'text-primary-light' : 'text-text-primary'}`}>
              {stat.value}
            </div>
            <div className="text-2xs-plus text-text-light mt-px">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Blur toggle */}
      <div className="flex items-center gap-2 py-2 px-3.5 bg-[#F8F8F5] rounded-tile border border-black/[0.06] shrink-0">
        <div className="flex items-center gap-[5px] py-1 px-2.5 bg-primary/[0.12] border border-primary/25 rounded-[20px] text-xs font-semibold text-[#B8860B]">
          <EyeOff size={10} stroke="#B8860B" strokeWidth={2} />
          Blur: ON
        </div>
        <span className="text-xs text-text-light">Settings</span>
      </div>
    </div>
  );
}
