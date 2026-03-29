import ActionMenu from '@/components/actionMenu';
import CustomLink from '@/components/customLink';
import Pagination from '@/components/pagination';
import SearchBar from '@/components/searchBar';
import AdminLayout from '@/layouts/admin/layout';
import { formatDate } from '@/lib/dateUtils';
import { cn, getImageUrl } from '@/lib/utils';
import { Team } from '@/types/bracket';
import type { PaginatedResponse } from '@/types/general';
import { Link, router } from '@inertiajs/react';
import { Shield, User2Icon } from 'lucide-react';
import { useState } from 'react';

interface UserListingProps {
  teams: PaginatedResponse<Team>;
  filters: {
    search: string;
  };
}

const UserListing = ({ teams, filters }: UserListingProps) => {
  const { data: items, meta, links } = teams;
  const [loading, setLoading] = useState(false);

  const pageOptions = [
    {
      label: 'Create New',
      callback: () => {
        router.visit(`/admin/teams/create`, {
          onBefore: () => setLoading(true),
        });
      },
    },
  ];

  return (
    <>
      <div className="mb-3 flex gap-2">
        <SearchBar
          filters={filters}
          queryUrl="/admin/teams"
          className="flex-1 py-1 text-sm"
          placeholder="Search teams here"
        />
        <ActionMenu options={pageOptions} disabled={loading} />
      </div>

      <div>
        {items.length > 0 ? (
          <>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/admin/teams/${item.id}`}
                  className="flex flex-col overflow-hidden rounded border border-gray-400 bg-gray-800 hover:bg-gray-700"
                >
                  <div className="flex gap-2 p-2">
                    <div className="flex-shrink-0">
                      <img
                        src={getImageUrl(item.logo || '')}
                        alt={item.club_name}
                        className="aspect-square w-8 object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-x-1.5 text-gray-300">
                        <p className="text-sm font-semibold">
                          {item.club_name}
                        </p>
                      </div>
                      <p className="text-xs text-slate-400">{item.monicker}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-between border-t border-gray-600 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-gray-300">
                    <p>
                      ID:
                      {item.id < 10 ? `0${item.id}` : item.id}
                    </p>
                    <p>{item.league?.short_name}</p>
                    {/* <p>{formatDate(item.created_at)}</p> */}
                  </div>
                </Link>
              ))}
            </div>
            <Pagination meta={meta} type="advanced" />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded border border-gray-700 bg-gray-800/50 py-12 text-center">
            <Shield size={46} className="mb-3 text-gray-300" />
            <h2 className="text-lg font-bold text-gray-300">No teams found.</h2>
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
