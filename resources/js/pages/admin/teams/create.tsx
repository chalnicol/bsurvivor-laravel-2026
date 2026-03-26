import AdminBreadcrumbs from '@/components/admin/adminBreadcrumbs';
import TeamForm from '@/components/form/teamForm';
import AdminLayout from '@/layouts/admin/layout';
import { League } from '@/types/bracket';
import { BreadcrumbItem } from '@/types/general';

const CreateTeam = ({ leagues }: { leagues: League[] }) => {
  const breadcrumbItems: BreadcrumbItem[] = [
    { title: 'Teams', href: '/admin/teams' },
    { title: 'Create Team' },
  ];

  return (
    <>
      <AdminBreadcrumbs items={breadcrumbItems} />

      <TeamForm className="mt-4" leagues={leagues} />
    </>
  );
};

CreateTeam.layout = (page: React.ReactNode) => <AdminLayout children={page} />;

export default CreateTeam;
