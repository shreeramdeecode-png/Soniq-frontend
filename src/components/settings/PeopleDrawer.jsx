import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ROLE_BADGE, STATUS_BADGE } from '@/components/settings/settingsTheme';
import { useToast } from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';
import api from '@/utils/api';
import { loadAllEmployees } from '@/components/settings/settingsAdapters';

const PAGE_SIZE = 5;

function groupByTeam(list) {
  return list.reduce((acc, emp) => {
    (acc[emp.team] ||= []).push(emp);
    return acc;
  }, {});
}

function EmployeeRow({ emp, onEdit, onDelete }) {
  const role = ROLE_BADGE[emp.role] || ROLE_BADGE.Employee;
  const status = STATUS_BADGE[emp.status] || STATUS_BADGE.active;

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
          <span className={cn('w-1.5 h-1.5 rounded-full', emp.mode === 'Remote' ? 'bg-[#1D9E75]' : emp.mode === 'Hybrid' ? 'bg-primary' : 'bg-text-muted')} />
          {emp.mode}
        </span>
        <span className="text-xs text-text-secondary bg-surface-subtle rounded-pill px-3 py-1 border border-black/[0.07]">{emp.os} · {emp.exe}</span>
        <span className="text-xs text-text-secondary bg-surface-subtle rounded-pill px-3 py-1 border border-black/[0.07]">{emp.last} ago</span>
      </div>

      <span className={cn('text-xs font-semibold rounded-pill px-3 py-1 border mr-4 shrink-0', role.bg, role.text, role.border)}>
        {emp.role}
      </span>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onEdit(emp)}
          className="w-8 h-8 rounded-lg border border-black/10 flex items-center justify-center hover:bg-white hover:border-black/20 cursor-pointer transition-all"
        >
          <Edit3 size={12} className="text-text-muted" />
        </button>
        <button
          onClick={() => onDelete(emp)}
          className="w-8 h-8 rounded-lg border border-primary/20 flex items-center justify-center hover:bg-primary/5 cursor-pointer transition-all"
        >
          <Trash2 size={12} className="text-[#085041]" />
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
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRoleId, setNewEmpRoleId] = useState('');
  const [teams, setTeams] = useState([]);
  const [newEmpTeamId, setNewEmpTeamId] = useState('');
  const [inviting, setInviting] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [editName, setEditName] = useState('');
  const toast = useToast();

  useEffect(() => {
    Promise.all([
      loadAllEmployees(api),
      api.get('/api/client/roles').then(r => r.data),
      api.get('/api/client/teams').then(r => r.data),
    ])
      .then(([emps, roleData, teamData]) => {
        setEmployees(emps);
        const list = Array.isArray(roleData) ? roleData : (roleData.items ?? roleData.data ?? []);
        setRoles(list);
        if (list.length > 0) setNewEmpRoleId((list.find(r => r.name === 'Employee') ?? list[0]).id);
        const tlist = Array.isArray(teamData) ? teamData : (teamData.items ?? teamData.data ?? []);
        setTeams(tlist);
        if (tlist.length > 0) setNewEmpTeamId(tlist[0].id);
      })
      .catch(() => toast.error('Failed to load employees'))
      .finally(() => setLoading(false));
  }, []);

  const counts = employees.reduce(
    (a, e) => { a[e.status] = (a[e.status] || 0) + 1; return a; },
    {},
  );

  const filtered = employees.filter((emp) => {
    if (statusFilter !== 'all' && emp.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return emp.name.toLowerCase().includes(q) || emp.email.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const grouped = groupByTeam(paged);

  function handleStatusFilter(status) {
    setStatusFilter(status);
    setPage(1);
  }

  async function handleAddSubmit() {
    if (!newEmpName.trim() || !newEmpEmail.trim() || !newEmpRoleId || inviting) return;
    setInviting(true);
    const email = newEmpEmail.trim();
    setShowAddModal(false);
    setNewEmpName('');
    setNewEmpEmail('');
    try {
      await api.post('/api/client/employees/invite', {
        name: newEmpName.trim(),
        email,
        roleId: newEmpRoleId,
        teamId: newEmpTeamId || undefined,
      });
      toast.success(`Invite sent to ${email}`, 'Employee Invited');
      loadAllEmployees(api).then(setEmployees).catch(() => {});
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to invite employee');
    } finally {
      setInviting(false);
    }
  }

  async function handleEditSubmit() {
    if (!editName.trim()) return;
    try {
      await api.put(`/api/client/employees/${editModal.id}`, { name: editName.trim() });
      toast.success(`Updated to ${editName}`, 'Employee Updated');
      setEmployees((prev) => prev.map((e) => e.id === editModal.id ? { ...e, name: editName } : e));
      setEditModal(null);
      setEditName('');
    } catch {
      toast.error('Failed to update employee');
    }
  }

  async function handleDeleteConfirm() {
    try {
      await api.post(`/api/client/employees/${deleteModal.id}/deactivate`, {});
      toast.success(`${deleteModal.name} deactivated`, 'Employee Deactivated');
      setEmployees((prev) => prev.filter((e) => e.id !== deleteModal.id));
      setDeleteModal(null);
    } catch {
      toast.error('Failed to deactivate employee');
    }
  }

  function openEdit(emp) {
    setEditName(emp.name);
    setEditModal(emp);
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span
            onClick={() => handleStatusFilter('active')}
            className={cn(
              'inline-flex items-center gap-1.5 text-xs font-semibold rounded-pill px-3 py-1.5 cursor-pointer transition-all',
              statusFilter === 'active' ? 'bg-primary/20 text-primary ring-1 ring-primary/30' : 'bg-primary/10 text-primary',
            )}
          >
            Active ({counts.active || 0})
          </span>
          <span
            onClick={() => handleStatusFilter('pending')}
            className={cn(
              'inline-flex items-center gap-1.5 text-xs font-semibold rounded-pill px-3 py-1.5 cursor-pointer transition-all',
              statusFilter === 'pending' ? 'bg-[rgba(29,158,117,.2)] text-[#0F6E56] ring-1 ring-primary/30' : 'bg-[rgba(29,158,117,.12)] text-[#0F6E56]',
            )}
          >
            Pending ({counts.pending || 0})
          </span>
          <span
            onClick={() => handleStatusFilter('inactive')}
            className={cn(
              'inline-flex items-center gap-1.5 text-xs font-semibold rounded-pill px-3 py-1.5 cursor-pointer transition-all',
              statusFilter === 'inactive' ? 'bg-[rgba(15,110,86,.15)] text-[#085041] ring-1 ring-primary/25' : 'bg-[rgba(15,110,86,.08)] text-[#085041]',
            )}
          >
            Inactive ({counts.inactive || 0})
          </span>
          {statusFilter !== 'all' && (
            <span
              onClick={() => handleStatusFilter('all')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-black/5 text-text-muted rounded-pill px-3 py-1.5 cursor-pointer hover:bg-black/10 transition-all"
            >
              Clear
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="glass-pill flex items-center gap-2 h-9 px-3.5 rounded-pill min-w-[200px]">
            <Search size={12} className="text-text-lighter shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="border-none bg-transparent outline-none text-xs text-text-primary w-full placeholder:text-text-lighter"
              placeholder="Search name or email…"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="primary-pill text-white text-xs font-semibold rounded-pill px-5 py-2.5 flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Plus size={13} /> Add Employee
          </button>
        </div>
      </div>

      {/* Card wrap */}
      <div className="glossy-card rounded-[20px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
          <div>
            <div className="text-md font-bold text-text-primary">
              {statusFilter === 'all' ? 'All Employees' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Employees`}
            </div>
            <div className="text-xs-plus text-text-light mt-0.5">Grouped by team · sorted by last activity</div>
          </div>
        </div>

        {/* Grouped rows */}
        {Object.keys(grouped).length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-text-light">No employees match the current filters.</div>
        ) : (
          Object.entries(grouped).map(([team, members]) => (
            <div key={team}>
              <div className="flex items-center gap-2 px-5 py-2.5 bg-primary/[0.04] border-b border-primary/[0.08]">
                <span className="text-xs-plus font-bold text-[#0F6E56] uppercase tracking-wider">{team}</span>
                <div className="flex-1 h-px bg-primary/10" />
              </div>
              {members.map((emp) => (
                <EmployeeRow key={emp.email} emp={emp} onEdit={openEdit} onDelete={setDeleteModal} />
              ))}
            </div>
          ))
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-black/5">
          <span className="text-xs text-text-light">
            Showing {Math.min((safePage - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className={cn('w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer', safePage <= 1 ? 'opacity-30 cursor-default' : 'hover:bg-black/5')}
            >
              <ChevronLeft size={13} className="text-text-muted" />
            </button>
            {pageNumbers.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold cursor-pointer',
                  safePage === p ? 'bg-primary text-white' : 'text-text-muted hover:bg-black/5',
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className={cn('w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer', safePage >= totalPages ? 'opacity-30 cursor-default' : 'hover:bg-black/5')}
            >
              <ChevronRight size={13} className="text-text-muted" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Invite Employee" subtitle="Send an invitation to a new team member" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">Full Name</label>
            <input
              value={newEmpName}
              onChange={(e) => setNewEmpName(e.target.value)}
              placeholder="e.g. Ravi Shankar"
              className="w-full h-10 px-3.5 rounded-xl border border-black/10 bg-white/80 text-sm text-text-primary outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-lighter"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">Email Address</label>
            <input
              type="email"
              value={newEmpEmail}
              onChange={(e) => setNewEmpEmail(e.target.value)}
              placeholder="e.g. ravi@company.com"
              className="w-full h-10 px-3.5 rounded-xl border border-black/10 bg-white/80 text-sm text-text-primary outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-lighter"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">Team</label>
            <select
              value={newEmpTeamId}
              onChange={(e) => setNewEmpTeamId(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-black/10 bg-white/80 text-sm text-text-primary outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
            >
              {teams.length === 0 && <option value="">No teams yet</option>}
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">Role</label>
            <select
              value={newEmpRoleId}
              onChange={(e) => setNewEmpRoleId(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-black/10 bg-white/80 text-sm text-text-primary outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
            >
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-text-muted hover:bg-black/5 cursor-pointer transition-colors">
              Cancel
            </button>
            <button onClick={handleAddSubmit} disabled={inviting} className="primary-pill px-5 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed">
              {inviting ? 'Sending…' : 'Send Invite'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Edit Employee" subtitle={editModal ? `Editing ${editModal.name}` : ''} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">Full Name</label>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-black/10 bg-white/80 text-sm text-text-primary outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-lighter"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setEditModal(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-text-muted hover:bg-black/5 cursor-pointer transition-colors">
              Cancel
            </button>
            <button onClick={handleEditSubmit} className="primary-pill px-5 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity">
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Deactivate Confirmation Modal */}
      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Deactivate Employee" subtitle="This will revoke their access" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Are you sure you want to deactivate <strong>{deleteModal?.name}</strong>? They will lose access immediately.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setDeleteModal(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-text-muted hover:bg-black/5 cursor-pointer transition-colors">
              Cancel
            </button>
            <button onClick={handleDeleteConfirm} className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#085041] hover:bg-[#0A5040] cursor-pointer transition-colors">
              Deactivate
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
