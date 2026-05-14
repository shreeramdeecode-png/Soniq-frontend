import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Plus, Users } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import CalendarHeatmap from '@/components/cards/teams/CalendarHeatmap';
import EmployeeTable from '@/components/tables/EmployeeTable';
import TopAppsPanel from '@/components/cards/teams/TopAppsPanel';
import WeeklyPerformancePanel from '@/components/cards/teams/WeeklyPerformancePanel';
import IdleAlertsPanel from '@/components/cards/teams/IdleAlertsPanel';
import QuickActionsPanel from '@/components/cards/teams/QuickActionsPanel';
import { teamInfo, teamDetailStats } from '@/mock/teamDetail';
import { useToast } from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';

export default function TeamDetailPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState('');

  function handleAddEmployee() {
    if (!newEmployeeName.trim()) return;
    toast.success(`${newEmployeeName} added to the team`, 'Employee Added');
    setNewEmployeeName('');
    setShowAddModal(false);
  }

  return (
    <div className="relative z-[2] pb-7">
      {/* Page Header */}
      <div className="flex items-end justify-between px-8 pt-4 pb-3.5">
        <div>
          <button
            onClick={() => navigate('/teams')}
            className="flex items-center gap-1.5 text-sm-plus text-text-muted cursor-pointer mb-1.5"
          >
            <ChevronLeft size={13} stroke="#AAA" strokeWidth={2} />
            Back to Teams
          </button>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-tile flex items-center justify-center text-lg font-bold"
              style={{ background: teamInfo.avatarBg, color: teamInfo.avatarColor }}
            >
              {teamInfo.abbr}
            </div>
            <div>
              <h1 className="text-[28px] font-bold text-text-primary tracking-tight leading-none">
                {teamInfo.name}
              </h1>
              <div className="flex items-center gap-2.5 mt-1">
                <span className="flex items-center gap-1 text-[11px] text-text-muted">
                  <Users size={10} stroke="#AAA" strokeWidth={2} />
                  {teamInfo.memberCount} members
                </span>
                <span className="w-[3px] h-[3px] rounded-full bg-neutral-pale" />
                <span className="flex items-center gap-1 text-[11px] text-text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
                  {teamInfo.status}
                </span>
                <span className="w-[3px] h-[3px] rounded-full bg-neutral-pale" />
                <span className="text-[11px] text-text-muted">{teamInfo.createdDate}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => toast.success('Team data exported successfully', 'Export Complete')}
            className="glass-pill flex items-center gap-[7px] py-[9px] px-4 rounded-pill text-sm-plus font-medium text-text-secondary cursor-pointer"
          >
            <Download size={12} stroke="#666" strokeWidth={2} />
            Export CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="dark-pill flex items-center gap-[7px] py-[9px] px-[18px] rounded-pill text-sm-plus font-semibold text-white cursor-pointer"
          >
            <Plus size={12} stroke="#fff" strokeWidth={2} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-4 gap-3 px-8 pb-4">
        {teamDetailStats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Main Layout: Left (Heatmap + Table) + Right Panel */}
      <div className="grid grid-cols-[1fr_300px] gap-3.5 px-8">
        <div className="flex flex-col gap-3.5">
          <CalendarHeatmap />
          <EmployeeTable />
        </div>
        <div className="flex flex-col gap-3.5">
          <TopAppsPanel />
          <WeeklyPerformancePanel />
          <IdleAlertsPanel />
          <QuickActionsPanel />
        </div>
      </div>

      <Modal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); setNewEmployeeName(''); }}
        title="Add Employee"
        subtitle="Add a new member to the team"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-text-primary mb-1.5 block">
              Employee Name
            </label>
            <input
              type="text"
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddEmployee()}
              placeholder="Enter employee name..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-white/60 text-sm text-text-primary placeholder:text-text-lighter outline-none focus:border-primary/40 transition-colors"
            />
          </div>
          <button
            onClick={handleAddEmployee}
            disabled={!newEmployeeName.trim()}
            className="dark-pill w-full py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add to Team
          </button>
        </div>
      </Modal>
    </div>
  );
}
