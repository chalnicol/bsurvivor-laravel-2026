import ContentBase from '../../components/contentBase';
import { useEffect, useState } from 'react';
import useDebounce from '../../hooks/use-debounce';
import { BracketChallenge } from '@/types/bracket';
import CustomLink from '@/components/customLink';
import {
  ChevronLeft,
  ChevronRight,
  CircleArrowDown,
  Trophy,
} from 'lucide-react';
import Detail from '@/components/detailCard';
import { formatDate } from '@/lib/dateUtils';
import { AppCustomLayout } from '@/layouts/app-custom-layout';
import EmptyPrompt from '../../components/emptyPrompt';
import { PaginatedResponse } from '@/types/general';
import SearchBar from '@/components/searchBar';
import Pagination from '@/components/pagination';
import Pill from '@/components/pill';
import { Link } from '@inertiajs/react';
import { cn, getImageUrl } from '@/lib/utils';

interface BracketChallengesListProps {
  bracketChallenges: PaginatedResponse<BracketChallenge>;
  filters: Record<string, string>;
}

const BracketChallengesList = ({
  bracketChallenges,
  filters = {},
}: BracketChallengesListProps) => {
  const { data: items, meta, links } = bracketChallenges;

  // const [bracketChallenges, setBracketChallenges] = useState<
  //     BracketChallenge[]
  // >([]);

  return (
    <>
      <title>{`BRACKET CHALLENGES | ${import.meta.env.VITE_APP_NAME}`}</title>
      <ContentBase>
        <div className="">
          <h2 className="text-lg font-bold">Bracket Challenges</h2>
          <p className="text-xs font-medium text-slate-400">
            View all bracket challenges here
          </p>

          <div>
            <SearchBar
              filters={filters}
              queryUrl="/bracket-challenges"
              className="my-5 pb-1.5 text-sm"
              placeholder="Search by challenge name or league name.."
            />

            <div>
              {items.length > 0 ? (
                <>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                      <Link
                        href={`/bracket-challenges/${item.slug}`}
                        key={item.id}
                        className="group space-y-2 rounded border border-gray-400 bg-gray-800 p-3 hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          <img
                            src={getImageUrl(item.league?.logo || '')}
                            alt={item.league?.short_name}
                            className="aspect-square w-8 object-contain"
                          />
                          <p className="text-lg font-bold text-gray-300">
                            {item.name}
                          </p>
                        </div>

                        {/* <hr className="my-2 border border-gray-600" /> */}

                        <div className="rounded border border-t border-gray-500 bg-gray-700/20 px-3 py-2 tracking-wide text-slate-400 uppercase group-hover:bg-gray-600">
                          {item.status !== 'completed' ? (
                            <div className="space-y-0.5 text-xs">
                              <p className="font-semibold">Submission</p>
                              <div className="flex items-center gap-2">
                                <p>Opens:</p>
                                <p
                                  className={cn(
                                    item.is_open
                                      ? 'text-sky-500'
                                      : 'text-slate-400',
                                  )}
                                >
                                  {formatDate(item.submission_start)}
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <p>Closes:</p>

                                <p
                                  className={cn(
                                    item.is_open
                                      ? 'text-amber-400'
                                      : 'text-slate-400',
                                  )}
                                >
                                  {formatDate(item.submission_end)}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-lg">IS COMPLETED</p>
                          )}
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
        </div>
      </ContentBase>
    </>
  );
};

BracketChallengesList.layout = (page: React.ReactNode) => (
  <AppCustomLayout children={page} />
);
export default BracketChallengesList;
