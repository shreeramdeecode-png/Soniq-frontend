import { useState, useMemo } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import { CHIP_STYLES } from '@/components/settings/settingsTheme';
import TeamsDrawer from '@/components/settings/TeamsDrawer';
import PeopleDrawer from '@/components/settings/PeopleDrawer';
import WorkPolicyDrawer from '@/components/settings/WorkPolicyDrawer';
import MonitoringDrawer from '@/components/settings/MonitoringDrawer';
import StealthDrawer from '@/components/settings/StealthDrawer';
import DefaultsDrawer from '@/components/settings/DefaultsDrawer';
import PermissionsDrawer from '@/components/settings/PermissionsDrawer';

const settingsSections = [
  { id: 'teams', num: '01', name: 'Teams & Structure', hint: 'Create, rename and manage your teams · member counts and productivity rings', barColor: '#0F6E56', chips: [{ label: 'Teams', class: 'default' }], group: 'org' },
  { id: 'people', num: '02', name: 'People & Roles', hint: 'Invite employees, assign teams and roles · EXE installation status · work mode', barColor: '#1D9E75', chips: [{ label: 'Employees', class: 'default' }], group: 'org' },
  { id: 'workpolicy', num: '03', name: 'Work Policy', hint: 'Working schedule and productivity targets · per employee · affects dashboard and reports', barColor: '#085041', chips: [{ label: 'Schedule + Targets merged', class: 'merged' }], group: 'work' },
  { id: 'monitoring', num: '04', name: 'Monitoring Controls', hint: 'Screen capture toggle · Gaussian blur · interval · idle detection threshold per employee', barColor: '#0F6E56', chips: [{ label: 'Capture + Idle merged', class: 'merged' }, { label: 'Syncs in 1h', class: 'default' }], group: 'work' },
  { id: 'stealth', num: '05', name: 'Silent Tracking', hint: 'Invisible background monitoring · gated behind mandatory legal consent · never merged with other sections', barColor: '#0A5040', chips: [{ label: 'Legal gate', class: 'danger' }], group: 'work' },
  { id: 'defaults', num: '06', name: 'Org Defaults', hint: 'Global fallbacks auto-applied to every new employee · per-employee settings always override these', barColor: '#1D9E75', chips: [{ label: 'Org-wide', class: 'purple' }], group: 'access' },
  { id: 'access', num: '07', name: 'Permissions & Access', hint: 'Role-based module access · colour-fill bar matrix · create custom roles', barColor: '#0F6E56', chips: [{ label: 'Role matrix', class: 'purple' }], group: 'access' },
];

const settingsGroups = [
  { id: 'org', name: 'Organisation & People', color: '#0F6E56', count: '2 sections' },
  { id: 'work', name: 'Work & Monitoring', color: '#1D9E75', count: '3 sections' },
  { id: 'access', name: 'Access & Controls', color: '#085041', count: '2 sections' },
];
import { cn } from '@/utils/cn';

const DRAWER_MAP = {
  teams: TeamsDrawer,
  people: PeopleDrawer,
  workpolicy: WorkPolicyDrawer,
  monitoring: MonitoringDrawer,
  stealth: StealthDrawer,
  defaults: DefaultsDrawer,
  access: PermissionsDrawer,
};

