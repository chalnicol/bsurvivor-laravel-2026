import ActionMenu from '@/components/actionMenu';
import AdminBreadcrumbs from '@/components/admin/adminBreadcrumbs';
import AdminDetailCard from '@/components/admin/adminDetailCard';
import BracketTree from '@/components/bracket/bracketTree';
import ConfirmationModal from '@/components/modals/confimationModal';
import Pill from '@/components/pill';
import BracketChallengeProvider from '@/context/BracketChallengeProvider';
import AdminLayout from '@/layouts/admin/layout';
import { formatDate } from '@/lib/dateUtils';
import { getImageUrl } from '@/lib/utils';
import { BracketChallenge, BracketChallengeStatus } from '@/types/bracket';
import { BreadcrumbItem, PillColor } from '@/types/general';
import { Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

interface BracketChallengeDetailsProps {
  challenge: BracketChallenge;
}

const UserDetails = ({ challenge }: BracketChallengeDetailsProps) => {
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmPublish, setConfirmPublish] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems: BreadcrumbItem[] = [
    { title: 'Bracket Challenges', href: '/admin/bracket-challenges' },
    { title: challenge.name },
  ];

  const pageOptions: {
    label: string;
    callback: () => void;
  }[] = useMemo(() => {
    const options = [
      {
        label: 'Delete',
        callback: () => setConfirmDelete(true),
      },
      {
        label: challenge.is_public ? 'Set Private' : 'Set Public',
        callback: () => handleTogglePublic(),
      },
    ];
    if (challenge.status == 'draft') {
      let newOptions = options;

      newOptions.unshift({
        label: 'Edit',
        callback: () => {
          router.visit(`/admin/bracket-challenges/${challenge.id}/edit`, {
            onBefore: () => setLoading(true),
          });
        },
      });

      newOptions.push({
        label: 'Publish',
        callback: () => setConfirmPublish(true),
      });

      return newOptions;
    }

    return options;
  }, [challenge.status, challenge.is_public]);

  const handleDelete = () => {
    // setConfirmDelete(false);

    router.delete(`/admin/bracket-challenges/${challenge.id}`, {
      onBefore: () => setLoading(true),
      onFinish: () => {
        setLoading(false);
        setConfirmDelete(false);
      },
    });
  };

  const handleTogglePublic = () => {
    router.patch(
      `/admin/bracket-challenges/${challenge.id}/toggle-public`,
      {},
      {
        preserveScroll: true,
        replace: true,
        onBefore: () => setLoading(true),
        onFinish: () => setLoading(false),
      },
    );
  };

  const handlePublish = () => {
    setLoading(true);
    router.patch(
      `/admin/bracket-challenges/${challenge.id}/publish`,
      {},
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,

        onFinish: () => setLoading(false),
        onSuccess: () => setConfirmPublish(false),
      },
    );
  };

  const statusClass: Record<BracketChallengeStatus, PillColor> = {
    completed: 'amber',
    draft: 'gray',
    published: 'emerald',
  };

  return (
    <>
      <AdminBreadcrumbs items={breadcrumbItems} />

      <div className="mt-4">
        <div className="mt-4 flex gap-x-2">
          <p className="flex-1 border-b border-gray-400 py-1 font-bold text-gray-300">
            {challenge.name}
          </p>
          <ActionMenu options={pageOptions} disabled={loading} />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-1.5 text-gray-300 md:grid-cols-2 lg:grid-cols-3">
          <AdminDetailCard title="ID">
            <p className="text-sm font-semibold">{challenge.id}</p>
          </AdminDetailCard>

          <AdminDetailCard title="Name">
            <p className="text-sm font-semibold">{challenge.name}</p>
          </AdminDetailCard>

          <AdminDetailCard title="League">
            {challenge.league ? (
              <Link
                href={`/admin/leagues/${challenge.league.id}`}
                className="flex gap-2 rounded border p-1 hover:border-gray-600"
              >
                <img
                  src={getImageUrl(challenge.league.logo)}
                  alt={challenge.league.name}
                  className="aspect-square w-8 flex-shrink-0 object-contain"
                />
                <div>
                  <p className="font-semibold">{challenge.league.short_name}</p>
                  <p className="text-xs text-slate-400">
                    {challenge.league.name}
                  </p>
                </div>
              </Link>
            ) : (
              <p className="text-sm font-semibold">--</p>
            )}
          </AdminDetailCard>

          <AdminDetailCard title="Entries Count">
            <p className="text-sm font-semibold">
              {challenge.entries_count || 0}
            </p>
          </AdminDetailCard>

          <AdminDetailCard title="Submission Start">
            <p className="text-xs font-semibold tracking-widest text-gray-300 uppercase">
              {formatDate(challenge.submission_start)}
            </p>
          </AdminDetailCard>

          <AdminDetailCard title="Submission End">
            <p className="text-xs font-semibold tracking-widest text-gray-300 uppercase">
              {formatDate(challenge.submission_end)}
            </p>
          </AdminDetailCard>

          <AdminDetailCard title="Status">
            <Pill
              text={challenge.status}
              color={statusClass[challenge.status]}
            />
          </AdminDetailCard>

          <AdminDetailCard title="is Public">
            <Pill
              text={challenge.is_public ? 'Public' : 'Private'}
              color={challenge.is_public ? 'emerald' : 'gray'}
            />
          </AdminDetailCard>

          <AdminDetailCard title="Slug" className="md:col-span-2 lg:col-span-1">
            <p className="rounded bg-zinc-900 p-2 font-mono text-xs text-slate-400">
              {challenge.slug}
            </p>
          </AdminDetailCard>

          <AdminDetailCard
            title="Bracket"
            className="grid md:col-span-2 lg:col-span-3"
          >
            <BracketChallengeProvider challenge={challenge}>
              <BracketTree />
            </BracketChallengeProvider>
          </AdminDetailCard>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmationModal
          message="Are you sure you want to delete this challenge?"
          details={challenge.name}
          onConfirm={handleDelete}
          onClose={() => setConfirmDelete(false)}
          loading={loading}
        />
      )}

      {confirmPublish && (
        <ConfirmationModal
          message="Once done, no changes can be made. Are you sure you want to publish? "
          onConfirm={handlePublish}
          onClose={() => setConfirmPublish(false)}
          loading={loading}
          button="info"
        />
      )}
    </>
  );
};

UserDetails.layout = (page: React.ReactNode) => <AdminLayout children={page} />;

export default UserDetails;
