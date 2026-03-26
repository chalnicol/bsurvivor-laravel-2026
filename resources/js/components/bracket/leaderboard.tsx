import type { BracketChallengeEntryInfo } from "../../data/adminData";
import StatusPills from "../statusPills";
import { useAuth } from "../../context/auth/AuthProvider";
import Detail from "../detail";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import apiClient from "../../utils/axiosConfig";
import Spinner from "../spinner";

type LeaderboardType = "global" | "friends";

interface LeaderboardProps {
	bracketChallengeId: number;
}

const Leaderboard = ({ bracketChallengeId }: LeaderboardProps) => {
	const { isAuthenticated, user } = useAuth();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [type, setType] = useState<LeaderboardType>("global");
	const [leaderboard, setLeaderboard] = useState<BracketChallengeEntryInfo[]>(
		[]
	);

	const fetchLeaderboard = async () => {
		setIsLoading(true);
		setLeaderboard([]);
		try {
			const response = await apiClient.get(
				`/bracket-challenges/${bracketChallengeId}/leaderboard?type=${type}`
			);
			setLeaderboard(response.data.entries);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleButtonClick = (buttonType: LeaderboardType) => {
		if (!isAuthenticated && buttonType === "friends") return;
		setType(buttonType);
	};

	const getFriendsButtonClass = (): string => {
		if (type == "friends") {
			return "bg-gray-500";
		} else {
			if (isAuthenticated) {
				return "hover:bg-gray-700 cursor-pointer";
			}
		}
		return "cursor-not-allowed";
	};

	useEffect(() => {
		fetchLeaderboard();
	}, [type]);

	// const fakeData = [
	// 	{
	// 		id: 1,
	// 		username: "Username_10000",
	// 		correctPrediction: 10,
	// 		status: "ELIMINATED",
	// 	},
	// 	{
	// 		id: 2,
	// 		username: "Username_10000",
	// 		correctPrediction: 10,
	// 		status: "ELIMINATED",
	// 	},
	// 	{
	// 		id: 3,
	// 		username: "Username_10000",
	// 		correctPrediction: 10,
	// 		status: "ELIMINATED",
	// 	},
	// 	{
	// 		id: 4,
	// 		username: "Username_10000",
	// 		correctPrediction: 10,
	// 		status: "ELIMINATED",
	// 	},
	// 	{
	// 		id: 5,
	// 		username: "Username_10000",
	// 		correctPrediction: 10,
	// 		status: "ELIMINATED",
	// 	},
	// 	{
	// 		id: 6,
	// 		username: "Username_10000",
	// 		correctPrediction: 10,
	// 		status: "ELIMINATED",
	// 	},
	// 	{
	// 		id: 7,
	// 		username: "Username_10000",
	// 		correctPrediction: 10,
	// 		status: "ELIMINATED",
	// 	},
	// 	{
	// 		id: 8,
	// 		username: "Username_10000",
	// 		correctPrediction: 10,
	// 		status: "ELIMINATED",
	// 	},
	// 	{
	// 		id: 9,
	// 		username: "Username_100000",
	// 		correctPrediction: 10,
	// 		status: "ELIMINATED",
	// 	},
	// 	{
	// 		id: 10,
	// 		username: "Username_10000",
	// 		correctPrediction: 10,
	// 		status: "ELIMINATED",
	// 	},
	// 	{
	// 		id: 11,
	// 		username: "Username_10000",
	// 		correctPrediction: 10,
	// 		status: "ELIMINATED",
	// 	},
	// 	{
	// 		id: 12,
	// 		username: "Username_10000",
	// 		correctPrediction: 10,
	// 		status: "ELIMINATED",
	// 	},
	// 	{
	// 		id: 13,
	// 		username: "Username_10000",
	// 		correctPrediction: 10,
	// 		status: "ELIMINATED",
	// 	},
	// ];

	const userEntry = useMemo((): BracketChallengeEntryInfo | null => {
		return leaderboard.find((entry) => entry.rank) || null;
	}, [leaderboard]);

	const firstEntries = useMemo((): BracketChallengeEntryInfo[] => {
		return leaderboard.filter((entry) => !entry.rank);
	}, [leaderboard]);

	return (
		<div className="max-w-5xl mx-auto mb-6 block">
			<h2 className="font-bold text-sm text-center text-xl">LEADERBOARD</h2>
			<div className="border rounded-full w-full max-w-sm mx-auto overflow-hidden flex mt-4">
				<button
					className={`flex-1 border-r border-gray-400 px-2 py-1 font-bold ${
						type === "global"
							? "bg-gray-500"
							: "hover:bg-gray-700 cursor-pointer"
					}`}
					onClick={() => handleButtonClick("global")}
				>
					GLOBAL
				</button>
				<button
					className={`flex-1 border-r border-gray-400 px-2 py-1 font-bold ${getFriendsButtonClass()}`}
					onClick={() => handleButtonClick("friends")}
					disabled={!isAuthenticated}
				>
					FRIENDS
				</button>
			</div>
			<div className="mt-3 h-[430px] overflow-y-auto">
				{firstEntries.length > 0 ? (
					<div>
						{firstEntries.map((entry, i) => (
							<Link
								to={`/bracket-challenge-entries/${entry.slug}`}
								className={`flex items-center border-t last:border-b border-gray-500 hover:bg-gray-700 ${
									user && entry.user_id == user.id && "bg-gray-700/60"
								}`}
								key={entry.id}
							>
								<p className="flex-none px-2 text-2xl font-bold w-15">
									{i < 10 ? `0${i + 1}` : i + 1}
								</p>
								<div className="flex-1 grid md:grid-cols-2 lg:grid-cols-3 px-3 py-2 space-y-1 text-sm text-white shadow">
									<Detail label="Username">
										<span
											className={`${
												user &&
												entry.user_id == user.id &&
												"text-yellow-500 font-semibold"
											}`}
										>
											{entry.user.username}
										</span>
									</Detail>
									<Detail label="Correct Predictions">
										{entry.correct_predictions_count}
									</Detail>
									<Detail label="Status">
										<StatusPills status={entry.status} />
									</Detail>
								</div>
							</Link>
						))}
					</div>
				) : (
					<>
						{isLoading ? (
							<div className="h-20 mt-1 bg-gray-700 rounded">
								<Spinner alignment="horizontal" />
							</div>
						) : (
							<div className="bg-gray-700 text-white px-2 py-1 h-16 flex items-center justify-center rounded">
								No leaderboard data to display.
							</div>
						)}
					</>
				)}
				{userEntry && (
					<div className="mt-3">
						<Link
							to={`/bracket-challenge-entries/${userEntry.slug}`}
							className={`flex items-center last:border-b border-t border-gray-500 hover:bg-gray-700 bg-gray-700/60`}
							key={userEntry.id}
						>
							<p
								className={`flex-none px-2 font-bold w-15 ${
									userEntry.rank && userEntry.rank >= 1000
										? "text-xl"
										: "text-2xl"
								}`}
							>
								{userEntry.rank}
							</p>
							<div className="flex-1 grid md:grid-cols-2 lg:grid-cols-3 px-3 py-2 space-y-1 text-sm text-white shadow">
								<Detail label="Username">
									<span className="text-yellow-500 font-semibold">
										{userEntry.user.username}
									</span>
								</Detail>
								<Detail label="Correct Predictions">
									{userEntry.correct_predictions_count}
								</Detail>
								<Detail label="Status">
									<StatusPills status={userEntry.status} />
								</Detail>
							</div>
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default Leaderboard;
