import type { PlayoffsRoundInfo } from "../../data/adminData";
import Matchup from "./matchup";
import { useBracket } from "../../context/bracket/BracketProvider";
import { useEffect, useState } from "react";

interface ConferenceProps {
	conference?: "EAST" | "WEST";
	league: string;
	className?: string;
}

const Conference = ({ conference, league, className }: ConferenceProps) => {
	const { rounds: roundsData } = useBracket();

	const [rounds, setRounds] = useState<PlayoffsRoundInfo[]>([]);

	const textAlignment = conference === "WEST" ? "text-right" : "text-left";

	const flexAlignment =
		conference === "WEST" ? "flex-row-reverse" : "flex-row";

	useEffect(() => {
		if (!roundsData) return;

		if (league == "NBA") {
			setRounds(
				roundsData.filter((round) => round.conference === conference)
			);
		} else if (league == "PBA") {
			setRounds(roundsData.filter((round) => round.order_index < 3));
		}
	}, [roundsData]);

	const spacingClass = (roundIndex: number): string => {
		switch (roundIndex) {
			case 1:
				return "space-y-4";
			case 2:
				return "space-y-[130px]";
			default:
				return "";
		}
	};

	return (
		<>
			<div className={`mt-1 ${className}`}>
				{conference && (
					<p className={`font-bold ${textAlignment}`}>
						<span
							className={`px-3 text-white ${
								conference == "EAST" ? "bg-blue-700" : "bg-rose-600"
							}`}
						>
							{conference}
						</span>
					</p>
				)}

				<div className={`mt-2 flex items-center gap-x-4 ${flexAlignment}`}>
					{rounds.map((round) => (
						<div key={round.id} className="flex-1 min-w-34">
							<p
								className={`font-semibold text-white text-sm mb-0.5 ${textAlignment}`}
							>
								{round.name}
							</p>
							<div className={`${spacingClass(round.order_index)}`}>
								{round.matchups.map((matchup) => (
									<Matchup
										key={matchup.id}
										roundIndex={round.order_index}
										conference={conference}
										matchup={matchup}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
};
export default Conference;
