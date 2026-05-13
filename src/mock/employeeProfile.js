export const profileData = {
  initials: 'RS',
  name: 'Ravi Shankar',
  role: 'Senior Software Engineer',
  team: 'Engineering',
  avatarBg: 'linear-gradient(135deg, #1D9E75, #0F6E56)',
  avatarColor: '#fff',
  status: 'Work Mode · Active',
  productivityScore: 91,
  productivityLabel: 'Excellent',
  info: [
    { label: 'Employee ID', value: 'EMP-0024' },
    { label: 'Check In', value: '09:01 AM' },
    { label: 'Last Active', value: 'Just now', highlight: true },
    { label: 'OS', value: 'Windows 11' },
    { label: 'EXE Version', value: 'v2.4.1' },
    { label: 'Work Type', value: 'Hybrid' },
    { label: 'Active Hours', value: '7h 12m today', highlight: true },
    { label: 'Daily Target', value: '8h / day' },
    { label: 'Role', value: 'Employee' },
  ],
  currentApp: {
    abbr: 'VS',
    name: 'VS Code',
    category: 'Productive',
    iconBg: 'linear-gradient(135deg, #2D2D2D, #1A1A1A)',
    iconColor: '#1D9E75',
  },
};

export const employeeTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'screenshots', label: 'Screenshots' },
  { id: 'app-usage', label: 'App Usage' },
];

export const miniStats = [
  {
    id: 'productive',
    value: '5h 13m',
    label: 'Productive Time',
    bg: 'linear-gradient(135deg, rgba(29,158,117,0.1), rgba(29,158,117,0.04))',
    border: '1px solid rgba(29,158,117,0.18)',
  },
  {
    id: 'unproductive',
    value: '0h 37m',
    label: 'Unproductive',
    bg: 'linear-gradient(135deg, rgba(26,26,26,0.06), rgba(26,26,26,0.02))',
    border: '1px solid rgba(26,26,26,0.1)',
  },
  {
    id: 'neutral',
    value: '1h 22m',
    label: 'Neutral Time',
    bg: 'rgba(255,255,255,0.6)',
    border: '1px solid rgba(0,0,0,0.06)',
  },
  {
    id: 'idle',
    value: '0h 48m',
    label: 'Idle Time',
    bg: 'rgba(255,255,255,0.6)',
    border: '1px solid rgba(0,0,0,0.06)',
  },
];

export const timelineSegments = [
  { left: '5%', width: '18%', bg: 'linear-gradient(90deg, #1D9E75, #0F6E56)' },
  { left: '25%', width: '8%', bg: '#D8D8D0' },
  { left: '35%', width: '22%', bg: 'linear-gradient(90deg, #1A1A1A, #2D2D2D)' },
  { left: '58%', width: '4%', bg: '#E8E0C8' },
  { left: '63%', width: '20%', bg: 'linear-gradient(90deg, #1D9E75, #0F6E56)' },
  { left: '84%', width: '5%', bg: '#D8D8D0' },
  { left: '90%', width: '8%', bg: 'linear-gradient(90deg, #1A1A1A, #2D2D2D)' },
];

export const timelineTicks = ['9 AM', '10', '11', '12', '1 PM', '2', '3', '4', '5 PM'];

export const timelineLegend = [
  { label: 'Productive', bg: 'linear-gradient(135deg, #1D9E75, #0F6E56)' },
  { label: 'Neutral', bg: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)' },
  { label: 'Idle', bg: '#D8D8D0' },
  { label: 'Away', bg: '#E8E0C8' },
];

export const appUsageData = [
  { abbr: 'VS', name: 'VS Code', time: '3h 12m', status: 'Productive', statusClass: 'prod', iconBg: 'linear-gradient(135deg, #2D2D2D, #1A1A1A)', iconColor: '#1D9E75' },
  { abbr: 'CH', name: 'Chrome', time: '1h 18m', status: 'Neutral', statusClass: 'neutral', iconBg: '#E8E0C8', iconColor: '#1A1A1A' },
  { abbr: 'SL', name: 'Slack', time: '0h 44m', status: 'Neutral', statusClass: 'neutral', iconBg: '#1D9E75', iconColor: '#fff' },
  { abbr: 'YT', name: 'YouTube', time: '0h 37m', status: 'Unproductive', statusClass: 'unprod', iconBg: '#D8D8D0', iconColor: '#1A1A1A' },
];

export const attendanceData = {
  tiles: [
    { value: '14', label: 'Working Days', bg: 'linear-gradient(135deg, rgba(29,158,117,0.1), rgba(29,158,117,0.04))', border: '1px solid rgba(29,158,117,0.15)' },
    { value: '13', label: 'Present', bg: 'linear-gradient(135deg, rgba(26,26,26,0.06), rgba(26,26,26,0.02))', border: '1px solid rgba(26,26,26,0.1)' },
    { value: '1', label: 'Absent', bg: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)' },
  ],
  monthlyPct: 92.8,
  avgCheckIn: '09:04 AM',
  avgCheckOut: '06:22 PM',
  onTimeRate: '96%',
};

export const dailyRecords = [
  {
    date: 'Apr 16 (Today)',
    checkIn: '09:01 AM',
    checkOut: 'Active',
    checkOutHighlight: true,
    totalHrs: '7h 12m',
    productive: '5h 13m',
    score: '91%',
    scoreBg: 'linear-gradient(135deg, #1D9E75, #0F6E56)',
    scoreColor: '#fff',
    status: 'Present',
    statusBg: 'transparent',
    statusColor: '#1A1A1A',
  },
  {
    date: 'Apr 15',
    checkIn: '08:58 AM',
    checkOut: '06:30 PM',
    checkOutHighlight: false,
    totalHrs: '7h 58m',
    productive: '5h 44m',
    score: '88%',
    scoreBg: 'linear-gradient(135deg, #1D9E75, #0F6E56)',
    scoreColor: '#fff',
    status: 'Present',
    statusBg: 'transparent',
    statusColor: '#1A1A1A',
  },
  {
    date: 'Apr 14',
    checkIn: '—',
    checkOut: '—',
    checkOutHighlight: false,
    totalHrs: '—',
    productive: '—',
    score: '—',
    scoreBg: '#F5F5F5',
    scoreColor: '#CCC',
    status: 'Absent',
    statusBg: '#FFF5F5',
    statusColor: '#CC4444',
  },
  {
    date: 'Apr 11',
    checkIn: '09:10 AM',
    checkOut: '06:15 PM',
    checkOutHighlight: false,
    totalHrs: '7h 42m',
    productive: '5h 30m',
    score: '85%',
    scoreBg: '#1A1A1A',
    scoreColor: '#1D9E75',
    status: 'Present',
    statusBg: 'transparent',
    statusColor: '#1A1A1A',
  },
];
