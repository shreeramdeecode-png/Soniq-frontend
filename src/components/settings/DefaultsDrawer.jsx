import { useState } from 'react';
import { Monitor, Clock, Zap, Target, Calendar, Shield } from 'lucide-react';
import { cn } from '@/utils/cn';
import { dayLabels } from '@/mock/settings';

function Toggle({ on, onChange, label }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs font-medium text-text-secondary">{label}</span>
      <button
        onClick={onChange}
        className={cn('relative w-10 h-[22px] rounded-full transition-colors cursor-pointer', on ? 'bg-primary' : 'bg-neutral-warm')}
      >
        <span className={cn(
          'absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform',
          on && 'translate-x-[18px]',
        )} />
      </button>
    </div>
  );
}

function Stepper({ label, value, onChange, min = 0, max = 100, suffix = '' }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs font-medium text-text-secondary">{label}</span>
      <div className="flex items-center border border-black/10 rounded-lg bg-white overflow-hidden">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-7 h-8 flex items-center justify-center hover:bg-black/5 cursor-pointer text-sm font-medium text-text-muted"
        >
          −
        </button>
        <span className="w-10 text-center text-xs font-bold text-text-primary">{value}{suffix}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-7 h-8 flex items-center justify-center hover:bg-black/5 cursor-pointer text-sm font-medium text-text-muted"
        >
          +
        </button>
      </div>
    </div>
  );
}

function DefaultCard({ icon: Icon, iconColor, previewBg, title, description, children }) {
  return (
    <div className="glossy-card overflow-hidden rounded-[18px]">
      <div className={cn('h-[90px] flex items-center justify-center', previewBg)}>
        <Icon size={32} stroke={iconColor} strokeWidth={1.5} />
      </div>
      <div className="p-5 space-y-2">
        <h4 className="text-sm font-bold text-text-primary">{title}</h4>
        {description && <p className="text-2xs text-text-light">{description}</p>}
        <div className="pt-2 space-y-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function DefaultsDrawer() {
  const [capOn, setCapOn] = useState(true);
  const [blurOn, setBlurOn] = useState(false);
  const [interval, setInterval_] = useState(5);

  const [checkIn, setCheckIn] = useState('09:30');
  const [workHrs, setWorkHrs] = useState(8);
  const [prodHrs, setProdHrs] = useState(6);
  const [targetScore, setTargetScore] = useState(80);

  const [alertsOn, setAlertsOn] = useState(true);
  const [threshold, setThreshold] = useState(3);
  const [wDays, setWDays] = useState([1, 1, 1, 1, 1, 0, 0]);

  function toggleDay(i) {
    setWDays((prev) => prev.map((d, idx) => (idx === i ? (d ? 0 : 1) : d)));
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-xs-plus text-text-muted leading-relaxed">
          Organisation-wide defaults — applied automatically to new employees. Existing employees keep their current settings unless overridden individually.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Screen Capture */}
        <DefaultCard
          icon={Monitor}
          iconColor="rgba(255,255,255,0.5)"
          previewBg="bg-ink-dark"
          title="Screen Capture"
          description="Default capture behaviour for new users"
        >
          <Toggle label="Capture enabled" on={capOn} onChange={() => setCapOn(!capOn)} />
          <Toggle label="Privacy blur" on={blurOn} onChange={() => setBlurOn(!blurOn)} />
          <Stepper label="Interval" value={interval} onChange={setInterval_} min={1} max={30} suffix="m" />
        </DefaultCard>

        {/* Work Hours */}
        <DefaultCard
          icon={Clock}
          iconColor="rgba(255,255,255,0.6)"
          previewBg="bg-gradient-to-br from-primary-dark to-primary"
          title="Work Hours & Targets"
          description="Default schedule and productivity goals"
        >
          <div className="flex items-center justify-between py-2">
            <span className="text-xs font-medium text-text-secondary">Check-in</span>
            <input
              type="time"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="border border-black/10 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-text-primary outline-none focus:border-primary/40 w-24"
            />
          </div>
          <Stepper label="Work hours" value={workHrs} onChange={setWorkHrs} min={1} max={16} suffix="h" />
          <Stepper label="Productive hrs" value={prodHrs} onChange={setProdHrs} min={1} max={16} suffix="h" />
          <Stepper label="Target score" value={targetScore} onChange={setTargetScore} min={0} max={100} suffix="%" />
        </DefaultCard>

        {/* Idle Detection */}
        <DefaultCard
          icon={Zap}
          iconColor="rgba(255,255,255,0.6)"
          previewBg="bg-gradient-to-br from-amber-800 to-amber-600"
          title="Idle Detection"
          description="Default alerts and threshold settings"
        >
          <Toggle label="Alerts enabled" on={alertsOn} onChange={() => setAlertsOn(!alertsOn)} />
          <Stepper label="Threshold" value={threshold} onChange={setThreshold} min={1} max={10} suffix="m" />
          <div className="pt-2">
            <span className="text-xs font-medium text-text-secondary block mb-2">Working Days</span>
            <div className="flex items-center gap-1.5">
              {dayLabels.map((d, i) => (
                <button
                  key={d}
                  onClick={() => toggleDay(i)}
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all cursor-pointer',
                    wDays[i]
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface-subtle text-text-muted hover:bg-neutral-pale border border-black/[0.07]',
                  )}
                >
                  {d.charAt(0)}
                </button>
              ))}
            </div>
          </div>
        </DefaultCard>
      </div>

      {/* Save */}
      <div className="flex items-center justify-end mt-5 pt-5 border-t border-black/5">
        <button className="primary-pill text-white text-xs font-semibold rounded-pill px-5 py-2.5 flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity">
          Save All Defaults
        </button>
      </div>
    </div>
  );
}
