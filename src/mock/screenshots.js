export const screenshotPageStats = {
  total: '1,842',
  subtitle: 'total today · Auto-refresh on',
};

export const filterChips = [
  { id: 'all', label: 'All', variant: 'active' },
  { id: 'productive', label: 'Productive', variant: 'primary' },
  { id: 'neutral', label: 'Neutral', variant: 'default' },
  { id: 'unproductive', label: 'Unproductive', variant: 'default' },
  { id: 'idle', label: 'Idle', variant: 'default' },
];

export const sidebarTeams = [
  {
    name: 'Engineering',
    count: 34,
    employees: [
      { id: 'ravi', initials: 'RS', name: 'Ravi Shankar', shots: '148 shots today', avatarBg: 'linear-gradient(135deg, #1D9E75, #0F6E56)', avatarColor: '#fff', dotColor: '#1D9E75', active: true },
      { id: 'arjun', initials: 'AM', name: 'Arjun Mehta', shots: '132 shots today', avatarBg: '#E8E0C8', avatarColor: '#888', dotColor: '#1A1A1A', active: false },
      { id: 'karthik', initials: 'KR', name: 'Karthik Rajan', shots: '89 shots today', avatarBg: '#D8D8D0', avatarColor: '#888', dotColor: '#D97706', active: false },
      { id: 'swetha', initials: 'SV', name: 'Swetha Varman', shots: '104 shots today', avatarBg: '#E8E0C8', avatarColor: '#888', dotColor: '#1A1A1A', active: false },
    ],
  },
  {
    name: 'Design',
    count: 18,
    employees: [
      { id: 'priya', initials: 'PK', name: 'Priya Krishnan', shots: '126 shots today', avatarBg: 'linear-gradient(135deg, #1D9E75, #0F6E56)', avatarColor: '#fff', dotColor: '#1A1A1A', active: false },
      { id: 'meera', initials: 'MK', name: 'Meera Kapoor', shots: '67 shots today', avatarBg: '#D8D8D0', avatarColor: '#888', dotColor: '#D97706', active: false },
    ],
  },
  {
    name: 'Sales',
    count: 24,
    employees: [
      { id: 'sneha', initials: 'SN', name: 'Sneha Nair', shots: '58 shots today', avatarBg: '#E8E0C8', avatarColor: '#888', dotColor: '#CCC', active: false },
      { id: 'arun', initials: 'AT', name: 'Arun Thomas', shots: '72 shots today', avatarBg: '#D8D8D0', avatarColor: '#888', dotColor: '#1A1A1A', active: false },
    ],
  },
  {
    name: 'Support',
    count: 22,
    employees: [
      { id: 'vikram', initials: 'VB', name: 'Vikram Bose', shots: '111 shots today', avatarBg: 'linear-gradient(135deg, #162E24, #0F6E56)', avatarColor: '#1D9E75', dotColor: '#1A1A1A', active: false },
      { id: 'nisha', initials: 'NK', name: 'Nisha Kumar', shots: '93 shots today', avatarBg: '#E8E0C8', avatarColor: '#888', dotColor: '#1A1A1A', active: false },
    ],
  },
];

export const selectedPerson = {
  initials: 'RS',
  name: 'Ravi Shankar',
  avatarBg: 'linear-gradient(135deg, #1D9E75, #0F6E56)',
  avatarColor: '#fff',
  team: 'Engineering',
  status: 'Work Mode',
  statusDotColor: '#1D9E75',
  os: 'Windows 11',
  lastActive: '2:41 PM',
  stats: [
    { value: '148', label: 'Shots today' },
    { value: '91%', label: 'Productive', highlight: true },
    { value: '1 min', label: 'Interval' },
  ],
  blurEnabled: true,
};

export const screenshots = [
  {
    id: 1,
    time: '2:41 PM',
    app: 'VS Code · main.py',
    category: 'productive',
    blurred: false,
    idle: false,
    bgStyle: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)',
    iconType: 'code',
  },
  {
    id: 2,
    time: '2:40 PM',
    app: 'VS Code · api.ts',
    category: 'productive',
    blurred: false,
    idle: false,
    bgStyle: 'linear-gradient(135deg, #252520, #1E1E18)',
    iconType: 'monitor',
  },
  {
    id: 3,
    time: '2:38 PM',
    app: 'Chrome · docs.google.com',
    category: 'neutral',
    blurred: false,
    idle: false,
    bgStyle: 'linear-gradient(135deg, #E8E4D8, #D8D4C8)',
    iconType: 'chrome',
  },
  {
    id: 4,
    time: '2:36 PM',
    app: 'Chrome · blurred',
    category: 'neutral',
    blurred: true,
    idle: false,
    bgStyle: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)',
    iconType: 'monitor',
  },
  {
    id: 5,
    time: '2:35 PM',
    app: 'VS Code · components/',
    category: 'productive',
    blurred: false,
    idle: false,
    bgStyle: 'linear-gradient(135deg, #1E1E1E, #282828)',
    iconType: 'code',
  },
  {
    id: 6,
    time: '2:32 PM',
    app: 'Desktop · no activity',
    category: 'idle',
    blurred: false,
    idle: true,
    bgStyle: 'linear-gradient(135deg, #F0ECD8, #E4E0CC)',
    iconType: 'clock',
  },
  {
    id: 7,
    time: '2:28 PM',
    app: 'Chrome · blurred',
    category: 'neutral',
    blurred: true,
    idle: false,
    bgStyle: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)',
    iconType: 'monitor',
  },
  {
    id: 8,
    time: '2:25 PM',
    app: 'Slack · #engineering',
    category: 'neutral',
    blurred: false,
    idle: false,
    bgStyle: 'linear-gradient(135deg, #3A3520, #2A2818)',
    iconType: 'slack',
  },
];
