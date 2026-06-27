// Transforms raw API report responses into shapes expected by viz components.
// Each key corresponds to a prop name consumed in the viz component via liveData.

const avg = (arr) => arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0;
const groupBy = (arr, key) => arr.reduce((acc, item) => {
  const k = key(item);
  (acc[k] = acc[k] ?? []).push(item);
  return acc;
}, {});

// ── productivity-trend → WorkPulseViz.dayBreakdown, LeaderboardViz ───────────
function fromProductivityTrend(rows) {
  if (!rows?.length) return {};

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const dayBreakdown = dayNames.map((day, i) => {
    const dow = i + 1; // 1=Mon … 5=Fri
    const dayRows = rows.filter(r => new Date(r.date).getDay() === dow && r.isPresent);
    if (!dayRows.length) return { day, pct: 0, color: '#0F6E56' };
    const pct = Math.round(avg(dayRows.map(r => Number(r.productivityScore ?? 0))));
    const unprodPct = Math.round(avg(dayRows.map(r =>
      r.totalWorkSeconds > 0 ? Math.round(r.unproductiveSeconds / r.totalWorkSeconds * 100) : 0,
    )));
    return { day, pct, ...(unprodPct > 3 ? { unprod: unprodPct } : {}), color: '#0F6E56' };
  });

  // Employee leaderboard
  const byEmp = groupBy(rows, r => r.employeeId);
  const leaderboardRows = Object.entries(byEmp).map(([, empRows]) => {
    const present = empRows.filter(r => r.isPresent);
    const scores = present.map(r => Number(r.productivityScore ?? 0)).filter(Boolean);
    const scoreAvg = Math.round(avg(scores));
    const totalHrs = Math.round(present.reduce((s, r) => s + (r.totalWorkSeconds || 0), 0) / 3600);
    const { name, designation, team } = empRows[0];
    return {
      init: name.split(' ').map(n => n[0] ?? '').join('').slice(0, 2).toUpperCase(),
      name, designation: designation ?? '', team: team ?? '',
      score: `${scoreAvg}%`,
      days: present.length,
      hrs: `${totalHrs}h`,
      sparkScore: present.slice(-7).map(r => Number(r.productivityScore ?? 0)),
      change: 0, rank: 0,
    };
  }).sort((a, b) => parseInt(b.score) - parseInt(a.score));
  leaderboardRows.forEach((e, i) => { e.rank = i + 1; });

  // Team aggregate for leaderboard
  const TEAM_COLORS = ['#085041', '#0F6E56', '#1D9E75', '#27C088', '#33A870', '#1E7A5C'];
  const teamMap = groupBy(rows.filter(r => r.isPresent && r.team), r => r.team);
  const leaderboardTeams = Object.entries(teamMap)
    .map(([name, teamRows], i) => ({
      name,
      score: `${Math.round(avg(teamRows.map(r => Number(r.productivityScore ?? 0))))}%`,
      color: TEAM_COLORS[i % TEAM_COLORS.length],
      members: new Set(teamRows.map(r => r.employeeId)).size,
    }))
    .sort((a, b) => parseInt(b.score) - parseInt(a.score));

  // Focus distribution (productivityScore as proxy)
  const empAvgScores = leaderboardRows.map(e => parseInt(e.score));
  const focusDistribution = [
    { band: 'Deep Focus',  count: empAvgScores.filter(s => s >= 75).length, color: '#0F6E56' },
    { band: 'Moderate',    count: empAvgScores.filter(s => s >= 50 && s < 75).length, color: '#1D9E75' },
    { band: 'Fragmented',  count: empAvgScores.filter(s => s >= 25 && s < 50).length, color: '#27C088' },
    { band: 'Scattered',   count: empAvgScores.filter(s => s < 25).length, color: '#085041' },
  ];
  const totalEmp = empAvgScores.length || 1;
  focusDistribution.forEach(d => { d.pct = Math.round(d.count / totalEmp * 100); });

  // Focus trend (7-day avg productivity for org)
  const byDate = groupBy(rows.filter(r => r.isPresent), r => r.date);
  const sortedDates = Object.keys(byDate).sort().slice(-7);
  const focusTrendData = sortedDates.map(d => Math.round(avg(byDate[d].map(r => Number(r.productivityScore ?? 0)))));
  const focusTrendLabels = sortedDates.map(d => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date(d).getDay()];
  });

  // Focus table (top employees by score)
  const focusTable = leaderboardRows.slice(0, 50).map(e => ({
    ...e,
    band: parseInt(e.score) >= 75 ? 'Deep Focus' : parseInt(e.score) >= 50 ? 'Moderate' : parseInt(e.score) >= 25 ? 'Fragmented' : 'Scattered',
    streak: Math.max(1, Math.floor(parseInt(e.score) / 10)),
    switchesHr: Math.max(1, Math.round(10 - parseInt(e.score) / 10)),
  }));

  return { dayBreakdown, leaderboardRows, leaderboardTeams, focusDistribution, focusTrendData, focusTrendLabels, focusTable };
}

