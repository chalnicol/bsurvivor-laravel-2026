import ContentBase from '@/components/contentBase';
import Pagination from '@/components/pagination';
import Pill from '@/components/pill';
import SearchBar from '@/components/searchBar';
import useDebounce from '@/hooks/use-debounce';
import ProfileLayout from '@/layouts/proflle/layout';
import { formatDate } from '@/lib/dateUtils';
import type { BracketChallengeEntry } from '@/types/bracket';
import { PaginatedResponse, PillColor } from '@/types/general';
import { Link, router } from '@inertiajs/react';
import { Sword, Trophy, User2Icon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface EntryListingProps {
  entries: PaginatedResponse<BracketChallengeEntry>;
  filters: {
    search: string;
  };
}

const EntryListing = ({ entries, filters }: EntryListingProps) => {
  const { data: items, meta, links } = entries;

  const statusClr: Record<string, PillColor> = {
    active: 'sky',
    eliminated: 'rose',
    won: 'emerald',
  };

  return (
    <>
      <title>{`BRACKET CHALLENGE ENTRIES | ${
        import.meta.env.VITE_APP_NAME
      }`}</title>

      <div>
        <SearchBar
          filters={filters}
          queryUrl="/profile/entries"
          className="mb-3 py-1 text-sm"
        />

        <div>
          {items.length > 0 ? (
            <>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  // <UserCardLink key={item.id} user={item} />
                  <Link
                    href={`/bracket-challenge-entries/${item.slug}`}
                    key={item.id}
                    className="divide-y divide-gray-500 rounded border border-gray-400 bg-gray-800 hover:bg-gray-700"
                  >
                    <div className="px-2 py-2 font-semibold">
                      <p className="text-gray-300">{item.name}</p>
                      <p>
                        <Pill
                          text={item.status}
                          color={statusClr[item.status]}
                        />
                      </p>
                    </div>

                    <div className="flex px-2 py-1 text-[10px] tracking-widest uppercase">
                      <p>{formatDate(item.created_at)}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Pagination meta={meta} type="advanced" />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded border border-gray-700 bg-gray-800/50 py-10 text-center">
              <Trophy size={46} className="mb-3 text-gray-300" />
              <h2 className="text-lg font-bold text-gray-300">
                No bracket challenge entries found.
              </h2>
              <p className="text-sm text-slate-400">
                Server may be down. Please try again later.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

EntryListing.layout = (page: React.ReactNode) => (
  <ProfileLayout children={page} />
);

export default EntryListing;
