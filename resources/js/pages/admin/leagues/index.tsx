import ActionMenu from '@/components/actionMenu';
import Pagination from '@/components/pagination';
import SearchBar from '@/components/searchBar';
import AdminLayout from '@/layouts/admin/layout';
import { formatDate } from '@/lib/dateUtils';
import { getImageUrl } from '@/lib/utils';
import { League } from '@/types/bracket';
import type { PaginatedResponse } from '@/types/general';
import { Link, router } from '@inertiajs/react';
import { Swords } from 'lucide-react';
import { useState } from 'react';

interface UserListingProps {
  leagues: PaginatedResponse<League>;
  filters: {
    search: string;
  };
}

const UserListing = ({ leagues, filters }: UserListingProps) => {
  const { data: items, meta, links } = leagues;

  const [loading, setLoading] = useState(false);

  const pageOptions = [
    {
      label: 'Create New',
      callback: () => {
        router.visit(`/admin/leagues/create`, {
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
          queryUrl="/admin/leagues"
          className="flex-1 py-1 text-sm"
          placeholder="Search leagues here"
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
                  href={`/admin/leagues/${item.id}`}
                  className="flex flex-col overflow-hidden rounded border border-gray-400 bg-gray-800 hover:bg-gray-700"
                >
                  <div className="flex gap-2 p-2">
                    <img
                      src={getImageUrl(item.logo || '')}
                      alt={item.short_name}
                      className="aspect-square w-8 flex-shrink-0 object-contain"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-x-1.5 text-gray-300">
                        <p className="text-sm font-semibold">
                          {item.short_name}
                        </p>
                      </div>
                      <p className="text-xs text-slate-400">{item.name}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-between border-t border-gray-600 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-gray-300">
                    <p>
                      ID:
                      {item.id < 10 ? `0${item.id}` : item.id}
                    </p>
                    <p>Teams: {item.teams_count}</p>
                    {/* <p>{formatDate(item.created_at)}</p> */}
                  </div>
                </Link>
              ))}
            </div>
            <Pagination meta={meta} type="advanced" />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded border border-gray-700 bg-gray-800/50 py-12 text-center">
            <Swords size={46} className="mb-3 text-gray-300" />
            <h2 className="text-lg font-bold text-gray-300">
              No leagues found.
            </h2>
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
