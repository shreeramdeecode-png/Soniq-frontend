import { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { settingsTeams } from '@/mock/settings';
import { useToast } from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';

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
          <button onClick={() => onDelete(team)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer">
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
  const [deleteModal, setDeleteModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [editName, setEditName] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [newName, setNewName] = useState('');

  function handleEdit(team) {
    setEditModal(team);
    setEditName(team.name);
  }

  function handleEditSave() {
    toast.success(`Team renamed to "${editName}"`, 'Team Updated');
    setEditModal(null);
  }

  function handleDelete(team) {
    setDeleteModal(team);
  }

  function confirmDelete() {
    toast.success(`Team "${deleteModal.name}" deleted`, 'Team Removed');
    setDeleteModal(null);
  }

  function handleCreate() {
    if (!newName.trim()) {
      toast.warning('Please enter a team name');
      return;
    }
    toast.success(`Team "${newName}" created`, 'Team Created');
    setNewName('');
    setCreateModal(false);
  }

  return (
    <div className="p-5">
      <div className="grid grid-cols-3 gap-4">
        {settingsTeams.map((team) => (
          <TeamCard key={team.name} team={team} onEdit={handleEdit} onDelete={handleDelete} />
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
          <button onClick={confirmDelete} className="bg-status-danger text-white text-sm font-semibold rounded-pill px-6 py-2.5 cursor-pointer hover:opacity-90 transition-opacity">
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
