export const employees = [
  { init: 'RS', name: 'Ravi Shankar', email: 'ravi@acme.com', team: 'Engineering', role: 'Admin', mode: 'Hybrid', os: 'Windows', exe: 'v2.4.1', last: '2 min', status: 'active', color: 'linear-gradient(135deg, #1D9E75, #0F6E56)', fc: '#fff', cap: true, blur: false, interval: 1, idle: true, idleMin: 5, hrs: 8, pHrs: 6, tgt: 82, days: [1, 1, 1, 1, 1, 0, 0] },
  { init: 'AM', name: 'Arjun Mehta', email: 'arjun@acme.com', team: 'Engineering', role: 'Manager', mode: 'Remote', os: 'macOS', exe: 'v2.4.1', last: '18 min', status: 'active', color: '#EAF2EE', fc: '#0F6E56', cap: true, blur: true, interval: 5, idle: true, idleMin: 3, hrs: 8, pHrs: 6, tgt: 82, days: [1, 1, 1, 1, 1, 0, 0] },
  { init: 'PK', name: 'Priya Krishnan', email: 'priya@acme.com', team: 'Design', role: 'Manager', mode: 'Hybrid', os: 'macOS', exe: 'v2.4.1', last: '5 min', status: 'active', color: 'linear-gradient(135deg, #1D9E75, #0F6E56)', fc: '#fff', cap: true, blur: false, interval: 10, idle: false, idleMin: 5, hrs: 8, pHrs: 5, tgt: 75, days: [1, 1, 1, 1, 1, 0, 0] },
  { init: 'SN', name: 'Sneha Nair', email: 'sneha@acme.com', team: 'Sales', role: 'Employee', mode: 'Office', os: 'Windows', exe: 'v2.3.8', last: '1 hr', status: 'active', color: '#EAF2EE', fc: '#085041', cap: true, blur: false, interval: 1, idle: true, idleMin: 5, hrs: 9, pHrs: 6, tgt: 70, days: [1, 1, 1, 1, 1, 1, 0] },
  { init: 'MK', name: 'Meera Kapoor', email: 'meera@acme.com', team: 'Design', role: 'Employee', mode: 'Remote', os: 'Windows', exe: 'v2.3.8', last: '3 hr', status: 'pending', color: '#F0F0E8', fc: '#888', cap: false, blur: false, interval: 10, idle: false, idleMin: 5, hrs: 8, pHrs: 5, tgt: 75, days: [1, 1, 1, 1, 0, 0, 0] },
];

export const settingsTeams = [
  { init: 'EN', name: 'Engineering', desc: 'Core product & backend', members: 34, score: 88, scoreColor: '#0F6E56', ringColor: '#1D9E75', ringDash: '94 33', bgColor: 'rgba(29,158,117,.12)', textColor: '#0F6E56' },
  { init: 'DS', name: 'Design', desc: 'UX, UI and visual design', members: 18, score: 76, scoreColor: '#1D9E75', ringColor: '#85C4B0', ringDash: '50 77', bgColor: 'rgba(15,110,86,.1)', textColor: '#085041' },
  { init: 'SL', name: 'Sales', desc: 'Revenue and BD', members: 24, score: 64, scoreColor: '#085041', ringColor: '#1D9E75', ringDash: '66 61', bgColor: 'rgba(15,110,86,.08)', textColor: '#0A5040' },
  { init: 'PR', name: 'Product', desc: 'Product management', members: 12, score: 83, scoreColor: '#0F6E56', ringColor: '#1D9E75', ringDash: '34 93', bgColor: 'rgba(29,158,117,.12)', textColor: '#085041' },
  { init: 'SP', name: 'Support', desc: 'Customer success', members: 20, score: 71, scoreColor: '#1D9E75', ringColor: '#0F6E56', ringDash: '56 71', bgColor: 'rgba(15,110,86,.1)', textColor: '#0F6E56' },
];

export const modules = ['Dashboard', 'Teams', 'Screenshots', 'Attendance', 'Reports', 'Settings', 'Access Control'];

