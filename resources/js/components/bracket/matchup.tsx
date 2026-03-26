import { useCallback, useEffect, useState } from "react";
import type {
	AnyPlayoffsTeamInfo,
	PlayoffsMatchupInfo,
	SlotModeType,
} from "../../data/adminData";
import TeamSlot from "./teamSlot";
import { useBracket } from "../../context/bracket/BracketProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface MatchupProps {
	roundIndex: number;
	matchup: PlayoffsMatchupInfo | null;
	conference?: "EAST" | "WEST";
}
const Matchup = ({ matchup, roundIndex, conference }: MatchupProps) => {
	const { mode, hasPredictions, clearMatchup } = useBracket();

	const alignment = conference === "WEST" ? "right" : "left";
	const textAlignment = conference === "WEST" ? "text-right" : "text-left";

	const [team1, setTeam1] = useState<AnyPlayoffsTeamInfo | null>(null);
	const [team2, setTeam2] = useState<AnyPlayoffsTeamInfo | null>(null);
	const [showClearButton, setShowClearButton] = useState<boolean>(false);
	const [isClickable, setIsClickable] = useState<boolean>(false);

	useEffect(() => {
		if (!matchup) return;
		setTeam1(matchup.teams.find((t) => t.slot == 1) || null);
		setTeam2(matchup.teams.find((t) => t.slot == 2) || null);

		setShowClearButton(
			mode == "preview"
				? false
				: roundIndex > 1 &&
						matchup.winner_team_id === null &&
						matchup.teams.length >= 1
		);

		setIsClickable(
			mode !== "preview" &&
				matchup.teams.length >= 2 &&
				matchup.winner_team_id === null
		);
	}, [matchup, mode]);

	const getPlaceHolderText = useCallback(
		(slot: number) => {
			if (matchup) {
				const { matchup_index } = matchup;
				const originIndex = 2 * (matchup_index - 1) + slot;

				if (conference) {
					const conferenceFirstLetter = conference.charAt(0).toUpperCase();
					return `${conferenceFirstLetter}_R${
						roundIndex - 1
					}M${originIndex} WINNER`;
					//..
				} else {
					return `R${roundIndex - 1}M${originIndex} WINNER`;
				}
			}
			return "TEAM";
		},
		[roundIndex, matchup]
	);

	const getTeamSlotStyle = useCallback(
		(team: AnyPlayoffsTeamInfo | null): SlotModeType => {
			if (matchup && team) {
				if (hasPredictions) {
					if (
						matchup.isCorrect == false &&
						matchup.winner_team_id &&
						matchup.predicted_winner_team_id == team.id
					)
						return "void";

					if (
						matchup.isCorrect &&
						matchup.winner_team_id &&
						matchup.predicted_winner_team_id == team.id &&
						matchup.predicted_winner_team_id == matchup.winner_team_id
					)
						return "correct";

					if (
						matchup.isCorrect &&
						matchup.winner_team_id &&
						matchup.predicted_winner_team_id == team.id &&
						matchup.predicted_winner_team_id != matchup.winner_team_id
					)
						return "incorrect";

					if (
						!matchup.winner_team_id &&
						matchup.predicted_winner_team_id == team.id
					)
						return "selected";

					if (
						!matchup.predicted_winner_team_id &&
						matchup.winner_team_id == team.id
					)
						return "selected";
				} else {
					if (matchup.winner_team_id == team.id) return "selected";
				}
			}
			return "idle";
		},
		[matchup]
	);

	const handleClearButton = useCallback(() => {
		if (!matchup) return;
		clearMatchup(conference || null, roundIndex, matchup.matchup_index);
	}, [conference, matchup, roundIndex]);

	const flexClass = alignment == "right" ? "flex-row-reverse" : "flex-row";

	// const borderClass = alignment == "right" ? "border-l pl-2" : "border-r pr-2";
	// const borderClass = "";

	if (!matchup) return;

	return (
		<>
			<div>
				<div className={`border-gray-500 space-y-2 relative`}>
					<TeamSlot
						team={team1}
						// slot={1}
						roundIndex={roundIndex}
						matchupIndex={matchup.matchup_index}
						conference={conference}
						isClickable={isClickable}
						slotMode={getTeamSlotStyle(team1)}
						alignment={alignment}
						placeholderText={getPlaceHolderText(1)}
					/>
					<TeamSlot
						team={team2}
						// slot={2}
						roundIndex={roundIndex}
						matchupIndex={matchup.matchup_index}
						conference={conference}
						isClickable={isClickable}
						slotMode={getTeamSlotStyle(team2)}
						alignment={alignment}
						placeholderText={getPlaceHolderText(2)}
					/>
				</div>
				<div
					className={`select-none text-[10px] mt-1.5 text-white font-semibold flex items-center ${flexClass} ${textAlignment}`}
				>
					<p className="flex-1">
						<span className="bg-gray-600 px-1">Match ID</span>
						<span className="bg-orange-900 px-1 text-white">
							{matchup.name}
						</span>
					</p>
					{showClearButton && (
						<button
							className="text-xs text-white cursor-pointer hover:text-gray-400 bg-gray-500 leading-0 px-1"
							onClick={handleClearButton}
							title="CLEAR TEAMS"
						>
							<FontAwesomeIcon icon="xmark" />
						</button>
					)}
				</div>
			</div>
		</>
	);
};
export default Matchup;
