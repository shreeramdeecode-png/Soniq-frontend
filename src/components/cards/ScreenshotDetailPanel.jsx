import { Users, Eye, Info } from 'lucide-react';
import { screenshotEmployee, screenshotDetails, blurStatus } from '@/mock/screenshotDetail';

function EmployeeCard() {
  const e = screenshotEmployee;
  return (
    <div className="dark-card p-[16px_18px]">
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-[9px] shadow-[0_3px_10px_rgba(29,158,117,0.4)]"
        style={{ background: e.avatarBg, color: e.avatarColor }}
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

function DetailsCard() {
  const d = screenshotDetails;
  const rows = [
    { label: 'Captured at', value: d.capturedAt, bold: true },
    { label: 'Date', value: d.date },
    { label: 'Application', value: d.application },
    { label: 'Category', value: d.category },
    { label: 'Productivity', value: d.productivity, badge: true },
    { label: 'Idle at capture', value: d.idleAtCapture },
    { label: 'Work mode', value: d.workMode },
    { label: 'Shot #', value: d.shotNumber },
  ];

  return (
    <div className="glossy-card p-[14px_16px] rounded-[16px]">
      <h4 className="text-sm-plus font-semibold text-text-primary mb-2.5">Screenshot Details</h4>
      {rows.map((row, i) => (
        <div key={row.label} className={`flex items-start justify-between gap-2 ${i < rows.length - 1 ? 'mb-[7px]' : ''}`}>
          <span className="text-2xs-plus text-text-light shrink-0">{row.label}</span>
          {row.badge ? (
            <span className="inline-flex py-0.5 px-[7px] rounded-[7px] text-2xs font-semibold bg-primary/[0.13] text-[#0F6E56] border border-primary/20">
              {row.value}
            </span>
          ) : (
            <span className={`text-xs font-medium text-text-primary text-right ${row.bold ? 'font-bold' : ''}`}>
              {row.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function BlurCard() {
  const b = blurStatus;
  return (
    <div className="glossy-card p-[14px_16px] rounded-[16px]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm-plus font-semibold text-text-primary">Privacy / Blur</h4>
        <div className="flex items-center gap-1 py-[3px] px-[9px] rounded-[20px] bg-surface-muted text-2xs-plus font-semibold text-text-muted">
          <Eye size={9} stroke="#888" strokeWidth={2} />
          {b.label}
        </div>
      </div>
      <p className="text-2xs-plus text-text-light leading-relaxed my-2">
        Blur is currently <strong className="text-text-primary">disabled</strong> for this employee. Full resolution visible. Change in Settings → Screenshot Settings.
      </p>
      <div className="flex items-center gap-[5px] py-[7px] px-2.5 bg-[#F8F8F5] rounded-[9px] border border-black/5 text-2xs text-text-lighter">
        <Info size={11} stroke="#CCC" strokeWidth={2} />
        {b.auditNote}
      </div>
    </div>
  );
}

export default function ScreenshotDetailPanel() {
  return (
    <div className="w-[286px] flex flex-col gap-2.5">
      <EmployeeCard />
      <DetailsCard />
      <BlurCard />
    </div>
  );
}
