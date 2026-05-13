import { cn } from '@/utils/cn';
import { leaderboardData } from '@/mock/reports';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardViz() {
  const { teams, employees } = leaderboardData;

  return (
    <div className="space-y-5">
      {/* Team podium */}
      <div className="grid grid-cols-5 gap-3">
        {teams.map((t, i) => (
          <div key={t.name} className="bg-white/80 border border-black/[0.07] rounded-[14px] p-4 text-center">
            <div className="text-xl font-extrabold mb-1.5" style={{ color: t.color }}>
              {i < 3 ? MEDALS[i] : `${i + 1}.`}
            </div>
            <div className="text-sm font-semibold text-text-primary">{t.name}</div>
            <div className="text-lg font-extrabold my-1" style={{ color: t.color }}>{t.score}</div>
            <div className="text-xs text-text-light">{t.members} members</div>
          </div>
        ))}
      </div>

      {/* Individual rankings */}
      <div className="space-y-1">
        {employees.map((e, i) => (
          <div key={e.init} className="flex items-center gap-3.5 py-3 border-b border-black/[0.05] last:border-b-0">
            <span className="text-xl font-extrabold w-7 text-center" style={{ color: i === 0 ? '#0F6E56' : i === 1 ? '#1D9E75' : i === 2 ? '#378ADD' : '#888' }}>
              {i + 1}
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-2xs font-bold shrink-0"
              style={{ background: e.bg, color: e.fc }}
            >
              {e.init}
            </div>
            <div className="w-[130px] shrink-0">
              <div className="text-sm font-semibold text-text-primary">{e.name}</div>
              <div className="text-xs text-text-light">{e.team}</div>
            </div>
            <div className="flex-1 h-[10px] rounded-full bg-neutral-pale overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${e.pct}%`, background: e.barColor }} />
            </div>
            <span className="text-sm font-bold w-10 text-right" style={{ color: e.barColor }}>{e.pct}%</span>
            <span
              className="text-xs font-semibold w-[56px] text-right shrink-0"
              style={{ color: e.delta.includes('+') ? '#0F6E56' : e.delta.includes('-') ? '#993535' : '#888' }}
            >
              {e.delta}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
