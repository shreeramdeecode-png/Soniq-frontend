import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, Download } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import AttendanceListTable from '@/components/cards/attendance/AttendanceListTable';
import AttendanceGantt from '@/components/cards/attendance/AttendanceGantt';
import { SingleDatePicker } from '@/components/ui/DateRangePicker';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/utils/cn';
import api from '@/utils/api';

const LEGEND = [
  { label: 'Productive', bg: '#0F6E56' },
  { label: 'Neutral', bg: 'rgba(29,158,117,0.28)' },
  { label: 'Unproductive', bg: '#1A1A1A' },
  { label: 'Idle', bg: 'rgba(0,0,0,0.08)' },
];

const GANTT_HOURS = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM'];

const getDateString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getInitials = (name) => {
  if (!name) return 'EE';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatTime = (isoString) => {
  if (!isoString) return { main: '—', sub: '' };
  const d = new Date(isoString);
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return {
    main: `${String(hours).padStart(2, '0')}:${minutes}`,
    sub: ampm
  };
};

const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return '0h 0m';
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return `${h}h ${m}m`;
};

const mapTimelineSegments = (segments, currentDate) => {
  const dayStart = new Date(currentDate);
  dayStart.setHours(8, 0, 0, 0);
  
  const dayEnd = new Date(currentDate);
  dayEnd.setHours(19, 0, 0, 0);
  
  const totalWindowMs = 11 * 3600 * 1000;
  
  return (segments || []).map(seg => {
    const start = new Date(seg.startTime);
    const end = new Date(seg.endTime);
    
    const clampedStartMs = Math.max(dayStart.getTime(), start.getTime());
    const clampedEndMs = Math.min(dayEnd.getTime(), end.getTime());
    
    if (clampedStartMs >= clampedEndMs) {
      return null;
    }
    
    const leftMs = clampedStartMs - dayStart.getTime();
    const widthMs = clampedEndMs - clampedStartMs;
    
    const leftPct = (leftMs / totalWindowMs) * 100;
    const widthPct = (widthMs / totalWindowMs) * 100;
    
    const hours = Math.floor(seg.durationSeconds / 3600);
    const mins = Math.round((seg.durationSeconds % 3600) / 60);
    const durStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    
    const startStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endStr = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let type = 'neutral';
    const status = (seg.productivityStatus || 'neutral').toLowerCase();
    if (status === 'productive') type = 'productive';
    else if (status === 'unproductive') type = 'unproductive';
    else if (status === 'idle') type = 'idle';
    else if (status === 'break') type = 'break';
    else if (status === 'away') type = 'away';
    
    return {
      left: `${leftPct.toFixed(2)}%`,
      width: `${widthPct.toFixed(2)}%`,
      type,
      app: seg.appName || 'Active Window',
      time: `${startStr} → ${endStr}`,
      dur: durStr,
    };
  }).filter(Boolean);
};

const getLateGap = (firstCheckin, currentDate) => {
  if (!firstCheckin) return null;
  const checkinDate = new Date(firstCheckin);
  
  const shiftStart = new Date(currentDate);
  shiftStart.setHours(9, 0, 0, 0);
  
  if (checkinDate.getTime() > shiftStart.getTime()) {
    const dayStart = new Date(currentDate);
    dayStart.setHours(8, 0, 0, 0);
    
    const totalWindowMs = 11 * 3600 * 1000;
    const leftMs = shiftStart.getTime() - dayStart.getTime();
    const widthMs = checkinDate.getTime() - shiftStart.getTime();
    
    const leftPct = (leftMs / totalWindowMs) * 100;
    const widthPct = (widthMs / totalWindowMs) * 100;
    
    return {
      left: `${leftPct.toFixed(2)}%`,
      width: `${widthPct.toFixed(2)}%`,
    };
  }
  return null;
};

const PAGE_SIZE = 10;

