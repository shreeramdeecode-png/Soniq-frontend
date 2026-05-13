import { useState } from 'react';
import GlossyCard from '@/components/ui/GlossyCard';
import { appUsageData } from '@/mock/employeeProfile';
import { cn } from '@/utils/cn';

const STATUS_CLASSES = {
  prod: 'bg-surface-muted text-text-primary',
  unprod: 'bg-ink text-primary-light',
  neutral: 'bg-surface-subtle text-text-muted',
};

export default function AppUsageTable() {
  const [activeFilter, setActiveFilter] = useState('apps');

  return (
    <GlossyCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-md font-semibold text-text-primary">App Usage</h4>
        <div className="flex gap-[5px]">
          <button
            onClick={() => setActiveFilter('apps')}
            className={cn(
              'py-[3px] px-[9px] rounded-[20px] text-xs cursor-pointer',
              activeFilter === 'apps' ? 'bg-ink text-white' : 'bg-black/5 text-text-muted'
            )}
          >
            Apps
          </button>
          <button
            onClick={() => setActiveFilter('sites')}
            className={cn(
              'py-[3px] px-[9px] rounded-[20px] text-xs cursor-pointer',
              activeFilter === 'sites' ? 'bg-ink text-white' : 'bg-black/5 text-text-muted'
            )}
          >
            Sites
          </button>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            {['App', 'Time', 'Status'].map((h) => (
              <th key={h} className="text-xs font-semibold text-text-light uppercase tracking-wide py-[7px] px-2.5 text-left border-b border-black/[0.06]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {appUsageData.map((app) => (
            <tr key={app.name} className="last:border-b-0">
              <td className="py-[9px] px-2.5 border-b border-black/[0.04]">
                <div className="flex items-center gap-[7px]">
                  <div
                    className="w-[22px] h-[22px] rounded-[6px] flex items-center justify-center text-[8px] font-bold shrink-0"
                    style={{ background: app.iconBg, color: app.iconColor }}
                  >
                    {app.abbr}
                  </div>
                  <span className="text-[11px] font-medium text-text-primary">{app.name}</span>
                </div>
              </td>
              <td className="py-[9px] px-2.5 border-b border-black/[0.04] text-[11px] font-semibold text-text-primary">
                {app.time}
              </td>
              <td className="py-[9px] px-2.5 border-b border-black/[0.04]">
                <span className={cn('text-2xs py-0.5 px-[7px] rounded-[6px] font-semibold', STATUS_CLASSES[app.statusClass])}>
                  {app.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlossyCard>
  );
}
