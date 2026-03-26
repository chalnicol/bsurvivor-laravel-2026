import { useEffect, useRef } from "react";
import type { AnyPlayoffsTeamInfo, SlotModeType } from "../../data/adminData";
import { getTeamLogoSrc } from "../../utils/imageService";
import { useBracket } from "../../context/bracket/BracketProvider";
import gsap from "gsap";
import { getSlotBgClass } from "../../utils/slots";

interface TeamSlotCenterProps {
	team: AnyPlayoffsTeamInfo | null;
	placeholderText: string;
	isClickable: boolean;
	mode: SlotModeType;
	size?: "lg" | null;
}

const TeamSlotCenter = ({
	team,
	placeholderText,
	mode,
	isClickable,
	size,
}: TeamSlotCenterProps) => {
	const { mode: bracketMode, updateFinalsPick } = useBracket();

	const hasAnimated = useRef<boolean>(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (bracketMode == "preview") return;

		if (team) {
			if (hasAnimated.current) {
				//..
				if (containerRef.current) {
					// gsap.killTweensOf(containerRef.current);
					gsap.set(containerRef.current, { scale: 1 });
				}
			} else {
				if (team && containerRef.current) {
					gsap.fromTo(
						containerRef.current,
						{ scale: 0 },
						{
							scale: 1,
							duration: 0.5,
							ease: "elastic.out(1.1, 0.6)",
						}
					);
					hasAnimated.current = true;
				}
			}
		} else {
			hasAnimated.current = false;
		}
		return () => {
			if (containerRef.current) {
				gsap.killTweensOf(containerRef.current);
			}
		};
	}, [team]);

	const getTextSizeClass = (): string => {
		if (team) {
			const fullName = `${team.fname} ${team.lname}`;
			if (fullName.length >= 24) return "text-sm";
		}
		return "text-lg";
	};

	const getBgClass = getSlotBgClass(mode);

	const heightClass = size == "lg" ? "h-12 border-2" : "h-10 border";

	const hoverClass =
		isClickable && mode == "idle" ? "cursor-pointer hover:bg-gray-500" : "";

	const handleClick = () => {
		if (!team) return;
		if (isClickable) updateFinalsPick(team);
	};

	// console.log("m", mode);

	return (
		<div
			ref={containerRef}
			onClick={handleClick}
			className={`rounded w-full relative overflow-hidden ${heightClass} ${hoverClass} ${getBgClass}`}
		>
			{team ? (
				<>
					<img
						src={getTeamLogoSrc(team.logo || "")}
						alt={team.abbr}
						className="h-20 w-auto aspect-square object-contain absolute top-1/2 left-[30%] -translate-y-1/2 -translate-x-1/2"
					/>
					<div
						className={`absolute font-bold leading-[1.1rem] text-wrap text-white text-shadow-sm w-[60%] text-shadow-black right-[5%] top-1/2 -translate-y-1/2 ${getTextSizeClass()}`}
					>
						{team.fname} {team.lname}
					</div>
				</>
			) : (
				<div className="h-full text-gray-400 text-xs font-semibold flex items-center justify-center">
					{placeholderText}
				</div>
			)}
		</div>
	);
};

export default TeamSlotCenter;
