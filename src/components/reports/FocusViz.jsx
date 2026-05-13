import { cn } from '@/utils/cn';
import { focusData } from '@/mock/reports';

const BAND_BADGE = {
  Deep: 'bg-[rgba(12,68,124,.1)] text-[#0C447C] border-[rgba(12,68,124,.2)]',
  Moderate: 'bg-[rgba(55,138,221,.1)] text-[#185FA5] border-[rgba(55,138,221,.2)]',
  Scattered: 'bg-[rgba(153,53,53,.1)] text-[#791F1F] border-[rgba(153,53,53,.2)]',
};

export default function FocusViz() {
  const { distribution, trendData, trendLabels, table } = focusData;

  return (
    <div className="space-y-5">
      {/* Two column: Distribution + Trend */}
      <div className="grid grid-cols-2 gap-4">
        {/* Distribution */}
        <div className="bg-surface-subtle rounded-[14px] p-5">
          <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Score Distribution</div>
          <div className="space-y-3">
            {distribution.map((d) => (
              <div key={d.band} className="flex items-center gap-2.5">
                <span className="text-xs text-text-muted w-[110px] shrink-0">{d.band}</span>
                <div className="flex-1 h-2.5 rounded-full bg-white overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: d.color }} />
                </div>
                <span className="text-xs font-bold w-8 text-right" style={{ color: d.color }}>{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trend */}
        <div className="bg-surface-subtle rounded-[14px] p-5">
          <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Score Trend — Apr 1–21</div>
          <div className="relative h-[110px]">
            {[0, 25, 50, 75, 100].map((v) => (
              <div
                key={v}
                className="absolute left-0 right-0 border-t border-dashed border-black/[0.06]"
                style={{ bottom: `${v}%` }}
              />
            ))}
            <svg viewBox={`0 0 ${(trendData.length - 1) * 10} 100`} className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(55,138,221,0.3)" />
                  <stop offset="100%" stopColor="rgba(55,138,221,0)" />
                </linearGradient>
              </defs>
              <path
                d={`M0,${100 - trendData[0]} ${trendData.map((v, i) => `L${i * 10},${100 - v}`).join(' ')} L${(trendData.length - 1) * 10},100 L0,100 Z`}
                fill="url(#focusGrad)"
              />
              <polyline
                points={trendData.map((v, i) => `${i * 10},${100 - v}`).join(' ')}
                fill="none"
                stroke="#185FA5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {trendData.map((v, i) => (
                <circle key={i} cx={i * 10} cy={100 - v} r="2.5" fill="#185FA5" />
              ))}
            </svg>
          </div>
          <div className="flex justify-between mt-2">
            {trendLabels.filter((_, i) => i % 2 === 0).map((l) => (
              <span key={l} className="text-2xs text-text-light">{l}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Employee table */}
      <div className="overflow-hidden rounded-[14px] border border-black/[0.05]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/[0.02] border-b border-black/5">
              <th className="text-xs font-bold text-text-light uppercase tracking-wider py-3 px-4">Employee</th>
              <th className="text-xs font-bold text-text-light uppercase tracking-wider py-3 px-4">Team</th>
              <th className="text-xs font-bold text-text-light uppercase tracking-wider py-3 px-4">Score</th>
              <th className="text-xs font-bold text-text-light uppercase tracking-wider py-3 px-4">Streak</th>
              <th className="text-xs font-bold text-text-light uppercase tracking-wider py-3 px-4">Switches/hr</th>
              <th className="text-xs font-bold text-text-light uppercase tracking-wider py-3 px-4">Band</th>
            </tr>
          </thead>
          <tbody>
            {table.map((e) => (
              <tr key={e.init} className="border-b border-black/[0.04] last:border-b-0 hover:bg-primary/[0.02]">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-2xs font-bold shrink-0" style={{ background: e.bg, color: e.fc }}>{e.init}</div>
                    <span className="text-sm font-semibold text-text-primary">{e.name}</span>
                  </div>
                </td>
                <td className="text-xs text-text-muted py-3 px-4">{e.team}</td>
                <td className="py-3 px-4">
                  <span className="text-sm font-bold" style={{ color: e.bandColor }}>{e.score}</span>
                  <div className="h-[5px] rounded-full bg-neutral-pale mt-1.5 w-16 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${e.score}%`, background: e.bandColor }} />
                  </div>
                </td>
                <td className="text-xs text-text-secondary py-3 px-4">{e.streak}</td>
                <td className="text-xs text-text-secondary py-3 px-4">{e.switches}</td>
                <td className="py-3 px-4">
                  <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-[8px] border', BAND_BADGE[e.band] || 'bg-neutral-pale text-text-muted border-black/5')}>
                    {e.band}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
