import {
  reports,
  heatmapData,
  burnoutData,
  focusData,
  toolsData,
  attendanceCalData,
  leaderboardData,
} from '@/mock/reports';

function escapeCsv(value) {
  const s = String(value ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function rowsToCsv(headers, rows) {
  const lines = [headers.map(escapeCsv).join(',')];
  rows.forEach((row) => {
    lines.push(row.map(escapeCsv).join(','));
  });
  return lines.join('\n');
}

function downloadBlob(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportWorkPulse() {
  const headers = ['Day', 'Hour', 'Productivity %'];
  const rows = [];
  heatmapData.days.forEach((day) => {
    heatmapData.hours.forEach((hour, i) => {
      rows.push([day, hour, heatmapData.values[day][i]]);
    });
  });
  return rowsToCsv(headers, rows);
}

function exportBurnout() {
  const headers = ['Employee', 'Team', 'Risk', 'Hours', 'OT', 'Risk Score'];
  const rows = burnoutData.riskTable.map((r) => [
    r.name, r.team, r.risk, r.hours, r.ot, r.riskPct,
  ]);
  return rowsToCsv(headers, rows);
}

function exportFocus() {
  const headers = ['Employee', 'Team', 'Score', 'Band', 'Streak', 'Switches/hr'];
  const rows = focusData.table.map((e) => [
    e.name, e.team, e.score, e.band, e.streak, e.switches,
  ]);
  return rowsToCsv(headers, rows);
}

function exportTools() {
  const headers = ['Tool', 'Category', 'Type', 'Hrs/day', 'Users', 'ROI'];
  const rows = toolsData.tools.map((t) => [
    t.name, t.category, t.type, t.hrs, t.users, t.roi,
  ]);
  return rowsToCsv(headers, rows);
}

function exportAttendance() {
  const headers = ['Employee', 'Team', 'Lates', 'Delay', 'Absences', 'Risk'];
  const rows = attendanceCalData.offenders.map((r) => [
    r.name, r.team, r.lates, r.delay, r.absences, r.risk,
  ]);
  return rowsToCsv(headers, rows);
}

function exportLeaderboard() {
  const headers = ['Rank', 'Employee', 'Team', 'Score %', 'Focus', 'Attendance', 'Delta'];
  const rows = leaderboardData.leaderboard.map((e) => [
    e.rank, e.name, e.team, e.pct, e.focus, e.attendance, e.delta,
  ]);
  return rowsToCsv(headers, rows);
}

const EXPORTERS = {
  workpulse: exportWorkPulse,
  burnout: exportBurnout,
  focus: exportFocus,
  tools: exportTools,
  attendance: exportAttendance,
  leaderboard: exportLeaderboard,
};

export function downloadReportExport(reportId, format = 'csv') {
  const report = reports.find((r) => r.id === reportId);
  const slug = report?.id ?? 'report';
  const exporter = EXPORTERS[reportId];
  if (!exporter) return false;

  const csv = exporter();
  const date = '2026-04-21';

  if (format === 'csv') {
    downloadBlob(csv, `${slug}-report-${date}.csv`, 'text/csv;charset=utf-8');
    return true;
  }

  downloadBlob(csv, `${slug}-report-${date}.xls`, 'application/vnd.ms-excel;charset=utf-8');
  return true;
}
