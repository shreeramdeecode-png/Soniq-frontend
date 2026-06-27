import { useState } from 'react';
import GlossyCard from '@/components/ui/GlossyCard';
import AppIcon from '@/components/ui/AppIcon';
import { cn } from '@/utils/cn';

const STATUS_CLASSES = {
  productive: 'bg-surface-muted text-text-primary',
  unproductive: 'bg-ink text-primary-light',
  neutral: 'bg-surface-subtle text-text-muted',
};

export default function AppUsageTable({ apps = [] }) {
  const [activeFilter, setActiveFilter] = useState('apps');

  const filteredApps = apps.filter((app) => {
    if (activeFilter === 'apps') {
      return !app.isWebsite;
    } else {
      return app.isWebsite;
    }
  });

  return (
    <GlossyCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-md font-semibold text-text-primary">App & Web Usage</h4>
        <div className="flex gap-[5px] font-poppins">
          <button
            onClick={() => setActiveFilter('apps')}
            className={cn(
              'py-[3px] px-[9px] rounded-[20px] text-xs cursor-pointer border-none',
              activeFilter === 'apps' ? 'bg-ink text-white' : 'bg-black/5 text-text-muted'
            )}
          >
            Apps
          </button>
          <button
            onClick={() => setActiveFilter('sites')}
            className={cn(
              'py-[3px] px-[9px] rounded-[20px] text-xs cursor-pointer border-none',
              activeFilter === 'sites' ? 'bg-ink text-white' : 'bg-black/5 text-text-muted'
            )}
          >
            Sites
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[340px]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['App', 'Time', 'Status'].map((h) => (
                <th key={h} className="text-xs font-semibold text-text-light uppercase tracking-wide py-[7px] px-2.5 text-left border-b border-black/[0.06] font-poppins">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredApps.length > 0 ? (
              filteredApps.map((app, i) => (
                <tr key={`${app.name}-${app.status}-${i}`} className="last:border-b-0 font-poppins">
                  <td className="py-[9px] px-2.5 border-b border-black/[0.04]">
                    <div className="flex items-center gap-[7px]">
                      <AppIcon iconUrl={app.iconUrl} abbr={app.abbr} size={22} radius={6} iconBg={app.iconBg} iconColor={app.iconColor} className="text-[8px]" />
                      <span className="text-[11px] font-medium text-text-primary truncate max-w-[120px]">{app.name}</span>
                    </div>
                  </td>
                  <td className="py-[9px] px-2.5 border-b border-black/[0.04] text-[11px] font-semibold text-text-primary font-poppins">
                    {app.time}
                  </td>
                  <td className="py-[9px] px-2.5 border-b border-black/[0.04]">
                    <span className={cn('text-2xs py-0.5 px-[7px] rounded-[6px] font-semibold font-poppins', STATUS_CLASSES[app.statusClass] || STATUS_CLASSES.neutral)}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-6 text-center text-xs text-text-light font-poppins">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </GlossyCard>
  );
}
