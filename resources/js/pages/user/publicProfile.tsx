import { useParams } from 'react-router-dom';

import ContentBase from '../../components/contentBase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EndOfPage from '../../components/endOfPage';
import { useEffect, useState } from 'react';
import type {
  BracketChallengeEntryInfo,
  ColorType,
  UserMiniInfo,
} from '../../data/adminData';
import apiClient from '../../utils/axiosConfig';
import { Link } from 'react-router-dom';
import Detail from '../../components/detailCard';
import StatusPills from '../../components/statusPills';
import Loader from '../../components/loader';
import CustomButton from '../../components/customButton';
import StatusMessage from '../../components/statusMessage';
// import LoadAuth from "../../components/auth/loadAuth";
import { useAuth } from '../../context/auth/AuthProvider';

interface FriendsButtonInfo {
  label: string;
  color: ColorType;
  action: string;
}

interface FriendsInfo {
  buttons: FriendsButtonInfo[];
  info: string;
}
interface FriendsType {
  [key: string]: FriendsInfo;
}

const PublicProfile = () => {
  const { authLoading } = useAuth();

  const { username } = useParams<{ username: string }>();

  const [user, setUser] = useState<UserMiniInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [isProcessing, setIsProcessing] = useState(false);

  const [entries, setEntries] = useState<BracketChallengeEntryInfo[]>([]);
  const [friendshipStatus, setFriendshipStatus] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [buttons, setButtons] = useState<FriendsButtonInfo[]>([]);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(
        `/user/profile?username=${username}`,
      );
      // console.log(response.data);
      const { user, entries, friendshipStatus } = response.data;
      setFriendshipStatus(friendshipStatus);
      setUser(user);
      setEntries(entries);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const friendQuery = async (action: string, user: UserMiniInfo) => {
    setIsLoading(true);
    try {
      await apiClient.post('/user/friends', {
        user_id: user.id,
        action: action,
      });
      // setFriends(response.data.friends);
      if (action == 'add') {
        setFriendshipStatus('pending_sent');
      } else if (action == 'accept') {
        setFriendshipStatus('friends');
      } else {
        setFriendshipStatus('none');
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    fetchUser();
  }, [username, authLoading]);

  useEffect(() => {
    if (!friendshipStatus) return;
    if (friendshipStatus == 'not_authenticated') return;
    setInfo(friendship[friendshipStatus].info);
    setButtons(friendship[friendshipStatus].buttons);
  }, [friendshipStatus]);

  const friendship: FriendsType = {
    not_friends: {
      buttons: [{ label: 'ADD FRIEND', color: 'blue', action: 'add' }],
      info: 'You are not friends with this user.',
    },
    friends: {
      buttons: [{ label: 'UNFRIEND', color: 'red', action: 'remove' }],
      info: 'You are friends with this user.',
    },
    pending_sent: {
      buttons: [{ label: 'CANCEL', color: 'amber', action: 'cancel' }],
      info: 'You have sent a friend request to this user.',
    },
    pending_received: {
      buttons: [
        { label: 'ACCEPT', color: 'green', action: 'accept' },
        { label: 'REJECT', color: 'red', action: 'reject' },
      ],
      info: 'You have pending friend request from this user.',
    },
    me: {
      buttons: [],
      info: 'You are viewing your own profile.',
    },
  };

  // if (authLoading) {
  // 	return <LoadAuth />;
  // }

  return (
    <>
      <title>{`${user ? user.fullname : ''} | ${
        import.meta.env.VITE_APP_NAME
      }`}</title>

      <ContentBase className="px-4 py-7">
        <div className="overflow-x-hidden rounded-lg border border-gray-400 bg-gray-100 p-3 shadow-sm">
          <h1 className="flex-1 text-xl font-bold">
            <FontAwesomeIcon icon="caret-right" /> User Profile
          </h1>
          <p className="my-1 text-sm font-medium">
            View user profile information.
          </p>

          {user ? (
            <div className="mt-5">
              {info && (
                <StatusMessage
                  message={info}
                  type="info"
                  fixed={true}
                  onClose={() => setInfo(null)}
                >
                  {buttons.map((btn) => (
                    <CustomButton
                      key={btn.action}
                      color={btn.color}
                      onClick={() => friendQuery(btn.action, user)}
                      size="sm"
                      className="px-4"
                      disabled={isLoading}
                    >
                      {btn.label.toUpperCase()}
                    </CustomButton>
                    // <button className="text-sm bg-gray-500 px-2 rounded text-white hover:bg-gray-600 font-semibold">
                    // 	{btn.label.toUpperCase()}
                    // </button>
                  ))}
                </StatusMessage>
              )}

              <div className="mt-2 rounded bg-gray-800 p-4 text-white">
                <div className="gap-x-4 sm:flex">
                  <div className="flex-none">
                    <div className="mx-auto flex aspect-square w-18 items-center justify-center overflow-hidden rounded-full border-2 border-gray-400 text-gray-400 shadow-lg">
                      <FontAwesomeIcon icon="user" size="2xl" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="border-gray-300 py-1 text-xs font-semibold">
                        Username
                      </p>
                      <p className="rounded bg-gray-600 px-3 py-1.5">
                        {user.username}
                      </p>
                    </div>
                    <div>
                      <p className="border-gray-300 py-1 text-xs font-semibold">
                        Full Name
                      </p>
                      <p className="rounded bg-gray-600 px-3 py-1.5">
                        {user.fullname}
                      </p>
                    </div>

                    {/* top entries */}
                    <div className="my-4 overflow-x-hidden">
                      <div className="min-w-sm">
                        <p className="py-1 text-sm font-semibold">
                          Top Bracket Challenge Entries
                        </p>

                        {entries.length > 0 ? (
                          <div className="mt-2 space-y-1">
                            {entries.map((entry, index) => (
                              <Link
                                key={entry.id}
                                to={`/bracket-challenge-entries/${entry.slug}`}
                                className="block flex items-center gap-x-3 border-t border-gray-500 py-1 last:border-b hover:bg-gray-700"
                              >
                                <p className="w-10 text-center text-2xl font-bold md:text-xl">
                                  0{index + 1}
                                </p>
                                <div className="grid flex-1 gap-y-1 text-sm md:grid-cols-2 xl:grid-cols-3">
                                  <Detail label="Bracket Challenge">
                                    {entry.bracket_challenge.name}
                                  </Detail>

                                  <Detail label="Correct Picks Count">
                                    {entry.correct_predictions_count}
                                  </Detail>

                                  <Detail label="Status">
                                    <StatusPills status={entry.status} />
                                  </Detail>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-0.5 border-t border-gray-400 py-1.5 text-gray-300">
                            No bracket challenge entries found.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 rounded bg-gray-300 px-3 py-2">
              {isLoading ? 'Fetching user information.' : 'User not found.'}
            </p>
          )}
        </div>
        {isLoading && <Loader />}
        <EndOfPage />
      </ContentBase>
    </>
  );
};

export default PublicProfile;
