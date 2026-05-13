import { useState } from 'react';
import { Plus, Edit3, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/utils/cn';
import { employees } from '@/mock/settings';

const ROLE_COLORS = {
  Admin: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
  Manager: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/20' },
  Employee: { bg: 'bg-neutral-warm/40', text: 'text-text-secondary', border: 'border-black/5' },
  'No Access': { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20' },
};

const STATUS_STYLE = {
  active: { dot: 'bg-primary', label: 'Active', badge: 'bg-primary/10 text-primary' },
  pending: { dot: 'bg-amber-500', label: 'Pending EXE', badge: 'bg-amber-500/10 text-amber-600' },
  inactive: { dot: 'bg-red-400', label: 'Inactive', badge: 'bg-red-400/10 text-red-500' },
};

function groupByTeam(list) {
  return list.reduce((acc, emp) => {
    (acc[emp.team] ||= []).push(emp);
    return acc;
  }, {});
}

function EmployeeRow({ emp }) {
  const role = ROLE_COLORS[emp.role] || ROLE_COLORS.Employee;
  const status = STATUS_STYLE[emp.status] || STATUS_STYLE.active;

  return (
    <div className="flex items-center py-3 px-5 hover:bg-white/90 transition-colors border-b border-black/[0.04] last:border-b-0 group">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mr-3"
        style={{ background: emp.color, color: emp.fc }}
      >
        {emp.init}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-text-primary truncate">{emp.name}</p>
        <p className="text-xs-plus text-text-light truncate">{emp.email}</p>
      </div>

      <div className="flex items-center gap-2 mx-5 shrink-0">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary bg-surface-subtle rounded-pill px-3 py-1 border border-black/[0.07]">
          <span className={cn('w-1.5 h-1.5 rounded-full', emp.mode === 'Remote' ? 'bg-blue-500' : emp.mode === 'Hybrid' ? 'bg-[#3D6028]' : 'bg-text-muted')} />
          {emp.mode}
        </span>
        <span className="text-xs text-text-secondary bg-surface-subtle rounded-pill px-3 py-1 border border-black/[0.07]">{emp.os} · {emp.exe}</span>
        <span className="text-xs text-text-secondary bg-surface-subtle rounded-pill px-3 py-1 border border-black/[0.07]">{emp.last} ago</span>
      </div>

      <span className={cn('text-xs font-semibold rounded-pill px-3 py-1 border mr-4 shrink-0', role.bg, role.text, role.border)}>
        {emp.role}
      </span>

      <div className="flex items-center gap-1.5 shrink-0">
        <button className="w-8 h-8 rounded-lg border border-black/10 flex items-center justify-center hover:bg-white hover:border-black/20 cursor-pointer transition-all">
          <Edit3 size={12} className="text-text-muted" />
        </button>
        <button className="w-8 h-8 rounded-lg border border-[rgba(153,53,53,0.2)] flex items-center justify-center hover:bg-red-50 cursor-pointer transition-all">
          <Trash2 size={12} className="text-[#993535]" />
        </button>
        <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold rounded-pill px-3 py-1 ml-1', status.badge)}>
          <span className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
          {status.label}
        </span>
      </div>
    </div>
  );
}

export default function PeopleDrawer() {
  const [page, setPage] = useState(1);
  const grouped = groupByTeam(employees);

  const counts = employees.reduce(
    (a, e) => { a[e.status] = (a[e.status] || 0) + 1; return a; },
    {},
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary/10 text-primary rounded-pill px-3 py-1.5 cursor-pointer">Active ({counts.active || 0})</span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-500/10 text-amber-600 rounded-pill px-3 py-1.5 cursor-pointer">Pending ({counts.pending || 0})</span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-red-400/10 text-red-500 rounded-pill px-3 py-1.5 cursor-pointer">Inactive ({counts.inactive || 0})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="glass-pill flex items-center gap-2 h-9 px-3.5 rounded-pill min-w-[200px]">
            <Search size={12} className="text-text-lighter" />
            <input className="border-none bg-transparent outline-none text-xs text-text-primary w-full placeholder:text-text-lighter" placeholder="Search name or email…" />
          </div>
          <button className="primary-pill text-white text-xs font-semibold rounded-pill px-5 py-2.5 flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity">
            <Plus size={13} /> Add Employee
          </button>
        </div>
      </div>

      {/* Card wrap */}
      <div className="glossy-card rounded-[20px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
          <div>
            <div className="text-md font-bold text-text-primary">All Employees</div>
            <div className="text-xs-plus text-text-light mt-0.5">Grouped by team · sorted by last activity</div>
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
              <EmployeeRow key={emp.email} emp={emp} />
            ))}
          </div>
        ))}

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-black/5">
          <span className="text-xs text-text-light">Showing {employees.length} of 128</span>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 cursor-pointer">
              <ChevronLeft size={13} className="text-text-muted" />
            </button>
            {[1, 2, 3].map((p) => (
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
            <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 cursor-pointer">
              <ChevronRight size={13} className="text-text-muted" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
