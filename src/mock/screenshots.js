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

export const employeeProfiles = {
  ravi: {
    initials: 'RS', name: 'Ravi Shankar',
    avatarBg: 'linear-gradient(135deg, #1D9E75, #0F6E56)', avatarColor: '#fff',
    team: 'Engineering', status: 'Work Mode', statusDotColor: '#1D9E75',
    os: 'Windows 11', lastActive: '2:41 PM',
    stats: [{ value: '148', label: 'Shots today' }, { value: '91%', label: 'Productive', highlight: true }, { value: '1 min', label: 'Interval' }],
  },
  arjun: {
    initials: 'AM', name: 'Arjun Mehta',
    avatarBg: '#E8E0C8', avatarColor: '#888',
    team: 'Engineering', status: 'Work Mode', statusDotColor: '#1A1A1A',
    os: 'macOS 14', lastActive: '2:38 PM',
    stats: [{ value: '132', label: 'Shots today' }, { value: '87%', label: 'Productive', highlight: true }, { value: '1 min', label: 'Interval' }],
  },
  karthik: {
    initials: 'KR', name: 'Karthik Rajan',
    avatarBg: '#D8D8D0', avatarColor: '#888',
    team: 'Engineering', status: 'Privacy', statusDotColor: '#D97706',
    os: 'Windows 11', lastActive: '2:22 PM',
    stats: [{ value: '89', label: 'Shots today' }, { value: '72%', label: 'Productive', highlight: true }, { value: '2 min', label: 'Interval' }],
  },
  swetha: {
    initials: 'SV', name: 'Swetha Varman',
    avatarBg: '#E8E0C8', avatarColor: '#888',
    team: 'Engineering', status: 'Work Mode', statusDotColor: '#1A1A1A',
    os: 'Windows 11', lastActive: '2:35 PM',
    stats: [{ value: '104', label: 'Shots today' }, { value: '80%', label: 'Productive', highlight: true }, { value: '1 min', label: 'Interval' }],
  },
  priya: {
    initials: 'PK', name: 'Priya Krishnan',
    avatarBg: 'linear-gradient(135deg, #1D9E75, #0F6E56)', avatarColor: '#fff',
    team: 'Design', status: 'Work Mode', statusDotColor: '#1A1A1A',
    os: 'macOS 14', lastActive: '2:40 PM',
    stats: [{ value: '126', label: 'Shots today' }, { value: '88%', label: 'Productive', highlight: true }, { value: '1 min', label: 'Interval' }],
  },
  meera: {
    initials: 'MK', name: 'Meera Kapoor',
    avatarBg: '#D8D8D0', avatarColor: '#888',
    team: 'Design', status: 'Privacy', statusDotColor: '#D97706',
    os: 'macOS 14', lastActive: '1:55 PM',
    stats: [{ value: '67', label: 'Shots today' }, { value: '65%', label: 'Productive', highlight: true }, { value: '3 min', label: 'Interval' }],
  },
  sneha: {
    initials: 'SN', name: 'Sneha Nair',
    avatarBg: '#E8E0C8', avatarColor: '#888',
    team: 'Sales', status: 'Offline', statusDotColor: '#CCC',
    os: 'Windows 10', lastActive: '12:30 PM',
    stats: [{ value: '58', label: 'Shots today' }, { value: '60%', label: 'Productive', highlight: true }, { value: '2 min', label: 'Interval' }],
  },
  arun: {
    initials: 'AT', name: 'Arun Thomas',
    avatarBg: '#D8D8D0', avatarColor: '#888',
    team: 'Sales', status: 'Work Mode', statusDotColor: '#1A1A1A',
    os: 'Windows 11', lastActive: '2:33 PM',
    stats: [{ value: '72', label: 'Shots today' }, { value: '78%', label: 'Productive', highlight: true }, { value: '2 min', label: 'Interval' }],
  },
  vikram: {
    initials: 'VB', name: 'Vikram Bose',
    avatarBg: 'linear-gradient(135deg, #162E24, #0F6E56)', avatarColor: '#1D9E75',
    team: 'Support', status: 'Work Mode', statusDotColor: '#1A1A1A',
    os: 'Linux', lastActive: '2:39 PM',
    stats: [{ value: '111', label: 'Shots today' }, { value: '83%', label: 'Productive', highlight: true }, { value: '1 min', label: 'Interval' }],
  },
  nisha: {
    initials: 'NK', name: 'Nisha Kumar',
    avatarBg: '#E8E0C8', avatarColor: '#888',
    team: 'Support', status: 'Work Mode', statusDotColor: '#1A1A1A',
    os: 'macOS 14', lastActive: '2:36 PM',
    stats: [{ value: '93', label: 'Shots today' }, { value: '85%', label: 'Productive', highlight: true }, { value: '1 min', label: 'Interval' }],
  },
};

