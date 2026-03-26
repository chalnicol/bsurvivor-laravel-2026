import CustomButton from '@/components/customButton';
import EmptyPrompt from '@/components/emptyPrompt';
import ConfirmationModal from '@/components/modals/confimationModal';
import Notification from '@/components/notification';
import ProfileLayout from '@/layouts/proflle/layout';
import type {
    Notification as NotifType,
    PaginatedResponse,
} from '@/types/general';
import { router, useForm } from '@inertiajs/react';
import { Bell, InfoIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface NotificationsProps {
    // Note: Ensuring the prop name 'data' matches your backend pagination object
    data: PaginatedResponse<NotifType>;
}

const Notifications = ({ data }: NotificationsProps) => {
    // const { data: localNotifications, links } = data;

    // console.log(data);

    const [localNotifications, setLocalNotifications] = useState<NotifType[]>(
        data.data,
    );

    const [nextPageUrl, setNextPageUrl] = useState<string | null>(
        data.links.next,
    );

    const { patch, post, delete: destroy, processing } = useForm();

    const [clicked, setClicked] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [toDelete, setToDelete] = useState<NotifType | null>(null);
    const [deleteAll, setDeleteAll] = useState<boolean>(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        // If user refreshes on ?page=3, send them back to the clean list
        if (params.has('page') && params.get('page') !== '1') {
            // router.replace('/profile/notifications');
            router.get(
                '/profile/notifications',
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                },
            );
        }
    }, []);

    useEffect(() => {
        if (data.meta.current_page === 1) {
            setLocalNotifications(data.data);
            setNextPageUrl(data.links.next);
        }
    }, [data]);

    const handleNotificationClick = (id: string) => {
        setClicked((prev) => (prev === id ? null : id));

        const target = localNotifications.find((n) => n.id === id);
        if (target && !target.isRead) {
            setLocalNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
            );

            patch(`/profile/notifications/${id}/read`, {
                preserveScroll: true,
                preserveState: true,
                onError: () => {
                    // Optional: Roll back if the server fails
                    setLocalNotifications((prev) =>
                        prev.map((n) =>
                            n.id === id ? { ...n, isRead: false } : n,
                        ),
                    );
                },
            });
        }
    };

    const handleLoadMore = () => {
        if (!nextPageUrl || isLoadingMore) return;

        router.get(
            nextPageUrl,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ['data'],
                onBefore: () => setIsLoadingMore(true),
                onSuccess: (page) => {
                    const incoming = page.props
                        .data as PaginatedResponse<NotifType>;
                    setLocalNotifications((prev) => [
                        ...prev,
                        ...incoming.data,
                    ]);
                    setNextPageUrl(incoming.links.next);
                },
                onFinish: () => setIsLoadingMore(false),
            },
        );
    };

    const handleRefreshList = () => {
        router.get(
            window.location.pathname,
            {},
            {
                only: ['data'],
                // preserveState: false, // Wipes local state
                preserveState: true, // Preserves local state
                preserveScroll: true,
                onBefore: () => setIsRefreshing(true),
                onFinish: () => setIsRefreshing(false),
            },
        );
    };

    const handleDelete = (id: string) => {
        const notifToDelete = localNotifications.find((n) => n.id === id);
        if (notifToDelete) setToDelete(notifToDelete);
    };

    const handleConfirmDelete = () => {
        if (!toDelete) return;
        destroy(`/profile/notifications/${toDelete.id}`, {
            onSuccess: () => {
                setLocalNotifications((prev) =>
                    prev.filter((n) => n.id !== toDelete?.id),
                );
                setToDelete(null);
                setClicked(null);
            },
            preserveScroll: true,
        });
    };

    const handleBatchMarkAllAsRead = () => {
        if (unreadNotifications.length === 0) return;
        post('/profile/notifications/mark-all-as-read', {
            preserveScroll: true,
            onSuccess: () => {
                setLocalNotifications((prev) =>
                    prev.map((n) => ({ ...n, isRead: true })),
                );
            },
        });
    };

    const handleDeleteAll = () => {
        if (localNotifications.length === 0) return;
        setDeleteAll(true);
        //..
    };
    const handleConfirmDeleteAll = () => {
        if (localNotifications.length === 0) return;
        destroy('/profile/notifications/destroy-all', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                // 1. Wipe the local list completely
                setLocalNotifications([]);
                // 2. Hide the "Load More" button since there's nothing left
                setNextPageUrl(null);
                // 3. Close the modal
                setDeleteAll(false);
                //
                setClicked(null);
            },
        });
        //..
    };

    const unreadNotifications = useMemo(() => {
        return localNotifications.filter((n) => !n.isRead);
    }, [localNotifications]);

    return (
        <>
            <div className="mb-3 flex items-center space-x-2">
                <CustomButton
                    label={isRefreshing ? 'Refreshing...' : 'Refresh List'}
                    disabled={processing || isRefreshing || isLoadingMore}
                    onClick={handleRefreshList}
                    className="text-sm"
                />
                <CustomButton
                    label="Mark All As Read"
                    disabled={
                        processing ||
                        isRefreshing ||
                        isLoadingMore ||
                        unreadNotifications.length === 0
                    }
                    onClick={handleBatchMarkAllAsRead}
                    className="text-sm"
                />
                <CustomButton
                    label="Delete All"
                    disabled={
                        processing ||
                        isRefreshing ||
                        isLoadingMore ||
                        localNotifications.length === 0
                    }
                    onClick={handleDeleteAll}
                    className="text-sm"
                />
            </div>

            {localNotifications.length > 0 ? (
                <div className="mt-3">
                    <div>
                        {localNotifications.map((notification) => (
                            <Notification
                                key={notification.id}
                                notification={notification}
                                isClicked={clicked === notification.id}
                                isProcessing={processing}
                                onClick={handleNotificationClick}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    {/* LOAD MORE BUTTON */}
                    {nextPageUrl && (
                        <div className="mt-4 flex justify-center">
                            <CustomButton
                                className="w-full md:w-auto"
                                label={
                                    isLoadingMore
                                        ? 'Loading...'
                                        : 'Load More Notifications'
                                }
                                onClick={handleLoadMore}
                                disabled={isLoadingMore || processing}
                            />
                        </div>
                    )}
                </div>
            ) : (
                // <div className="mt-3 flex min-h-44 flex-col items-center justify-center gap-2 rounded border border-gray-600 bg-gray-800 p-3 text-gray-300">
                //     <Bell size={30} className="mr-2" />
                //     <p>You're all caught up! Check back later for updates.</p>
                // </div>
                <div className="flex flex-col items-center justify-center rounded border border-gray-700 bg-gray-800/50 py-10 text-center">
                    <Bell size={46} className="mb-3 text-gray-300" />
                    <h2 className="text-lg font-bold text-gray-300">
                        Yey, you're all caught up!
                    </h2>
                    <p className="text-sm text-slate-400">
                        Check back later for updates.
                    </p>
                </div>
            )}

            {toDelete && (
                <ConfirmationModal
                    message="Are you sure you want to delete the notification?"
                    details={`ID: ${toDelete.id.toUpperCase()}`}
                    isProcessing={processing}
                    onClose={() => setToDelete(null)}
                    onConfirm={handleConfirmDelete}
                />
            )}

            {deleteAll && (
                <ConfirmationModal
                    message="Are you sure you want to delete all notifications?"
                    isProcessing={processing}
                    onClose={() => setDeleteAll(false)}
                    onConfirm={handleConfirmDeleteAll}
                />
            )}

            {/* <Link
                href="/test-notification"
                className="mt-6 inline-block rounded border bg-sky-900 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-800"
            >
                Send Test Notification
            </Link> */}
        </>
    );
};

Notifications.layout = (page: React.ReactNode) => (
    <ProfileLayout children={page} />
);

export default Notifications;
