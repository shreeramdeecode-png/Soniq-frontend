import { useState } from 'react';
import { Shield, Users, Eye, Ban, Save, RotateCcw, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { modules, rolePermsData, roleMeta, permColors, permLabels } from '@/mock/settings';
import { useToast } from '@/components/ui/Toast';

const ROLE_ICONS = {
  admin: Shield,
  manager: Users,
  viewer: Eye,
  noaccess: Ban,
};

const ROLE_ORDER = ['admin', 'manager', 'viewer', 'noaccess'];

function RoleCard({ roleKey, meta, isSelected, onClick }) {
  const Icon = ROLE_ICONS[roleKey] || Shield;

  return (
    <button
      onClick={onClick}
      className={cn(
        'glossy-card p-5 flex items-start gap-3.5 text-left transition-all cursor-pointer rounded-[18px]',
        isSelected && 'ring-2 ring-primary/40 shadow-[0_0_0_1px_rgba(15,110,86,0.15)]',
      )}
    >
      <div
        className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
        style={{ background: meta.labelBg, color: meta.labelColor }}
      >
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-text-primary">{meta.label === 'A' ? 'Admin' : meta.label === 'M' ? 'Manager' : meta.label === 'V' ? 'Viewer' : 'No Access'}</p>
        <p className="text-xs-plus text-text-light mt-0.5">{meta.members}</p>
        <span className={cn(
          'inline-block text-[10px] font-semibold rounded-pill px-2.5 py-0.5 mt-2',
          meta.badgeClass === 'dn' ? 'bg-neutral-warm/40 text-text-muted' : meta.badgeClass === 'db' ? 'bg-blue-500/10 text-blue-600' : 'bg-purple-500/10 text-purple-600',
        )}>
          {meta.badge}
        </span>
      </div>
    </button>
  );
}

function PermissionBar({ level, onChange, editable }) {
  const segments = [0, 1, 2];

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-3 flex-1 rounded-full overflow-hidden bg-surface-subtle border border-black/[0.05]">
        {segments.map((seg) => (
          <button
            key={seg}
            onClick={() => editable && onChange(seg)}
            className={cn(
              'flex-1 transition-colors',
              editable && 'cursor-pointer hover:opacity-80',
            )}
            style={{
              background: level >= seg ? permColors[seg] : undefined,
            }}
          />
        ))}
      </div>
      <span
        className="text-[10px] font-semibold rounded-pill px-3 py-1 w-[80px] text-center"
        style={{
          background: level === 0 ? '#F0F0EC' : level === 1 ? 'rgba(29,158,117,0.1)' : 'rgba(15,110,86,0.12)',
          color: permColors[level],
        }}
      >
        {permLabels[level]}
      </span>
    </div>
  );
}

export default function PermissionsDrawer() {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [perms, setPerms] = useState({ ...rolePermsData });
  const toast = useToast();

  const meta = roleMeta[selectedRole];
  const currentPerms = perms[selectedRole];
  const editable = meta.edit;

  function updatePerm(moduleIdx, level) {
    setPerms((prev) => {
      const copy = { ...prev };
      copy[selectedRole] = [...copy[selectedRole]];
      copy[selectedRole][moduleIdx] = level;
      return copy;
    });
  }

  function resetPerms() {
    setPerms((prev) => ({
      ...prev,
      [selectedRole]: [...rolePermsData[selectedRole]],
    }));
    toast.info('Permissions reset to defaults');
  }

  return (
    <div>
      {/* Role strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {ROLE_ORDER.map((key) => (
          <RoleCard
            key={key}
            roleKey={key}
            meta={roleMeta[key]}
            isSelected={selectedRole === key}
            onClick={() => setSelectedRole(key)}
          />
        ))}
      </div>

      {/* Permission panel */}
      <div className="glossy-card p-6 rounded-[20px]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h4 className="text-md font-bold text-text-primary">{meta.title}</h4>
            <p className="text-xs-plus text-text-muted mt-0.5">{meta.sub}</p>
          </div>
          {!editable && (
            <span className="text-xs font-semibold text-text-light bg-surface-subtle rounded-pill px-3.5 py-1.5 border border-black/5">
              🔒 Locked — Read Only
            </span>
          )}
        </div>

        {/* Module permission rows */}
        <div className="space-y-4">
          {modules.map((mod, i) => (
            <div key={mod} className="flex items-center gap-5">
              <span className="text-sm font-medium text-text-secondary w-[160px] shrink-0">{mod}</span>
              <div className="flex-1">
                <PermissionBar
                  level={currentPerms[i]}
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
                  onClick={() => toast.success('Permission changes saved', 'Permissions Updated')}
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
          <button className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark cursor-pointer transition-colors px-3 py-2 rounded-lg hover:bg-primary/5">
            <Plus size={13} /> Create Custom Role
          </button>
        </div>
      </div>
    </div>
  );
}
