import ActionMenu from '@/components/actionMenu';
import Pagination from '@/components/pagination';
import SearchBar from '@/components/searchBar';
import AdminLayout from '@/layouts/admin/layout';
import { formatDate } from '@/lib/dateUtils';
import { cn, getImageUrl } from '@/lib/utils';
import {
  BracketChallenge,
  BracketChallengeStatus,
  League,
} from '@/types/bracket';
import type { PaginatedResponse } from '@/types/general';
import { Link, router } from '@inertiajs/react';
import { Network } from 'lucide-react';
import { useState } from 'react';

interface BracketChallengeListingProps {
  challenges: PaginatedResponse<BracketChallenge>;
  filters: {
    search: string;
  };
}

const BracketChallengeListing = ({
  challenges,
  filters,
}: BracketChallengeListingProps) => {
  const { data: items, meta, links } = challenges;

  const [loading, setLoading] = useState(false);

  const pageOptions = [
    {
      label: 'Create New',
      callback: () => {
        router.visit(`/admin/bracket-challenges/create`, {
          onBefore: () => setLoading(true),
        });
      },
    },
  ];

  const statusClass: Record<BracketChallengeStatus, string> = {
    closed: 'text-red-500',
    completed: 'text-amber-100',
    draft: 'text-slate-300',
    open: 'text-green-500',
  };

  return (
    <>
      <div className="mb-3 flex gap-2">
        <SearchBar
          filters={filters}
          queryUrl="/admin/bracket-challenges"
          className="flex-1 py-1 text-sm"
          placeholder="Search bracket challenges here"
        />
        <ActionMenu options={pageOptions} disabled={loading} />
      </div>

      <div>
        {items.length > 0 ? (
          <>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/admin/bracket-challenges/${item.id}`}
                  className="flex flex-col overflow-hidden rounded border border-gray-500 bg-gray-800 hover:border-gray-300 hover:bg-gray-700"
                >
                  <div className="flex gap-2 p-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-x-1.5 text-gray-300">
                        <p className="text-sm font-semibold">{item.name}</p>
                      </div>

                      <span
                        className={cn(
                          'bg-gray-600 px-2 text-[10px] font-medium tracking-widest uppercase',
                          statusClass[item.status],
                        )}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="flex flex-shrink-0 flex-col gap-1">
                      <p
                        className={cn(
                          'aspect-square h-2 rounded-full',
                          item.is_public ? 'bg-green-600' : 'bg-gray-500',
                        )}
                      ></p>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-between border-t border-gray-500 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-gray-300">
                    <p>
                      ID:
                      {item.id < 10 ? `0${item.id}` : item.id}
                    </p>
                    <p>Entries Count: {item.entries_count}</p>
                    {/* <p>{formatDate(item.created_at)}</p> */}
                  </div>
                </Link>
              ))}
            </div>
            <Pagination meta={meta} type="advanced" />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded border border-gray-700 bg-gray-800/50 py-12 text-center">
            <Network size={46} className="mb-3 text-gray-300" />
            <h2 className="text-lg font-bold text-gray-300">
              No bracket challenges found.
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

BracketChallengeListing.layout = (page: React.ReactNode) => (
  <AdminLayout children={page} />
);

export default BracketChallengeListing;
