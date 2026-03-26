import ContentBase from '../../components/contentBase';
import { useEffect, useState } from 'react';
import useDebounce from '../../hooks/use-debounce';
import { BracketChallenge } from '@/types/bracket';
import CustomLink from '@/components/customLink';
import { CircleArrowDown, Trophy } from 'lucide-react';
import Detail from '@/components/detail';
import { formatDate } from '@/lib/dateUtils';
import { AppCustomLayout } from '@/layouts/app-custom-layout';
import EmptyPrompt from '../../components/emptyPrompt';
import { PaginatedResponse } from '@/types/general';
import SearchBar from '@/components/searchBar';
import Pagination from '@/components/pagination';

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
            <title>{`BRACKET CHALLENGES | ${
                import.meta.env.VITE_APP_NAME
            }`}</title>
            <ContentBase>
                <div className="">
                    <h2 className="text-lg font-bold">Bracket Challenges</h2>
                    <p className="text-xs font-medium text-slate-400">
                        View all bracket challenges here
                    </p>

                    {/* <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mt-4 w-full border-b border-gray-400 px-1 py-0.5 focus:outline-none"
                        placeholder="Filter search here..."
                    /> */}

                    <div>
                        <SearchBar
                            filters={filters}
                            queryUrl="/bracket-challenges"
                            className="my-3 pb-1.5 text-sm"
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
                                    <Trophy
                                        size={46}
                                        className="mb-3 text-gray-300"
                                    />
                                    <h2 className="text-lg font-bold text-gray-300">
                                        No bracket challenge entries found.
                                    </h2>
                                    <p className="text-sm text-slate-400">
                                        Server may be down. Please try again
                                        later.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* <div className="mt-3">
                        {bracketChallenges.length > 0 ? (
                            <>
                                <div className="overflow-x-hidden">
                                    <div className="min-w-xl">
                                        {bracketChallenges.map((challenge) => (
                                            <CustomLink
                                                href={`/bracket-challenges/${challenge.slug}`}
                                                key={challenge.id}
                                            >
                                                <div className="mb-1 space-y-1 rounded border bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700 sm:grid md:grid-cols-2">
                                                    <Detail label="Challenge Name">
                                                        {challenge.name}
                                                    </Detail>
                                                    <Detail label="League">
                                                        {challenge.league?.name}
                                                    </Detail>
                                                    <Detail label="Submission Opens">
                                                        {formatDate(
                                                            challenge.submission_start,
                                                        )}
                                                    </Detail>
                                                    <Detail label="Submission Closes">
                                                        {formatDate(
                                                            challenge.submission_end,
                                                        )}
                                                    </Detail>
                                                </div>
                                            </CustomLink>
                                        ))}
                                    </div>
                                    <div className="mt-3 text-center">
                                        {currentPage < lastPage ? (
                                            <button
                                                className="cursor-pointer space-x-2 rounded bg-gray-700 px-4 py-1 text-sm font-semibold text-white hover:bg-gray-600"
                                                onClick={loadModeChallenges}
                                            >
                                                <CircleArrowDown size={14} />
                                                <span>LOAD MORE</span>
                                            </button>
                                        ) : (
                                            <span className="mx-auto rounded px-4 text-sm font-bold text-gray-400 select-none">
                                                - END OF BRACKET CHALLENGES -
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="mt-3">
                                {isLoading ? (
                                    <p className="rounded bg-gray-300 p-3">
                                        Loading..
                                    </p>
                                ) : (
                                    // <EmptyPrompt
                                    //     message="No bracket challenges found."
                                    //     // className="mt-6"
                                    // />
                                    <div className="flex flex-col items-center justify-center rounded border border-gray-700 bg-gray-800/50 py-10 text-center">
                                        <Trophy
                                            size={46}
                                            className="mb-3 text-gray-300"
                                        />
                                        <h2 className="text-lg font-bold text-gray-300">
                                            No bracket challenges found.
                                        </h2>
                                        <p className="text-sm text-slate-400">
                                            Server may be down. Please try again
                                            later.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div> */}
                </div>
            </ContentBase>
        </>
    );
};

BracketChallengesList.layout = (page: React.ReactNode) => (
    <AppCustomLayout children={page} />
);
export default BracketChallengesList;
