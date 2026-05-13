import { Monitor, Zap, Clock, User, Heart, Check } from 'lucide-react';
import DarkCard from '@/components/ui/DarkCard';
import { liveActivity } from '@/mock/dashboard';
import { cn } from '@/utils/cn';

const ICON_MAP = {
  monitor: Monitor,
  zap: Zap,
  clock: Clock,
  user: User,
  heart: Heart,
};

function ActivityItem({ name, status, completed, icon }) {
  const Icon = ICON_MAP[icon] || Monitor;

  return (
    <div className="flex items-center gap-[9px] py-[7px] border-b border-white/5 last:border-b-0 last:pb-0">
      <div className="w-[26px] h-[26px] rounded-[7px] bg-white/[0.07] flex items-center justify-center shrink-0">
        <Icon size={12} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
      </div>
      <div className="flex-1">
        <div
          className={cn(
            'text-sm font-medium',
            completed
              ? 'line-through text-white/30'
              : 'text-white/85'
          )}
        >
          {name}
        </div>
        <div className="text-2xs-plus text-white/30 mt-px">{status}</div>
      </div>
      <div
        className={cn(
          'w-[17px] h-[17px] rounded-full flex items-center justify-center shrink-0',
          completed
            ? 'check-done'
            : 'bg-white/[0.07] border border-white/10'
        )}
      >
        {completed && (
          <Check size={9} stroke="#1A1A1A" strokeWidth={3} />
        )}
      </div>
    </div>
  );
}

export default function LiveActivityCard() {
  const { active, total, items } = liveActivity;

  return (
    <DarkCard variant="task" className="p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-semibold text-white">Live Activity</span>
        <span className="text-3xl font-bold text-white tracking-tight">
          {active}/{total}
        </span>
      </div>
      {items.map((item) => (
        <ActivityItem key={item.id} {...item} />
      ))}
    </DarkCard>
  );
}
