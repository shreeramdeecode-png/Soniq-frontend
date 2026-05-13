import { useState } from 'react';
import { Search, Filter, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlossyCard from '@/components/ui/GlossyCard';
import { employees, teamTabs } from '@/mock/teamDetail';
import { cn } from '@/utils/cn';

const STATUS_STYLES = {
  work: { bg: 'bg-surface-muted', text: 'text-text-primary', dot: '#1A1A1A' },
  privacy: { bg: 'bg-[#FFF8E8]', text: 'text-[#B8860B]', dot: '#D97706' },
  offline: { bg: 'bg-[#F5F5F5]', text: 'text-[#999]', dot: '#CCC' },
  absent: { bg: 'bg-[#FFF0F0]', text: 'text-[#CC4444]', dot: '#CC4444' },
};

function StatusBadge({ status, label }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.offline;
  return (
    <span className={cn('inline-flex items-center gap-1 py-[3px] px-[9px] rounded-[20px] text-xs font-medium', style.bg, style.text)}>
      <span className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: style.dot }} />
      {label}
    </span>
  );
}

export default function EmployeeTable() {
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  return (
    <GlossyCard className="p-4">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-lg font-semibold text-text-primary">Team Members</h3>
        <div className="flex items-center gap-2">
          <div className="glass-pill flex items-center gap-1.5 px-3 h-8 rounded-pill text-[11px] text-text-lighter">
            <Search size={11} stroke="#BBB" strokeWidth={2} />
            Search member...
          </div>
          <button className="glass-pill flex items-center gap-[5px] px-3 h-8 rounded-pill text-[11px] text-text-secondary cursor-pointer">
            <Filter size={11} stroke="#888" strokeWidth={2} />
            Filter
          </button>
        </div>
      </div>

      <div className="flex items-center gap-0.5 bg-black/5 rounded-[10px] p-[3px] w-fit mb-3.5">
        {teamTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'py-1.5 px-3.5 rounded-lg text-sm font-medium cursor-pointer transition-all',
              activeTab === tab.id
                ? 'bg-white text-text-primary shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                : 'text-text-muted'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Employee', 'Status', 'Check In', 'Active Hrs', 'Productivity', 'Score', 'Most Used App'].map((h) => (
                <th key={h} className="text-xs font-semibold text-text-light uppercase tracking-wide py-2 px-3 text-left border-b border-black/[0.06]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.id}
                className="cursor-pointer hover:bg-primary/[0.04] transition-colors"
                onClick={() => navigate(`/teams/engineering/employee/${emp.id}`)}
              >
                <td className="py-2.5 px-3 border-b border-black/[0.04]">
                  <div className="flex items-center gap-[9px]">
                    <div
                      className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: emp.avatarBg, color: emp.avatarColor }}
                    >
                      {emp.initials}
                    </div>
                    <div>
                      <div className="text-sm-plus font-semibold text-text-primary">{emp.name}</div>
                      <div className="text-xs text-text-light">{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-3 border-b border-black/[0.04]">
                  <StatusBadge status={emp.status} label={emp.statusLabel} />
                </td>
                <td className="py-2.5 px-3 border-b border-black/[0.04] text-[11px] text-text-secondary">
                  {emp.checkIn}
                </td>
                <td className="py-2.5 px-3 border-b border-black/[0.04] text-sm font-semibold text-text-primary">
                  {emp.activeHrs}
                </td>
                <td className="py-2.5 px-3 border-b border-black/[0.04]">
                  <div className="h-1 rounded-sm bg-surface-muted overflow-hidden w-[70px] inline-block align-middle">
                    <div className="h-full rounded-sm" style={{ width: `${emp.productivity}%`, background: emp.prodBarBg }} />
                  </div>
                </td>
                <td className="py-2.5 px-3 border-b border-black/[0.04]">
                  <span
                    className="inline-flex py-0.5 px-2 rounded-lg text-xs font-bold"
                    style={{ background: emp.scoreBg, color: emp.scoreColor }}
                  >
                    {emp.scoreLabel}
                  </span>
                </td>
                <td className="py-2.5 px-3 border-b border-black/[0.04] text-[11px] text-text-muted">
                  {emp.topApp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-black/5 mt-1">
        <span className="text-[11px] text-text-light">Showing 5 of 34 employees</span>
        <div className="flex gap-1.5">
          <button className="py-[5px] px-3 rounded-[20px] bg-white/60 border border-black/[0.08] text-[11px] text-text-muted cursor-pointer">
            ← Prev
          </button>
          <button className="py-[5px] px-3 rounded-[20px] dark-pill text-[11px] text-white cursor-pointer">
            Next →
          </button>
        </div>
      </div>
    </GlossyCard>
  );
}