// ── app-usage → ToolsViz ─────────────────────────────────────────────────────
function fromAppUsage(rows) {
  if (!rows?.length) return {};
  const totalDur = rows.reduce((s, r) => s + r.totalDurationSeconds, 0) || 1;

  const tools = rows.slice(0, 30).map(r => ({
    // browser visits arrive as appName "Google Chrome" with the real site in domain
    name: (r.appDomain || r.appName) ?? 'Unknown',
    hrs: Math.round((r.totalDurationSeconds / 3600) * 10) / 10,
    status: r.productivityStatus ?? 'Neutral',
    domain: r.appDomain ?? null,
    category: r.appCategory ?? null,
    type: r.appDomain ? 'Browser' : 'App',
    sparkHrs: [],
  }));

  const maxHrs = Math.max(...tools.map(t => t.hrs), 0.1);
  const prodDur = rows.filter(r => r.productivityStatus === 'Productive').reduce((s, r) => s + r.totalDurationSeconds, 0);
  const unprodDur = rows.filter(r => r.productivityStatus === 'Unproductive').reduce((s, r) => s + r.totalDurationSeconds, 0);
  const toolsSplit = {
    productive: Math.round(prodDur / totalDur * 100),
    neutral: Math.round((totalDur - prodDur - unprodDur) / totalDur * 100),
    unproductive: Math.round(unprodDur / totalDur * 100),
  };

  return { tools, maxHrs, toolsSplit };
}

// ── effort → BurnoutViz ──────────────────────────────────────────────────────
function fromEffort(rows) {
  if (!rows?.length) return {};

  const byDate = groupBy(rows.filter(r => r.isPresent), r => r.date);
  const sortedDates = Object.keys(byDate).sort().slice(-21);
  const overtimeDaily = sortedDates.map(d => {
    const dayRows = byDate[d] ?? [];
    const avgOT = avg(dayRows.map(r => Math.max(0, r.actualWorkHours - r.targetWorkHours)));
    return Math.round(avgOT * 60); // minutes
  });
  const overtimeLabels = sortedDates.map(d => d.slice(5));

  const byEmp = groupBy(rows, r => r.employeeId);
  const riskTable = Object.entries(byEmp).map(([, empRows]) => {
    const present = empRows.filter(r => r.isPresent);
    const avgOT = present.length ? avg(present.map(r => Math.max(0, r.actualWorkHours - r.targetWorkHours))) : 0;
    const avgWork = present.length ? avg(present.map(r => r.actualWorkHours)) : 0;
    const { name, designation, team } = empRows[0];
    const risk = avgOT >= 2 ? 'Overworked' : avgOT >= 1 ? 'At Risk' : 'Healthy';
    return {
      init: name.split(' ').map(n => n[0] ?? '').join('').slice(0, 2),
      name, designation: designation ?? '', team: team ?? '',
      risk, otDaily: `${avgOT.toFixed(1)}h`, avgWorkHrs: `${avgWork.toFixed(1)}h`,
      days: present.length,
      score: Math.round(avg(present.map(r => r.workUtilizationPct ?? 0))),
    };
  }).sort((a, b) => ({ Overworked: 0, 'At Risk': 1, Healthy: 2 }[a.risk] - { Overworked: 0, 'At Risk': 1, Healthy: 2 }[b.risk]));

  return { overtimeDaily, overtimeLabels, riskTable };
}

