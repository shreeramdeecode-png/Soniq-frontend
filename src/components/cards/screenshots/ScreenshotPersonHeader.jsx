import { useState, useEffect } from 'react';
import { Users, EyeOff, Eye } from 'lucide-react';
import api from '@/utils/api';
import { useToast } from '@/components/ui/Toast';
import { isLiveActive } from '@/utils/liveStatus';

export default function ScreenshotPersonHeader({ employeeId }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!employeeId) return;

    async function fetchProfile() {
      setLoading(true);
      try {
        const todayStr = new Date().toISOString().slice(0, 10);
        
        // Fetch employee details and today's attendance stats
        const [empRes, attRes] = await Promise.all([
          api.get(`/api/client/employees/${employeeId}`),
          api.get(`/api/client/attendance/employees/${employeeId}?from=${todayStr}&to=${todayStr}`),
        ]);

        const empData = empRes.data || {};
        const attToday = attRes.data?.[0] || {};
        const initials = empData.name ? empData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '..';

        setProfile({
          name: empData.name,
          initials,
          team: empData.teamName || 'No Team',
          status: isLiveActive(empData) ? 'Active' : 'Offline',
          statusDotColor: isLiveActive(empData) ? '#1D9E75' : '#AAA',
          os: empData.operatingSystem || 'Windows 11',
          lastActive: empData.lastSeenAt 
            ? new Date(empData.lastSeenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : 'Offline',
          blurEnabled: empData.settings?.blurEnabled ?? false,
          stats: [
            { value: String(attToday.screenshotsCount ?? 0), label: 'Shots today' },
            { value: attToday.productivityScore != null ? `${Math.round(attToday.productivityScore)}%` : '—', label: 'Productive', highlight: true },
            { value: empData.settings?.captureIntervalMinutes ? `${empData.settings.captureIntervalMinutes} min` : '1 min', label: 'Interval' }
          ]
        });
      } catch (err) {
        console.error('Error fetching screenshot person header details:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [employeeId]);

  async function toggleBlur() {
    if (!profile) return;
    const newBlur = !profile.blurEnabled;
    try {
      await api.put(`/api/client/employees/${employeeId}/settings/screenshot`, {
        blurEnabled: newBlur
      });
      setProfile(prev => ({
        ...prev,
        blurEnabled: newBlur
      }));
      toast.success(newBlur ? 'Screenshot blurring enabled' : 'Screenshot blurring disabled');
    } catch (err) {
      console.error('Failed to toggle blur settings:', err);
      toast.error('Failed to update blur setting');
    }
  }

  if (loading || !profile) {
    return (
      <div className="glossy-card h-[76px] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="glossy-card p-[16px_20px] flex items-center gap-4">
      {/* Avatar */}
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold shrink-0 shadow-[0_2px_8px_rgba(29,158,117,0.35)] bg-gradient-to-br from-primary to-primary-dark text-white"
      >
        {profile.initials}
      </div>

      {/* Name + meta */}
      <div>
        <div className="text-[16px] font-bold text-text-primary tracking-tight">{profile.name}</div>
        <div className="flex items-center gap-2.5 mt-[3px]">
          <span className="flex items-center gap-1 text-xs-plus text-text-muted">
            <Users size={10} stroke="#AAA" strokeWidth={2} />
            {profile.team}
          </span>
          <span className="w-[3px] h-[3px] rounded-full bg-[#DDD]" />
          <span className="flex items-center gap-1 text-xs-plus text-text-muted">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: profile.statusDotColor }} />
            {profile.status}
          </span>
          <span className="w-[3px] h-[3px] rounded-full bg-[#DDD]" />
          <span className="text-xs-plus text-text-muted">{profile.os}</span>
          <span className="w-[3px] h-[3px] rounded-full bg-[#DDD]" />
          <span className="text-xs-plus text-text-muted">Last: {profile.lastActive}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-5 ml-auto">
        {profile.stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`text-[16px] font-bold tracking-tight ${stat.highlight ? 'text-primary' : 'text-text-primary'}`}>
              {stat.value}
            </div>
            <div className="text-2xs-plus text-text-light mt-px">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Blur toggle */}
      <button 
        onClick={toggleBlur}
        className="flex items-center gap-2 py-2 px-3.5 bg-[#F8F8F5] rounded-tile border border-black/[0.06] shrink-0 cursor-pointer hover:bg-black/[0.03] transition-colors"
      >
        {profile.blurEnabled ? (
          <div className="flex items-center gap-[5px] py-1 px-2.5 bg-primary/[0.12] border border-primary/25 rounded-[20px] text-xs font-semibold text-[#0F6E56]">
            <EyeOff size={10} stroke="#0F6E56" strokeWidth={2} />
            Blur: ON
          </div>
        ) : (
          <div className="flex items-center gap-[5px] py-1 px-2.5 bg-black/[0.06] border border-black/[0.08] rounded-[20px] text-xs font-semibold text-text-muted">
            <Eye size={10} stroke="#666" strokeWidth={2} />
            Blur: OFF
          </div>
        )}
        <span className="text-xs text-text-light">Settings</span>
      </button>
    </div>
  );
}