export default function AttendancePage() {
  const [viewMode, setViewMode] = useState('list');
  const [activeTab, setActiveTab] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [dailyAttendance, setDailyAttendance] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [teamsList, setTeamsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shiftLabel, setShiftLabel] = useState('9AM–6PM');
  const toast = useToast();

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateLabel = `${dayNames[currentDate.getDay()]}, ${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [teamsRes, settingsRes] = await Promise.all([
          api.get('/api/client/teams'),
          api.get('/api/client/settings').catch(() => ({ data: null })),
        ]);
        setTeamsList(teamsRes.data || []);
        if (settingsRes.data?.defaultExpectedInTime) {
          const raw = settingsRes.data.defaultExpectedInTime; // "HH:MM:SS"
          const [h, m] = raw.split(':').map(Number);
          const startHr = h % 12 || 12;
          const startAmpm = h < 12 ? 'AM' : 'PM';
          const endH = h + (settingsRes.data.defaultWorkHoursPerDay ?? 8);
          const endHr = endH % 12 || 12;
          const endAmpm = endH < 12 ? 'AM' : 'PM';
          const mStr = m > 0 ? `:${String(m).padStart(2, '0')}` : '';
          setShiftLabel(`${startHr}${mStr}${startAmpm}–${endHr}${endAmpm}`);
        }
      } catch (err) {
        console.error('Failed to load teams list:', err);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    async function loadAttendanceData() {
      setLoading(true);
      try {
        const dateStr = getDateString(currentDate);
        const [dailyRes, timelineRes] = await Promise.all([
          api.get(`/api/client/attendance/daily?date=${dateStr}`),
          api.get(`/api/client/attendance/timeline?date=${dateStr}`),
        ]);
        setDailyAttendance(dailyRes.data || []);
        setTimelineData(timelineRes.data || []);
      } catch (err) {
        console.error('Failed to load attendance metrics:', err);
        toast.error('Failed to load attendance metrics', 'Error');
      } finally {
        setLoading(false);
      }
    }
    loadAttendanceData();
  }, [currentDate]);

  const isSelectedToday = useMemo(() => {
    return getDateString(currentDate) === getDateString(new Date());
  }, [currentDate]);

  const currentTimePosition = useMemo(() => {
    if (!isSelectedToday) return 'none';
    const now = new Date();
    const dayStart = new Date(now);
    dayStart.setHours(8, 0, 0, 0);
    const dayEnd = new Date(now);
    dayEnd.setHours(19, 0, 0, 0);
    
    if (now.getTime() < dayStart.getTime()) return '0%';
    if (now.getTime() > dayEnd.getTime()) return '100%';
    
    const totalWindowMs = 11 * 3600 * 1000;
    const elapsedMs = now.getTime() - dayStart.getTime();
    return `${((elapsedMs / totalWindowMs) * 100).toFixed(2)}%`;
  }, [currentDate, isSelectedToday]);

  const currentTimeLabel = useMemo(() => {
    if (!isSelectedToday) return '';
    const now = new Date();
    return `Now ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }, [currentDate, isSelectedToday]);

  const mergedEmployees = useMemo(() => {
    return dailyAttendance.map(dEmp => {
      const tEmp = timelineData.find(t => t.employeeId === dEmp.employeeId) || {};
      const segments = tEmp.segments || [];
      
      const mappedSegments = mapTimelineSegments(segments, currentDate);
      const lateGap = dEmp.isPresent && dEmp.isLate ? getLateGap(dEmp.firstCheckin, currentDate) : null;
      
      const status = !dEmp.isPresent ? 'absent' : (dEmp.isLate ? 'late' : 'present');
      const statusLabel = status === 'absent' ? '✕ Absent' : (status === 'late' ? '◐ Late' : '● Present');
      
      const checkInTime = formatTime(dEmp.firstCheckin);
      const checkIn = dEmp.isPresent ? checkInTime.main : '—';
      const checkInSub = dEmp.isPresent ? (checkInTime.sub + (dEmp.isLate ? ' ⚠' : '')) : '';
      
      const isToday = getDateString(currentDate) === getDateString(new Date());
      let checkOut = '—';
      let checkOutColor = '#CCC';
      if (dEmp.isPresent) {
        if (!dEmp.lastCheckout || (isToday && dEmp.screenshotsCount > 0 && (new Date() - new Date(dEmp.lastCheckout)) < 15 * 60 * 1000)) {
          checkOut = 'Active';
          checkOutColor = '#1D9E75';
        } else if (dEmp.lastCheckout) {
          const t = formatTime(dEmp.lastCheckout);
          checkOut = `${t.main} ${t.sub}`;
          checkOutColor = '#1A1A1A';
        }
      }
      
      const scoreVal = dEmp.productivityScore != null ? Math.round(Number(dEmp.productivityScore)) : 0;
      const score = dEmp.isPresent ? `${scoreVal}%` : '—';
      let scoreClass = 'med';
      if (dEmp.isPresent) {
        if (scoreVal >= 80) scoreClass = 'high';
        else if (scoreVal >= 60) scoreClass = 'med';
        else scoreClass = 'low';
      }
      
      const avatarBg = status === 'present' 
        ? 'linear-gradient(135deg, #1D9E75, #0F6E56)' 
        : (status === 'late' ? 'linear-gradient(135deg, #D97706, #B45309)' : '#F0F0EC');
      const avatarColor = status === 'absent' ? '#888' : '#fff';
      const dotColor = status === 'present' ? '#1D9E75' : (status === 'late' ? '#D97706' : '#EEE');
      
      const totalHrs = dEmp.isPresent ? formatDuration(dEmp.totalWorkSeconds) : '—';
      const productive = dEmp.isPresent ? formatDuration(dEmp.productiveSeconds) : '—';
      
      const ganttSubtext = dEmp.isPresent 
        ? `In ${checkIn}${checkInTime.sub} · ${totalHrs}`
        : 'Absent today';
      const ganttSubtextColor = status === 'absent' ? '#CC4444' : 'rgba(0,0,0,0.4)';
      
      return {
        id: dEmp.employeeId,
        name: dEmp.name,
        role: dEmp.designation || 'Employee',
        teamName: dEmp.teamName || null,
        initials: getInitials(dEmp.name),
        avatarBg,
        avatarColor,
        status,
        statusLabel,
        shift: `Morning\n${shiftLabel}`,
        checkIn,
        checkInSub,
        checkOut,
        checkOutColor,
        totalHrs,
        productive,
        score,
        scoreClass,
        dotColor,
        ganttSubtext,
        ganttSubtextColor,
        lateGap,
        segments: mappedSegments,
        ganttBlocks: mappedSegments,
        absent: status === 'absent',
      };
    });
  }, [dailyAttendance, timelineData, currentDate]);

  const filteredEmployees = useMemo(() => {
    return mergedEmployees.filter(emp => {
      if (searchQuery && !emp.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (activeTab === 'present') return emp.status === 'present' || emp.status === 'late';
      if (activeTab === 'absent') return emp.status === 'absent';
      return true;
    });
  }, [mergedEmployees, searchQuery, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE));

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredEmployees.slice(start, start + PAGE_SIZE);
  }, [filteredEmployees, currentPage]);

  const groupedTeams = useMemo(() => {
    const teamMap = new Map();
    teamsList.forEach(team => {
      teamMap.set(team.name, { name: team.name, totalMembers: 0, present: 0, employees: [] });
    });

    paginatedEmployees.forEach(emp => {
      const tName = emp.teamName || 'Other';
      if (!teamMap.has(tName)) {
        teamMap.set(tName, { name: tName, totalMembers: 0, present: 0, employees: [] });
      }
      const group = teamMap.get(tName);
      group.employees.push(emp);
      group.totalMembers++;
      if (emp.status !== 'absent') group.present++;
    });

    return Array.from(teamMap.values()).filter(g => g.employees.length > 0);
  }, [paginatedEmployees, teamsList]);

  const attendanceStats = useMemo(() => {
    const present = mergedEmployees.filter(e => e.status === 'present' || e.status === 'late').length;
    const absent = mergedEmployees.filter(e => e.status === 'absent').length;
    const total = mergedEmployees.length;
    
    const attendanceRate = total > 0 ? ((present / total) * 100).toFixed(1) : '0';
    
    const presentWithWork = mergedEmployees.filter(e => e.status !== 'absent' && e.totalHrs !== '—');
    let avgSeconds = 0;
    if (presentWithWork.length > 0) {
      const sum = presentWithWork.reduce((acc, curr) => {
        const dEmp = dailyAttendance.find(d => d.employeeId === curr.id);
        return acc + (dEmp?.totalWorkSeconds || 0);
      }, 0);
      avgSeconds = sum / presentWithWork.length;
    }
    
    const avgWorkTime = formatDuration(avgSeconds);
    const lateCount = mergedEmployees.filter(e => e.status === 'late').length;
    
    return [
      { id: 'present', value: String(present), label: 'Present Today', change: `${attendanceRate}% attendance rate`, changeColor: '#1D9E75', iconBg: 'linear-gradient(135deg, #1D9E75, #0F6E56)', iconStroke: '#fff', icon: 'user' },
      { id: 'absent', value: String(absent), label: 'Absent Today', change: `${total} total employees`, changeColor: '#AAA', iconBg: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)', iconStroke: '#1D9E75', icon: 'alert-circle' },
      { id: 'avg-time', value: avgWorkTime, label: 'Avg Work Time', change: 'target 8h / day', changeColor: '#888', iconBg: '#F0F0EC', iconStroke: '#1A1A1A', icon: 'clock' },
      { id: 'late', value: String(lateCount), label: 'Late Check-ins', change: 'after 9:10 AM grace', changeColor: '#D97706', iconBg: '#F0F0EC', iconStroke: '#D97706', icon: 'alert-triangle' },
    ];
  }, [mergedEmployees, dailyAttendance]);

  const attendanceTabs = useMemo(() => {
    const present = mergedEmployees.filter(e => e.status === 'present' || e.status === 'late').length;
    const absent = mergedEmployees.filter(e => e.status === 'absent').length;
    const total = mergedEmployees.length;
    
    return [
      { id: 'all', label: `All (${total})` },
      { id: 'present', label: `Present (${present})` },
      { id: 'absent', label: `Absent (${absent})` },
    ];
  }, [mergedEmployees]);

  useEffect(() => { setCurrentPage(1); }, [currentDate, activeTab, searchQuery]);

  function goDay(dir) {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + dir);
      return d;
    });
  }

  const handleExportCSV = async () => {
    try {
      const dateStr = getDateString(currentDate);
      const response = await api.get(`/api/client/attendance/export?date=${dateStr}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance-${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Attendance CSV downloaded successfully', 'Export Complete');
    } catch (err) {
      console.error('Failed to export CSV:', err);
      toast.error('Failed to export CSV file', 'Error');
    }
  };

  return (
    <div className="relative z-[2]">
      {/* Page Header */}
      <div className="flex items-end justify-between px-8 pt-3.5 pb-3">
        <div>
          <div className="text-xs-plus text-text-light mb-[3px]">Dashboard → Attendance</div>
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">
            {viewMode === 'list' ? 'Attendance' : 'Attendance — Timeline View'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="glass-pill flex items-center gap-1.5 py-2 px-4 rounded-pill text-sm font-medium text-text-secondary cursor-pointer border-none bg-white/60 hover:bg-white/90 shadow-sm"
          >
            <Download size={12} stroke="#666" strokeWidth={2} />
            Export CSV
          </button>
          <SingleDatePicker
            date={currentDate}
            onChange={setCurrentDate}
            variant="primary"
          />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-3 px-8 pb-3.5">
        {attendanceStats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Controls Row */}
      <div className="flex items-center gap-2.5 px-8 pb-3.5 flex-wrap">
        {/* Date nav */}
        <div className="glass-pill flex items-center gap-2 h-9 px-1.5 rounded-pill">
          <button
            onClick={() => goDay(-1)}
            className="w-6 h-6 rounded-full border border-black/[0.08] flex items-center justify-center cursor-pointer bg-white/60 hover:bg-white/90 transition-colors"
          >
            <ChevronLeft size={10} stroke="#888" strokeWidth={2} />
          </button>
          <span className="text-sm-plus font-semibold text-text-primary px-2 whitespace-nowrap">{dateLabel}</span>
          <button
            onClick={() => goDay(1)}
            className="w-6 h-6 rounded-full border border-black/[0.08] flex items-center justify-center cursor-pointer bg-white/60 hover:bg-white/90 transition-colors"
          >
            <ChevronRight size={10} stroke="#888" strokeWidth={2} />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-0.5 bg-black/5 rounded-[10px] p-[3px]">
          {attendanceTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'py-1.5 px-3.5 rounded-lg text-sm font-medium cursor-pointer border-none bg-transparent whitespace-nowrap transition-all',
                activeTab === tab.id
                  ? 'bg-white text-text-primary shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                  : 'text-text-muted'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="glass-pill flex items-center gap-[7px] h-9 px-3.5 rounded-pill min-w-[180px]">
          <Search size={12} stroke="#CCC" strokeWidth={2} className="shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-none bg-transparent outline-none text-sm font-poppins text-text-primary w-full placeholder:text-text-lighter"
            placeholder="Search employee..."
          />
        </div>

        {/* View toggle */}
        <div className="flex gap-0.5 bg-black/5 rounded-[10px] p-[3px] ml-auto">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'py-[5px] px-3 rounded-lg text-[11px] font-medium cursor-pointer border-none bg-transparent whitespace-nowrap transition-all',
              viewMode === 'list'
                ? 'bg-white text-text-primary shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                : 'text-text-muted'
            )}
          >
            ≡ List View
          </button>
          <button
            onClick={() => setViewMode('gantt')}
            className={cn(
              'py-[5px] px-3 rounded-lg text-[11px] font-medium cursor-pointer border-none bg-transparent whitespace-nowrap transition-all',
              viewMode === 'gantt'
                ? 'bg-white text-text-primary shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                : 'text-text-muted'
            )}
          >
            ⧖ Timeline Gantt
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3.5 px-8 pb-3 flex-wrap">
        <span className="text-xs text-text-light font-medium mr-1">Legend:</span>
        {LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-[5px] text-xs text-text-muted">
            <div className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ background: item.bg }} />
            {item.label}
          </div>
        ))}
        <div className="flex items-center gap-[5px] text-xs text-text-muted">
          <div className="w-2.5 h-2.5 bg-ink rounded-[1px]" />
          Shift Start
        </div>
        <div className="flex items-center gap-[5px] text-xs text-text-muted">
          <div className="w-2.5 h-2.5 bg-text-muted/50 rounded-[1px]" />
          Shift End
        </div>
        {viewMode === 'gantt' && currentTimePosition && currentTimePosition !== 'none' && (
          <div className="flex items-center gap-[5px] text-xs text-primary-light font-semibold">
            <div className="w-0.5 h-3 rounded-[1px]" style={{ background: 'linear-gradient(180deg, #1D9E75, rgba(29,158,117,0.3))' }} />
            Now ({new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
          </div>
        )}
      </div>

      {/* Content: List or Gantt */}
      {loading ? (
        <div className="glossy-card mx-8 p-12 text-center text-text-muted font-poppins">
          Loading attendance metrics...
        </div>
      ) : (
        viewMode === 'list' ? (
          <AttendanceListTable teams={groupedTeams} />
        ) : (
          <AttendanceGantt
            teams={groupedTeams}
            ganttHours={GANTT_HOURS}
            currentTimePosition={currentTimePosition}
            currentTimeLabel={currentTimeLabel}
          />
        )
      )}

      {/* Pagination */}
      {!loading && filteredEmployees.length > PAGE_SIZE && (
        <div className="flex items-center justify-between px-8 py-4">
          <span className="text-xs-plus text-text-light">
            Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredEmployees.length)}–{Math.min(currentPage * PAGE_SIZE, filteredEmployees.length)} of {filteredEmployees.length} employees
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 rounded-lg border border-black/[0.08] flex items-center justify-center bg-white/60 hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={12} stroke="#555" strokeWidth={2} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  'w-7 h-7 rounded-lg text-xs font-semibold border transition-colors cursor-pointer',
                  page === currentPage
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white/60 text-text-secondary border-black/[0.08] hover:bg-white/90'
                )}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 rounded-lg border border-black/[0.08] flex items-center justify-center bg-white/60 hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={12} stroke="#555" strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
