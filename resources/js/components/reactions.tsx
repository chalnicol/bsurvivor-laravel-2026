import { useEffect, useState } from 'react';
import { useAuth } from '../context/auth/AuthProvider';
import ReactionButton from './reactionButton';
import useDebounce from '../hooks/use-debounce';

interface ReactionsProps {
    likeableId: number;
    likeableParentId: number | null;
    userVote: 'like' | 'dislike' | null;
    likesCount: number;
    dislikesCount: number;
    size?: 'xs' | 'sm' | 'lg';
    onVote: (
        id: number,
        parentId: number | null,
        vote: 'like' | 'dislike',
    ) => void;
    className?: string;
    isLoading: boolean;
}
const Reactions = ({
    likeableId,
    likeableParentId,
    likesCount,
    dislikesCount,
    userVote,
    onVote,
    size,
    className,
    isLoading,
}: ReactionsProps) => {
    const { isAuthenticated } = useAuth();

    const [vote, setVote] = useState<'like' | 'dislike' | null>(null);
    const [likes, setLikes] = useState<number>(0);
    const [dislikes, setDislikes] = useState<number>(0);

    const [userVoteState, setUserVoteState] = useState<{
        id: number;
        parent_id: number | null;
        vote: 'like' | 'dislike';
    } | null>(null);

    const debouncedVote = useDebounce(userVoteState, 3000);

    useEffect(() => {
        setVote(userVote);
        setLikes(likesCount);
        setDislikes(dislikesCount);
    }, [userVote, likesCount, dislikesCount]);

    useEffect(() => {
        if (debouncedVote) {
            const { id, parent_id, vote } = debouncedVote;
            onVote(id, parent_id, vote);
        }
    }, [debouncedVote]);

    const handleVoteClick = (newVote: 'like' | 'dislike') => {
        setUserVoteState({
            id: likeableId,
            parent_id: likeableParentId,
            vote: newVote,
        });
        if (!isAuthenticated) return;

        if (newVote === vote) {
            setVote(null);
            if (newVote === 'like') {
                setLikes((prev) => prev - 1);
            } else {
                setDislikes((prev) => prev - 1);
            }
        } else {
            setVote(newVote);
            if (newVote === 'like' && vote === 'dislike') {
                setLikes((prev) => prev + 1);
                setDislikes((prev) => prev - 1);
            } else if (newVote === 'dislike' && vote === 'like') {
                setDislikes((prev) => prev + 1);
                setLikes((prev) => prev - 1);
            } else if (newVote === 'like' && vote === null) {
                setLikes((prev) => prev + 1);
            } else if (newVote === 'dislike' && vote === null) {
                setDislikes((prev) => prev + 1);
            }
        }
    };

    const sizeProps = size && { size };

    return (
        <div
            className={`inline-flex items-center gap-x-9 rounded-full border border-gray-400 bg-white p-1 shadow ${className}`}
        >
            {/* <ReactionButton
				type="like"
				disabled={!isAuthenticated || isLoading}
				selected={(userVote && userVote == "like") || false}
				count={likesCount}
				onClick={() => handleVoteClick("like")}
				{...sizeProps}
			/>
			<ReactionButton
				type="dislike"
				disabled={!isAuthenticated || isLoading}
				selected={(userVote && userVote == "dislike") || false}
				count={dislikesCount}
				onClick={() => handleVoteClick("dislike")}
				{...sizeProps}
			/> */}
            <ReactionButton
                type="like"
                disabled={!isAuthenticated || isLoading}
                selected={(vote && vote == 'like') || false}
                count={likes}
                onClick={() => handleVoteClick('like')}
                {...sizeProps}
            />
            <ReactionButton
                type="dislike"
                disabled={!isAuthenticated || isLoading}
                selected={(vote && vote == 'dislike') || false}
                count={dislikes}
                onClick={() => handleVoteClick('dislike')}
                {...sizeProps}
            />
        </div>
    );
};

export default Reactions;
