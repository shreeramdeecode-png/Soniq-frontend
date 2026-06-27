import GlossyCard from '@/components/ui/GlossyCard';
import AppIcon from '@/components/ui/AppIcon';

export default function TopAppsPanel({ apps = [] }) {
  return (
    <GlossyCard className="p-4">
      <h4 className="text-md font-semibold text-text-primary mb-3">Top Apps Today</h4>
      <div className="flex flex-col gap-3">
        {apps.length > 0 ? (
          apps.map((app) => (
            <div key={app.name} className="flex items-center gap-2 font-poppins">
              <AppIcon iconUrl={app.iconUrl} abbr={app.abbr} size={24} iconBg={app.iconBg} iconColor={app.iconColor} />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-text-primary mb-0.5 truncate">{app.name}</div>
                <div className="h-[3px] bg-surface-muted rounded-sm overflow-hidden">
                  <div className="h-full rounded-sm" style={{ width: `${app.pct}%`, background: app.barColor }} />
                </div>
              </div>
              <div className="text-xs font-semibold text-text-primary whitespace-nowrap shrink-0 ml-2">
                {app.time}
              </div>
            </div>
          ))
        ) : (
          <div className="text-xs text-text-light py-4 text-center font-poppins">No application usage logs today.</div>
        )}
      </div>
    </GlossyCard>
  );
}

