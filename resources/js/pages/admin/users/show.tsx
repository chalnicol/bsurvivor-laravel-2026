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
import { User } from '@/types/auth';
import { BreadcrumbItem } from '@/types/general';
import { router } from '@inertiajs/react';
import { Check, CircleCheck, CircleX } from 'lucide-react';
import { format } from 'path';
import { useState } from 'react';

interface UserDetailsProps {
  user: User;
}

const UserDetails = ({ user }: UserDetailsProps) => {
  const [loading, setLoading] = useState(false);

  const [toUpdateRoles, setToUpdateRoles] = useState(false);
  const [roles, setRoles] = useState<string[]>(user.roles || []);
  const [error, setError] = useState<string | null>(null);
  const [toConfirmBlockUser, setToConfirmBlockUser] = useState(false);

  const breadcrumbItems: BreadcrumbItem[] = [
    { title: 'Users', href: '/admin/users' },
    { title: user.full_name },
  ];

  const handleToggleBlock = () => {
    setLoading(true);

    router.patch(
      `/admin/users/${user.id}/toggle-block-status`,
      {},
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
        onFinish: () => {
          setLoading(false);
          setToConfirmBlockUser(false);
        },
      },
    );
  };

  const pageOptions = [
    {
      label: user.is_blocked ? 'Unblock User' : 'Block User',
      callback: user.is_blocked
        ? handleToggleBlock
        : () => setToConfirmBlockUser(true),
    },
    {
      label: 'Update User Role',
      callback: () => setToUpdateRoles(true),
    },
  ];

  const roleOptions: { label: string; value: string }[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Moderator', value: 'moderator' },
  ];

  const handleOptionClick = (role: string) => {
    if (roles.includes(role)) {
      setRoles(roles.filter((r) => r !== role));
    } else {
      // setRoles([...roles, role]);
      setRoles([role]);
    }
  };

  const handleUpdateRoles = () => {
    //..
    setLoading(true);
    router.patch(
      `/admin/users/${user.id}/update-roles`,
      { roles },
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
        onFinish: () => {
          setLoading(false);
        },
        onSuccess: () => {
          setToUpdateRoles(false);
        },
        onError: (err: any) => {
          setRoles(user.roles || []);
          setError(err.error || 'Something went wrong.');
        },
      },
    );
  };

  const reset = () => {
    setError(null);
    setRoles(user.roles);
    setToUpdateRoles(false);
  };
  return (
    <>
      <AdminBreadcrumbs items={breadcrumbItems} />

      <div className="mt-4">
        <div className="flex gap-x-2">
          <p className="flex-1 border-b border-gray-400 py-1 font-bold text-gray-300">
            {user.full_name}
          </p>
          <ActionMenu options={pageOptions} disabled={loading} />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-1.5 text-gray-300 md:grid-cols-2 lg:grid-cols-3">
          <AdminDetailCard title="ID">
            <p className="text-sm font-semibold">{user.id}</p>
          </AdminDetailCard>

          <AdminDetailCard title="Avatar">
            <img
              src={getImageUrl(user.avatar, 'avatar')}
              alt={user.full_name}
              className="w-7 rounded-full object-contain"
            />
          </AdminDetailCard>

          <AdminDetailCard title="Email">
            <p className="text-sm font-semibold">{user.email}</p>
          </AdminDetailCard>

          <AdminDetailCard title="Roles">
            {user.roles && user.roles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.roles.map((role) => (
                  <span
                    key={role}
                    className="rounded border border-gray-500 bg-gray-700 px-2 py-1 text-xs font-semibold tracking-wider text-gray-300 uppercase"
                  >
                    {role}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs"> -- </span>
            )}
          </AdminDetailCard>

          <AdminDetailCard title="Email Verified">
            <span
              className={cn(
                'bg-gray-700 px-2 text-xs font-semibold tracking-wider uppercase',
                user.is_verified ? 'text-blue-400' : 'text-gray-400',
              )}
            >
              {user.is_verified ? 'Verified' : 'Unverified'}
            </span>
          </AdminDetailCard>

          <AdminDetailCard title="Account Status" className="">
            <span
              className={cn(
                'bg-gray-700 px-2 text-xs font-semibold tracking-wider uppercase',
                user.is_blocked ? 'text-rose-400' : 'text-emerald-500',
              )}
            >
              {user.is_blocked ? 'Blocked' : 'Active'}
            </span>
          </AdminDetailCard>

          <AdminDetailCard title="Member Since">
            <p className="text-sm font-semibold">
              {formatDate(user.created_at)}
            </p>
          </AdminDetailCard>
        </div>
      </div>

      {toUpdateRoles && (
        <BaseModal size="lg">
          <div className="rounded border border-gray-600 bg-gray-800 px-4 pt-3 pb-5 text-gray-300">
            <h2 className="font-semibold">Update Roles</h2>
            <p className="text-xs text-slate-400">
              Select to add or remove roles for this user.
            </p>

            {error && (
              <PromptMessage type="error" message={error} className="my-4" />
            )}

            <div className="my-4 flex flex-col divide-y divide-gray-600 overflow-hidden rounded border border-gray-500">
              {roleOptions.map((option) => {
                const isSelected = roles.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className={cn(
                      'flex cursor-pointer items-center justify-between p-2 text-left text-sm hover:bg-gray-700/50 disabled:pointer-events-none',
                      isSelected && 'bg-gray-700 text-amber-100',
                    )}
                    disabled={loading}
                  >
                    {option.label}
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-1.5">
              <CustomButton
                type="button"
                label="CANCEL"
                onClick={reset}
                className="min-w-16 bg-gray-600 px-4 text-sm hover:bg-gray-500"
              />
              <CustomButton
                type="button"
                label="OK"
                onClick={handleUpdateRoles}
                className="min-w-16 bg-sky-800 text-sm hover:bg-sky-800"
                disabled={loading}
                loading={loading}
              />
            </div>
          </div>
        </BaseModal>
      )}

      {toConfirmBlockUser && (
        <ConfirmationModal
          message="Are you sure you want to block this user?"
          details={user.full_name}
          onClose={() => setToConfirmBlockUser(false)}
          onConfirm={handleToggleBlock}
          loading={loading}
        />
      )}
    </>
  );
};

UserDetails.layout = (page: React.ReactNode) => <AdminLayout children={page} />;

export default UserDetails;
