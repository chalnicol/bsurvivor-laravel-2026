import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatNumberShorthand } from "../utils/numbers";
import gsap from "gsap";
import React, { useEffect } from "react";

interface ReactionButtonProps {
	type: "like" | "dislike";
	size?: "xs" | "sm" | "lg";
	disabled: boolean;
	selected: boolean;
	count: number;
	onClick: () => void;
}
const ReactionButton = ({
	type,
	disabled,
	selected,
	count,
	size,
	onClick,
}: ReactionButtonProps) => {
	const countRef = React.useRef<HTMLDivElement>(null);

	const getCount = (count: number): string => {
		if (count && count > 0) {
			return formatNumberShorthand(count);
		}
		return "";
	};

	const getBgClass = () => {
		if (!disabled) {
			if (selected && type == "like") {
				return "bg-green-700 hover:bg-green-600 text-amber-300 cursor-pointer";
			} else if (selected && type == "dislike") {
				return "bg-red-700 hover:bg-red-600 text-amber-300 cursor-pointer";
			} else if (!selected && type == "like") {
				return "bg-green-700 hover:bg-green-600 text-white cursor-pointer";
			} else if (!selected && type == "dislike") {
				return "bg-red-700 hover:bg-red-600 text-white cursor-pointer";
			}
		}
		return "bg-gray-400 text-white";
	};

	useEffect(() => {
		if (count > 0 && countRef.current) {
			gsap.fromTo(
				countRef.current,
				{
					scale: 0,
					x: -8,
				},
				{ scale: 1, x: 0, duration: 0.4, ease: "elastic.out(1, 0.5)" }
			);
		}
		return () => {
			if (countRef.current) {
				gsap.killTweensOf(countRef.current);
			}
		};
	}, [count]);

	const sizeProps = size && { size };
	return (
		<div className="relative">
			<button
				className={`rounded-full aspect-square active:scale-95 flex items-center justify-center px-1.5 transition-scale ease-in duration-100 ${getBgClass()}`}
				onClick={onClick}
				disabled={disabled}
			>
				<FontAwesomeIcon
					icon={type == "like" ? "thumbs-up" : "thumbs-down"}
					{...sizeProps}
				/>
			</button>

			{count > 0 && (
				<p
					ref={countRef}
					className={`absolute -top-0.5 z-10 font-bold text-xs px-1 shadow bg-white border border-gray-300 text-center rounded min-w-6 shadow ${
						size == "xs" ? "left-5" : "left-6"
					}`}
				>
					{getCount(count)}
				</p>
			)}
		</div>
	);
};

export default ReactionButton;
