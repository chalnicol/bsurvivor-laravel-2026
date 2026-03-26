import ActionMenu from '@/components/actionMenu';
import AdminBreadcrumbs from '@/components/admin/adminBreadcrumbs';
import AdminDetailCard from '@/components/admin/adminDetailCard';
import ConfirmationModal from '@/components/modals/confimationModal';
import AdminLayout from '@/layouts/admin/layout';
import { cn, getImageUrl } from '@/lib/utils';
import { Team } from '@/types/bracket';
import { BreadcrumbItem } from '@/types/general';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface TeamDetailsProps {
  team: Team;
}

const UserDetails = ({ team }: TeamDetailsProps) => {
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const breadcrumbItems: BreadcrumbItem[] = [
    { title: 'Teams', href: '/admin/teams' },
    { title: `${team.club_name} ${team.monicker}` },
  ];

  const pageOptions = [
    {
      label: 'Edit',
      callback: () => {
        router.visit(`/admin/teams/${team.id}/edit`, {
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

    router.delete(`/admin/teams/${team.id}`, {
      onBefore: () => setLoading(true),
    });
  };

  return (
    <>
      <AdminBreadcrumbs items={breadcrumbItems} />

      <div className="mt-4 flex gap-x-2">
        <p className="flex-1 border-b border-gray-400 py-1 font-bold text-gray-300">
          {team.club_name} {team.monicker}
        </p>
        <ActionMenu options={pageOptions} disabled={loading} />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-1.5 text-gray-300 md:grid-cols-2 lg:grid-cols-3">
        <AdminDetailCard title="ID">
          <p className="text-sm font-semibold">{team.id}</p>
        </AdminDetailCard>

        <AdminDetailCard title="logo">
          <img
            src={getImageUrl(team.logo || '')}
            alt={team.club_name}
            className="aspect-square w-8 object-contain"
          />
        </AdminDetailCard>

        <AdminDetailCard title="Club Name">
          <p className="text-sm font-semibold">{team.club_name}</p>
        </AdminDetailCard>

        <AdminDetailCard title="Monicker">
          <p className="text-sm font-semibold">{team.monicker}</p>
        </AdminDetailCard>

        <AdminDetailCard title="League">
          {team.league ? (
            <Link
              href={`/admin/leagues/${team.league.id}`}
              className="group flex gap-2"
            >
              <img
                src={getImageUrl(team.league.logo)}
                alt={team.league.name}
                className="aspect-square w-8 flex-shrink-0 object-contain"
              />
              <div>
                <p className="font-semibold group-hover:text-gray-200">
                  {team.league.short_name}
                </p>
                <p className="text-xs text-slate-400 group-hover:text-slate-300">
                  {team.league.name}
                </p>
              </div>
            </Link>
          ) : (
            <p className="text-sm font-semibold">--</p>
          )}
        </AdminDetailCard>

        <AdminDetailCard title="Conference">
          <span
            className={cn(
              'text-xs font-semibold tracking-widest uppercase',
              team.conference === 'east' && 'text-blue-500',
              team.conference === 'west' && 'text-red-600',
              team.conference === 'north' && 'text-yellow-600',
              team.conference === 'south' && 'text-green-600',
            )}
          >
            {team.conference || '--'}
          </span>
        </AdminDetailCard>
      </div>

      {confirmDelete && (
        <ConfirmationModal
          message="Are you sure you want to delete this team?"
          // details={team.club_name + ' ' + team.monicker}
          onConfirm={handleDelete}
          onClose={() => setConfirmDelete(false)}
          loading={loading}
        >
          <div className="flex gap-2 rounded bg-gray-700 p-2">
            <div className="flex-shrink-0">
              <img
                src={getImageUrl(team.logo)}
                alt={team.short_name}
                className="aspect-square w-8 object-contain"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-x-1.5 text-gray-300">
                <p className="text-sm font-semibold">{team.club_name}</p>
              </div>
              <p className="text-xs text-slate-400">{team.monicker}</p>
            </div>
          </div>
        </ConfirmationModal>
      )}
    </>
  );
};

UserDetails.layout = (page: React.ReactNode) => <AdminLayout children={page} />;

export default UserDetails;
