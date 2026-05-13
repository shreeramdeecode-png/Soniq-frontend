import { cn } from '@/utils/cn';
import { toolsData } from '@/mock/reports';

const TYPE_BADGE = {
  Productive: 'bg-[rgba(15,110,86,.1)] text-[#085041] border-[rgba(15,110,86,.2)]',
  Neutral: 'bg-[rgba(184,134,11,.1)] text-[#633806] border-[rgba(184,134,11,.25)]',
  Unproductive: 'bg-[rgba(153,53,53,.1)] text-[#791F1F] border-[rgba(153,53,53,.2)]',
};

export default function ToolsViz() {
  const { tools, maxHrs } = toolsData;

  return (
    <div className="space-y-5">
      {/* Horizontal bar chart */}
      <div className="space-y-2.5">
        {tools.map((t) => (
          <div key={t.name} className="flex items-center gap-3">
            <span className="text-xs font-medium text-text-muted w-[80px] shrink-0 text-right">{t.name}</span>
            <div className="flex-1 h-[26px] rounded-[6px] bg-surface-subtle overflow-hidden relative">
              <div
                className="h-full rounded-[6px] flex items-center justify-end pr-2.5 transition-all"
                style={{ width: `${(t.hrs / maxHrs) * 100}%`, background: t.barColor }}
              >
                <span className="text-xs font-bold text-white">{t.hrs}h</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[14px] border border-black/[0.05]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/[0.02] border-b border-black/5">
              <th className="text-xs font-bold text-text-light uppercase tracking-wider py-3 px-4">Tool</th>
              <th className="text-xs font-bold text-text-light uppercase tracking-wider py-3 px-4">Category</th>
              <th className="text-xs font-bold text-text-light uppercase tracking-wider py-3 px-4">Productivity</th>
              <th className="text-xs font-bold text-text-light uppercase tracking-wider py-3 px-4">Avg hrs/user/day</th>
              <th className="text-xs font-bold text-text-light uppercase tracking-wider py-3 px-4">Users</th>
              <th className="text-xs font-bold text-text-light uppercase tracking-wider py-3 px-4">ROI Signal</th>
            </tr>
          </thead>
          <tbody>
            {tools.slice(0, 4).map((t) => (
              <tr key={t.name} className="border-b border-black/[0.04] last:border-b-0 hover:bg-primary/[0.02]">
                <td className="text-sm font-semibold text-text-primary py-3 px-4">{t.name}</td>
                <td className="text-xs text-text-muted py-3 px-4">{t.category}</td>
                <td className="py-3 px-4">
                  <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-[8px] border', TYPE_BADGE[t.type])}>
                    {t.type}
                  </span>
                </td>
                <td className="text-sm font-bold py-3 px-4" style={{ color: t.type === 'Unproductive' ? '#993535' : '#1A1A1A' }}>
                  {t.hrs}h
                </td>
                <td className="text-xs text-text-secondary py-3 px-4">{t.users}</td>
                <td className="text-xs font-semibold py-3 px-4" style={{ color: t.roiColor }}>{t.roi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
