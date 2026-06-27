import { Users, Eye, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

function EmployeeCard({ employee }) {
  const e = employee;
  return (
    <div className="dark-card p-[16px_18px] font-poppins">
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-[9px] shadow-[0_3px_10px_rgba(29,158,117,0.4)] bg-gradient-to-br from-primary to-primary-dark text-white"
      >
        {e.initials}
      </div>
      <div className="text-lg font-semibold text-white text-center mb-px">{e.name}</div>
      <div className="text-2xs-plus text-white/35 text-center mb-2.5">{e.role}</div>

      <div className="flex items-center justify-center gap-[5px] py-1 px-3 rounded-[20px] bg-primary/[0.12] border border-primary/20 mb-2">
        <Users size={9} stroke="#1D9E75" strokeWidth={2} />
        <span className="text-xs font-medium text-primary-light">{e.team}</span>
      </div>

      <div className="flex items-center justify-center gap-[5px] mb-2.5">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse" />
        <span className="text-xs text-white/65 font-medium">{e.status}</span>
      </div>

      <div className="h-px bg-white/[0.06] my-2" />

      <div className="flex items-center justify-between mb-1.5">
        <span className="text-2xs text-white/30">Check-in</span>
        <span className="text-xs font-medium text-white/80">{e.checkIn}</span>
      </div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-2xs text-white/30">Today's score</span>
        <span className="text-xs font-semibold text-primary-light">{e.todayScore}</span>
      </div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-2xs text-white/30">Shots today</span>
        <span className="text-xs font-medium text-white/80">{e.shotsToday}</span>
      </div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-2xs text-white/30">OS</span>
        <span className="text-xs font-medium text-white/80">{e.os}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-2xs text-white/30">Work type</span>
        <span className="text-xs font-medium text-white/80">{e.workType}</span>
      </div>
    </div>
  );
}

function DetailsCard({ shot }) {
  const parts = shot.app.split(' · ');
  const application = parts[0] || 'Active Window';
  const appDetail = parts[1] || 'Application';
  const categoryLabel = shot.category.charAt(0).toUpperCase() + shot.category.slice(1);

  const rows = [
    { label: 'Captured at', value: shot.time.split(' · ')[0] || shot.time, bold: true },
    { label: 'Date', value: shot.time.split(' · ')[1] || 'Today' },
    { label: 'Application', value: application },
    { label: 'Window Title', value: appDetail },
    { label: 'Productivity', value: categoryLabel, badge: true },
    { label: 'Idle at capture', value: shot.idle ? 'Yes' : 'No' },
    { label: 'Idle status', value: shot.idle ? 'Idle state logged' : 'Active state logged' },
  ];

  return (
    <div className="glossy-card p-[14px_16px] rounded-[16px] font-poppins">
      <h4 className="text-sm-plus font-semibold text-text-primary mb-2.5">Screenshot Details</h4>
      {rows.map((row, i) => (
        <div key={row.label} className={`flex items-start justify-between gap-2 ${i < rows.length - 1 ? 'mb-[7px]' : ''}`}>
          <span className="text-2xs-plus text-text-light shrink-0">{row.label}</span>
          {row.badge ? (
            <span className={cn(
              "inline-flex py-0.5 px-[7px] rounded-[7px] text-2xs font-semibold border",
              shot.category === 'productive' && "bg-primary/[0.13] text-[#0F6E56] border-primary/20",
              shot.category === 'unproductive' && "bg-ink text-primary-light border-black/10",
              shot.category === 'idle' && "bg-[#FFF8E8] text-[#B8860B] border-yellow-200",
              shot.category === 'neutral' && "bg-surface-subtle text-text-muted border-black/5"
            )}>
              {row.value}
            </span>
          ) : (
            <span className={`text-xs font-medium text-text-primary text-right max-w-[150px] truncate ${row.bold ? 'font-bold' : ''}`}>
              {row.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function BlurCard({ shot, onToggleBlur }) {
  return (
    <div className="glossy-card p-[14px_16px] rounded-[16px] font-poppins">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm-plus font-semibold text-text-primary">Privacy / Blur</h4>
        <button
          onClick={onToggleBlur}
          className="flex items-center gap-1 py-[3px] px-[9px] rounded-[20px] bg-primary/[0.12] text-primary hover:bg-primary/20 transition-colors text-2xs-plus font-semibold border-none cursor-pointer"
        >
          <Eye size={9} stroke="#1D9E75" strokeWidth={2} />
          {shot.blurred ? 'Unblur' : 'Blur'}
        </button>
      </div>
      <p className="text-2xs-plus text-text-light leading-relaxed my-2">
        Blur is currently <strong className="text-text-primary">{shot.blurred ? 'enabled' : 'disabled'}</strong> for this screenshot. Full resolution {shot.blurred ? 'hidden' : 'visible'}.
      </p>
      <div className="flex items-center gap-[5px] py-[7px] px-2.5 bg-[#F8F8F5] rounded-[9px] border border-black/5 text-2xs text-text-lighter">
        <Info size={11} stroke="#CCC" strokeWidth={2} />
        {shot.blurred ? 'Privacy blur was applied automatically.' : 'Full visibility requested by supervisor.'}
      </div>
    </div>
  );
}

export default function ScreenshotDetailPanel({ shot, employee, onToggleBlur }) {
  if (!shot || !employee) return null;
  return (
    <div className="w-[286px] flex flex-col gap-2.5">
      <EmployeeCard employee={employee} />
      <DetailsCard shot={shot} />
      <BlurCard shot={shot} onToggleBlur={onToggleBlur} />
    </div>
  );
}
