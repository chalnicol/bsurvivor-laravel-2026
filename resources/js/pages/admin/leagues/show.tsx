import ActionMenu from '@/components/actionMenu';
import AdminBreadcrumbs from '@/components/admin/adminBreadcrumbs';
import AdminDetailCard from '@/components/admin/adminDetailCard';
import CustomButton from '@/components/customButton';
import ConfirmationModal from '@/components/modals/confimationModal';
import AdminLayout from '@/layouts/admin/layout';
import { formatDate } from '@/lib/dateUtils';
import { getImageUrl } from '@/lib/utils';
import { League } from '@/types/bracket';
import { BreadcrumbItem } from '@/types/general';
import { Link, router } from '@inertiajs/react';
import { CircleCheck, CircleX } from 'lucide-react';
import { format } from 'path';
import { useState } from 'react';

interface TeamDetailsProps {
  league: League;
}

const UserDetails = ({ league }: TeamDetailsProps) => {
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const breadcrumbItems: BreadcrumbItem[] = [
    { title: 'Leagues', href: '/admin/leagues' },
    { title: league.name },
  ];

  const pageOptions = [
    {
      label: 'Edit',
      callback: () => {
        router.visit(`/admin/leagues/${league.id}/edit`, {
          onBefore: () => setLoading(true),
        });
      },
    },
    {
      label: 'Delete',
      callback: () => setConfirmDelete(true),
    },
  ];

  const handleDelete = () => {
    // setConfirmDelete(false);

    router.delete(`/admin/leagues/${league.id}`, {
      onBefore: () => setLoading(true),
    });
  };

  return (
    <>
      <AdminBreadcrumbs items={breadcrumbItems} />

      <div className="mt-4">
        <div className="mt-4 flex gap-x-2">
          <p className="flex-1 border-b border-gray-400 py-1 font-bold text-gray-300">
            {league.name}
          </p>
          <ActionMenu options={pageOptions} disabled={loading} />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-1.5 text-gray-300 md:grid-cols-2 lg:grid-cols-3">
          <AdminDetailCard title="ID">
            <p className="text-sm font-semibold">{league.id}</p>
          </AdminDetailCard>

          <AdminDetailCard title="logo">
            <img
              src={getImageUrl(league.logo || '')}
              alt={league.name}
              className="aspect-square w-8 object-contain"
            />
          </AdminDetailCard>

          <AdminDetailCard title="Name">
            <p className="text-sm font-semibold">{league.name}</p>
          </AdminDetailCard>

          <AdminDetailCard title="Short Name">
            <p className="text-sm font-semibold">{league.short_name}</p>
          </AdminDetailCard>

          <AdminDetailCard title="Status">
            <p className="text-sm font-semibold">N/A</p>
          </AdminDetailCard>

          <AdminDetailCard title="Bracket Challenges">
            <p className="text-sm font-semibold">
              {league.bracket_challenges_count}
            </p>
          </AdminDetailCard>

          <AdminDetailCard
            title="Teams"
            className="col-span-1 md:col-span-2 lg:col-span-3"
          >
            {league.teams && league.teams?.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-2 gap-y-1.5 md:grid-cols-2 lg:grid-cols-3">
                {league.teams.map((team) => (
                  <Link
                    key={team.id}
                    href={`/admin/teams/${team.id}`}
                    className="flex items-center gap-x-1.5 rounded border border-gray-600 bg-gray-800 p-2 hover:bg-gray-700"
                  >
                    <img
                      src={getImageUrl(team.logo || '')}
                      alt={team.club_name}
                      className="aspect-square w-6 rounded-full object-contain"
                    />
                    <p className="text-sm">
                      {team.club_name} {team.monicker}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <span className="text-xs"> -- </span>
            )}
          </AdminDetailCard>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmationModal
          message="Are you sure you want to delete this league?"
          details={league.name}
          onConfirm={handleDelete}
          onClose={() => setConfirmDelete(false)}
          loading={loading}
        >
          <div className="flex gap-2 rounded bg-gray-700 p-2">
            <div className="flex-shrink-0">
              <img
                src={getImageUrl(league.logo)}
                alt={league.short_name}
                className="aspect-square w-8 object-contain"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-x-1.5 text-gray-300">
                <p className="text-sm font-semibold">{league.short_name}</p>
              </div>
              <p className="text-xs text-slate-400">{league.name}</p>
            </div>
          </div>
        </ConfirmationModal>
      )}
    </>
  );
};

UserDetails.layout = (page: React.ReactNode) => <AdminLayout children={page} />;

export default UserDetails;
