import GlossyCard from '@/components/ui/GlossyCard';
import { idleAlerts } from '@/mock/teamDetail';

export default function IdleAlertsPanel() {
  return (
    <GlossyCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-md font-semibold text-text-primary">Idle Alerts Today</h4>
        <span className="bg-primary rounded-[20px] py-0.5 px-2 text-xs font-bold text-white">
          {idleAlerts.length + 2}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {idleAlerts.map((alert, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-2 bg-[#E8FFF5] rounded-[10px] border border-primary/20"
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-2xs font-bold shrink-0"
              style={{ background: alert.avatarBg, color: alert.avatarColor }}
            >
              {alert.initials}
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-medium text-text-primary">{alert.name}</div>
              <div className="text-2xs-plus text-text-light">{alert.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </GlossyCard>
  );
}
