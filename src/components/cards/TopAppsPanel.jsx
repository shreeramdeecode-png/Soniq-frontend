import GlossyCard from '@/components/ui/GlossyCard';
import { topApps } from '@/mock/teamDetail';

export default function TopAppsPanel() {
  return (
    <GlossyCard className="p-4">
      <h4 className="text-md font-semibold text-text-primary mb-3">Top Apps Today</h4>
      <div className="flex flex-col gap-[9px]">
        {topApps.map((app) => (
          <div key={app.name} className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-[7px] flex items-center justify-center text-2xs font-bold shrink-0"
              style={{ background: app.iconBg, color: app.iconColor }}
            >
              {app.abbr}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium text-text-primary mb-0.5">{app.name}</div>
              <div className="h-[3px] bg-surface-muted rounded-sm overflow-hidden">
                <div className="h-full rounded-sm" style={{ width: `${app.pct}%`, background: app.barColor }} />
              </div>
            </div>
            <div className="text-xs font-semibold text-text-primary whitespace-nowrap shrink-0">
              {app.time}
            </div>
          </div>
        ))}
      </div>
    </GlossyCard>
  );
}
