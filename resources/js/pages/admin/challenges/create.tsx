import AdminBreadcrumbs from '@/components/admin/adminBreadcrumbs';
import BracketChallengeForm from '@/components/form/bracketChallengeForm';
import LeagueForm from '@/components/form/leagueForm';
import AdminLayout from '@/layouts/admin/layout';
import { League, Team } from '@/types/bracket';
import { BreadcrumbItem } from '@/types/general';

const CreateBraacketChallenge = ({ leagues }: { leagues: League[] }) => {
  const breadcrumbItems: BreadcrumbItem[] = [
    { title: 'Bracket Challenges', href: '/admin/bracket-challenges' },
    { title: 'Create New Challenge' },
  ];

  return (
    <>
      <AdminBreadcrumbs items={breadcrumbItems} />

      <BracketChallengeForm className="mt-4" leagues={leagues} />
    </>
  );
};

CreateBraacketChallenge.layout = (page: React.ReactNode) => (
  <AdminLayout children={page} />
);

export default CreateBraacketChallenge;
