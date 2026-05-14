import { useState } from 'react';
import { Info, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { employees } from '@/mock/settings';
import { useToast } from '@/components/ui/Toast';

function groupByTeam(list) {
  return list.reduce((acc, emp) => {
    (acc[emp.team] ||= []).push(emp);
    return acc;
  }, {});
}

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={onChange}
      className={cn('relative w-10 h-[22px] rounded-full transition-colors cursor-pointer', on ? 'bg-primary' : 'bg-neutral-warm')}
    >
      <span
        className={cn(
          'absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform',
          on && 'translate-x-[18px]',
        )}
      />
    </button>
  );
}

function MonitoringRow({ emp, onSave }) {
  const [capOn, setCapOn] = useState(emp.cap);
  const [blur, setBlur] = useState(emp.blur);
  const [interval, setInterval_] = useState(emp.interval);
  const [idleOn, setIdleOn] = useState(emp.idle);
  const [idleMin, setIdleMin] = useState(emp.idleMin);

  const pct = ((idleMin - 1) / 4) * 100;

  return (
    <div className="flex items-center py-3.5 px-5 hover:bg-white/90 transition-colors border-b border-black/[0.04] last:border-b-0">
      {/* Avatar + Name */}
      <div className="flex items-center gap-3 w-[170px] shrink-0">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{ background: emp.color, color: emp.fc }}
        >
          {emp.init}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">{emp.name}</p>
          <p className="text-xs-plus text-text-light truncate">{emp.team}</p>
        </div>
      </div>

      <div className="w-px h-9 bg-black/[0.06] mx-4" />

      {/* Capture section */}
      <div className="flex items-center gap-3 flex-1">
        <span className="text-2xs font-bold text-text-light uppercase tracking-wide w-12 shrink-0">Capture</span>
        <div className="flex items-center bg-surface-subtle rounded-pill border border-black/[0.08] overflow-hidden">
          <button
            onClick={() => setCapOn(!capOn)}
            className={cn('flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium border-r border-black/[0.06] transition-colors', capOn ? 'bg-primary/[0.15] text-[#0F6E56]' : 'text-text-light')}
          >
            {capOn ? 'On' : 'Off'}
          </button>
          <button
            onClick={() => setBlur(!blur)}
            className={cn('flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium border-r border-black/[0.06] transition-colors', blur ? 'bg-ink/10 text-text-primary' : 'text-text-light')}
          >
            {blur ? 'Blur' : 'No Blur'}
          </button>
          <div className="flex items-center py-0.5 px-1">
            <button onClick={() => setInterval_(Math.max(1, interval - 1))} className="w-6 h-7 flex items-center justify-center hover:bg-black/5 cursor-pointer text-sm font-medium text-text-muted">−</button>
            <span className="w-8 text-center text-xs font-bold text-text-primary">{interval}m</span>
            <button onClick={() => setInterval_(Math.min(60, interval + 1))} className="w-6 h-7 flex items-center justify-center hover:bg-black/5 cursor-pointer text-sm font-medium text-text-muted">+</button>
          </div>
        </div>
      </div>

      <div className="w-px h-9 bg-black/[0.06] mx-4" />

      {/* Idle section */}
      <div className="flex items-center gap-3 w-[220px] shrink-0">
        <span className="text-2xs font-bold text-text-light uppercase tracking-wide w-8 shrink-0">Idle</span>
        <Toggle on={idleOn} onChange={() => setIdleOn(!idleOn)} />
        <div className={cn('flex-1 h-2 rounded-full bg-black/[0.08] relative', !idleOn && 'opacity-30 pointer-events-none')}>
          <div className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-primary-light to-primary" style={{ width: `${pct}%` }} />
          <input
            type="range"
            min={1}
            max={5}
            value={idleMin}
            onChange={(e) => setIdleMin(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white border-[3px] border-ink shadow-[0_2px_5px_rgba(0,0,0,0.2)] pointer-events-none"
            style={{ left: `calc(${pct}% - 9px)` }}
          />
        </div>
        <span className="text-lg font-extrabold text-text-primary w-5 text-center">{idleMin}</span>
        <span className="text-2xs text-text-light">m</span>
      </div>

      {/* Save */}
      <button
        onClick={() => onSave?.(emp.name)}
        className="primary-pill text-white text-xs font-semibold rounded-pill px-4 py-2 flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity ml-3 shrink-0"
      >
        <Save size={11} /> Save
      </button>
    </div>
  );
}

export default function MonitoringDrawer() {
  const [page, setPage] = useState(1);
  const toast = useToast();
  const PAGE_SIZE = 5;
  const totalPages = Math.ceil(employees.length / PAGE_SIZE);
  const paginatedEmployees = employees.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const grouped = groupByTeam(paginatedEmployees);

  function handleSave(name) {
    toast.success(`Monitoring settings saved for ${name}`, 'Settings Saved');
  }

  return (
    <div>
      {/* Info banner */}
      <div className="flex items-start gap-3 bg-[rgba(55,138,221,0.07)] border border-[rgba(55,138,221,0.2)] rounded-[14px] px-5 py-4 mb-5">
        <div className="w-8 h-8 rounded-[9px] bg-[rgba(55,138,221,0.12)] flex items-center justify-center shrink-0">
          <Info size={15} className="text-[#185FA5]" />
        </div>
        <div>
          <div className="text-sm font-bold text-[#0C447C] mb-0.5">Sync delay · up to 1 hour</div>
          <div className="text-xs-plus text-text-muted leading-relaxed">
            Changes sync to the Trackpilots EXE agent. When Blur is ON, Soniq applies server-side Gaussian blur — the original unblurred image is <strong>never stored</strong>.
          </div>
        </div>
      </div>

      {/* Card wrap */}
      <div className="glossy-card rounded-[20px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
          <div>
            <div className="text-md font-bold text-text-primary">Capture, Blur & Idle — per Employee</div>
            <div className="text-xs-plus text-text-light mt-0.5">Use the pod to toggle capture and blur · drag the bar to set idle threshold</div>
          </div>
        </div>

        {/* Grouped rows */}
        {Object.entries(grouped).map(([team, members]) => (
          <div key={team}>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-primary/[0.04] border-b border-primary/[0.08]">
              <span className="text-xs-plus font-bold text-[#0F6E56] uppercase tracking-wider">{team}</span>
              <div className="flex-1 h-px bg-primary/10" />
            </div>
            {members.map((emp) => (
              <MonitoringRow key={emp.email} emp={emp} onSave={handleSave} />
            ))}
          </div>
        ))}

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-black/5">
          <span className="text-xs text-text-light">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, employees.length)} of {employees.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={13} className="text-text-muted" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold cursor-pointer',
                  page === p ? 'bg-primary text-white' : 'text-text-muted hover:bg-black/5',
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={13} className="text-text-muted" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
