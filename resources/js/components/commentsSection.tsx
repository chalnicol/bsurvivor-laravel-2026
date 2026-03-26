import { useEffect, useRef, useState } from "react";
import Comment from "./comment";
import { useAuth } from "../context/auth/AuthProvider";
import { useComments } from "../context/comment/CommentsProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CommentForm from "./commentForm";
import CustomButton from "./customButton";
import Spinner from "./spinner";

interface CommentsSectionProps {
	className?: string;
}

const CommentsSection = ({ className }: CommentsSectionProps) => {
	const { isAuthenticated } = useAuth();
	const {
		comments,
		isLoading,
		totalCommentsCount,
		currentPage,
		lastPage,
		fetchComments,
		loadMoreComments,
		addComment,
		activeId,
		updateActiveId,
	} = useComments();

	const [body, setBody] = useState<string>("");
	const [addCommentMode, setAddCommentMode] = useState<boolean>(false);

	const isInitialMount = useRef<boolean>(false);

	const handleSubmit = async () => {
		await addComment(body);
		setBody("");
		setAddCommentMode(false);
	};

	const handleCancel = () => {
		setBody("");
		setAddCommentMode(false);
	};

	const handleAddComment = () => {
		updateActiveId(null);
		setAddCommentMode(true);
	};

	const commentsCount: string =
		totalCommentsCount > 0 ? `(${totalCommentsCount})` : "";

	useEffect(() => {
		if (!isInitialMount.current) {
			fetchComments(1);
			isInitialMount.current = true;
		}
	}, [isInitialMount.current]);

	useEffect(() => {
		if (activeId) {
			setAddCommentMode(false);
			setBody("");
		}
	}, [activeId]);

	return (
		<div className={`${className}`}>
			<div className="flex gap-x-4 items-center">
				<h2 className="font-bold text-lg">Comments {commentsCount}</h2>
				{isAuthenticated && (
					<CustomButton
						onClick={handleAddComment}
						size="sm"
						disabled={addCommentMode}
						color="amber"
						className="shadow"
					>
						ADD COMMENT
					</CustomButton>
				)}
			</div>

			{addCommentMode && (
				<CommentForm
					className="mt-2 mb-6 space-y-1.5"
					textValue={body}
					isLoading={isLoading}
					onSubmit={() => handleSubmit()}
					onCancel={() => handleCancel()}
					onChange={(e: string) => setBody(e)}
					btnSizes="sm"
				/>
			)}

			<div className="mt-4 md:mt-3">
				{comments.length > 0 ? (
					<>
						{comments.map((comment) => (
							<Comment
								key={comment.id}
								className="mb-3"
								comment={comment}
							/>
						))}
						{isLoading ? (
							<div className="bg-gray-300 py-3 rounded">
								<Spinner
									colorTheme="dark"
									alignment="horizontal"
									size="xs"
								/>
							</div>
						) : (
							<div className="mt-3 text-center">
								{currentPage < lastPage ? (
									<button
										className="bg-gray-600 hover:bg-gray-500 cursor-pointer text-white text-sm font-semibold px-4 py-1.5 rounded space-x-2"
										onClick={loadMoreComments}
									>
										<FontAwesomeIcon icon="arrow-alt-circle-down" />
										<span>MORE COMMENTS</span>
									</button>
								) : (
									<span className="text-gray-400 text-sm font-bold rounded mx-auto px-4 select-none">
										END OF COMMENTS
									</span>
								)}
							</div>
						)}
					</>
				) : (
					<>
						{isLoading ? (
							<div className="bg-gray-300 py-3 rounded">
								<Spinner
									colorTheme="dark"
									alignment="horizontal"
									size="xs"
								/>
							</div>
						) : (
							<p className="border-t border-gray-300 py-2">
								No comments to display.
							</p>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default CommentsSection;
