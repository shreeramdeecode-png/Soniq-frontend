import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/components/ui/Toast';
import api from '@/utils/api';
import { loadAllEmployees } from '@/components/settings/settingsAdapters';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const QUICK_PRESETS = [
  { label: 'Mon – Fri', days: [1, 1, 1, 1, 1, 0, 0] },
  { label: 'Mon – Sat', days: [1, 1, 1, 1, 1, 1, 0] },
  { label: 'All 7 Days', days: [1, 1, 1, 1, 1, 1, 1] },
  { label: 'Weekends Only', days: [0, 0, 0, 0, 0, 1, 1] },
];

function Stepper({ label, value, onChange, min = 0, max = 100, suffix = '' }) {
  return (
    <div className="bg-surface-subtle rounded-[13px] p-4">
      <div className="text-2xs font-semibold text-text-light uppercase tracking-wider mb-2">{label}</div>
      <div className="flex items-center border border-black/10 rounded-[10px] bg-white overflow-hidden">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-9 flex items-center justify-center hover:bg-black/5 cursor-pointer text-sm font-semibold text-text-muted"
        >
          −
        </button>
        <span className="flex-1 text-center text-sm font-bold text-text-primary">
          {value}{suffix}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-9 flex items-center justify-center hover:bg-black/5 cursor-pointer text-sm font-semibold text-text-muted"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function WorkPolicyDrawer() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('days');
  const [activePreset, setActivePreset] = useState(0);
  const [days, setDays] = useState([1, 1, 1, 1, 1, 0, 0]);
  const [checkIn, setCheckIn] = useState('09:00');
  const [workHrs, setWorkHrs] = useState(8);
  const [prodHrs, setProdHrs] = useState(6);
  const toast = useToast();

  useEffect(() => {
    loadAllEmployees(api)
      .then((list) => {
        setEmployees(list);
        if (list.length > 0) loadEmployeeSettings(list[0]);
      })
      .catch(() => toast.error('Failed to load employees'))
      .finally(() => setLoading(false));
  }, []);

  async function loadEmployeeSettings(emp) {
    if (!emp?.id) return;
    setSettingsLoading(true);
    try {
      const { data: s } = await api.get(`/api/client/employees/${emp.id}/settings`);
      setDays(DAY_KEYS.map(k => s[k] ? 1 : 0));
      setWorkHrs(Math.round(Number(s.expectedWorkHoursPerDay ?? 8)));
      setProdHrs(Math.round(Number(s.expectedProductiveHoursPerDay ?? 6)));
      const rawTime = typeof s.expectedInTime === 'string' ? s.expectedInTime.slice(0, 5) : '09:00';
      setCheckIn(rawTime);
    } catch {
      // keep current values on error
    } finally {
      setSettingsLoading(false);
    }
  }

  const selected = employees[selectedIdx] ?? { name: '…', team: '…', id: null };

  function handleSelectEmployee(i) {
    setSelectedIdx(i);
    loadEmployeeSettings(employees[i]);
  }

  function toggleDay(i) {
    setDays((prev) => prev.map((d, idx) => (idx === i ? (d ? 0 : 1) : d)));
  }

  function applyPreset(preset, idx) {
    setDays([...preset]);
    setActivePreset(idx);
  }

  async function handleSaveSchedule() {
    if (!selected.id) return;
    setSaving(true);
    try {
      await api.put(`/api/client/employees/${selected.id}/settings/work-days`,
        Object.fromEntries(DAY_KEYS.map((k, i) => [k, !!days[i]]))
      );
      toast.success(`Schedule saved for ${selected.name}`, 'Work Policy Updated');
    } catch {
      toast.error('Failed to save schedule');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveTargets() {
    if (!selected.id) return;
    setSaving(true);
    try {
      await api.put(`/api/client/employees/${selected.id}/settings/work-hours`, {
        expectedWorkHoursPerDay: workHrs,
        expectedProductiveHoursPerDay: prodHrs,
        expectedInTime: `${checkIn}:00`,
      });
      toast.success(`Targets saved for ${selected.name}`, 'Targets Updated');
    } catch {
      toast.error('Failed to save targets');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Warning banner */}
      <div className="flex items-start gap-3 bg-[rgba(15,110,86,0.08)] border border-[rgba(15,110,86,0.2)] rounded-[14px] px-5 py-4 mb-5">
        <div className="w-8 h-8 rounded-[9px] bg-[rgba(15,110,86,0.14)] flex items-center justify-center shrink-0">
          <AlertTriangle size={15} className="text-[#0F6E56]" />
        </div>
        <div>
          <div className="text-sm font-bold text-[#085041] mb-0.5">Changes ripple across modules</div>
          <div className="text-xs-plus text-text-muted leading-relaxed">
            Working days affect attendance absent-flagging. Expected hours drive the dashboard progress bar, late check-in detection, overtime calculation and productivity score targets in all reports.
          </div>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-[260px_1fr] glossy-card rounded-[20px] overflow-hidden">
        {/* Left sidebar – employee list */}
        <div className="border-r border-black/[0.06]">
          <div className="py-3.5 px-4 border-b border-black/5 text-sm font-bold text-text-primary">
            Employees
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {employees.map((emp, i) => (
              <button
                key={emp.email}
                onClick={() => handleSelectEmployee(i)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer border-b border-black/[0.04]',
                  selectedIdx === i
                    ? 'bg-primary/[0.08] border-r-[3px] border-r-primary'
                    : 'hover:bg-black/[0.02]',
                )}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-2xs font-bold shrink-0"
                  style={{ background: emp.color, color: emp.fc }}
                >
                  {emp.init}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{emp.name}</p>
                  <p className="text-2xs-plus text-text-light truncate">{emp.team}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="p-6">
          {/* Employee header */}
          <div className="mb-5 flex items-center gap-3">
            <div>
              <h4 className="text-lg font-bold text-text-primary">{selected.name}</h4>
              <p className="text-xs-plus text-text-light mt-0.5">{selected.team} · Select a tab to configure</p>
            </div>
            {settingsLoading && (
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin ml-2" />
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-0.5 bg-black/[0.04] rounded-[10px] p-1 mb-6 w-full">
            {[
              { id: 'days', label: 'Working Days' },
              { id: 'targets', label: 'Productivity Targets' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer text-center',
                  tab === t.id
                    ? 'bg-white text-text-primary shadow-[0_1px_4px_rgba(0,0,0,0.1)]'
                    : 'text-text-muted hover:text-text-secondary',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'days' ? (
            <div>
              {/* Day grid */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {DAY_LABELS.map((d, i) => (
                  <div key={d} className="flex flex-col items-center cursor-pointer" onClick={() => toggleDay(i)}>
                    <span className={cn('text-2xs font-bold uppercase tracking-wide mb-1.5', days[i] ? 'text-text-primary' : 'text-text-light')}>
                      {d}
                    </span>
                    <div
                      className={cn(
                        'w-full h-[50px] rounded-[10px] flex items-center justify-center text-lg font-bold transition-all',
                        days[i]
                          ? 'bg-ink text-primary-light shadow-[0_2px_8px_rgba(0,0,0,0.15)]'
                          : i >= 5
                            ? 'bg-black/5 text-text-lighter'
                            : 'bg-black/5 text-text-lighter border-2 border-dashed border-black/10',
                      )}
                    >
                      {days[i] ? '✓' : i >= 5 ? '—' : '+'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick-apply chips */}
              <div className="mb-6">
                <div className="text-sm font-semibold text-text-muted mb-2.5">Quick apply</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {QUICK_PRESETS.map((p, idx) => (
                    <button
                      key={p.label}
                      onClick={() => applyPreset(p.days, idx)}
                      className={cn(
                        'flex items-center gap-1.5 text-xs font-medium rounded-[20px] px-4 py-2 border transition-all cursor-pointer',
                        activePreset === idx
                          ? 'bg-primary/[0.12] border-primary/30 text-[#0F6E56] font-semibold'
                          : 'bg-surface-subtle border-black/[0.07] text-text-muted hover:bg-primary/5 hover:border-primary/20 hover:text-primary',
                      )}
                    >
                      {activePreset === idx && <span className="text-xs">✓</span>}
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => { loadEmployeeSettings(selected); setActivePreset(0); toast.info('Schedule reset'); }}
                  className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-secondary cursor-pointer px-4 py-2"
                >
                  Reset
                </button>
                <button
                  onClick={handleSaveSchedule}
                  disabled={saving || settingsLoading}
                  className="primary-pill text-white text-xs font-semibold rounded-pill px-5 py-2.5 flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save Schedule'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Targets grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-surface-subtle rounded-[13px] p-4">
                  <div className="text-2xs font-semibold text-text-light uppercase tracking-wider mb-2">Expected Check-In</div>
                  <input
                    type="text"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full h-9 border border-black/10 rounded-lg bg-white px-3 text-sm font-semibold text-text-primary outline-none focus:border-primary/40"
                  />
                </div>
                <Stepper label="Work Hours / Day" value={workHrs} onChange={setWorkHrs} min={1} max={16} suffix="h" />
                <Stepper label="Productive Hrs / Day" value={prodHrs} onChange={setProdHrs} min={1} max={16} suffix="h" />
                <div className="bg-surface-subtle rounded-[13px] p-4">
                  <div className="text-2xs font-semibold text-text-light uppercase tracking-wider mb-2">Productivity Target</div>
                  <div className="flex items-center h-9 px-3 rounded-[10px] bg-white border border-black/10">
                    <span className="text-sm font-bold text-text-primary">
                      {workHrs > 0 ? Math.round((prodHrs / workHrs) * 100) : 0}%
                    </span>
                    <span className="ml-2 text-xs text-text-light">({prodHrs}h of {workHrs}h)</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => loadEmployeeSettings(selected)}
                  className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-secondary cursor-pointer px-4 py-2"
                >
                  Reset
                </button>
                <button
                  onClick={handleSaveTargets}
                  disabled={saving || settingsLoading}
                  className="primary-pill text-white text-xs font-semibold rounded-pill px-5 py-2.5 flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save Targets'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
