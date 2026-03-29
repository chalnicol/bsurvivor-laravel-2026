import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { type BracketChallengeInfo } from '../data/adminData';
import { apiClient } from '../utils/api';
import { BracketProvider } from '../context/bracket/BracketProvider';

import Loader from '../components/loader';
import Bracket from '../components/bracket/bracket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { displayLocalDate } from '../utils/dateTime';
import ContentBase from '../components/contentBase';
import { useAuth } from '../context/auth/AuthProvider';
import Detail from '../components/detailCard';
import { Link } from 'react-router-dom';
import EndOfPage from '../components/endOfPage';
import Leaderboard from '../components/bracket/leaderboard';
import CommentsSection from '../components/commentsSection';
import { CommentsProvider } from '../context/comment/CommentsProvider';
import gsap from 'gsap';
import ShareToSocials from '../components/shareToSocials';
import Reactions from '../components/reactions';
import EntriesModal from '../components/entriesModal';

const BracketChallengePage = () => {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();
  const { slug } = useParams<{ slug: string }>();

  const [bracketChallenge, setBracketChallenge] =
    useState<BracketChallengeInfo | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [isPast, setIsPast] = useState<boolean>(false);
  // const [totalCommentsCount, setTotalCommentsCount] = useState<number>(0);

  const [viewEntries, setViewEntries] = useState<boolean>(false);

  const leaderboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;
    //fetch bracket challenge..
    const fetchBracketChallenge = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(
          `/bracket-challenges/${slug}/show`,
        );

        const { bracketChallenge, isPast } = response.data;

        setBracketChallenge(bracketChallenge);
        setIsPast(isPast);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) {
      fetchBracketChallenge();
    }
  }, [slug, authLoading]);

  useEffect(() => {
    if (!leaderboardRef.current) return;
    gsap.to(leaderboardRef.current, {
      yPercent: showLeaderboard ? 100.1 : 0,
      duration: 0.3,
      ease: 'power4.out',
    });

    return () => {
      if (leaderboardRef.current) {
        gsap.killTweensOf(leaderboardRef.current);
      }
    };
  }, [showLeaderboard]);

  const entrySlug = useMemo(() => {
    if (bracketChallenge) {
      if (bracketChallenge.entries && bracketChallenge.entries.length > 0) {
        return bracketChallenge.entries[0].slug;
      }
    }
    return null;
  }, [bracketChallenge]);

  //test comments
  const getBracketMode = () => {
    if (entrySlug || isPast) {
      return 'preview';
    }
    return 'submit';
  };

  const handleBracketChallengeVote = async (
    id: number,
    parent_id: number | null,
    vote: 'like' | 'dislike',
  ) => {
    //.
    console.log(id, parent_id, vote);

    try {
      const response = await apiClient.post('/likes', {
        is_like: vote === 'like',
        likeable_id: id,
        model_name: 'BracketChallenge',
      });
      const votes = response.data.votes;

      setBracketChallenge((prev) => {
        if (!prev) return prev;
        let newVote = prev.user_vote != vote ? vote : null;
        return {
          ...prev,
          user_vote: newVote,
          votes: votes,
        };
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <title>{`${bracketChallenge ? bracketChallenge.name : ''} | ${
        import.meta.env.VITE_APP_NAME
      }`}</title>

      <ContentBase className="px-4 py-7">
        <div className="overflow-x-hidden rounded-lg border border-gray-400 bg-gray-100 p-3 shadow-sm">
          <h1 className="flex-1 text-xl font-bold">
            <FontAwesomeIcon icon="caret-right" /> Bracket Challenge
          </h1>
          {bracketChallenge ? (
            <>
              <p className="my-1 text-sm font-medium">
                Advance teams by selecting a winner in each matchup. One entry
                per bracket challenge is allowed, and no changes can be made
                after submission.
              </p>
              <div className="mt-4 rounded border border-gray-300 bg-gray-800 p-4 text-sm text-white">
                <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2">
                  <Detail label="Challenge Name">
                    {bracketChallenge.name}
                  </Detail>
                  <Detail label="Submitted Entries">
                    {bracketChallenge.entries_count &&
                    bracketChallenge.entries_count > 0 ? (
                      <button
                        className="min-w-10 cursor-pointer space-x-1 rounded bg-blue-500 px-3 py-0.5 text-xs font-bold text-white hover:bg-blue-400"
                        onClick={() => setViewEntries(true)}
                      >
                        {bracketChallenge.entries_count}
                      </button>
                    ) : (
                      <span>0</span>
                    )}
                  </Detail>
                  <Detail label="Submission Opens">
                    {displayLocalDate(bracketChallenge.start_date)}
                  </Detail>
                  <Detail label="Submission Closes">
                    {displayLocalDate(bracketChallenge.end_date)}
                  </Detail>
                </div>
                <hr className="my-3 border-gray-400" />

                {isAuthenticated && entrySlug && (
                  <div className="mb-3 items-center justify-between space-y-2 rounded bg-teal-600 px-4 py-1 py-2 font-semibold sm:flex sm:space-y-0">
                    <p className="text-white">
                      You have an entry for this bracket challenge.
                    </p>
                    <Link
                      to={`/bracket-challenge-entries/${entrySlug}`}
                      className="mb-1 block w-26 rounded bg-teal-900 px-2 py-1 text-center text-xs font-semibold text-white hover:bg-teal-800 sm:mb-0"
                    >
                      VIEW ENTRY
                    </Link>
                  </div>
                )}

                {!isAuthenticated && !isPast && (
                  <div className="mb-3 items-center justify-between rounded bg-teal-400 px-4 py-2 font-semibold md:flex">
                    <span className="text-gray-600">
                      To join this bracket challenge, you must be registered and
                      logged in.
                    </span>
                    <div className="my-2 space-x-1 md:my-0">
                      <Link
                        to="/login"
                        state={{ from: location }}
                        replace={true}
                        className="rounded bg-gray-600 px-2 py-1 text-xs font-semibold text-white hover:bg-gray-500"
                      >
                        LOG IN
                      </Link>
                      <Link
                        to="/register"
                        state={{ from: location }}
                        replace={true}
                        className="rounded bg-gray-600 px-2 py-1 text-xs font-semibold text-white hover:bg-gray-500"
                      >
                        REGISTER
                      </Link>
                    </div>
                  </div>
                )}

                <div className="relative overflow-hidden">
                  <BracketProvider
                    bracketChallenge={bracketChallenge}
                    bracketMode={getBracketMode()}
                  >
                    <Bracket />
                  </BracketProvider>

                  {/* bracket */}
                  {isPast && (
                    <div
                      ref={leaderboardRef}
                      className="absolute bottom-full left-0 h-full w-full bg-gray-800"
                    >
                      <Leaderboard bracketChallengeId={bracketChallenge.id} />
                    </div>
                  )}
                </div>

                {isPast && (
                  <>
                    <hr className="my-3 border-gray-400" />
                    <button
                      className={`w-full cursor-pointer rounded px-3 py-2 font-bold text-white sm:w-44 ${
                        showLeaderboard
                          ? 'bg-orange-500 hover:bg-orange-400'
                          : 'bg-blue-500 hover:bg-blue-400'
                      }`}
                      onClick={() => setShowLeaderboard((prev) => !prev)}
                    >
                      {`${showLeaderboard ? 'HIDE' : 'SHOW'} LEADERBOARD`}
                    </button>
                  </>
                )}
              </div>

              {/* reacts and share */}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-x-2 font-bold text-gray-500">
                  <p className="w-17 rounded bg-gray-700 px-3 py-1 text-xs leading-3.5 text-white">
                    REACT
                    <br />
                    VOTE
                  </p>
                  <Reactions
                    likeableId={bracketChallenge.id}
                    likeableParentId={null}
                    likesCount={bracketChallenge.votes.likes}
                    dislikesCount={bracketChallenge.votes.dislikes}
                    userVote={bracketChallenge.user_vote}
                    onVote={handleBracketChallengeVote}
                    className="-ms-6"
                    isLoading={isLoading}
                  />
                </div>

                <div className="flex items-center gap-x-2 font-bold text-gray-500">
                  <p className="w-21 rounded bg-gray-700 px-3 py-1 text-xs leading-3.5 text-white">
                    SOCIAL
                    <br />
                    SHARING
                  </p>
                  <ShareToSocials className="-ms-6" />
                </div>
              </div>

              <hr className="my-2 border-gray-400 shadow" />

              <CommentsProvider
                resource="challenges"
                resourceId={bracketChallenge.id}
                totalCount={bracketChallenge.comments_count}
                // comments={bracketChallenge.comments}
              >
                <CommentsSection />
              </CommentsProvider>
            </>
          ) : (
            <div className="mt-4 bg-gray-300 px-3 py-2">
              {isLoading ? 'Loading...' : 'Bracket challenge not found.'}
            </div>
          )}
        </div>
        <EndOfPage />

        {viewEntries && (
          <EntriesModal
            bracketChallengeId={bracketChallenge?.id || 0}
            onClose={() => setViewEntries(false)}
          />
        )}

        {isLoading && <Loader />}
      </ContentBase>
    </>
  );
};

export default BracketChallengePage;
