import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAdmin } from '../../context/admin/AdminProvider';
import { displayLocalDate } from '../../utils/dateTime';
import Detail from '../detailCard';
import RefreshButton from '../refreshButton';
import Spinner from '../spinner';

const BracketChallengeActiveList = () => {
  const {
    activeChallenges,
    isLoading,
    activeChallengesFetched,
    fetchBracketChallenges,
  } = useAdmin();

  useEffect(() => {
    if (!activeChallengesFetched) {
      fetchBracketChallenges('active');
    }
  }, [activeChallengesFetched]);

  return (
    <>
      <div className="w-full">
        <div className="flex flex-row items-center space-y-2 gap-x-5 md:space-y-0">
          <h3 className="text-xl font-bold">
            <FontAwesomeIcon icon="caret-right" /> Open Bracket Challenges
          </h3>

          <RefreshButton
            color="amber"
            size="sm"
            delay={3}
            className="flex-none px-2"
            onClick={() => fetchBracketChallenges('active')}
            disabled={isLoading}
          >
            REFRESH LIST
          </RefreshButton>
        </div>
        <p className="mt-1 text-sm">
          Take a look of the open bracket challenges and submit your bracket
          challenge entry. Hurry up before the end date!
        </p>

        {activeChallenges.length > 0 ? (
          <div className="mt-4 mb-4 space-y-2">
            {activeChallenges.map((bracketChallenge) => (
              <Link
                to={`/bracket-challenges/${bracketChallenge.slug}`}
                key={bracketChallenge.id}
              >
                <div className="mb-1 space-y-1 rounded border border-gray-400 bg-gray-800 px-3 py-2 text-sm text-white shadow hover:bg-gray-700 sm:grid md:grid-cols-2">
                  <Detail label="Name">{bracketChallenge.name}</Detail>
                  <Detail label="League">
                    {bracketChallenge.league == 'NBA' && (
                      <span className="rounded bg-red-600 px-2 font-semibold text-white">
                        NBA
                      </span>
                    )}
                    {bracketChallenge.league == 'PBA' && (
                      <span className="rounded bg-blue-600 px-2 font-semibold text-white">
                        PBA
                      </span>
                    )}
                  </Detail>
                  <Detail label="Start Date">
                    {displayLocalDate(bracketChallenge.start_date)}
                  </Detail>
                  <Detail label="End Date">
                    {displayLocalDate(bracketChallenge.end_date)}
                  </Detail>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <>
            {isLoading ? (
              <div className="mt-4 h-13 bg-gray-200">
                <Spinner colorTheme="dark" alignment="horizontal" size="sm" />
              </div>
            ) : (
              <div className="mt-4 rounded bg-gray-200 px-3 py-2">
                No open bracket challenges to display.
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default BracketChallengeActiveList;