export const screenshots = [
  // Ravi Shankar
  { id: 1, employeeId: 'ravi', time: '2:41 PM', app: 'VS Code · main.py', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)', iconType: 'code' },
  { id: 2, employeeId: 'ravi', time: '2:40 PM', app: 'VS Code · api.ts', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #252520, #1E1E18)', iconType: 'monitor' },
  { id: 3, employeeId: 'ravi', time: '2:38 PM', app: 'Chrome · docs.google.com', category: 'neutral', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #E8E4D8, #D8D4C8)', iconType: 'chrome' },
  { id: 4, employeeId: 'ravi', time: '2:36 PM', app: 'Chrome · blurred', category: 'neutral', blurred: true, idle: false, bgStyle: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)', iconType: 'monitor' },
  { id: 5, employeeId: 'ravi', time: '2:35 PM', app: 'VS Code · components/', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #1E1E1E, #282828)', iconType: 'code' },
  { id: 6, employeeId: 'ravi', time: '2:32 PM', app: 'Desktop · no activity', category: 'idle', blurred: false, idle: true, bgStyle: 'linear-gradient(135deg, #F0ECD8, #E4E0CC)', iconType: 'clock' },
  { id: 7, employeeId: 'ravi', time: '2:28 PM', app: 'Chrome · blurred', category: 'neutral', blurred: true, idle: false, bgStyle: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)', iconType: 'monitor' },
  { id: 8, employeeId: 'ravi', time: '2:25 PM', app: 'Slack · #engineering', category: 'neutral', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #3A3520, #2A2818)', iconType: 'slack' },
  // Arjun Mehta
  { id: 9, employeeId: 'arjun', time: '2:38 PM', app: 'IntelliJ · UserService.java', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #2B1B3D, #1A1128)', iconType: 'code' },
  { id: 10, employeeId: 'arjun', time: '2:35 PM', app: 'Chrome · stackoverflow.com', category: 'neutral', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #E8E4D8, #D8D4C8)', iconType: 'chrome' },
  { id: 11, employeeId: 'arjun', time: '2:32 PM', app: 'Terminal · build logs', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)', iconType: 'monitor' },
  { id: 12, employeeId: 'arjun', time: '2:28 PM', app: 'Slack · #backend', category: 'neutral', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #3A3520, #2A2818)', iconType: 'slack' },
  { id: 13, employeeId: 'arjun', time: '2:25 PM', app: 'IntelliJ · tests/', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #252520, #1E1E18)', iconType: 'code' },
  { id: 14, employeeId: 'arjun', time: '2:20 PM', app: 'Desktop · no activity', category: 'idle', blurred: false, idle: true, bgStyle: 'linear-gradient(135deg, #F0ECD8, #E4E0CC)', iconType: 'clock' },
  // Karthik Rajan
  { id: 15, employeeId: 'karthik', time: '2:22 PM', app: 'Figma · Dashboard v2', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #1A1A2E, #16213E)', iconType: 'monitor' },
  { id: 16, employeeId: 'karthik', time: '2:18 PM', app: 'Figma · Components', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #2D2B55, #1E1B3D)', iconType: 'monitor' },
  { id: 17, employeeId: 'karthik', time: '2:15 PM', app: 'Chrome · dribbble.com', category: 'neutral', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #E8E4D8, #D8D4C8)', iconType: 'chrome' },
  { id: 18, employeeId: 'karthik', time: '2:10 PM', app: 'Chrome · blurred', category: 'neutral', blurred: true, idle: false, bgStyle: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)', iconType: 'monitor' },
  { id: 19, employeeId: 'karthik', time: '2:05 PM', app: 'Slack · #design', category: 'neutral', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #3A3520, #2A2818)', iconType: 'slack' },
  // Swetha Varman
  { id: 20, employeeId: 'swetha', time: '2:35 PM', app: 'VS Code · App.tsx', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)', iconType: 'code' },
  { id: 21, employeeId: 'swetha', time: '2:33 PM', app: 'Chrome · localhost:3000', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #E8E4D8, #D8D4C8)', iconType: 'chrome' },
  { id: 22, employeeId: 'swetha', time: '2:30 PM', app: 'VS Code · styles.css', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #252520, #1E1E18)', iconType: 'code' },
  { id: 23, employeeId: 'swetha', time: '2:27 PM', app: 'Terminal · npm run dev', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #1E1E1E, #282828)', iconType: 'monitor' },
  { id: 24, employeeId: 'swetha', time: '2:22 PM', app: 'Notion · Sprint board', category: 'neutral', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #F5F0E0, #E8E0C8)', iconType: 'monitor' },
  // Priya Krishnan
  { id: 25, employeeId: 'priya', time: '2:40 PM', app: 'Figma · Mobile App UI', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #1A1A2E, #16213E)', iconType: 'monitor' },
  { id: 26, employeeId: 'priya', time: '2:37 PM', app: 'Figma · Icon Set', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #2D2B55, #1E1B3D)', iconType: 'monitor' },
  { id: 27, employeeId: 'priya', time: '2:34 PM', app: 'Chrome · fonts.google.com', category: 'neutral', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #E8E4D8, #D8D4C8)', iconType: 'chrome' },
  { id: 28, employeeId: 'priya', time: '2:30 PM', app: 'Slack · #design-review', category: 'neutral', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #3A3520, #2A2818)', iconType: 'slack' },
  { id: 29, employeeId: 'priya', time: '2:25 PM', app: 'Desktop · no activity', category: 'idle', blurred: false, idle: true, bgStyle: 'linear-gradient(135deg, #F0ECD8, #E4E0CC)', iconType: 'clock' },
  // Meera Kapoor
  { id: 30, employeeId: 'meera', time: '1:55 PM', app: 'Illustrator · Logo v3', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #2D1B00, #1A1100)', iconType: 'monitor' },
  { id: 31, employeeId: 'meera', time: '1:50 PM', app: 'Chrome · blurred', category: 'neutral', blurred: true, idle: false, bgStyle: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)', iconType: 'monitor' },
  { id: 32, employeeId: 'meera', time: '1:45 PM', app: 'Figma · Brand Guide', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #1A1A2E, #16213E)', iconType: 'monitor' },
  { id: 33, employeeId: 'meera', time: '1:40 PM', app: 'Desktop · no activity', category: 'idle', blurred: false, idle: true, bgStyle: 'linear-gradient(135deg, #F0ECD8, #E4E0CC)', iconType: 'clock' },
  // Sneha Nair
  { id: 34, employeeId: 'sneha', time: '12:30 PM', app: 'Salesforce · Leads', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #00274D, #001B36)', iconType: 'monitor' },
  { id: 35, employeeId: 'sneha', time: '12:25 PM', app: 'Chrome · gmail.com', category: 'neutral', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #E8E4D8, #D8D4C8)', iconType: 'chrome' },
  { id: 36, employeeId: 'sneha', time: '12:20 PM', app: 'Zoom · Client call', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #1A3A5C, #0F2640)', iconType: 'monitor' },
  { id: 37, employeeId: 'sneha', time: '12:15 PM', app: 'Desktop · no activity', category: 'idle', blurred: false, idle: true, bgStyle: 'linear-gradient(135deg, #F0ECD8, #E4E0CC)', iconType: 'clock' },
  // Arun Thomas
  { id: 38, employeeId: 'arun', time: '2:33 PM', app: 'HubSpot · Deals', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #FF5C35, #E84420)', iconType: 'monitor' },
  { id: 39, employeeId: 'arun', time: '2:28 PM', app: 'Chrome · linkedin.com', category: 'neutral', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #E8E4D8, #D8D4C8)', iconType: 'chrome' },
  { id: 40, employeeId: 'arun', time: '2:22 PM', app: 'Google Sheets · Q2 Pipeline', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #1D7044, #0F5530)', iconType: 'monitor' },
  { id: 41, employeeId: 'arun', time: '2:18 PM', app: 'Slack · #sales', category: 'neutral', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #3A3520, #2A2818)', iconType: 'slack' },
  // Vikram Bose
  { id: 42, employeeId: 'vikram', time: '2:39 PM', app: 'Zendesk · Ticket #4521', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #03363D, #022B31)', iconType: 'monitor' },
  { id: 43, employeeId: 'vikram', time: '2:35 PM', app: 'Chrome · docs.company.com', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #E8E4D8, #D8D4C8)', iconType: 'chrome' },
  { id: 44, employeeId: 'vikram', time: '2:30 PM', app: 'Slack · #support-escalation', category: 'neutral', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #3A3520, #2A2818)', iconType: 'slack' },
  { id: 45, employeeId: 'vikram', time: '2:26 PM', app: 'Zendesk · Ticket #4519', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #03363D, #022B31)', iconType: 'monitor' },
  { id: 46, employeeId: 'vikram', time: '2:20 PM', app: 'Chrome · blurred', category: 'neutral', blurred: true, idle: false, bgStyle: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)', iconType: 'monitor' },
  // Nisha Kumar
  { id: 47, employeeId: 'nisha', time: '2:36 PM', app: 'Intercom · Chat queue', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #1F1F4B, #14143A)', iconType: 'monitor' },
  { id: 48, employeeId: 'nisha', time: '2:32 PM', app: 'Notion · KB Article Draft', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #F5F0E0, #E8E0C8)', iconType: 'monitor' },
  { id: 49, employeeId: 'nisha', time: '2:28 PM', app: 'Chrome · jira.company.com', category: 'productive', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #E8E4D8, #D8D4C8)', iconType: 'chrome' },
  { id: 50, employeeId: 'nisha', time: '2:24 PM', app: 'Slack · #support', category: 'neutral', blurred: false, idle: false, bgStyle: 'linear-gradient(135deg, #3A3520, #2A2818)', iconType: 'slack' },
];
