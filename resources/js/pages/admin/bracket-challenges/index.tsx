import ActionMenu from '@/components/actionMenu';
import Pagination from '@/components/pagination';
import Pill from '@/components/pill';
import SearchBar from '@/components/searchBar';
import AdminLayout from '@/layouts/admin/layout';
import { cn } from '@/lib/utils';
import { BracketChallenge, BracketChallengeStatus } from '@/types/bracket';
import type { PaginatedResponse, PillColor } from '@/types/general';
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

  const pillClr: Record<BracketChallengeStatus, PillColor> = {
    published: 'emerald',
    completed: 'amber',
    draft: 'gray',
  };

  const status: Record<
    BracketChallengeStatus,
    { label: string; txtClass: string }
  > = {
    published: { label: 'P', txtClass: 'bg-emerald-600 text-gray-200' },
    completed: { label: 'C', txtClass: 'bg-amber-400 text-zinc-800' },
    draft: { label: 'D', txtClass: 'bg-slate-500 text-slate-300' },
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
                  className="flex flex-col overflow-hidden rounded border border-gray-400 bg-gray-800 hover:bg-gray-700"
                >
                  <div className="flex gap-2 p-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-300">{item.name}</p>
                      <p className={cn('text-xs font-semibold text-slate-400')}>
                        {item.league?.short_name}
                      </p>
                      {/* <Pill text={item.status} color={pillClr[item.status]} /> */}
                    </div>

                    <div className="flex flex-shrink-0 flex-col gap-1">
                      <span
                        className={cn(
                          'px-1 text-[10px] font-semibold',
                          item.is_public
                            ? 'bg-emerald-600 text-gray-200'
                            : 'bg-slate-500 text-slate-300',
                        )}
                        title={item.is_public ? 'Public' : 'Private'}
                      >
                        P
                      </span>
                      <span
                        className={cn(
                          'px-1 text-[10px] font-semibold',
                          status[item.status].txtClass,
                        )}
                        title={item.status}
                      >
                        {status[item.status].label}
                      </span>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-between border-t border-gray-400 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-gray-300">
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