export default function SettingsPage() {
  const [openSection, setOpenSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return settingsSections;
    const q = searchQuery.toLowerCase();
    return settingsSections.filter(
      (s) => s.name.toLowerCase().includes(q) || s.hint.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredGroups = useMemo(() => {
    const sectionGroupIds = new Set(filteredSections.map((s) => s.group));
    return settingsGroups.filter((g) => sectionGroupIds.has(g.id));
  }, [filteredSections]);

  function toggleSection(id) {
    setOpenSection((prev) => (prev === id ? null : id));
  }

  return (
    <div className="relative z-[2]">
      {/* Page Header */}
      <div className="flex items-end justify-between px-9 pt-[18px] pb-[22px]">
        <div>
          <div className="text-xs text-text-lighter mb-[5px]">Dashboard › Settings</div>
          <h1 className="text-[28px] font-extrabold text-text-primary tracking-tight">Settings</h1>
          <div className="text-xs-plus text-text-light mt-[3px]">7 sections · click any row to expand inline</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="glass-pill flex items-center gap-[7px] h-[34px] px-[13px] rounded-pill min-w-[220px]">
            <Search size={12} stroke="#BBBBAA" strokeWidth={2} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-none bg-transparent outline-none text-xs-plus font-poppins text-text-primary w-full placeholder:text-text-lighter"
              placeholder="Search settings…"
            />
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="mx-9 mb-12 bg-white/[0.88] rounded-[22px] border border-white/[0.98] shadow-[0_2px_0_rgba(255,255,255,0.95)_inset,0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4 px-6 border-b border-black/[0.06] bg-white/50">
          <div>
            <div className="text-[14px] font-bold text-text-primary">Configuration Sections</div>
            <div className="text-2xs-plus text-text-light">Expand any row · all changes save per section</div>
          </div>
          <div className="flex items-center gap-1.5 text-2xs text-text-light">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-[2px] bg-[#0F6E56] inline-block" />Org & People</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-[2px] bg-[#1D9E75] inline-block" />Work & Monitoring</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-[2px] bg-[#085041] inline-block" />Access & Controls</span>
          </div>
        </div>

        {/* Sections */}
        {filteredGroups.map((group) => (
          <div key={group.id}>
            {/* Group bar */}
            <div className="flex items-center gap-0 py-2 px-6 bg-black/[0.025] border-b border-black/[0.06] border-t border-black/[0.04]">
              <div className="w-[3px] h-4 rounded-[2px] mr-2.5 shrink-0" style={{ background: group.color }} />
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider flex-1">{group.name}</div>
              <div className="text-2xs text-text-lighter font-semibold">{group.count}</div>
            </div>

            {/* Section rows for this group */}
            {filteredSections
              .filter((s) => s.group === group.id)
              .map((section) => {
                const isOpen = openSection === section.id;
                const DrawerComponent = DRAWER_MAP[section.id];
                return (
                  <div key={section.id}>
                    {/* Row */}
                    <div
                      onClick={() => toggleSection(section.id)}
                      className={cn(
                        'flex items-center px-6 border-b border-black/5 cursor-pointer relative transition-colors',
                        isOpen && 'bg-primary/[0.04]'
                      )}
                    >
                      {isOpen && (
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-[2px]" style={{ background: section.barColor }} />
                      )}
                      <div className="flex items-center w-full py-[15px]">
                        <div className={cn('text-md font-bold w-8 shrink-0 tabular-nums transition-colors', isOpen ? 'text-text-primary' : 'text-neutral-warm')}>
                          {section.num}
                        </div>
                        <div className={cn('w-[3px] h-[38px] rounded-[2px] mr-4 shrink-0 transition-opacity', isOpen ? 'opacity-100' : 'opacity-50')} style={{ background: section.barColor }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-md font-semibold text-text-primary mb-0.5 tracking-tight">{section.name}</div>
                          <div className="text-xs-plus text-text-light leading-snug">{section.hint}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {section.chips.map((chip, i) => (
                            <span key={i} className={cn('text-2xs font-bold py-[3px] px-[9px] rounded-[20px] whitespace-nowrap', CHIP_STYLES[chip.class])}>
                              {chip.label}
                            </span>
                          ))}
                          <div className={cn('w-[22px] h-[22px] rounded-full bg-black/[0.06] flex items-center justify-center transition-all shrink-0 ml-1', isOpen && 'bg-black/10')}>
                            <ChevronRight size={8} stroke="#888" strokeWidth={2.5} className={cn('transition-transform', isOpen && 'rotate-90')} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Drawer */}
                    {isOpen && DrawerComponent && (
                      <div className="border-b border-black/5">
                        <div className="py-6 px-8">
                          <DrawerComponent />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
