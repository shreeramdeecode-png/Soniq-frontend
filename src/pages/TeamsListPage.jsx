import { Download, Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/ui/StatCard';
import FilterBar from '@/components/ui/FilterBar';
import Button from '@/components/ui/Button';
import TeamCard, { CreateTeamCard } from '@/components/cards/TeamCard';
import { teamsStats, teamsFilterChips, teams } from '@/mock/teams';

export default function TeamsListPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={['Dashboard', 'Teams']}
        title="Teams"
        subtitle="Manage and monitor all your teams in one place"
        actions={
          <>
            <Button variant="secondary">
              <Download size={13} stroke="#666" strokeWidth={2} />
              Export
            </Button>
            <Button variant="primary">
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
        sortLabel="Sort: Productivity"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 px-8 pb-7">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
        <CreateTeamCard />
      </div>
    </>
  );
}
