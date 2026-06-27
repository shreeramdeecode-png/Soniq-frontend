export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  TEAMS: '/teams',
  TEAMS_DETAIL: '/teams/:teamId',
  TEAMS_EMPLOYEE: '/teams/:teamId/employee/:employeeId',
  SCREENSHOTS: '/screenshots',
  SCREENSHOTS_DETAIL: '/screenshots/:id',
  ATTENDANCE: '/attendance',
  ATTENDANCE_TIMELINE: '/attendance/timeline',
  REPORTS: '/reports',
  REPORTS_ATTENDANCE: '/reports/attendance',
  REPORTS_BURNOUT: '/reports/burnout',
  REPORTS_FOCUS: '/reports/focus',
  REPORTS_LEADERBOARD: '/reports/leaderboard',
  REPORTS_TOOLS: '/reports/tools',
  REPORTS_WORKPULSE: '/reports/workpulse',
  SETTINGS: '/settings',
};

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/' },
  { label: 'Teams', path: '/teams' },
  { label: 'Screenshots', path: '/screenshots' },
  { label: 'Attendance', path: '/attendance' },
  { label: 'Reports', path: '/reports' },
  { label: 'Settings', path: '/settings' },
];
