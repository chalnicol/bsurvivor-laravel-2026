import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModalBase from './modalBase';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import type {
    BracketChallengeEntryInfo,
    PaginatedResponse,
} from '../data/adminData';
import apiClient from '../utils/axiosConfig';
import Spinner from './spinner';
import { Link } from 'react-router-dom';
import Detail from './detail';
import StatusPills from './statusPills';
import { useAuth } from '../context/auth/AuthProvider';
import useDebounce from '../hooks/use-debounce';

interface EntriesProps {
    bracketChallengeId: number;
    onClose: () => void;
}

const EntriesModal = ({ bracketChallengeId, onClose }: EntriesProps) => {
    const { isAuthenticated, user } = useAuth();

    const [entries, setEntries] = useState<BracketChallengeEntryInfo[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [lastPage, setLastPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

    const contRef = useRef<HTMLDivElement>(null);

    const fetchEntries = async (page: number, term: string) => {
        if (!bracketChallengeId) return;
        try {
            setIsLoading(true);
            const response = await apiClient.get<
                PaginatedResponse<BracketChallengeEntryInfo>
            >(
                `/bracket-challenges/${bracketChallengeId}/entries?page=${page}${
                    term ? `&search=${term}` : ''
                }`,
            );

            const { data, meta } = response.data;

            setEntries((prevEntries) => {
                if (page === 1) {
                    return data;
                }
                // Create a Set of all existing comment IDs for quick lookup
                const existingIds = new Set(
                    prevEntries.map((entries) => entries.id),
                );

                // Filter the new data to only include comments that are not already in our state
                const newUniqueEntries = data.filter(
                    (entries) => !existingIds.has(entries.id),
                );

                // Combine the old and new comments
                return [...prevEntries, ...newUniqueEntries];
            });
            setCurrentPage(meta.current_page);
            setLastPage(meta.last_page);
            setTotalCount(meta.total);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const openAnim = () => {
        if (contRef.current) {
            gsap.fromTo(
                contRef.current,
                { scale: 0 },
                {
                    scale: 1,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.8)',
                },
            );
        }
    };

    const closeAnim = () => {
        if (contRef.current) {
            gsap.to(contRef.current, {
                scale: 0,
                duration: 0.6,
                ease: 'elastic.in(1, 0.8)',
                onComplete: onClose,
            });
        }
    };

    const loadMoreEntries = () => {
        if (currentPage < lastPage) {
            fetchEntries(currentPage + 1, debouncedSearchTerm);
        }
    };

    useEffect(() => {
        fetchEntries(1, debouncedSearchTerm);
    }, [bracketChallengeId, debouncedSearchTerm]);

    useEffect(() => {
        openAnim();

        return () => {
            if (contRef.current) {
                gsap.killTweensOf(contRef.current);
            }
        };
    }, []);

    return (
        <ModalBase>
            <div ref={contRef} className={`m-auto h-140 w-full max-w-6xl`}>
                <div className="relative h-full w-full rounded bg-white p-1">
                    <button
                        className="absolute -top-2.5 -right-2.5 z-10 flex aspect-square w-6 cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-white text-black hover:bg-gray-300"
                        onClick={closeAnim}
                    >
                        <FontAwesomeIcon icon="xmark" />
                    </button>
                    <div className="flex h-full w-full flex-col space-y-4 rounded bg-gray-900 px-4 py-3 text-white">
                        <div className="text-gray-300">
                            <h1 className="text-lg font-semibold">
                                Submitted Entries{' '}
                                {totalCount > 0 ? `(${totalCount})` : ''}
                            </h1>
                            <p className="text-sm">
                                View all entries submitted for this challenge.
                            </p>
                        </div>
                        <div>
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mt-2 w-full rounded border border-gray-500 px-1 px-2 py-0.5 py-1.5 focus:outline-none"
                                placeholder="Filter search by user or status here..."
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <div>
                                {entries.length > 0 ? (
                                    <>
                                        <div>
                                            {entries.map((entry) => (
                                                <Link
                                                    to={`/bracket-challenge-entries/${entry.slug}`}
                                                    key={entry.id}
                                                    className="block flex items-center justify-center gap-x-3 border-t border-gray-600 text-sm last:border-b even:bg-gray-600/40 hover:bg-gray-700/30"
                                                >
                                                    <div className="grid flex-1 space-y-1 px-1 py-2 font-semibold sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
                                                        <Detail
                                                            label="User"
                                                            size="xs"
                                                        >
                                                            <span
                                                                className={`${
                                                                    isAuthenticated &&
                                                                    user &&
                                                                    user.id ==
                                                                        entry
                                                                            .user
                                                                            .id &&
                                                                    'font-semibold text-yellow-400'
                                                                }`}
                                                            >
                                                                {
                                                                    entry.user
                                                                        .username
                                                                }
                                                            </span>
                                                        </Detail>
                                                        <Detail
                                                            label="Likes"
                                                            size="xs"
                                                        >
                                                            {entry.votes.likes}
                                                        </Detail>
                                                        <Detail
                                                            label="Dislikes"
                                                            size="xs"
                                                        >
                                                            {
                                                                entry.votes
                                                                    .dislikes
                                                            }
                                                        </Detail>
                                                        <Detail
                                                            label="Comments"
                                                            size="xs"
                                                        >
                                                            {
                                                                entry.comments_count
                                                            }
                                                        </Detail>

                                                        <Detail
                                                            label="Status"
                                                            size="xs"
                                                        >
                                                            <StatusPills
                                                                status={
                                                                    entry.status
                                                                }
                                                            />
                                                        </Detail>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="mt-3 text-center">
                                            {currentPage < lastPage ? (
                                                <button
                                                    className="cursor-pointer space-x-2 rounded bg-gray-700 px-4 py-1 text-sm font-semibold text-white hover:bg-gray-600"
                                                    onClick={loadMoreEntries}
                                                >
                                                    <FontAwesomeIcon
                                                        icon="arrow-alt-circle-down"
                                                        size="sm"
                                                    />
                                                    <span>LOAD MORE</span>
                                                </button>
                                            ) : (
                                                <span className="mx-auto rounded px-4 text-sm font-bold text-gray-400 select-none">
                                                    - END OF ENTRIES -
                                                </span>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {!isLoading && (
                                            <p className="rounded bg-gray-600 px-3 py-2 text-white">
                                                No entries found.
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        {isLoading && (
                            <div className="absolute top-0 left-0 h-full w-full bg-gray-900/50">
                                <Spinner size="sm" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ModalBase>
    );
};

export default EntriesModal;
