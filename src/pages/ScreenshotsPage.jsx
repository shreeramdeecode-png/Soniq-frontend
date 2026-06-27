import { useState, useEffect, useMemo } from 'react';
import { isLiveActive } from '@/utils/liveStatus';
import { Search } from 'lucide-react';
import ScreenshotSidebar from '@/components/cards/screenshots/ScreenshotSidebar';
import ScreenshotPersonHeader from '@/components/cards/screenshots/ScreenshotPersonHeader';
import ScreenshotGrid from '@/components/cards/screenshots/ScreenshotGrid';
import DateRangePicker from '@/components/ui/DateRangePicker';
import { cn } from '@/utils/cn';

const filterChips = [
  { id: 'all', label: 'All' },
  { id: 'productive', label: 'Productive' },
  { id: 'neutral', label: 'Neutral' },
  { id: 'unproductive', label: 'Unproductive' },
  { id: 'idle', label: 'Idle' },
];
import api from '@/utils/api';

export default function ScreenshotsPage() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      try {
        const todayStr = new Date().toISOString().slice(0, 10);
        const [teamsRes, employeesRes, attendanceRes] = await Promise.all([
          api.get('/api/client/teams'),
          api.get('/api/client/employees?pageSize=100'),
          api.get(`/api/client/attendance/daily?date=${todayStr}`),
        ]);

        const teamsData = teamsRes.data || [];
        const employeesData = employeesRes.data?.items || [];
        const attendanceData = attendanceRes.data || [];

        // Build screenshotsCount map from today's attendance
        const shotCountMap = new Map();
        attendanceData.forEach(r => {
          if (r.employeeId) shotCountMap.set(r.employeeId, r.screenshotsCount ?? 0);
        });

        setTeams(teamsData);
        setEmployees(employeesData.map(e => ({ ...e, _shotCount: shotCountMap.get(e.id) ?? null })));

        if (employeesData.length > 0) {
          setSelectedEmployee(employeesData[0].id);
        }
      } catch (err) {
        console.error('Failed to load screenshots layout data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const sidebarTeams = useMemo(() => {
    if (!employees.length) return [];

    const teamMap = new Map();
    teams.forEach((t) => {
      teamMap.set(t.id, {
        name: t.name,
        count: 0,
        employees: [],
      });
    });

    const noTeamKey = 'no-team';
    teamMap.set(noTeamKey, {
      name: 'Other',
      count: 0,
      employees: [],
    });

    employees.forEach((emp) => {
      const initials = emp.name
        ? emp.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
        : '..';
      const key = emp.teamId && teamMap.has(emp.teamId) ? emp.teamId : noTeamKey;
      const group = teamMap.get(key);

      const shotCount = emp._shotCount;
      const shotsLabel = shotCount != null
        ? `${shotCount} shot${shotCount !== 1 ? 's' : ''} today`
        : isLiveActive(emp) ? 'Active Now' : 'Offline';

      group.employees.push({
        id: emp.id,
        initials,
        name: emp.name,
        shots: shotsLabel,
        avatarBg: isLiveActive(emp) ? 'linear-gradient(135deg, #1D9E75, #0F6E56)' : '#D8D8D0',
        avatarColor: isLiveActive(emp) ? '#fff' : '#888',
        dotColor: isLiveActive(emp) ? '#1D9E75' : '#AAA',
      });
      group.count++;
    });

    return Array.from(teamMap.values()).filter((g) => g.employees.length > 0);
  }, [employees, teams]);

  return (
    <div className="relative z-[2] pb-6 font-poppins">
      {/* Page Header */}
      <div className="flex items-end justify-between px-8 pt-3.5 pb-3">
        <div>
          <div className="text-xs-plus text-text-light mb-1">Dashboard → Screenshots</div>
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">Screenshots</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] text-text-light">{employees.length} employees listed · Auto-refresh on</span>
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2.5 px-8 pb-3.5">
        {/* Date range picker */}
        <DateRangePicker
          from={dateRange.from}
          to={dateRange.to}
          onChange={setDateRange}
          variant="glass"
        />

        {/* Filter chips */}
        {filterChips.map((chip) => (
          <button
            key={chip.id}
            onClick={() => setActiveFilter(chip.id)}
            className={cn(
              'h-9 px-3.5 rounded-pill flex items-center text-sm font-medium cursor-pointer whitespace-nowrap transition-all border-none',
              activeFilter === chip.id && chip.id === 'all'
                ? 'dark-pill text-white'
                : activeFilter === chip.id
                  ? 'primary-pill text-white'
                  : 'bg-white/60 border-[1.5px] border-white/85 text-text-secondary shadow-[0_1px_0_rgba(255,255,255,0.9)_inset]'
            )}
          >
            {chip.label}
          </button>
        ))}

        {/* Search */}
        <div className="glass-pill flex items-center gap-[7px] h-9 px-3.5 rounded-pill ml-auto">
          <Search size={12} stroke="#CCC" strokeWidth={2} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by app..."
            className="border-none bg-transparent outline-none text-sm font-poppins text-text-primary w-[160px] placeholder:text-text-lighter"
          />
        </div>
      </div>

      {/* Main Body: Sidebar + Content */}
      <div className="grid grid-cols-[240px_1fr] gap-3.5 px-8">
        <ScreenshotSidebar 
          selectedId={selectedEmployee} 
          onSelect={setSelectedEmployee} 
          loading={loading} 
          sidebarTeams={sidebarTeams} 
        />
        <div className="flex flex-col gap-3">
          {selectedEmployee ? (
            <>
              <ScreenshotPersonHeader employeeId={selectedEmployee} />
              <ScreenshotGrid
                categoryFilter={activeFilter}
                searchQuery={searchQuery}
                employeeId={selectedEmployee}
                from={dateRange.from}
                to={dateRange.to}
              />
            </>
          ) : (
            !loading && (
              <div className="glossy-card p-12 text-center text-text-muted">
                No employees available to show screenshots
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
