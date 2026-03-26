import AdminBreadcrumbs from '@/components/admin/adminBreadcrumbs';
import TeamForm from '@/components/form/teamForm';
import AdminLayout from '@/layouts/admin/layout';
import { League, Team } from '@/types/bracket';
import { BreadcrumbItem } from '@/types/general';

const EditTeam = ({ team, leagues }: { team: Team; leagues: League[] }) => {
  const breadcrumbItems: BreadcrumbItem[] = [
    { title: 'Teams', href: '/admin/teams' },
    {
      title: `${team.club_name} ${team.monicker}`,
      href: `/admin/teams/${team.id}`,
    },
    { title: 'Edit Team' },
  ];

  return (
    <>
      <AdminBreadcrumbs items={breadcrumbItems} />

      <TeamForm className="mt-4" team={team} leagues={leagues} />
    </>
  );
};

EditTeam.layout = (page: React.ReactNode) => <AdminLayout children={page} />;

export default EditTeam;
