import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ShareToSocialsProps {
	className?: string;
}

const ShareToSocials = ({ className }: ShareToSocialsProps) => {
	const handleShareToX = () => {
		const text = encodeURIComponent(
			"Check out my bracket predictions! #BracketChallenge"
		);
		const url = encodeURIComponent(window.location.href);
		window.open(
			`https://x.com/intent/tweet?text=${text}&url=${url}`,
			"_blank"
		);
	};

	const handleShareToFacebook = () => {
		const url = encodeURIComponent(window.location.href);
		window.open(
			`https://www.facebook.com/sharer/sharer.php?u=${url}`,
			"_blank"
		);
	};

	return (
		<div
			className={`inline-flex items-center space-x-2 bg-white border border-gray-400 shadow p-1 rounded-full ${className}`}
		>
			<button
				className="h-7 aspect-square rounded-full bg-blue-500 hover:bg-blue-400 text-white cursor-pointer flex items-center justify-center"
				onClick={handleShareToFacebook}
			>
				<FontAwesomeIcon icon={["fab", "facebook-f"]} />
			</button>
			<button
				className="h-7 aspect-square rounded-full bg-gray-900 hover:bg-gray-600 text-white cursor-pointer flex items-center justify-center"
				onClick={handleShareToX}
			>
				<FontAwesomeIcon icon={["fab", "x-twitter"]} />
			</button>
		</div>
	);
};

export default ShareToSocials;
