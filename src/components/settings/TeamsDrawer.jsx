import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';
import api from '@/utils/api';

const TEAM_COLORS = [
  { bg: 'rgba(15,110,86,0.12)', text: '#085041', ring: '#0F6E56' },
  { bg: 'rgba(29,158,117,0.12)', text: '#085041', ring: '#1D9E75' },
  { bg: 'rgba(8,80,65,0.12)', text: '#085041', ring: '#085041' },
  { bg: 'rgba(39,192,136,0.12)', text: '#085041', ring: '#27C088' },
  { bg: 'rgba(51,168,112,0.12)', text: '#085041', ring: '#33A870' },
  { bg: 'rgba(30,122,92,0.12)', text: '#085041', ring: '#1E7A5C' },
];

function adaptTeam(t, idx) {
  const palette = TEAM_COLORS[idx % TEAM_COLORS.length];
  const memberCount = t.employeeCount ?? t.memberCount ?? 0;
  const circum = 2 * Math.PI * 20;
  const fill = Math.min(1, memberCount / 20) * circum;
  return {
    ...t,
    init: (t.name ?? '?')[0].toUpperCase(),
    bgColor: palette.bg,
    textColor: palette.text,
    ringColor: palette.ring,
    ringDash: `${fill.toFixed(1)} ${circum.toFixed(1)}`,
    members: memberCount,
    score: t.avgProductivityScore ?? t.avgScore ?? 0,
    scoreColor: '#0F6E56',
    desc: t.description ?? '',
  };
}

function TeamCard({ team, onEdit, onDelete }) {
  return (
    <div className="glossy-card flex flex-col">
      <div className="p-4 flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-tile flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: team.bgColor, color: team.textColor }}
        >
          {team.init}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-text-primary truncate">{team.name}</h4>
          <p className="text-2xs-plus text-text-muted mt-0.5">{team.desc}</p>
        </div>
        <div className="relative w-12 h-12 shrink-0">
          <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#E5E5DC" strokeWidth="3" />
            <circle
              cx="24" cy="24" r="20" fill="none"
              stroke={team.ringColor} strokeWidth="3" strokeLinecap="round"
              strokeDasharray={team.ringDash}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-2xs font-bold text-text-primary">
            {team.members}
          </span>
        </div>
      </div>

      <div className="px-4 pb-3 flex items-center gap-4 text-2xs-plus text-text-muted">
        <span><span className="font-semibold text-text-secondary">{team.members}</span> Members</span>
        <span>
          Avg Score{' '}
          <span className="font-semibold" style={{ color: team.scoreColor }}>{team.score}%</span>
        </span>
      </div>

      <div className="border-t border-black/[0.05] px-4 py-2.5 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-2xs font-semibold text-primary bg-primary/10 rounded-pill px-2 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Active
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(team)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors cursor-pointer">
            <Edit3 size={12} className="text-text-muted" />
          </button>
          <button onClick={() => onDelete(team)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-primary/5 transition-colors cursor-pointer">
            <Trash2 size={12} className="text-text-muted" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateTeamCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-card border-2 border-dashed border-neutral-warm/60 flex flex-col items-center justify-center gap-2 min-h-[160px] hover:border-primary/40 hover:bg-primary/[0.03] transition-colors cursor-pointer"
    >
      <div className="w-10 h-10 rounded-full border-2 border-dashed border-neutral-cool flex items-center justify-center">
        <Plus size={18} className="text-text-light" />
      </div>
      <span className="text-xs font-medium text-text-muted">Create New Team</span>
    </button>
  );
}

export default function TeamsDrawer() {
  const toast = useToast();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [editName, setEditName] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [newName, setNewName] = useState('');

  function loadTeams() {
    setLoading(true);
    api.get('/api/client/teams')
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : (data.data ?? []);
        setTeams(list.map((t, i) => adaptTeam(t, i)));
      })
      .catch(() => toast.error('Failed to load teams'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadTeams(); }, []);

  function handleEdit(team) { setEditModal(team); setEditName(team.name); }

  async function handleEditSave() {
    try {
      await api.put(`/api/client/teams/${editModal.id}`, { name: editName });
      toast.success(`Team renamed to "${editName}"`, 'Team Updated');
      setEditModal(null);
      loadTeams();
    } catch { toast.error('Failed to rename team'); }
  }

  function handleDelete(team) { setDeleteModal(team); }

  async function confirmDelete() {
    try {
      await api.delete(`/api/client/teams/${deleteModal.id}`);
      toast.success(`Team "${deleteModal.name}" deleted`, 'Team Removed');
      setDeleteModal(null);
      loadTeams();
    } catch { toast.error('Failed to delete team'); }
  }

  async function handleCreate() {
    if (!newName.trim()) { toast.warning('Please enter a team name'); return; }
    try {
      await api.post('/api/client/teams', { name: newName.trim() });
      toast.success(`Team "${newName}" created`, 'Team Created');
      setNewName('');
      setCreateModal(false);
      loadTeams();
    } catch { toast.error('Failed to create team'); }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="grid grid-cols-3 gap-4">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
        <CreateTeamCard onClick={() => setCreateModal(true)} />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Team"
        subtitle={`Are you sure you want to delete "${deleteModal?.name}"?`}
        size="sm"
      >
        <p className="text-sm text-text-muted mb-5">
          This action cannot be undone. All team members will become unassigned.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteModal(null)} className="px-5 py-2.5 rounded-pill text-sm font-medium text-text-muted cursor-pointer">
            Cancel
          </button>
          <button onClick={confirmDelete} className="bg-[#085041] text-white text-sm font-semibold rounded-pill px-6 py-2.5 cursor-pointer hover:bg-[#0A5040] transition-colors">
            Delete Team
          </button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editModal}
        onClose={() => setEditModal(null)}
        title="Edit Team"
        subtitle="Rename this team"
        size="sm"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full h-11 border border-black/10 rounded-[12px] bg-white px-4 text-sm text-text-primary outline-none focus:border-primary/40"
            onKeyDown={(e) => e.key === 'Enter' && handleEditSave()}
          />
          <div className="flex justify-end gap-3">
            <button onClick={() => setEditModal(null)} className="px-5 py-2.5 rounded-pill text-sm font-medium text-text-muted cursor-pointer">
              Cancel
            </button>
            <button onClick={handleEditSave} className="primary-pill text-white text-sm font-semibold rounded-pill px-6 py-2.5 cursor-pointer hover:opacity-90 transition-opacity">
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Create Modal */}
      <Modal
        open={createModal}
        onClose={() => setCreateModal(false)}
        title="Create New Team"
        subtitle="Add a new team to your organization"
        size="sm"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Team name..."
            className="w-full h-11 border border-black/10 rounded-[12px] bg-white px-4 text-sm text-text-primary outline-none focus:border-primary/40"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <div className="flex justify-end gap-3">
            <button onClick={() => setCreateModal(false)} className="px-5 py-2.5 rounded-pill text-sm font-medium text-text-muted cursor-pointer">
              Cancel
            </button>
            <button onClick={handleCreate} className="primary-pill text-white text-sm font-semibold rounded-pill px-6 py-2.5 cursor-pointer hover:opacity-90 transition-opacity">
              Create
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
