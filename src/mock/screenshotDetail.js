export const screenshotEmployee = {
  initials: 'RS',
  name: 'Ravi Shankar',
  role: 'Senior Software Engineer',
  team: 'Engineering Team',
  avatarBg: 'linear-gradient(135deg, #1D9E75, #0F6E56)',
  avatarColor: '#fff',
  status: 'Work Mode · Active',
  checkIn: '09:01 AM',
  todayScore: '91% — Excellent',
  shotsToday: '148 total',
  os: 'Windows 11',
  workType: 'Hybrid',
};

export const screenshotDetails = {
  capturedAt: '2:41:32 PM',
  date: 'Apr 16, 2026',
  application: 'VS Code',
  category: 'Dev Tools',
  productivity: 'Productive',
  idleAtCapture: 'No',
  workMode: 'Active tracking',
  shotNumber: '42 of 148 today',
};

export const blurStatus = {
  enabled: false,
  label: 'Blur OFF',
  description: 'Blur is currently disabled for this employee. Full resolution visible. Change in Settings → Screenshot Settings.',
  auditNote: 'All views are logged in the audit trail',
};

export const filmStripItems = [
  { id: 1, time: '2:43 PM', bg: 'linear-gradient(135deg, #1A1A1A, #252525)', prodBarBg: '#D8D8D0', blurred: false, active: false, iconType: 'code' },
  { id: 2, time: '2:41 PM', bg: 'linear-gradient(135deg, #1E1E1E, #282828)', prodBarBg: 'linear-gradient(90deg, #1D9E75, #0F6E56)', blurred: false, active: true, iconType: 'code' },
  { id: 3, time: '2:38 PM', bg: 'linear-gradient(135deg, #E8E4D8, #D8D4C8)', prodBarBg: '#D8D8D0', blurred: false, active: false, iconType: 'globe' },
  { id: 4, time: '2:36 PM', bg: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)', prodBarBg: '#D8D8D0', blurred: true, active: false, iconType: null },
  { id: 5, time: '2:35 PM', bg: 'linear-gradient(135deg, #1A1A1A, #252525)', prodBarBg: 'linear-gradient(90deg, #1D9E75, #0F6E56)', blurred: false, active: false, iconType: 'code' },
  { id: 6, time: '2:32 PM', bg: 'linear-gradient(135deg, #F0ECD8, #E4E0CC)', prodBarBg: '#E8D870', blurred: false, active: false, iconType: 'clock' },
  { id: 7, time: '2:28 PM', bg: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)', prodBarBg: '#D8D8D0', blurred: true, active: false, iconType: null },
  { id: 8, time: '2:22 PM', bg: 'linear-gradient(135deg, #E8E4D8, #D8D4C8)', prodBarBg: '#1A1A1A', blurred: false, active: false, iconType: 'video' },
];

export const mockCodeLines = [
  { num: 1, content: '#!/usr/bin/env python3', type: 'comment' },
  { num: 2, content: '# Soniq data pipeline', type: 'comment' },
  { num: 3, content: '', type: 'empty' },
  { num: 4, tokens: [{ text: 'import', type: 'keyword' }, { text: ' asyncio', type: 'var' }] },
  { num: 5, tokens: [{ text: 'from', type: 'keyword' }, { text: ' typing ', type: 'var' }, { text: 'import', type: 'keyword' }, { text: ' Dict, List', type: 'var' }] },
  { num: 6, content: '', type: 'empty' },
  { num: 7, tokens: [{ text: 'async def', type: 'keyword' }, { text: ' process_webhook', type: 'function' }, { text: '(payload: Dict) -> None:', type: 'plain' }], highlight: true },
  { num: 8, tokens: [{ text: '    ', type: 'plain' }, { text: '"""Process incoming webhook"""', type: 'string' }], highlight: true },
  { num: 9, tokens: [{ text: '    employee_id', type: 'var' }, { text: " = payload['userId']", type: 'plain' }] },
  { num: 10, tokens: [{ text: '    ', type: 'plain' }, { text: 'await', type: 'keyword' }, { text: ' save_to_db', type: 'function' }, { text: '(employee_id)', type: 'plain' }] },
  { num: 11, content: '', type: 'empty' },
];

export const mockEditorFiles = [
  { name: '📄 main.py', active: true },
  { name: '📄 api.ts', active: false },
  { name: '📁 components/', active: false },
  { name: '📄 utils.js', active: false },
  { name: '📄 config.json', active: false },
  { name: '📁 tests/', active: false },
];

export const mockTabs = [
  { name: 'main.py', active: true },
  { name: 'api.ts', active: false },
  { name: 'utils.js', active: false },
];
