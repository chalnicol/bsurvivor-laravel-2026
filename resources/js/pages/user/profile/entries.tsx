import ContentBase from '@/components/contentBase';
import Pagination from '@/components/pagination';
import SearchBar from '@/components/searchBar';
import useDebounce from '@/hooks/use-debounce';
import ProfileLayout from '@/layouts/proflle/layout';
import type { BracketChallengeEntry } from '@/types/bracket';
import { PaginatedResponse } from '@/types/general';
import { router } from '@inertiajs/react';
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
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  // <UserCardLink key={item.id} user={item} />
                  <div key={item.id}>
                    <p>{item.name}</p>
                  </div>
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
