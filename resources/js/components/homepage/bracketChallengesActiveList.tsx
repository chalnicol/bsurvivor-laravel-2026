import { Link } from "react-router-dom";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAdmin } from "../../context/admin/AdminProvider";
import { displayLocalDate } from "../../utils/dateTime";
import Detail from "../detail";
import RefreshButton from "../refreshButton";
import Spinner from "../spinner";

const BracketChallengeActiveList = () => {
	const {
		activeChallenges,
		isLoading,
		activeChallengesFetched,
		fetchBracketChallenges,
	} = useAdmin();

	useEffect(() => {
		if (!activeChallengesFetched) {
			fetchBracketChallenges("active");
		}
	}, [activeChallengesFetched]);

	return (
		<>
			<div className="w-full">
				<div className="flex flex-row items-center gap-x-5 space-y-2 md:space-y-0">
					<h3 className="font-bold text-xl">
						<FontAwesomeIcon icon="caret-right" /> Open Bracket Challenges
					</h3>

					<RefreshButton
						color="amber"
						size="sm"
						delay={3}
						className="px-2 flex-none"
						onClick={() => fetchBracketChallenges("active")}
						disabled={isLoading}
					>
						REFRESH LIST
					</RefreshButton>
				</div>
				<p className="text-sm mt-1">
					Take a look of the open bracket challenges and submit your
					bracket challenge entry. Hurry up before the end date!
				</p>

				{activeChallenges.length > 0 ? (
					<div className="space-y-2 mt-4 mb-4">
						{activeChallenges.map((bracketChallenge) => (
							<Link
								to={`/bracket-challenges/${bracketChallenge.slug}`}
								key={bracketChallenge.id}
							>
								<div className="sm:grid md:grid-cols-2 px-3 py-2 space-y-1 border border-gray-400 bg-gray-800 hover:bg-gray-700 text-sm text-white rounded mb-1 shadow">
									<Detail label="Name">{bracketChallenge.name}</Detail>
									<Detail label="League">
										{bracketChallenge.league == "NBA" && (
											<span className="font-semibold bg-red-600 px-2 rounded text-white">
												NBA
											</span>
										)}
										{bracketChallenge.league == "PBA" && (
											<span className="font-semibold bg-blue-600 px-2 rounded text-white">
												PBA
											</span>
										)}
									</Detail>
									<Detail label="Start Date">
										{displayLocalDate(bracketChallenge.start_date)}
									</Detail>
									<Detail label="End Date">
										{displayLocalDate(bracketChallenge.end_date)}
									</Detail>
								</div>
							</Link>
						))}
					</div>
				) : (
					<>
						{isLoading ? (
							<div className="mt-4 bg-gray-200 h-13">
								<Spinner
									colorTheme="dark"
									alignment="horizontal"
									size="sm"
								/>
							</div>
						) : (
							<div className="mt-4 py-2 px-3 bg-gray-200 rounded">
								No open bracket challenges to display.
							</div>
						)}
					</>
				)}
			</div>
		</>
	);
};

export default BracketChallengeActiveList;
