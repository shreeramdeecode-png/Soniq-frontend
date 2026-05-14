import { useState, useMemo } from 'react';
import { Download, Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/ui/StatCard';
import FilterBar from '@/components/ui/FilterBar';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import TeamCard, { CreateTeamCard } from '@/components/cards/teams/TeamCard';
import { teamsStats, teamsFilterChips, teams } from '@/mock/teams';
import { useToast } from '@/components/ui/Toast';

export default function TeamsListPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('productivity');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const toast = useToast();

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
  }, [search, filter, sort]);

  function handleExport() {
    toast.success('Teams data exported successfully', 'Export Complete');
  }

  function handleCreateTeam() {
    if (!newTeamName.trim()) {
      toast.warning('Please enter a team name');
      return;
    }
    toast.success(`Team "${newTeamName}" created successfully`, 'Team Created');
    setNewTeamName('');
    setShowCreateModal(false);
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
        {teamsStats.map((stat) => (
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
          <p className="text-lg font-semibold text-text-muted">No teams found</p>
          <p className="text-sm text-text-light mt-1">Try adjusting your search or filter criteria</p>
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
            <label className="text-sm font-semibold text-text-primary block mb-1.5">Team Name</label>
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="e.g. Marketing, QA, DevOps..."
              className="w-full h-11 border border-black/10 rounded-[12px] bg-white px-4 text-sm text-text-primary outline-none focus:border-primary/40 transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTeam()}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
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
