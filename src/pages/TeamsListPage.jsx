import { useState, useMemo, useEffect } from 'react';
import { isLiveActive } from '@/utils/liveStatus';
import { Download, Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/ui/StatCard';
import FilterBar from '@/components/ui/FilterBar';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import TeamCard, { CreateTeamCard } from '@/components/cards/teams/TeamCard';
const teamsFilterChips = [
  { id: 'all', label: 'All Teams' },
  { id: 'active', label: 'Active' },
  { id: 'high', label: 'High Productivity' },
  { id: 'attention', label: 'Needs Attention' },
];
import { useToast } from '@/components/ui/Toast';
import api from '@/utils/api';

export default function TeamsListPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('productivity');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [teams, setTeams] = useState([]);
  const [stats, setStats] = useState([]);
  const toast = useToast();

  async function fetchTeams() {
    try {
      const [teamsRes, employeesRes] = await Promise.all([
        api.get('/api/client/teams'),
        api.get('/api/client/employees?pageSize=100')
      ]);
      
      const backendTeams = teamsRes.data || [];
      const backendEmployees = employeesRes.data?.items || [];

      // Map backend teams to UI format
      const mappedTeams = backendTeams.map((t, index) => {
        const abbr = t.name.slice(0, 2).toUpperCase();
        const createdDate = `Created ${new Date(t.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`;

        const colors = [
          { stripBg: 'linear-gradient(90deg, #1D9E75, #0F6E56)', avatarBg: 'linear-gradient(135deg, #1D9E75, #0F6E56)', avatarColor: '#fff', prodBarBg: 'linear-gradient(90deg, #1D9E75, #0F6E56)' },
          { stripBg: 'linear-gradient(90deg, #2D2D2D, #1A1A1A)', avatarBg: 'linear-gradient(135deg, #2D2D2D, #1A1A1A)', avatarColor: '#1D9E75', prodBarBg: 'linear-gradient(90deg, #2D2D2D, #1A1A1A)' },
          { stripBg: 'linear-gradient(90deg, #C8C8C0, #B0B0A8)', avatarBg: 'linear-gradient(135deg, #C8C8C0, #B0B0A8)', avatarColor: '#fff', prodBarBg: 'linear-gradient(90deg, #D8D8D0, #C0C0B8)' },
          { stripBg: 'linear-gradient(90deg, #162E24, #0A5040)', avatarBg: 'linear-gradient(135deg, #162E24, #0A5040)', avatarColor: '#1D9E75', prodBarBg: 'linear-gradient(90deg, #162E24, #0A5040)' },
          { stripBg: 'linear-gradient(90deg, #E8E0C8, #D8CEB0)', avatarBg: 'linear-gradient(135deg, #E8E0C8, #D8CEB0)', avatarColor: '#1A1A1A', prodBarBg: 'linear-gradient(90deg, #E8E0C8, #D8CEB0)' }
        ];
        const colorSet = colors[index % colors.length];

        const productivity = t.avgProductivityScore != null ? Math.round(t.avgProductivityScore) : 0;
        const status = productivity < 70 ? 'attention' : 'active';
        const statusLabel = productivity < 70 ? 'Attention' : 'Active';
        const prodValColor = productivity < 70 ? '#D97706' : '#1A1A1A';

        const workingCount = t.activeNow;
        const offlineCount = Math.max(0, t.employeeCount - t.activeNow);

        const liveStatus = [
          { label: `${workingCount} Working`, variant: 'work', dotColor: '#1A1A1A' },
          { label: `${offlineCount} Offline`, variant: 'offline', dotColor: '#CCC' },
        ];

        const workHours = Math.floor((t.avgWorkSeconds || 0) / 3600);
        const workMins = Math.round(((t.avgWorkSeconds || 0) % 3600) / 60);
        const workTimeStr = workHours > 0 || workMins > 0 ? `${workHours}h ${workMins}m` : '0h 0m';

        const stats = [
          { value: `${productivity}%`, label: 'Productivity' },
          { value: workTimeStr, label: 'Avg Work' },
          { value: `${t.presentToday}/${t.employeeCount}`, label: 'Present' }
        ];

        // Filter and map actual members dynamically
        const teamEmployees = backendEmployees.filter(e => e.teamId === t.id);
        const members = teamEmployees.slice(0, 3).map(e => {
          const initials = e.name ? e.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '..';
          return {
            initials,
            bg: isLiveActive(e) ? 'linear-gradient(135deg, #1D9E75, #0F6E56)' : '#D8D8D0',
            color: isLiveActive(e) ? '#fff' : '#888'
          };
        });

        return {
          id: t.id,
          name: t.name,
          abbr,
          createdDate,
          memberCount: t.employeeCount,
          status,
          statusLabel,
          ...colorSet,
          liveStatus,
          stats,
          productivity,
          prodValColor,
          members,
          moreCount: Math.max(0, t.employeeCount - members.length),
        };
      });

      setTeams(mappedTeams);

      // Compute statistics based on dynamic values
      const totalTeamsCount = mappedTeams.length;
      const totalEmployeesCount = mappedTeams.reduce((acc, t) => acc + t.memberCount, 0);
      const activeEmployeesCount = backendTeams.reduce((acc, t) => acc + (t.activeNow || 0), 0);
      const avgProd = totalTeamsCount > 0 
        ? Math.round(mappedTeams.reduce((acc, t) => acc + t.productivity, 0) / totalTeamsCount) 
        : 0;

      const totalAvgWorkSeconds = backendTeams.length > 0
        ? backendTeams.reduce((acc, t) => acc + (t.avgWorkSeconds || 0), 0) / backendTeams.length
        : 0;
      const orgWorkHours = Math.floor(totalAvgWorkSeconds / 3600);
      const orgWorkMins = Math.round((totalAvgWorkSeconds % 3600) / 60);
      const orgWorkTimeStr = orgWorkHours > 0 || orgWorkMins > 0 ? `${orgWorkHours}h ${orgWorkMins}m` : '0h 0m';

      setStats([
        {
          id: 'total-teams',
          value: String(totalTeamsCount),
          label: 'Total Teams',
          change: 'across organization',
          changeColor: '#888',
          iconBg: 'linear-gradient(135deg, #1D9E75, #0F6E56)',
          iconStroke: '#fff',
          icon: 'users',
        },
        {
          id: 'total-employees',
          value: String(totalEmployeesCount),
          label: 'Total Employees',
          change: `${activeEmployeesCount} active now`,
          changeColor: '#1D9E75',
          iconBg: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)',
          iconStroke: '#1D9E75',
          icon: 'user',
        },
        {
          id: 'avg-productivity',
          value: `${avgProd}%`,
          label: 'Avg Productivity',
          change: 'org average today',
          changeColor: '#1D9E75',
          iconBg: '#F0F0EC',
          iconStroke: '#1A1A1A',
          icon: 'activity',
        },
        {
          id: 'avg-work-time',
          value: orgWorkTimeStr,
          label: 'Avg Work Time',
          change: 'per employee today',
          changeColor: '#888',
          iconBg: '#F0F0EC',
          iconStroke: '#1A1A1A',
          icon: 'clock',
        },
      ]);
    } catch (err) {
      console.error('Error fetching teams:', err);
      toast.error('Failed to load teams list');
    }
  }

  useEffect(() => {
    fetchTeams();
  }, []);

  const filteredTeams = useMemo(() => {
    let result = [...teams];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q));
    }

    if (filter !== 'all') {
      if (filter === 'active') result = result.filter((t) => t.status === 'active');
      else if (filter === 'high') result = result.filter((t) => t.productivity >= 80);
      else if (filter === 'attention') result = result.filter((t) => t.status === 'attention' || t.productivity < 70);
    }

    if (sort === 'productivity') result.sort((a, b) => b.productivity - a.productivity);
    else if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'members') result.sort((a, b) => b.memberCount - a.memberCount);

    return result;
  }, [teams, search, filter, sort]);

  function handleExport() {
    const rows = [
      ['Team', 'Members', 'Present Today', 'Active Now', 'Productivity %', 'Avg Work', 'Status', 'Created'],
      ...filteredTeams.map(t => [
        t.name, t.memberCount, t.presentToday ?? '', t.activeNow ?? '',
        t.productivity ?? '', t.workTimeStr ?? '', t.statusLabel, t.createdDate,
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'teams.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Teams exported', 'Export Complete');
  }

  async function handleCreateTeam() {
    if (!newTeamName.trim()) {
      toast.warning('Please enter a team name');
      return;
    }
    try {
      await api.post('/api/client/teams', { name: newTeamName });
      toast.success(`Team "${newTeamName}" created successfully`, 'Team Created');
      setNewTeamName('');
      setShowCreateModal(false);
      fetchTeams();
    } catch (err) {
      console.error('Error creating team:', err);
      toast.error('Failed to create team');
    }
  }

  return (
    <>
      <PageHeader
        breadcrumbs={['Dashboard', 'Teams']}
        title="Teams"
        subtitle="Manage and monitor all your teams in one place"
        actions={
          <>
            <Button variant="secondary" onClick={handleExport}>
              <Download size={13} stroke="#666" strokeWidth={2} />
              Export
            </Button>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <Plus size={13} stroke="#fff" strokeWidth={2} />
              Create New Team
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 px-8 pb-5">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <FilterBar
        chips={teamsFilterChips}
        placeholder="Search teams..."
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onSortChange={setSort}
        activeFilter={filter}
        searchValue={search}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 px-8 pb-7">
        {filteredTeams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
        <CreateTeamCard onClick={() => setShowCreateModal(true)} />
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-12 px-8">
          <p className="text-lg font-semibold text-text-muted font-poppins">No teams found</p>
          <p className="text-sm text-text-light mt-1 font-poppins">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Team"
        subtitle="Add a new team to your organization"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-text-primary block mb-1.5 font-poppins">Team Name</label>
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="e.g. Marketing, QA, DevOps..."
              className="w-full h-11 border border-black/10 rounded-[12px] bg-white px-4 text-sm text-text-primary outline-none focus:border-primary/40 transition-colors font-poppins"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTeam()}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2 font-poppins">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-5 py-2.5 rounded-pill text-sm font-medium text-text-muted hover:text-text-secondary cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTeam}
              className="primary-pill text-white text-sm font-semibold rounded-pill px-6 py-2.5 cursor-pointer hover:opacity-90 transition-opacity"
            >
              Create Team
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

