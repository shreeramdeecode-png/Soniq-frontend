import GlossyCard from '@/components/ui/GlossyCard';

export default function IdleAlertsPanel({ alerts = [] }) {
  return (
    <GlossyCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-md font-semibold text-text-primary">Idle Alerts Today</h4>
        <span className="bg-primary rounded-[20px] py-0.5 px-2 text-xs font-bold text-white font-poppins">
          {alerts.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {alerts.length > 0 ? (
          alerts.map((alert, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2 bg-[#E8FFF5] rounded-[10px] border border-primary/20 font-poppins"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-2xs font-bold shrink-0"
                style={{ background: alert.avatarBg, color: alert.avatarColor }}
              >
                {alert.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-text-primary truncate">{alert.name}</div>
                <div className="text-2xs-plus text-text-light truncate">{alert.detail}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-xs text-text-light py-4 text-center font-poppins">No idle alerts flagged today.</div>
        )}
      </div>
    </GlossyCard>
  );
}

