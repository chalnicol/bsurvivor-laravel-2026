import CustomLink from '@/components/customLink';
import Pagination from '@/components/pagination';
import SearchBar from '@/components/searchBar';
import AdminLayout from '@/layouts/admin/layout';
import { formatDate } from '@/lib/dateUtils';
import { cn, getImageUrl } from '@/lib/utils';
import { User } from '@/types/auth';
import type { PaginatedResponse } from '@/types/general';
import { Link } from '@inertiajs/react';
import { User2Icon } from 'lucide-react';

interface UserListingProps {
  users: PaginatedResponse<User>;
  filters: {
    search: string;
  };
}

const UserListing = ({ users, filters }: UserListingProps) => {
  const { data: items, meta, links } = users;

  const breadcrumbItems = [{ title: 'Users' }];

  return (
    <>
      <div className="mb-3 flex gap-2">
        {/* <CustomLink
          href="/admin/users"
          label="Add New"
          className="flex flex-none items-center rounded border border-gray-500 bg-gray-700 px-2.5 py-1 text-xs font-semibold tracking-wider uppercase"
        /> */}
        <SearchBar
          filters={filters}
          queryUrl="/admin/users"
          className="flex-1 py-1 text-sm"
          placeholder="Search users here"
        />
      </div>

      <div>
        {items.length > 0 ? (
          <>
            <div className="grid gap-2 lg:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/admin/users/${item.id}`}
                  className="group flex flex-col overflow-hidden rounded border border-gray-400 bg-gray-800 hover:bg-gray-700"
                >
                  <div className="flex items-center gap-2 p-2">
                    <div className="flex-none">
                      <img
                        src={getImageUrl(item.avatar, 'avatar')}
                        alt={item.full_name}
                        className="h-full w-9 rounded-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{item.full_name}</p>
                      <p className="text-xs text-slate-400">{item.email}</p>
                    </div>

                    <div className="flex flex-none flex-col gap-1">
                      <span
                        className={cn(
                          'px-1 text-[10px] font-semibold',
                          item.is_blocked
                            ? 'bg-rose-400 text-white'
                            : 'bg-emerald-500 text-white',
                        )}
                      >
                        {item.is_blocked ? 'B' : 'A'}
                      </span>
                      <span
                        className={cn(
                          'px-1 text-[10px] font-semibold',
                          item.is_verified
                            ? 'bg-sky-600 text-white'
                            : 'bg-gray-700 text-gray-300',
                        )}
                      >
                        V
                      </span>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-between border-t border-gray-600 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-gray-300">
                    <p>
                      ID:
                      {item.id < 10 ? `0${item.id}` : item.id}
                    </p>
                    <p>{formatDate(item.created_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Pagination meta={meta} type="advanced" />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded border border-gray-700 bg-gray-800/50 py-12 text-center">
            <User2Icon size={46} className="mb-3 text-gray-300" />
            <h2 className="text-lg font-bold text-gray-300">No users found.</h2>
            <p className="text-sm text-slate-400">
              Server may be down. Please try again later.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

UserListing.layout = (page: React.ReactNode) => <AdminLayout children={page} />;

export default UserListing;
