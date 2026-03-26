import ActionMenu from '@/components/actionMenu';
import AdminBreadcrumbs from '@/components/admin/adminBreadcrumbs';
import AdminDetailCard from '@/components/admin/adminDetailCard';
import CustomButton from '@/components/customButton';
import BaseModal from '@/components/modals/baseModal';
import ConfirmationModal from '@/components/modals/confimationModal';
import PromptMessage from '@/components/promptMessage';
import AdminLayout from '@/layouts/admin/layout';
import { formatDate } from '@/lib/dateUtils';
import { cn, getImageUrl } from '@/lib/utils';
import {
  BracketChallenge,
  BracketChallengeStatus,
  League,
} from '@/types/bracket';
import { BreadcrumbItem } from '@/types/general';
import { Link, router } from '@inertiajs/react';
import { Check, Edit } from 'lucide-react';
import { format } from 'path';
import { useState } from 'react';

interface BracketChallengeDetailsProps {
  challenge: BracketChallenge;
}

const UserDetails = ({ challenge }: BracketChallengeDetailsProps) => {
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState<BracketChallengeStatus>(
    challenge.status,
  );
  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems: BreadcrumbItem[] = [
    { title: 'Bracket Challenges', href: '/admin/bracket-challenges' },
    { title: challenge.name },
  ];

  const pageOptions = [
    {
      label: 'Edit',
      callback: () => {
        router.visit(`/admin/bracket-challenges/${challenge.id}/edit`, {
          onBefore: () => setLoading(true),
        });
      },
    },
    {
      label: 'Delete',
      callback: () => setConfirmDelete(true),
    },
    {
      label: 'Toggle Public',
      callback: () => handleTogglePublic(),
    },
    {
      label: 'Change Status',
      callback: () => {
        setShowStatus(true);
        setError(null);
      },
    },
  ];

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
        preserveState: true,
        replace: true,
        onBefore: () => setLoading(true),
        onFinish: () => setLoading(false),
      },
    );
  };

  const statusOptions: { label: string; value: BracketChallengeStatus }[] = [
    {
      label: 'Draft',
      value: 'draft',
    },
    {
      label: 'Open',
      value: 'open',
    },
    {
      label: 'Closed',
      value: 'closed',
    },
    {
      label: 'Completed',
      value: 'completed',
    },
  ];

  const handleUpdateStatus = () => {
    setLoading(true);
    setError(null);
    router.patch(
      `/admin/bracket-challenges/${challenge.id}/update-status`,
      { status },
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
        onError: (err: any) => {
          setError(err.status || 'Something went wrong. Please try again');
          setStatus(challenge.status);
        },
        onFinish: () => setLoading(false),
        onSuccess: () => setShowStatus(false),
      },
    );
  };

  const statusClass: Record<BracketChallengeStatus, string> = {
    closed: 'text-red-500',
    completed: 'text-amber-100',
    draft: 'text-slate-400',
    open: 'text-green-500',
  };

  // console.log(challenge);

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

          <AdminDetailCard title="is Public">
            <span
              className={cn(
                'bg-gray-700 px-2 text-xs font-bold tracking-wider uppercase',
                challenge.is_public ? 'text-emerald-400' : 'text-rose-400',
              )}
            >
              {challenge.is_public ? 'Yes' : 'No'}
            </span>
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

          <AdminDetailCard title="Slug">
            <p className="bg-gray-900 px-2 py-1 font-mono text-xs text-slate-400">
              {challenge.slug}
            </p>
          </AdminDetailCard>

          <AdminDetailCard title="Status">
            <span
              className={cn(
                'bg-gray-700 px-2 text-xs font-semibold tracking-wider text-slate-400 uppercase',
                statusClass[challenge.status],
              )}
            >
              {challenge.status}
            </span>
          </AdminDetailCard>

          <AdminDetailCard title="Entries Count">
            <p className="text-sm font-semibold">{challenge.entries_count}</p>
          </AdminDetailCard>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmationModal
          message="Are you sure you want to delete this league?"
          details={challenge.name}
          onConfirm={handleDelete}
          onClose={() => setConfirmDelete(false)}
          loading={loading}
        />
      )}

      {showStatus && (
        <BaseModal size="lg">
          <div className="rounded border border-gray-600 bg-gray-900 px-4 pt-3 pb-5 text-gray-300">
            <h2 className="font-semibold">Change Status</h2>
            <p className="text-xs text-slate-400">
              Please select a new status for this challenge.
            </p>

            {error && (
              <PromptMessage type="error" message={error} className="my-4" />
            )}

            <div className="my-4 flex max-h-[40dvh] flex-col overflow-y-auto rounded border border-gray-500">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatus(option.value)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-2 border-b border-gray-700 px-3 py-1 text-left text-sm last:border-0 even:bg-gray-800 hover:text-amber-100 disabled:pointer-events-none',
                    status === option.value && 'text-amber-100',
                  )}
                  disabled={loading || status === option.value}
                >
                  {option.label}
                  {status === option.value && <Check size={14} />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <CustomButton
                type="button"
                label="CANCEL"
                onClick={() => setShowStatus(false)}
                className="min-w-16 bg-gray-600 px-4 text-sm hover:bg-gray-500"
              />
              <CustomButton
                type="button"
                label="OK"
                onClick={handleUpdateStatus}
                className="min-w-16 bg-sky-800 text-sm hover:bg-sky-800"
                disabled={loading || !status}
                loading={loading}
              />
            </div>
          </div>
        </BaseModal>
      )}
    </>
  );
};

UserDetails.layout = (page: React.ReactNode) => <AdminLayout children={page} />;

export default UserDetails;
