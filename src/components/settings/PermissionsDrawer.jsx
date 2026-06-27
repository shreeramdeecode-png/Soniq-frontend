import { useState, useEffect } from 'react';
import { Shield, Users, Eye, Ban, Save, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ROLE_META_BADGE } from '@/components/settings/settingsTheme';
import { useToast } from '@/components/ui/Toast';
import api from '@/utils/api';

const PERM_COLORS = ['#D0D0C8', '#1D9E75', '#0F6E56'];
const PERM_LABELS = ['No Access', 'Read Only', 'Full Access'];
const MODULES = ['Dashboard', 'Teams', 'Screenshots', 'Attendance', 'Reports', 'Settings', 'Access Control'];
const ROLE_ICONS = [Shield, Users, Eye, Ban];

const ROLE_PALETTE = [
  { labelColor: '#0F6E56', labelBg: 'rgba(29,158,117,.12)' },
  { labelColor: '#1D9E75', labelBg: 'rgba(15,110,86,.1)' },
  { labelColor: '#085041', labelBg: 'rgba(15,110,86,.1)' },
  { labelColor: '#AAA', labelBg: '#F5F5F0' },
];

function getRoleBadgeClass(role) {
  if (role.isSystemDefault) return 'dn';
  return 'db';
}

function RoleCard({ role, palette, Icon, isSelected, onClick, onDelete }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glossy-card p-5 flex items-start gap-3.5 text-left transition-all cursor-pointer rounded-[18px] relative group/card',
        isSelected && 'ring-2 ring-primary/40 shadow-[0_0_0_1px_rgba(15,110,86,0.15)]',
      )}
    >
      {!role.isSystemDefault && (
        <button
          onClick={e => { e.stopPropagation(); onDelete(role); }}
          className="absolute top-2.5 right-2.5 w-6 h-6 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity cursor-pointer"
        >
          <Trash2 size={11} />
        </button>
      )}
      <div
        className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
        style={{ background: palette.labelBg, color: palette.labelColor }}
      >
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-text-primary">{role.name}</p>
        <p className="text-xs-plus text-text-light mt-0.5">{role.isSystemDefault ? 'System role' : 'Custom role'}</p>
        <span className={cn('inline-block text-[10px] font-semibold rounded-pill px-2.5 py-0.5 mt-2', role.isSystemDefault ? 'text-[#888] bg-black/[0.06]' : 'text-[#0F6E56] bg-[rgba(29,158,117,0.12)]')}>
          {role.isSystemDefault ? 'Read Only' : 'Editable'}
        </span>
      </div>
    </div>
  );
}

function PermissionBar({ level, onChange, editable }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1 flex-1">
        {[0, 1, 2].map((seg) => (
          <button
            key={seg}
            onClick={() => editable && onChange(seg)}
            title={PERM_LABELS[seg]}
            className={cn('flex-1 h-3 rounded-[3px] transition-all border', editable && 'cursor-pointer hover:opacity-80')}
            style={{
              background: level >= seg ? PERM_COLORS[seg] : '#EEEEE8',
              borderColor: level >= seg ? PERM_COLORS[seg] : '#E0E0D8',
            }}
          />
        ))}
      </div>
      <span
        className="text-[10px] font-semibold rounded-pill px-3 py-1 w-[80px] text-center"
        style={{
          background: level === 0 ? '#F0F0EC' : level === 1 ? 'rgba(29,158,117,0.1)' : 'rgba(15,110,86,0.12)',
          color: PERM_COLORS[level],
        }}
      >
        {PERM_LABELS[level]}
      </span>
    </div>
  );
}

