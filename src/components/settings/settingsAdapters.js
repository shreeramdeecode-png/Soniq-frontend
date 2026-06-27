// Shared helpers for transforming API employee data into the shape
// expected by settings drawer components.

const AVATAR_COLORS = [
  { bg: '#0F6E56', fc: '#fff' },
  { bg: '#1D9E75', fc: '#fff' },
  { bg: '#085041', fc: '#fff' },
  { bg: '#27C088', fc: '#fff' },
  { bg: '#33A870', fc: '#fff' },
  { bg: '#1E7A5C', fc: '#fff' },
  { bg: '#0A5040', fc: '#fff' },
  { bg: '#2EBD90', fc: '#fff' },
];

function formatAgo(dateStr) {
  if (!dateStr) return 'N/A';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export function adaptEmployeeForSettings(emp, idx) {
  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  const initials = (emp.name ?? '')
    .split(' ')
    .map(n => n[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return {
    id: emp.id,
    init: initials,
    name: emp.name ?? '',
    email: emp.email ?? '',
    role: emp.roleName ?? emp.role?.name ?? 'Employee',
    team: emp.teamName ?? emp.team?.name ?? 'Unassigned',
    mode: emp.workModeType ?? 'Office',
    os: emp.operatingSystem ?? 'Windows',
    exe: emp.designation ?? 'Employee',
    last: formatAgo(emp.lastSeenAt),
    color: color.bg,
    fc: color.fc,
    status: emp.status ?? 'active',
    // WorkPolicy defaults (overridden by per-employee settings if loaded)
    days: [1, 1, 1, 1, 1, 0, 0],
    hrs: 8,
    pHrs: 6,
    tgt: 80,
    // Monitoring defaults
    cap: true,
    blur: false,
    interval: 10,
    idle: true,
    idleMin: 5,
    score: 0,
  };
}

export async function loadAllEmployees(apiClient) {
  const { data } = await apiClient.get('/api/client/employees?pageSize=200');
  const list = Array.isArray(data) ? data : (data.items ?? data.data ?? []);
  return list.map((e, i) => adaptEmployeeForSettings(e, i));
}
