import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, Circle } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import api from '@/utils/api';

export default function IntegrationsDrawer() {
  const toast = useToast();
  const [status, setStatus] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    api.get('/api/client/settings/trackpilots')
      .then(res => setStatus(res.data))
      .catch(() => setStatus({ connected: false, mapping: null }));
  }, []);

  async function handleSync() {
    setSyncing(true);
    try {
      const { data } = await api.post('/api/client/settings/trackpilots/sync');
      const { teams, employees } = data;
      const msg = `Synced ${teams.synced} teams (${teams.created} new) · ${employees.synced} employees (${employees.created} new)`;
      toast.success(msg);
      setLastSync(new Date());
      setStatus(prev => ({ ...prev, connected: true }));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  }

  const connected = status?.connected ?? false;

  return (
    <div className="space-y-5">
      {/* Trackpilots card */}
      <div className="border border-black/[0.08] rounded-[14px] p-5 bg-white/60">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-primary font-bold text-sm">T</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-text-primary">Trackpilots</div>
              <div className="text-xs text-text-muted mt-0.5">Desktop monitoring agent · syncs employees and teams</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {connected
              ? <><CheckCircle size={13} className="text-status-success" /><span className="text-xs font-semibold text-status-success">Connected</span></>
              : <><Circle size={13} className="text-text-muted" /><span className="text-xs font-semibold text-text-muted">Not configured</span></>
            }
          </div>
        </div>

        {/* Sync section */}
        <div className="mt-4 pt-4 border-t border-black/[0.06] flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-text-secondary">Manual Sync</div>
            <div className="text-2xs text-text-muted mt-0.5">
              {lastSync
                ? `Last synced: ${lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : status?.mapping?.updatedAt
                  ? `Last synced: ${new Date(status.mapping.updatedAt).toLocaleDateString()}`
                  : 'Pull latest teams and employees from Trackpilots'}
            </div>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing || !connected}
            className="flex items-center gap-2 h-9 px-4 rounded-[10px] bg-primary text-white text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed border-none"
          >
            <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing…' : 'Sync Now'}
          </button>
        </div>

        {!connected && (
          <div className="mt-3 px-3 py-2.5 rounded-[8px] bg-amber-50 border border-amber-200">
            <p className="text-xs text-amber-700">Integration not configured. Contact your Soniq administrator to set up Trackpilots credentials.</p>
          </div>
        )}
      </div>
    </div>
  );
}
