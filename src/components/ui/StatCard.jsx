import { Users, User, Activity, Clock, Monitor, AlertCircle, AlertTriangle } from 'lucide-react';

const ICON_MAP = {
  users: Users,
  user: User,
  activity: Activity,
  clock: Clock,
  monitor: Monitor,
  'alert-circle': AlertCircle,
  'alert-triangle': AlertTriangle,
};

export default function StatCard({ value, label, change, changeColor, iconBg, iconStroke, icon }) {
  const Icon = ICON_MAP[icon] || Activity;

  return (
    <div className="glossy-card p-[16px_18px]">
      <div className="flex items-center justify-between mb-2">
        <div className="text-4xl font-bold text-text-primary tracking-tight leading-none">
          {value}
        </div>
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center"
          style={{ background: iconBg }}
        >
          <Icon size={16} stroke={iconStroke} strokeWidth={2} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-[11px] text-text-light">{label}</div>
        <div
          className="text-xs-plus font-semibold"
          style={{ color: changeColor }}
        >
          {change}
        </div>
      </div>
    </div>
  );
}
