import AdminBreadcrumbs from '@/components/admin/adminBreadcrumbs';
import LeagueForm from '@/components/form/leagueForm';
import AdminLayout from '@/layouts/admin/layout';
import { League, Team } from '@/types/bracket';
import { BreadcrumbItem } from '@/types/general';

const EditLeague = ({ league }: { league: League }) => {
  const breadcrumbItems: BreadcrumbItem[] = [
    { title: 'Leagues', href: '/admin/leagues' },
    {
      title: league.name,
      href: `/admin/teams/${league.id}`,
    },
    { title: 'Edit League' },
  ];

  return (
    <>
      <AdminBreadcrumbs items={breadcrumbItems} />
      <LeagueForm className="mt-4" league={league} />
    </>
  );
};

EditLeague.layout = (page: React.ReactNode) => <AdminLayout children={page} />;

export default EditLeague;
