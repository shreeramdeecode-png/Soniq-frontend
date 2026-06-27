import { useState, useEffect } from 'react';
import { Lock, Save } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/components/ui/Toast';
import api from '@/utils/api';
import { loadAllEmployees } from '@/components/settings/settingsAdapters';

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

function StealthEmployeeRow({ emp, onSave, onError }) {
  const [on, setOn] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!emp.id) return;
    api.get(`/api/client/employees/${emp.id}/settings/stealth`)
      .then(({ data }) => setOn(data.stealthEnabled ?? false))
      .catch(() => {});
  }, [emp.id]);

  async function handleSave() {
    setSaving(true);
    try {
      await api.put(`/api/client/employees/${emp.id}/settings/stealth`, {
        stealthEnabled: on,
        consentAcknowledged: true,
      });
      onSave(emp.name, on);
    } catch {
      onError?.();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-4 py-4 px-5 hover:bg-black/[0.015] transition-colors rounded-[16px] border border-white/[0.98] bg-white/[0.86] shadow-[0_2px_0_rgba(255,255,255,0.95)_inset] mb-2">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={{ background: emp.color, color: emp.fc }}
      >
        {emp.init}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-text-primary truncate">{emp.name}</p>
        <p className="text-xs-plus text-text-light truncate">{emp.team} · {emp.role}</p>
      </div>
      <span className={cn('text-xs font-semibold mr-2', on ? 'text-[#1D9E75]' : 'text-text-light')}>
        {on ? '● Active' : '○ Inactive'}
      </span>
      <Toggle on={on} onChange={() => setOn(!on)} />
      <button
        onClick={handleSave}
        disabled={saving}
        className="primary-pill text-white text-xs font-semibold rounded-pill px-4 py-2 flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity ml-2 disabled:opacity-60"
      >
        <Save size={12} /> {saving ? '…' : 'Save'}
      </button>
    </div>
  );
}

export default function StealthDrawer() {
  const [employees, setEmployees] = useState([]);
  const [consented, setConsented] = useState(false);
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem('soniq_stealth_unlocked') === '1');
  const toast = useToast();

  useEffect(() => {
    loadAllEmployees(api)
      .then(setEmployees)
      .catch(() => {});
  }, []);

  function handleSave(name, isOn) {
    if (isOn) {
      toast.warning(`Silent tracking enabled for ${name}`, 'Stealth Mode');
    } else {
      toast.success(`Silent tracking disabled for ${name}`, 'Stealth Mode');
    }
  }

  function handleError() {
    toast.error('Failed to save stealth setting');
  }

  return (
    <div>
      {/* Legal Gate */}
      <div className="dark-card p-8 mb-6 rounded-[22px]">
        <div className="w-[52px] h-[52px] rounded-[15px] bg-[rgba(15,110,86,0.25)] border border-[rgba(15,110,86,0.35)] flex items-center justify-center mb-5">
          <Lock size={26} className="text-[#85C4B0]" />
        </div>
        <h3 className="text-xl font-extrabold text-white tracking-tight mb-2">Legal Consent Required</h3>
        <p className="text-sm text-white/[0.48] max-w-[700px] leading-[1.8] mb-6">
          Silent Tracking enables invisible background monitoring — no visible indicator appears on the employee's machine.
          This may be subject to local labour laws and employee privacy rights.
          <br /><br />
          <strong className="text-white/75">Soniq is not responsible for legal misuse.</strong> Ensure full compliance with applicable laws before enabling this for any employee.
        </p>

        {/* Consent checkbox */}
        <div
          onClick={() => setConsented(!consented)}
          className="flex items-start gap-3 bg-[rgba(15,110,86,0.15)] border border-[rgba(15,110,86,0.3)] rounded-[14px] px-5 py-4 mb-5 cursor-pointer select-none"
        >
          <div
            className={cn(
              'w-5 h-5 rounded-[6px] flex items-center justify-center border-2 transition-colors shrink-0 mt-0.5',
              consented ? 'bg-primary border-primary' : 'border-[rgba(15,110,86,0.5)] bg-transparent',
            )}
          >
            {consented && (
              <svg viewBox="0 0 12 12" className="w-3 h-3">
                <path d="M2 6l3 3 5-5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="text-xs-plus text-white/55 leading-relaxed">
            I have obtained all required consents, notified employees as required by local law, and accept full legal responsibility for enabling Silent Tracking in my organisation.
          </span>
        </div>

        <button
          disabled={!consented}
          onClick={() => {
            localStorage.setItem('soniq_stealth_unlocked', '1');
            setUnlocked(true);
            toast.info('Silent tracking panel unlocked', 'Access Granted');
          }}
          className={cn(
            'text-sm font-semibold rounded-pill px-7 py-3 transition-all',
            consented
              ? 'bg-[linear-gradient(135deg,#0F6E56,#085041)] text-white cursor-pointer hover:opacity-90'
              : 'bg-white/10 text-white/30 cursor-not-allowed',
          )}
        >
          Unlock Silent Tracking
        </button>
      </div>

      {/* Re-lock button */}
      {unlocked && (
        <div className="flex justify-end mb-3">
          <button
            onClick={() => { localStorage.removeItem('soniq_stealth_unlocked'); setUnlocked(false); setConsented(false); toast.info('Silent tracking locked', 'Access Revoked'); }}
            className="text-xs font-semibold text-text-muted hover:text-red-500 flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Lock size={11} /> Lock Silent Tracking
          </button>
        </div>
      )}

      {/* Employee list */}
      <div className={cn('transition-all duration-400', !unlocked && 'opacity-20 blur-[3px] pointer-events-none select-none')}>
        <div className="flex flex-col gap-2">
          {employees.map((emp) => (
            <StealthEmployeeRow key={emp.email} emp={emp} onSave={handleSave} onError={handleError} />
          ))}
        </div>
      </div>
    </div>
  );
}
