import AdminBreadcrumbs from '@/components/admin/adminBreadcrumbs';
import LeagueForm from '@/components/form/leagueForm';
import AdminLayout from '@/layouts/admin/layout';
import { BreadcrumbItem } from '@/types/general';

const CreateTeam = () => {
  const breadcrumbItems: BreadcrumbItem[] = [
    { title: 'Leagues', href: '/admin/leagues' },
    { title: 'Create League' },
  ];

  return (
    <>
      <AdminBreadcrumbs items={breadcrumbItems} />

      <LeagueForm className="mt-4" />
    </>
  );
};

CreateTeam.layout = (page: React.ReactNode) => <AdminLayout children={page} />;

export default CreateTeam;
