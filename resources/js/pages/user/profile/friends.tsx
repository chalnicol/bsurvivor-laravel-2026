import { router, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useDebounce from '@/hooks/use-debounce';
import CustomButton from '@/components/customButton';
import { UserBase } from '@/types/auth';
import ProfileLayout from '@/layouts/proflle/layout';
import TransparentIcon from '@/components/transparentIcon';
import PromptMessage from '@/components/promptMessage';

// This extends UserBase to include the friendship status from our search query
interface SearchUser extends UserBase {
  status: 'not_friends' | 'friends' | 'request_sent' | 'request_received';
}

interface FriendListProps {
  active_friends: UserBase[]; // Resources come wrapped in data
  requests_received: UserBase[];
  requests_sent: UserBase[];
}

type ActionType = 'add' | 'remove' | 'accept' | 'cancel' | 'ignore';

const FriendsList = ({
  active_friends,
  requests_received,
  requests_sent,
}: FriendListProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Handle the live search
  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      setError(null);
      try {
        axios
          .get(`/profile/friends/search?search=${debouncedSearchTerm}`)
          .then((res) => {
            setSearchResults(res.data.users);
          })
          .finally(() => setIsSearching(false));
      } catch (err: any) {
        setError('Something went wrong. Please try again later.');
      }
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);

  // Single function to handle all friend actions
  const handleAction = (user_id: number, action: ActionType) => {
    setLoading(true);
    setError(null);
    router.post(
      '/profile/friends',
      {
        user_id,
        action,
      },
      {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => setLoading(false),
        onSuccess: () => {
          updateSearchResult(user_id, action);
        },
        onError: () => {
          setError('Something went wrong..');
        },
      },
    );
  };

  // Helper to render a user row
  const UserCard = ({
    user,
    children,
  }: {
    user: UserBase;
    children?: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between rounded border border-gray-600 bg-gray-800 px-3 py-1.5">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white">{user.full_name}</span>
        <span className="text-xs text-slate-500">@{user.username}</span>
      </div>
      <div className="flex gap-2">{children}</div>
    </div>
  );

  const updateSearchResult = (user_id: number, action: ActionType) => {
    //..
    if (action == 'add') {
      setSearchResults((prev) =>
        prev.map((user) => {
          if (user.id === user_id) {
            return { ...user, status: 'request_sent' };
          }
          return user;
        }),
      );
    } else if (action == 'accept') {
      setSearchResults((prev) =>
        prev.map((user) => {
          if (user.id === user_id) {
            return { ...user, status: 'friends' };
          }
          return user;
        }),
      );
    } else {
      setSearchResults((prev) =>
        prev.map((user) => {
          if (user.id === user_id) {
            return { ...user, status: 'not_friends' };
          }
          return user;
        }),
      );
    }
  };

  return (
    <>
      <title>{`FRIENDS | ${import.meta.env.VITE_APP_NAME}`}</title>

      {error && <PromptMessage message={error} type="error" className="mb-3" />}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 1. SEARCH SECTION */}
        <div className="relative col-span-1 space-y-3 overflow-hidden rounded border border-gray-300 px-4 py-3 lg:col-span-2">
          <TransparentIcon className="absolute -top-12 -right-12 z-0 w-60 rotate-30 opacity-5" />
          <div className="relative">
            <h4 className="text-sm font-semibold text-gray-300">
              Friends Search
            </h4>
            <p className="mt-0.5 text-xs text-slate-400">
              Search for users to add as friends.
            </p>

            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-2 w-full border-b border-gray-300 bg-transparent px-0.5 py-1.5 text-sm text-white outline-none focus:border-amber-100"
              placeholder="Type username or name..."
            />

            <div className="mt-3 h-44 overflow-y-auto">
              {isSearching ? (
                <p className="p-1 text-sm text-slate-500">Searching...</p>
              ) : searchResults.length > 0 ? (
                <div className="grid gap-2 lg:grid-cols-2 xl:grid-cols-3">
                  {searchResults.map((user) => (
                    <UserCard key={user.id} user={user}>
                      {user.status === 'not_friends' && (
                        <CustomButton
                          label="Add"
                          onClick={() => handleAction(user.id, 'add')}
                          disabled={isSearching || loading}
                          className="min-w-14 bg-blue-600 px-2 py-0.5 text-xs tracking-wider uppercase hover:bg-blue-500"
                        />
                      )}
                      {user.status === 'request_sent' && (
                        <span className="text-[10px] tracking-widest text-amber-400 uppercase select-none">
                          Pending..
                        </span>
                      )}
                      {user.status === 'request_received' && (
                        <span className="text-[10px] tracking-widest text-sky-300 uppercase select-none">
                          Pending..
                        </span>
                      )}
                      {user.status === 'friends' && (
                        <span className="text-[10px] tracking-widest text-emerald-400 uppercase select-none">
                          Friend..
                        </span>
                      )}
                    </UserCard>
                  ))}
                </div>
              ) : (
                <div className="py-1 text-sm text-slate-500">
                  No users found.
                </div>
              )}
            </div>
          </div>
        </div>
        {/* 2. FRIENDS LIST */}
        <div className="relative space-y-3 overflow-hidden rounded border border-gray-300 px-4 py-3 lg:col-span-2">
          <TransparentIcon className="absolute -top-12 -right-12 z-0 w-60 rotate-30 opacity-5" />
          <div className="relative">
            <h4 className="text-sm font-semibold text-gray-300">Friends</h4>
            <p className="mt-0.5 text-xs text-slate-400">
              List of friends you have.
            </p>
            <div className="mt-3 h-44 overflow-y-auto">
              {active_friends.length > 0 ? (
                <div className="grid gap-2 lg:grid-cols-2 xl:grid-cols-3">
                  {active_friends.map((user) => (
                    <UserCard key={user.id} user={user}>
                      <CustomButton
                        label="remove"
                        onClick={() => handleAction(user.id, 'remove')}
                        disabled={isSearching || loading}
                        className="min-w-14 bg-rose-700 px-2 py-0.5 text-xs tracking-wider uppercase hover:bg-rose-600"
                      />
                    </UserCard>
                  ))}
                </div>
              ) : (
                <p className="py-1 text-sm text-slate-500">No friends yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* 3. REQUEST SENT */}
        <div className="relative space-y-3 overflow-hidden rounded border border-gray-300 px-4 py-3">
          <TransparentIcon className="absolute -top-12 -right-12 z-0 w-60 rotate-30 opacity-5" />
          <div className="relative">
            <h4 className="text-sm font-semibold text-gray-300">
              Request Sent
            </h4>
            <p className="mt-0.5 text-xs text-slate-400">
              Waiting for their response.
            </p>
            <div className="mt-3 h-44 overflow-y-auto">
              {requests_sent.length > 0 ? (
                <div className="space-y-2">
                  {requests_sent.map((user) => (
                    <UserCard key={user.id} user={user}>
                      <CustomButton
                        label="Cancel"
                        onClick={() => handleAction(user.id, 'cancel')}
                        disabled={isSearching || loading}
                        className="min-w-14 bg-amber-700 px-2 py-0.5 text-xs tracking-wider uppercase hover:bg-amber-600"
                      />
                    </UserCard>
                  ))}
                </div>
              ) : (
                <p className="py-1 text-sm text-slate-500">
                  No pending requests.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 4. REQUEST RECEIVED */}
        <div className="relative space-y-3 overflow-hidden rounded border border-gray-300 px-4 py-3">
          <TransparentIcon className="absolute -top-12 -right-12 z-0 w-60 rotate-30 opacity-5" />
          <div className="relative">
            <h4 className="text-sm font-semibold text-gray-300">
              Request Received
            </h4>
            <p className="mt-0.5 text-xs text-slate-400">
              People who want to be your friend.
            </p>
            <div className="mt-3 h-44 overflow-y-auto">
              {requests_received.length > 0 ? (
                <div className="space-y-2">
                  {requests_received.map((user) => (
                    <UserCard key={user.id} user={user}>
                      <CustomButton
                        label="Accept"
                        onClick={() => handleAction(user.id, 'accept')}
                        disabled={isSearching || loading}
                        className="min-w-14 bg-emerald-600 px-2 py-0.5 text-xs tracking-wider uppercase hover:bg-emerald-500"
                      />
                      <CustomButton
                        label="ignore"
                        onClick={() => handleAction(user.id, 'ignore')}
                        disabled={isSearching || loading}
                        className="min-w-14 bg-rose-700 px-2 py-0.5 text-xs tracking-wider uppercase hover:bg-rose-600"
                      />
                    </UserCard>
                  ))}
                </div>
              ) : (
                <p className="py-1 text-sm text-slate-500">
                  No pending requests.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

FriendsList.layout = (page: React.ReactNode) => (
  <ProfileLayout children={page} />
);

export default FriendsList;
