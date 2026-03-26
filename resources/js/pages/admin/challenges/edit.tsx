import AdminBreadcrumbs from '@/components/admin/adminBreadcrumbs';
import BracketChallengeForm from '@/components/form/bracketChallengeForm';
import LeagueForm from '@/components/form/leagueForm';
import AdminLayout from '@/layouts/admin/layout';
import { BracketChallenge, League, Team } from '@/types/bracket';
import { BreadcrumbItem } from '@/types/general';

const EditBracketChallenge = ({
  challenge,
  leagues,
}: {
  challenge: BracketChallenge;
  leagues: League[];
}) => {
  const breadcrumbItems: BreadcrumbItem[] = [
    { title: 'Bracket Challenges', href: '/admin/brackekt-challenges' },
    {
      title: challenge.name,
      href: `/admin/bracket-challenges/${challenge.id}`,
    },
    { title: 'Edit Bracket Challenge' },
  ];

  return (
    <>
      <AdminBreadcrumbs items={breadcrumbItems} />
      <BracketChallengeForm
        className="mt-4"
        challenge={challenge}
        leagues={leagues}
      />
    </>
  );
};

EditBracketChallenge.layout = (page: React.ReactNode) => (
  <AdminLayout children={page} />
);

export default EditBracketChallenge;
