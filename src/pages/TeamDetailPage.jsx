import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Download, Plus, Users } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import CalendarHeatmap from '@/components/cards/teams/CalendarHeatmap';
import EmployeeTable from '@/components/tables/EmployeeTable';
import TopAppsPanel from '@/components/cards/teams/TopAppsPanel';
import WeeklyPerformancePanel from '@/components/cards/teams/WeeklyPerformancePanel';
import IdleAlertsPanel from '@/components/cards/teams/IdleAlertsPanel';
import QuickActionsPanel from '@/components/cards/teams/QuickActionsPanel';
import { useToast } from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';
import api from '@/utils/api';

export default function TeamDetailPage() {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
  const [newEmployeeDesignation, setNewEmployeeDesignation] = useState('');

  const [teamInfo, setTeamInfo] = useState({
    name: 'Loading...',
    abbr: '..',
    memberCount: 0,
    status: 'Active',
    createdDate: '',
    avatarBg: '#F0F0EC',
    avatarColor: '#1A1A1A',
  });

  const [stats, setStats] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [topApps, setTopApps] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [alerts, setAlerts] = useState([]);

  async function loadTeamData() {
    if (!teamId) return;
    setLoading(true);
    try {
      // 1. Fetch main team info (includes employees list)
      const teamRes = await api.get(`/api/client/teams/${teamId}`);
      const teamData = teamRes.data;

      const initials = teamData.name.slice(0, 2).toUpperCase();
      const createdDate = `Created ${new Date(teamData.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`;

      setTeamInfo({
        name: teamData.name,
        abbr: initials,
        memberCount: teamData.employees?.length || 0,
        status: 'Active',
        createdDate,
        avatarBg: 'linear-gradient(135deg, #1D9E75, #0F6E56)',
        avatarColor: '#fff',
      });

      // Map employees
      const rawEmployees = teamData.employees || [];
      const mappedEmployees = rawEmployees.map((emp) => {
        const empInitials = emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
        
        const isRecentlyActive = emp.lastSeenAt
          && (Date.now() - new Date(emp.lastSeenAt).getTime()) < 5 * 60 * 1000;
        let status = 'offline';
        let statusLabel = 'Offline';
        if (emp.isCurrentlyWorking && isRecentlyActive) {
          status = 'work';
          statusLabel = 'Working';
        } else if (emp.today?.isPresent) {
          status = 'privacy';
          statusLabel = 'Idle';
        } else if (emp.status === 'inactive') {
          status = 'absent';
          statusLabel = 'Absent';
        }

        const checkIn = emp.today?.firstCheckin 
          ? new Date(emp.today.firstCheckin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          : '—';

        const workHrsVal = (emp.today?.totalWorkSeconds || 0) / 3600;
        const workHoursStr = Math.floor(workHrsVal);
        const workMinsStr = Math.round((workHrsVal % 1) * 60);
        const activeHrs = `${workHoursStr}h ${workMinsStr}m`;

        const productivity = emp.today?.productivityScore != null ? Math.round(Number(emp.today.productivityScore)) : 0;

        let scoreLabel = 'Average';
        let scoreBg = 'rgba(217, 119, 6, 0.1)';
        let scoreColor = '#D97706';
        if (productivity >= 85) {
          scoreLabel = 'Excellent';
          scoreBg = 'rgba(15, 110, 86, 0.1)';
          scoreColor = '#0F6E56';
        } else if (productivity >= 70) {
          scoreLabel = 'Good';
          scoreBg = 'rgba(29, 158, 117, 0.1)';
          scoreColor = '#1D9E75';
        } else {
          scoreLabel = 'Low';
          scoreBg = 'rgba(229, 62, 62, 0.1)';
          scoreColor = '#E53E3E';
        }

        return {
          id: emp.id,
          name: emp.name,
          email: emp.email,
          initials: empInitials,
          avatarBg: (emp.isCurrentlyWorking && isRecentlyActive) ? 'linear-gradient(135deg, #1D9E75, #0F6E56)' : '#D8D8D0',
          avatarColor: (emp.isCurrentlyWorking && isRecentlyActive) ? '#fff' : '#888',
          status,
          statusLabel,
          checkIn,
          activeHrs,
          productivity,
          prodBarBg: 'linear-gradient(90deg, #1D9E75, #0F6E56)',
          scoreLabel,
          scoreBg,
          scoreColor,
          topApp: emp.topApp || '—',
        };
      });

      setEmployees(mappedEmployees);

      // Compute statistics cards
      const activeCount = rawEmployees.filter(e => e.isCurrentlyWorking && e.lastSeenAt && (Date.now() - new Date(e.lastSeenAt).getTime()) < 5 * 60 * 1000).length;
      const presentCount = rawEmployees.filter(e => e.today?.isPresent).length;
      const productivityScore = teamData.avgProductivityScore != null ? Math.round(Number(teamData.avgProductivityScore)) : 0;

      const totalWorkSeconds = rawEmployees.reduce((acc, e) => acc + (e.today?.totalWorkSeconds || 0), 0);
      const avgWorkSeconds = presentCount > 0 ? totalWorkSeconds / presentCount : 0;
      const workHours = Math.floor(avgWorkSeconds / 3600);
      const workMins = Math.floor((avgWorkSeconds % 3600) / 60);
      const workTimeStr = `${workHours}h ${workMins}m`;

      setStats([
        {
          id: 'productivity',
          value: `${productivityScore}%`,
          label: 'Team Productivity',
          change: 'avg score today',
          changeColor: '#888',
          iconBg: 'linear-gradient(135deg, #1D9E75, #0F6E56)',
          iconStroke: '#fff',
          icon: 'activity',
        },
        {
          id: 'avg-work',
          value: workTimeStr,
          label: 'Avg Work Time',
          change: 'per active employee',
          changeColor: '#888',
          iconBg: '#F0F0EC',
          iconStroke: '#1A1A1A',
          icon: 'clock',
        },
        {
          id: 'present',
          value: `${presentCount}/${rawEmployees.length}`,
          label: 'Total Present',
          change: 'attendance rate',
          changeColor: '#888',
          iconBg: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)',
          iconStroke: '#1D9E75',
          icon: 'user',
        },
        {
          id: 'active-now',
          value: String(activeCount),
          label: 'Active Now',
          change: 'working mode',
          changeColor: '#1D9E75',
          iconBg: '#F0F0EC',
          iconStroke: '#1A1A1A',
          icon: 'users',
        },
      ]);

      // 2. Fetch Top Apps for team — current day only (panel is "Top Apps Today")
      const toDate = new Date();
      const fromDate = new Date();
      const appsRes = await api.get(`/api/client/dashboard/top-apps?teamId=${teamId}&from=${fromDate.toISOString().slice(0, 10)}&to=${toDate.toISOString().slice(0, 10)}&limit=4`);
      const rawApps = (appsRes.data || []).filter(a => a.appName && a.appName !== 'Screen Lock' && a.productivityStatus !== 'Idle');
      const maxDuration = Math.max(...rawApps.map(a => a.totalDurationSeconds), 1);
      const mappedApps = rawApps.slice(0, 4).map(app => {
        const appHours = Math.floor(app.totalDurationSeconds / 3600);
        const appMins = Math.round((app.totalDurationSeconds % 3600) / 60);
        const category = (app.productivityStatus || 'Neutral').toLowerCase();
        const iconBg = category === 'unproductive'
          ? 'linear-gradient(135deg, #2D2D2D, #1A1A1A)'
          : 'linear-gradient(135deg, #162E24, #0F6E56)';
        const barColor = category === 'unproductive' ? '#1A1A1A' : '#0F6E56';
        return {
          name: app.appName,
          abbr: app.appName.slice(0, 2).toUpperCase(),
          time: appHours > 0 ? `${appHours}h ${appMins}m` : `${appMins}m`,
          pct: Math.round((app.totalDurationSeconds / maxDuration) * 100),
          iconBg,
          iconColor: '#1D9E75',
          barColor,
          iconUrl: app.appIconUrl || null,
        };
      });
      setTopApps(mappedApps);

      // 3. Fetch Weekly Performance — always build Mon–Sun of current week
      const today = new Date();
      const dowToday = today.getDay(); // 0=Sun
      const daysFromMon = dowToday === 0 ? 6 : dowToday - 1;
      const weekMonday = new Date(today);
      weekMonday.setDate(today.getDate() - daysFromMon);

      const weekFromStr = weekMonday.toISOString().slice(0, 10);
      const weekToStr = today.toISOString().slice(0, 10);
      const performanceRes = await api.get(`/api/client/dashboard/work-hour-chart?teamId=${teamId}&from=${weekFromStr}&to=${weekToStr}`);
      const rawPerf = performanceRes.data || [];
      const perfByDate = new Map(rawPerf.map(r => [r.date, r]));

      const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
      const fullWeekPerf = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekMonday);
        d.setDate(weekMonday.getDate() + i);
        const dateStr = d.toISOString().slice(0, 10);
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        const isFuture = d > today;
        const apiRow = perfByDate.get(dateStr);
        const hours = apiRow ? apiRow.productive / 3600 : 0;
        return { day: WEEK_LABELS[i], hours, isWeekend, isFuture, hasData: !!apiRow };
      });

      const maxPerfHours = Math.max(...fullWeekPerf.map(p => p.hours), 0.1);
      const scaledPerf = fullWeekPerf.map(p => {
        const hh = Math.floor(p.hours);
        const mm = Math.round((p.hours % 1) * 60);
        const tooltip = p.hasData
          ? (hh > 0 ? `${hh}h ${mm}m productive` : `${mm}m productive`)
          : null;
        return {
          day: p.day,
          height: p.isFuture ? 3 : p.hasData ? Math.max(8, Math.round((p.hours / maxPerfHours) * 46)) : 3,
          bg: p.isWeekend ? 'rgba(0,0,0,0.08)' : p.hasData ? '#0F6E56' : 'rgba(0,0,0,0.06)',
          tooltip,
        };
      });
      setPerformance(scaledPerf);

      // Deriving simple alerts from idle times
      const idleAlerts = rawEmployees
        .filter(e => (e.today?.idleSeconds || 0) > 1800)
        .map(e => ({
          name: e.name,
          initials: e.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
          detail: `Idle for ${Math.round(e.today.idleSeconds / 60)} mins`,
          avatarBg: 'linear-gradient(135deg, #E8E0C8, #D8CEB0)',
          avatarColor: '#1A1A1A',
        }));
      setAlerts(idleAlerts);

    } catch (err) {
      console.error('Error fetching team details:', err);
      toast.error('Failed to load team details');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeamData();
    const interval = setInterval(loadTeamData, 60_000);
    return () => clearInterval(interval);
  }, [teamId]);

  function handleExportCSV() {
    const rows = [
      ['Name', 'Email', 'Status', 'Check In', 'Active Hrs', 'Score %', 'Most Used App'],
      ...employees.map(e => [e.name, e.email, e.statusLabel, e.checkIn, e.activeHrs, e.productivity, e.topApp ?? '']),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `team-${teamId}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success('Team data exported', 'Export Complete');
  }

  async function handleAddEmployee() {
    if (!newEmployeeName.trim() || !newEmployeeEmail.trim() || inviting) return;
    setInviting(true);
    const email = newEmployeeEmail.trim();
    setShowAddModal(false);
    setNewEmployeeName('');
    setNewEmployeeEmail('');
    setNewEmployeeDesignation('');
    try {
      const rolesRes = await api.get('/api/client/roles');
      const roleList = Array.isArray(rolesRes.data) ? rolesRes.data : (rolesRes.data?.items ?? rolesRes.data?.data ?? []);
      const defaultRole = roleList.find(r => r.name === 'Employee') || roleList.find(r => r.isSystemDefault) || roleList[0];
      if (!defaultRole) {
        toast.error('No organization role exists to assign.');
        return;
      }
      await api.post('/api/client/employees/invite', {
        name: newEmployeeName.trim(),
        email,
        designation: newEmployeeDesignation || undefined,
        teamId: teamId,
        roleId: defaultRole.id,
      });
      toast.success(`Invite sent to ${email}`, 'Employee Invited');
      loadTeamData();
    } catch (err) {
      console.error('Error adding employee:', err);
      toast.error(err?.response?.data?.error || 'Failed to add employee');
    } finally {
      setInviting(false);
    }
  }

  if (loading && employees.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative z-[2] pb-7 font-poppins">
      {/* Page Header */}
      <div className="flex items-end justify-between px-8 pt-4 pb-3.5">
        <div>
          <button
            onClick={() => navigate('/teams')}
            className="flex items-center gap-1.5 text-sm-plus text-text-muted cursor-pointer mb-1.5 font-poppins bg-transparent border-none"
          >
            <ChevronLeft size={13} stroke="#AAA" strokeWidth={2} />
            Back to Teams
          </button>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-tile flex items-center justify-center text-lg font-bold"
              style={{ background: teamInfo.avatarBg, color: teamInfo.avatarColor }}
            >
              {teamInfo.abbr}
            </div>
            <div>
              <h1 className="text-[28px] font-bold text-text-primary tracking-tight leading-none">
                {teamInfo.name}
              </h1>
              <div className="flex items-center gap-2.5 mt-1 font-poppins">
                <span className="flex items-center gap-1 text-[11px] text-text-muted">
                  <Users size={10} stroke="#AAA" strokeWidth={2} />
                  {teamInfo.memberCount} members
                </span>
                <span className="w-[3px] h-[3px] rounded-full bg-neutral-pale" />
                <span className="flex items-center gap-1 text-[11px] text-text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
                  {teamInfo.status}
                </span>
                <span className="w-[3px] h-[3px] rounded-full bg-neutral-pale" />
                <span className="text-[11px] text-text-muted">{teamInfo.createdDate}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2.5 font-poppins">
          <button
            onClick={handleExportCSV}
            className="glass-pill flex items-center gap-[7px] py-[9px] px-4 rounded-pill text-sm-plus font-medium text-text-secondary cursor-pointer border-none bg-white/60 hover:bg-white/80 transition-colors"
          >
            <Download size={12} stroke="#666" strokeWidth={2} />
            Export CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="dark-pill flex items-center gap-[7px] py-[9px] px-[18px] rounded-pill text-sm-plus font-semibold text-white cursor-pointer border-none bg-ink"
          >
            <Plus size={12} stroke="#fff" strokeWidth={2} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 px-8 pb-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Main Layout: Left (Heatmap + Table) + Right Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-3.5 px-8">
        <div className="flex flex-col gap-3.5 min-w-0">
          <CalendarHeatmap teamId={teamId} />
          <EmployeeTable employees={employees} teamId={teamId} />
        </div>
        <div className="flex flex-col gap-3.5">
          <TopAppsPanel apps={topApps} />
          <WeeklyPerformancePanel performance={performance} />
          <IdleAlertsPanel alerts={alerts} />
          <QuickActionsPanel onAddMember={() => setShowAddModal(true)} />
        </div>
      </div>

      <Modal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewEmployeeName('');
          setNewEmployeeEmail('');
          setNewEmployeeDesignation('');
        }}
        title="Add Employee"
        subtitle="Invite a new member to join this team"
        size="sm"
      >
        <div className="flex flex-col gap-4 font-poppins">
          <div>
            <label className="text-sm font-medium text-text-primary mb-1.5 block">
              Employee Name
            </label>
            <input
              type="text"
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
              placeholder="e.g. Jane Smith"
              className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-white/60 text-sm text-text-primary placeholder:text-text-lighter outline-none focus:border-primary/40 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-primary mb-1.5 block">
              Work Email Address
            </label>
            <input
              type="email"
              value={newEmployeeEmail}
              onChange={(e) => setNewEmployeeEmail(e.target.value)}
              placeholder="e.g. jane@acme.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-white/60 text-sm text-text-primary placeholder:text-text-lighter outline-none focus:border-primary/40 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-primary mb-1.5 block">
              Designation
            </label>
            <input
              type="text"
              value={newEmployeeDesignation}
              onChange={(e) => setNewEmployeeDesignation(e.target.value)}
              placeholder="e.g. Backend Developer"
              className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-white/60 text-sm text-text-primary placeholder:text-text-lighter outline-none focus:border-primary/40 transition-colors"
            />
          </div>
          <button
            onClick={handleAddEmployee}
            disabled={!newEmployeeName.trim() || !newEmployeeEmail.trim() || inviting}
            className="dark-pill w-full py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer border-none bg-ink disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {inviting ? 'Sending…' : 'Invite to Team'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
