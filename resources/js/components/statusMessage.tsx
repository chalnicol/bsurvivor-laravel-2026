import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { isElementInViewport } from "../utils/elements";

interface StatusMessageProps {
	message: string;
	type: "success" | "error" | "info";
	onClose: () => void;
	fixed?: boolean;
	children?: React.ReactNode;
}

gsap.registerPlugin(ScrollToPlugin);

const StatusMessage = ({
	message,
	type,
	children,
	onClose,
	fixed,
}: StatusMessageProps) => {
	const containerRef = useRef<HTMLDivElement>(null);

	const bgClr = () => {
		switch (type) {
			case "success":
				return "bg-green-600";
			case "error":
				return "bg-red-600";
			case "info":
				return "bg-teal-600";
			default:
				return "bg-gray-600";
		}
	};

	const openAnim = () => {
		if (containerRef.current) {
			gsap.fromTo(
				containerRef.current,
				{ scaleY: 0 },
				{ scaleY: 1, duration: 0.5, ease: "elastic.out(1, 0.8)" }
			);
		}
	};

	const closeAnim = () => {
		if (containerRef.current) {
			gsap.fromTo(
				containerRef.current,
				{ scaleY: 1 },
				{
					scaleY: 0,
					duration: 0.3,
					ease: "elastic.in(1, 0.8)",
					onComplete: onClose,
				}
			);
		}
	};

	const scrollAnim = () => {
		if (containerRef.current) {
			gsap.to(window, {
				scrollTo: { y: containerRef.current.offsetTop, offsetY: 10 },
				duration: 0.5,
				ease: "power4.out",
			});
		}
	};

	useEffect(() => {
		if (!message) return;

		openAnim();
		// scrollAnim();
		// Conditionally trigger the scroll animation ONLY if the element is out of view
		if (containerRef.current && !isElementInViewport(containerRef.current)) {
			scrollAnim();
		}

		let timer = fixed ? null : setTimeout(() => closeAnim(), 5000);

		return () => {
			if (timer) {
				clearTimeout(timer);
			}
			if (containerRef.current) {
				gsap.killTweensOf(containerRef.current);
			}
		};
	}, [message]);

	return (
		<div
			ref={containerRef}
			className={`w-full my-2 relative flex justify-between gap-x-2 text-white rounded font-semibold px-3 pt-2 ${
				children
					? "pb-3 md:pb-2 items-start md:items-center"
					: "pb-2 items-center"
			} ${bgClr()}`}
		>
			<div className="md:flex items-center w-full space-y-1 md:space-y-0">
				<p className="flex-1 text-sm">{message}</p>
				{children}
			</div>
			<button
				className={`px-1 cursor-pointer hover:bg-white/20`}
				onClick={closeAnim}
			>
				<FontAwesomeIcon icon="xmark" />
			</button>
		</div>
	);
};

export default StatusMessage;
