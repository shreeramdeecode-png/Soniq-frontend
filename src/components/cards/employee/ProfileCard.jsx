import { Users } from 'lucide-react';
import { profileData } from '@/mock/employeeProfile';

function ProductivityGauge({ score }) {
  const circumference = 2 * Math.PI * 40;
  const dashArray = (score / 100) * circumference;
  const dashOffset = circumference * 0.25;

  return (
    <div className="relative w-[100px] h-[100px] mx-auto mt-3.5 mb-1.5">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="url(#gauge-gradient)"
          strokeWidth="10"
          strokeDasharray={`${dashArray} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <defs>
          <linearGradient id="gauge-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1D9E75" />
            <stop offset="100%" stopColor="#0F6E56" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-[22px] font-bold text-white leading-none">{score}</div>
        <div className="text-[8.5px] text-white/35 mt-px">/ 100</div>
      </div>
    </div>
  );
}

export default function ProfileCard() {
  const p = profileData;

  return (
    <div className="dark-card p-[22px] flex flex-col items-center text-center">
      {/* Avatar */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-[26px] font-bold mb-3 shadow-[0_4px_16px_rgba(29,158,117,0.4),0_1px_0_rgba(255,255,255,0.3)_inset]"
        style={{ background: p.avatarBg, color: p.avatarColor }}
      >
        {p.initials}
      </div>
      <div className="text-[17px] font-bold text-white tracking-tight">{p.name}</div>
      <div className="text-[11px] text-white/45 mt-0.5">{p.role}</div>

      {/* Team pill */}
      <div className="flex items-center gap-[5px] mt-1.5 py-1 px-3 rounded-[20px] bg-primary/[0.12] border border-primary/20">
        <Users size={10} stroke="#1D9E75" strokeWidth={2} />
        <span className="text-xs-plus text-primary-light font-medium">{p.team}</span>
      </div>

      {/* Live status */}
      <div className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-[20px] bg-white/[0.07] my-3 text-sm text-white font-medium">
        <span className="w-[7px] h-[7px] rounded-full bg-primary-light animate-pulse" />
        {p.status}
      </div>

      {/* Productivity gauge */}
      <ProductivityGauge score={p.productivityScore} />
      <div className="text-xs text-white/45 text-center mb-3">
        Productivity Score · {p.productivityLabel}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-white/[0.07] my-3" />

      {/* Info rows */}
      {p.info.map((row) => (
        <div key={row.label} className="flex items-center justify-between w-full py-[5px]">
          <span className="text-xs text-white/35">{row.label}</span>
          <span className={`text-[11px] font-medium ${row.highlight ? 'text-primary-light' : 'text-white/80'}`}>
            {row.value}
          </span>
        </div>
      ))}

      {/* Divider */}
      <div className="w-full h-px bg-white/[0.07] my-3" />

      {/* Current app */}
      <div className="w-full flex items-center justify-between">
        <span className="text-xs text-white/30">Current App</span>
        <div className="flex items-center gap-1.5">
          <div
            className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center text-[7px] font-bold border border-white/[0.08]"
            style={{ background: p.currentApp.iconBg, color: p.currentApp.iconColor }}
          >
            {p.currentApp.abbr}
          </div>
          <span className="text-[11px] text-white/70 font-medium">{p.currentApp.name}</span>
          <span className="text-2xs py-0.5 px-1.5 rounded-lg bg-primary/[0.12] text-primary-light font-semibold">
            {p.currentApp.category}
          </span>
        </div>
      </div>
    </div>
  );
}
