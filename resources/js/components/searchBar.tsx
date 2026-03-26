import useDebounce from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

interface SearchBarProps {
  filters: Record<string, string>;
  queryUrl: string;
  className?: string;
  placeholder?: string;
}

const SearchBar = ({
  filters = {},
  queryUrl,
  placeholder,
  className,
}: SearchBarProps) => {
  const [search, setSearch] = useState(filters.search || '');
  // Prevent the first render from firing a request if the search is already empty
  const isFirstRender = useRef(true);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // 1. Create the base params without the search
    // We use 'any' here to allow flexible key additions for the URL
    const queryParams: Record<string, any> = { ...filters };

    // 2. Only add the search key if it's NOT empty
    if (debouncedSearch) {
      queryParams.search = debouncedSearch;
    } else {
      // If empty, we explicitly remove it from the filters copy
      // This is safer than 'delete' for TS
      const { search, ...rest } = queryParams;

      // Now 'rest' contains everything except the search key
      router.get(queryUrl, rest, {
        preserveState: true,
        replace: true,
        // only: [table],
      });
      return; // Exit early since we fired the request
    }

    // 3. Fire the request for when search has a value
    router.get(queryUrl, queryParams, {
      preserveState: true,
      replace: true,
      // only: [table],
    });
  }, [debouncedSearch]);

  return (
    <input
      type="search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className={cn(
        'w-full border-b border-gray-400 outline-none focus:border-amber-100',
        className,
      )}
      placeholder={placeholder || 'Search'}
    />
  );
};

export default SearchBar;