export default function PermissionsDrawer() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [perms, setPerms] = useState({});
  const [originalPerms, setOriginalPerms] = useState({});
  const [showNewRole, setShowNewRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [creating, setCreating] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api.get('/api/client/roles')
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : (data.items ?? data.data ?? []);
        setRoles(list);
        const firstEditable = list.find(r => !r.isSystemDefault) ?? list[0];
        if (firstEditable) setSelectedId(firstEditable.id);
        const map = {};
        list.forEach(r => {
          map[r.id] = Array.isArray(r.permissions) ? [...r.permissions] : Array(MODULES.length).fill(0);
        });
        setPerms(map);
        setOriginalPerms(map);
      })
      .catch(() => toast.error('Failed to load roles'))
      .finally(() => setLoading(false));
  }, []);

  const selected = roles.find(r => r.id === selectedId);
  const currentPerms = perms[selectedId] ?? Array(MODULES.length).fill(0);
  const editable = !!selected && !selected.isSystemDefault;

  function updatePerm(moduleIdx, level) {
    setPerms(prev => {
      const copy = { ...prev };
      copy[selectedId] = [...(copy[selectedId] ?? Array(MODULES.length).fill(0))];
      copy[selectedId][moduleIdx] = level;
      return copy;
    });
  }

  function resetPerms() {
    setPerms(prev => ({
      ...prev,
      [selectedId]: [...(originalPerms[selectedId] ?? Array(MODULES.length).fill(0))],
    }));
    toast.info('Permissions reset to saved values');
  }

  async function handleDeleteRole(role) {
    if (!window.confirm(`Delete role "${role.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/client/roles/${role.id}`);
      setRoles(prev => prev.filter(r => r.id !== role.id));
      if (selectedId === role.id) setSelectedId(roles.find(r => r.id !== role.id)?.id ?? null);
      toast.success(`Role "${role.name}" deleted`, 'Role Deleted');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to delete role');
    }
  }

  async function handleCreateRole() {
    const name = newRoleName.trim();
    if (!name) return;
    setCreating(true);
    try {
      const { data } = await api.post('/api/client/roles', { name });
      const newRole = data;
      setRoles(prev => [...prev, newRole]);
      const emptyPerms = Array(MODULES.length).fill(0);
      setPerms(prev => ({ ...prev, [newRole.id]: emptyPerms }));
      setOriginalPerms(prev => ({ ...prev, [newRole.id]: emptyPerms }));
      setSelectedId(newRole.id);
      setShowNewRole(false);
      setNewRoleName('');
      toast.success(`Role "${name}" created`, 'Role Created');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to create role');
    } finally {
      setCreating(false);
    }
  }

  async function handleSave() {
    try {
      await api.put(`/api/client/roles/${selectedId}`, { permissions: currentPerms });
      setOriginalPerms(prev => ({ ...prev, [selectedId]: [...currentPerms] }));
      toast.success('Permission changes saved', 'Permissions Updated');
    } catch {
      toast.error('Failed to save permissions');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Role strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {roles.map((role, idx) => {
          const palette = ROLE_PALETTE[idx % ROLE_PALETTE.length];
          const Icon = ROLE_ICONS[idx % ROLE_ICONS.length];
          return (
            <RoleCard
              key={role.id}
              role={role}
              palette={palette}
              Icon={Icon}
              isSelected={selectedId === role.id}
              onClick={() => setSelectedId(role.id)}
              onDelete={handleDeleteRole}
            />
          );
        })}
      </div>

      {/* Permission panel */}
      {selected && (
        <div className="glossy-card p-6 rounded-[20px]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h4 className="text-md font-bold text-text-primary">{selected.name} — Module Permissions</h4>
              <p className="text-xs-plus text-text-muted mt-0.5">Click a segment to change permission level</p>
            </div>
          </div>

          {/* Module permission rows */}
          <div className="space-y-4">
            {MODULES.map((mod, i) => (
              <div key={mod} className="flex items-center gap-5">
                <span className="text-sm font-medium text-text-secondary w-[160px] shrink-0">{mod}</span>
                <div className="flex-1">
                  <PermissionBar
                    level={currentPerms[i] ?? 0}
                    onChange={(level) => updatePerm(i, level)}
                    editable={editable}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-black/5">
            <div className="flex items-center gap-3">
              {editable && (
                <>
                  <button
                    onClick={handleSave}
                    className="primary-pill text-white text-xs font-semibold rounded-pill px-5 py-2.5 flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <Save size={12} /> Save Changes
                  </button>
                  <button
                    onClick={resetPerms}
                    className="text-xs font-medium text-text-muted hover:text-text-secondary flex items-center gap-1.5 cursor-pointer px-3 py-2"
                  >
                    <RotateCcw size={12} /> Reset to Default
                  </button>
                </>
              )}
            </div>
            {showNewRole ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={newRoleName}
                  onChange={e => setNewRoleName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleCreateRole(); if (e.key === 'Escape') { setShowNewRole(false); setNewRoleName(''); } }}
                  placeholder="Role name…"
                  className="h-8 border border-black/10 rounded-lg bg-surface-subtle px-3 text-xs text-text-primary outline-none focus:border-primary/40 w-[140px]"
                />
                <button
                  onClick={handleCreateRole}
                  disabled={!newRoleName.trim() || creating}
                  className="primary-pill text-white text-xs font-semibold px-3 py-1.5 rounded-pill cursor-pointer disabled:opacity-50"
                >
                  {creating ? '…' : 'Create'}
                </button>
                <button onClick={() => { setShowNewRole(false); setNewRoleName(''); }} className="text-xs text-text-muted hover:text-text-secondary cursor-pointer px-2">Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => setShowNewRole(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark cursor-pointer transition-colors px-3 py-2 rounded-lg hover:bg-primary/5"
              >
                <Plus size={13} /> Create Custom Role
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
