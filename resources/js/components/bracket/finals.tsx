import { useEffect, useState } from "react";
import pbaThrophy from "../../assets/pba_trophy.png";
import nbaThrophy from "../../assets/nba_trophy.png";
import { useBracket } from "../../context/bracket/BracketProvider";
import type { AnyPlayoffsTeamInfo, SlotModeType } from "../../data/adminData";
import TeamSlotCenter from "./teamSlotCenter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PBAFinalsProps {
	league: "NBA" | "PBA";
	className?: string;
}

const Finals = ({ league, className }: PBAFinalsProps) => {
	const { rounds, mode, hasPredictions, clearFinalsMatchup } = useBracket();

	// const [matchup, setMatchup] = useState<PlayoffsMatchupInfo | null>(null);
	const [teamA, setTeamA] = useState<AnyPlayoffsTeamInfo | null>(null);
	const [teamB, setTeamB] = useState<AnyPlayoffsTeamInfo | null>(null);
	const [winningTeam, setWinningTeam] = useState<AnyPlayoffsTeamInfo | null>(
		null
	);
	const [showClearButton, setShowClearButton] = useState<boolean>(false);

	const [isClickable, setIsClickable] = useState<boolean>(false);

	useEffect(() => {
		if (!rounds) return;

		const finalRounds = rounds.find((r) => r.name === "Finals");

		if (finalRounds) {
			const finalMatchup = finalRounds.matchups[0];

			// setMatchup(finalMatchup);
			setTeamA(finalMatchup.teams.find((t) => t.slot == 1) || null);
			setTeamB(finalMatchup.teams.find((t) => t.slot == 2) || null);

			const team_id = finalMatchup.predicted_winner_team_id
				? finalMatchup.predicted_winner_team_id
				: finalMatchup.winner_team_id;

			setWinningTeam(
				finalMatchup.teams.find((t) => t.id == team_id) || null
			);

			setIsClickable(
				mode !== "preview" &&
					finalMatchup.teams.length >= 2 &&
					finalMatchup.winner_team_id === null
			);
			setShowClearButton(
				mode !== "preview" && finalMatchup.teams.length >= 1
			);
		}
	}, [rounds, mode]);

	const getTeamMode = (team: AnyPlayoffsTeamInfo | null): SlotModeType => {
		if (!team || !rounds) {
			return "idle";
		}

		const finalRounds = rounds.find((r) => r.name === "Finals");
		if (!finalRounds) {
			return "idle";
		}

		const finalMatchup = finalRounds.matchups[0];
		if (!finalMatchup) {
			return "idle";
		}

		if (hasPredictions) {
			if (
				!finalMatchup.isCorrect &&
				finalMatchup.winner_team_id &&
				finalMatchup.predicted_winner_team_id == team.id
			)
				return "void";

			if (
				finalMatchup.isCorrect &&
				finalMatchup.winner_team_id &&
				finalMatchup.predicted_winner_team_id == team.id &&
				finalMatchup.predicted_winner_team_id == finalMatchup.winner_team_id
			)
				return "correct";

			if (
				finalMatchup.isCorrect &&
				finalMatchup.winner_team_id &&
				finalMatchup.predicted_winner_team_id == team.id &&
				finalMatchup.predicted_winner_team_id != finalMatchup.winner_team_id
			)
				return "incorrect";

			if (
				!finalMatchup.winner_team_id &&
				finalMatchup.predicted_winner_team_id == team.id
			)
				return "selected";

			if (
				!finalMatchup.predicted_winner_team_id &&
				finalMatchup.winner_team_id == team.id
			)
				return "selected";
		} else {
			if (finalMatchup.winner_team_id === team.id) return "selected";
		}

		return "idle";
	};

	return (
		<>
			<div className={`select-none w-48 ${className}`}>
				<div>
					<div className="my-1 text-xs text-white flex justify-center items-center gap-x-2">
						<div className="font-bold text-lg text-center">
							{league} FINALS
						</div>
						{/* {showClearButton && (
							<button
								className="cursor-pointer hover:text-gray-400 bg-gray-500 leading-0 px-1"
								onClick={clearFinalsMatchup}
								title="CLEAR TEAMS"
							>
								<FontAwesomeIcon icon="xmark" />
							</button>
						)} */}
					</div>

					<div className="space-y-2 w-full">
						<TeamSlotCenter
							team={teamA}
							mode={getTeamMode(teamA)}
							isClickable={isClickable}
							placeholderText="R2M1 WINNER"
						/>
						<TeamSlotCenter
							team={teamB}
							mode={getTeamMode(teamB)}
							isClickable={isClickable}
							placeholderText="R2M2 WINNER"
						/>
					</div>
					<div
						className={`select-none text-[10px] mt-1.5 text-white font-semibold flex items-center`}
					>
						<p className="flex-1">
							<span className="bg-gray-600 px-1">Match ID</span>
							<span className="bg-orange-900 px-1 text-white">
								{league == "NBA" ? "F_R4M1" : "R3M1"}
							</span>
						</p>
						{showClearButton && (
							<button
								className="text-xs text-white cursor-pointer hover:text-gray-400 bg-gray-500 leading-0 px-1"
								onClick={clearFinalsMatchup}
								title="CLEAR TEAMS"
							>
								<FontAwesomeIcon icon="xmark" />
							</button>
						)}
					</div>
				</div>
				{/* winning team */}
				<div className="mt-6 text-white">
					<div className="flex items-center justify-center gap-x-1 mb-2 font-bold text-xl">
						<span className="">{league}</span>
						<img
							src={league == "NBA" ? nbaThrophy : pbaThrophy}
							alt="finals"
							className="h-9"
						/>
						<span>CHAMPION</span>
					</div>
					<TeamSlotCenter
						team={winningTeam}
						isClickable={false}
						placeholderText="FINALS WINNER"
						mode={getTeamMode(winningTeam)}
						size="lg"
					/>
				</div>
			</div>
		</>
	);
};

export default Finals;