export const rolePermsData = {
  admin: [2, 2, 2, 2, 2, 2, 2],
  manager: [2, 2, 1, 1, 1, 0, 0],
  viewer: [1, 1, 1, 1, 1, 0, 0],
  noaccess: [0, 0, 0, 0, 0, 0, 0],
};

export const roleMeta = {
  admin: { title: 'Admin — Module Permissions', sub: 'System role · read only', edit: false, label: 'A', labelColor: '#0F6E56', labelBg: 'rgba(29,158,117,.12)', badge: 'System · locked', badgeClass: 'dn', members: 'Full access · 3 members' },
  manager: { title: 'Manager — Module Permissions', sub: '12 members · editable role', edit: true, label: 'M', labelColor: '#1D9E75', labelBg: 'rgba(15,110,86,.1)', badge: 'Editable', badgeClass: 'db', members: 'Restricted · 12 members' },
  viewer: { title: 'Viewer — Module Permissions', sub: 'Custom role · 8 members', edit: true, label: 'V', labelColor: '#085041', labelBg: 'rgba(15,110,86,.1)', badge: 'Custom · editable', badgeClass: 'dp', members: 'Read-only · 8 members' },
  noaccess: { title: 'No Access — Module Permissions', sub: 'System role · locked', edit: false, label: 'N', labelColor: '#AAA', labelBg: '#F5F5F0', badge: 'System · locked', badgeClass: 'dn', members: 'Blocked · 2 members' },
};

export const permColors = ['#D0D0C8', '#1D9E75', '#0F6E56'];
export const permLabels = ['No Access', 'Read Only', 'Full Access'];

export const settingsSections = [
  {
    id: 'teams',
    num: '01',
    name: 'Teams & Structure',
    hint: 'Create, rename and manage your teams · member counts and productivity rings',
    barColor: '#0F6E56',
    chips: [{ label: '5 teams', class: 'default' }, { label: '128 employees', class: 'default' }],
    group: 'org',
  },
  {
    id: 'people',
    num: '02',
    name: 'People & Roles',
    hint: 'Invite employees, assign teams and roles · EXE installation status · work mode',
    barColor: '#1D9E75',
    chips: [{ label: '3 pending', class: 'warn' }, { label: '128 employees', class: 'default' }],
    group: 'org',
  },
  {
    id: 'workpolicy',
    num: '03',
    name: 'Work Policy',
    hint: 'Working schedule and productivity targets · per employee · affects dashboard and reports',
    barColor: '#085041',
    chips: [{ label: 'Schedule + Targets merged', class: 'merged' }],
    group: 'work',
  },
  {
    id: 'monitoring',
    num: '04',
    name: 'Monitoring Controls',
    hint: 'Screen capture toggle · Gaussian blur · interval · idle detection threshold per employee',
    barColor: '#0F6E56',
    chips: [{ label: 'Capture + Idle merged', class: 'merged' }, { label: 'Syncs in 1h', class: 'default' }],
    group: 'work',
  },
  {
    id: 'stealth',
    num: '05',
    name: 'Silent Tracking',
    hint: 'Invisible background monitoring · gated behind mandatory legal consent · never merged with other sections',
    barColor: '#0A5040',
    chips: [{ label: 'Legal gate', class: 'danger' }],
    group: 'work',
  },
  {
    id: 'defaults',
    num: '06',
    name: 'Org Defaults',
    hint: 'Global fallbacks auto-applied to every new employee · per-employee settings always override these',
    barColor: '#1D9E75',
    chips: [{ label: 'Org-wide', class: 'purple' }],
    group: 'access',
  },
  {
    id: 'access',
    num: '07',
    name: 'Permissions & Access',
    hint: 'Role-based module access · colour-fill bar matrix · create custom roles · 4 roles configured',
    barColor: '#0F6E56',
    chips: [{ label: '4 roles', class: 'purple' }, { label: '2 custom', class: 'default' }],
    group: 'access',
  },
];

export const settingsGroups = [
  { id: 'org', name: 'Organisation & People', color: '#0F6E56', count: '2 sections' },
  { id: 'work', name: 'Work & Monitoring', color: '#1D9E75', count: '3 sections' },
  { id: 'access', name: 'Access & Controls', color: '#085041', count: '2 sections' },
];

export const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