// ── attendance → AttendanceViz ───────────────────────────────────────────────
function fromAttendance(rows) {
  if (!rows?.length) return {};

  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const byDate = groupBy(rows, r => r.date);
  const sortedDates = Object.keys(byDate).sort().slice(-21);
  const attendanceDailyRate = sortedDates.map(d => {
    const dayRows = byDate[d] ?? [];
    return dayRows.length ? Math.round(dayRows.filter(r => r.isPresent).length / dayRows.length * 100) : 0;
  });
  const attendanceDailyRateLabels = sortedDates.map(d => DOW[new Date(d).getDay()]);

  // Late arrivals by day-of-week (count of employees who were late on each dow)
  const lateDowMap = {};
  rows.forEach(r => {
    if (!r.isLate) return;
    const d = DOW[new Date(r.date).getDay()];
    lateDowMap[d] = (lateDowMap[d] ?? 0) + 1;
  });
  const lateByDow = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(d => ({
    day: d, count: lateDowMap[d] ?? 0,
  }));

  // Habitual offenders: employees with ≥3 late days OR ≥2 absent days
  const byEmp = groupBy(rows, r => r.employeeId);
  const habitualOffenders = Object.entries(byEmp).map(([, empRows]) => {
    const sorted = [...empRows].sort((a, b) => a.date.localeCompare(b.date));
    const lateDays = empRows.filter(r => r.isLate).length;
    const absentDays = empRows.filter(r => !r.isPresent).length;
    if (lateDays < 3 && absentDays < 2) return null;

    // Compute max absence streak
    let maxStreak = 0, streak = 0;
    for (const r of sorted) {
      if (!r.isPresent) { streak++; maxStreak = Math.max(maxStreak, streak); }
      else streak = 0;
    }

    // Day-of-week with most late arrivals
    const lateDow = {};
    sorted.filter(r => r.isLate).forEach(r => {
      const d = DOW[new Date(r.date).getDay()];
      lateDow[d] = (lateDow[d] ?? 0) + 1;
    });
    const worstDay = Object.entries(lateDow).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

    const { name, designation, team } = empRows[0];
    return {
      init: name.split(' ').map(n => n[0] ?? '').join('').slice(0, 2).toUpperCase(),
      name, designation: designation ?? '', team: team ?? '',
      lateDays, absentDays, maxStreak, worstDay,
      risk: lateDays >= 5 || absentDays >= 4 ? 'High' : 'Medium',
    };
  }).filter(Boolean).sort((a, b) => b.lateDays - a.lateDays);

  return { attendanceDailyRate, attendanceDailyRateLabels, lateByDow, habitualOffenders };
}

// ── hourly-heatmap → WorkPulseViz ────────────────────────────────────────────
const HEATMAP_HOURS_IST = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const HEATMAP_HOUR_LABELS = HEATMAP_HOURS_IST.map(h =>
  h < 12 ? `${h}AM` : h === 12 ? '12PM' : `${h - 12}PM`
);
const DOW_LABELS = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri' };

export function fromHourlyHeatmap(bucket) {
  const values = {};
  for (const label of Object.values(DOW_LABELS)) {
    values[label] = HEATMAP_HOURS_IST.map(() => 0);
  }
  if (!bucket || typeof bucket !== 'object') return { heatmapValues: values, heatmapHours: HEATMAP_HOUR_LABELS };
  for (const [dowStr, hourBuckets] of Object.entries(bucket)) {
    const label = DOW_LABELS[parseInt(dowStr)];
    if (!label) continue;
    values[label] = HEATMAP_HOURS_IST.map(h => {
      const b = hourBuckets[h];
      if (!b || b.total === 0) return 0;
      return Math.round((b.productive / b.total) * 100);
    });
  }
  return { heatmapValues: values, heatmapHours: HEATMAP_HOUR_LABELS };
}

// ── Master transform ─────────────────────────────────────────────────────────
export function transformReportData({ trend = [], apps = [], effort = [], attendance = [], hourly = {} }) {
  return {
    ...fromProductivityTrend(trend),
    ...fromAppUsage(apps),
    ...fromEffort(effort),
    ...fromAttendance(attendance),
    ...fromHourlyHeatmap(hourly),
  };
}
