import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../utils/api';
import Loader from '../components/loader';
import type { BracketChallengeEntryInfo } from '../data/adminData';
import Bracket from '../components/bracket/bracket';
import { BracketProvider } from '../context/bracket/BracketProvider';
import ContentBase from '../components/contentBase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Detail from '../components/detailCard';
import { displayLocalDate } from '../utils/dateTime';
import EndOfPage from '../components/endOfPage';
import StatusPills from '../components/statusPills';

import { Link } from 'react-router-dom';
import { CommentsProvider } from '../context/comment/CommentsProvider';
import CommentsSection from '../components/commentsSection';
import { useAuth } from '../context/auth/AuthProvider';
import Reactions from '../components/reactions';
import ShareToSocials from '../components/shareToSocials';
// import { useAuth } from "../context/auth/AuthProvider";

const BracketChallengeEntryPage = () => {
  const { isAuthenticated, user, authLoading } = useAuth();
  const { slug } = useParams<{ slug: string }>();

  const [bracketChallengeEntry, setBracketChallengeEnry] =
    useState<BracketChallengeEntryInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCommentsCount, setTotalCommentsCount] = useState<number>(0);

  const fetchBracketChallengeEntry = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(
        `/bracket-challenge-entries/${slug}`,
      );
      const { message, entry, totalCommentsCount } = response.data;
      console.log(message);
      setBracketChallengeEnry(entry);
      setTotalCommentsCount(totalCommentsCount);
      // console.log(response.data.user);
    } catch (error) {
      console.error('Error fetching bracket challenge:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    fetchBracketChallengeEntry();
  }, [slug, authLoading]);

  const getEntryUsername = useCallback((): string => {
    if (bracketChallengeEntry) {
      if (isAuthenticated && user && user.id == bracketChallengeEntry.user.id) {
        return 'You';
      }
      return bracketChallengeEntry.user.username;
    }
    return '';
  }, [user, isAuthenticated, bracketChallengeEntry]);

  const handleBracketChallengeEntryVote = async (
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
        model_name: 'BracketChallengeEntry',
      });
      const votes = response.data.votes;

      setBracketChallengeEnry((prev) => {
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

  // if (authLoading) {
  // 	return <LoadAuth />;
  // }

  return (
    <>
      <title>{`${
        bracketChallengeEntry ? bracketChallengeEntry.name : ''
      } | ${import.meta.env.VITE_APP_NAME}`}</title>
      <ContentBase className="px-4 py-7">
        <div className="overflow-x-hidden rounded-lg border border-gray-400 bg-gray-100 p-3 shadow-sm">
          <h1 className="flex-1 text-xl font-bold">
            <FontAwesomeIcon icon="caret-right" /> Bracket Challenge Entry
          </h1>

          {bracketChallengeEntry ? (
            <>
              <p className="my-1 text-sm font-medium">
                View bracket challenge entry below.
              </p>

              <div className="mt-4 rounded border border-gray-300 bg-gray-800 p-4 text-sm text-white">
                <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 xl:grid-cols-3">
                  <Detail label="Entry ID">{bracketChallengeEntry.name}</Detail>

                  <Detail label="Date Submitted">
                    {displayLocalDate(bracketChallengeEntry.created_at)}
                  </Detail>

                  <Detail label="Bracket Challenge">
                    <Link
                      to={`/bracket-challenges/${bracketChallengeEntry.bracket_challenge.slug}`}
                      className="border-b border-gray-300 hover:text-gray-400"
                    >
                      {bracketChallengeEntry.bracket_challenge.name}
                      <FontAwesomeIcon
                        icon="external-link"
                        size="sm"
                        className="ms-2"
                      />
                    </Link>
                  </Detail>

                  <Detail label="Entry By">
                    <Link
                      to={`/users/${bracketChallengeEntry.user.username}`}
                      className="border-b border-gray-300 hover:text-gray-400"
                    >
                      {getEntryUsername()}
                      <FontAwesomeIcon
                        icon="external-link"
                        size="sm"
                        className="ms-2"
                      />
                    </Link>
                  </Detail>

                  <Detail label="Correct Picks Count">
                    <span
                      className={`font-semibold ${
                        bracketChallengeEntry.correct_predictions_count > 0 &&
                        'text-yellow-500'
                      }`}
                    >
                      {bracketChallengeEntry.correct_predictions_count}
                    </span>
                  </Detail>

                  <Detail label="Status">
                    <StatusPills status={bracketChallengeEntry.status} />
                  </Detail>
                </div>
                <hr className="my-4 border-gray-400" />
                {/* preview */}
                <div>
                  <BracketProvider
                    bracketChallenge={bracketChallengeEntry.bracket_challenge}
                    predictions={bracketChallengeEntry.predictions}
                    bracketMode={'preview'}
                  >
                    <Bracket />
                  </BracketProvider>
                </div>
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
                    likeableId={bracketChallengeEntry.id}
                    likeableParentId={null}
                    likesCount={bracketChallengeEntry.votes.likes}
                    dislikesCount={bracketChallengeEntry.votes.dislikes}
                    userVote={bracketChallengeEntry.user_vote}
                    onVote={handleBracketChallengeEntryVote}
                    isLoading={isLoading}
                    className="-ms-6"
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

              <hr className="mt-2 mb-4 border-gray-400 shadow" />

              <CommentsProvider
                resource="entries"
                resourceId={bracketChallengeEntry.id}
                totalCount={totalCommentsCount}
              >
                <CommentsSection />
              </CommentsProvider>
            </>
          ) : (
            <>
              <div className="mt-2 rounded bg-gray-300 p-3">
                {isLoading
                  ? 'Loading...'
                  : 'Bracket challenge entry not found.'}
              </div>
            </>
          )}
        </div>
        <EndOfPage />
        {isLoading && <Loader />}
      </ContentBase>
    </>
  );
};

export default BracketChallengeEntryPage;
