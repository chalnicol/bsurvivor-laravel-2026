import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TopEntryList from "./topEntryList";
import { useAdmin } from "../../context/admin/AdminProvider";
import { useEffect } from "react";
import RefreshButton from "../refreshButton";
import Spinner from "../spinner";

const TopEntries = () => {
	const {
		isLoading,
		fetchBracketChallenges,
		ongoingChallenges,
		isOngoingLoading,
		ongoingChallengesFetched,
	} = useAdmin();

	useEffect(() => {
		if (!ongoingChallengesFetched) {
			fetchBracketChallenges("ongoing");
		}
	}, [ongoingChallengesFetched]);

	return (
		<div className="mb-12">
			<div className="flex flex-wrap items-center gap-x-3">
				<h3 className="font-bold text-xl">
					<FontAwesomeIcon icon="caret-right" /> Bracket Challenge Top
					Entries
				</h3>
				<RefreshButton
					color="amber"
					size="sm"
					delay={3}
					className="px-2"
					onClick={() => fetchBracketChallenges("ongoing")}
					disabled={isLoading}
				>
					REFRESH LIST
				</RefreshButton>
			</div>

			<p className="text-sm">
				This is the list of ongoing bracket challenges and their top
				entries.
			</p>

			{ongoingChallenges.length > 0 ? (
				<div className="space-y-4 mb-4 mt-4">
					{ongoingChallenges.map((bracketChallenge) => (
						<TopEntryList
							key={bracketChallenge.id}
							bracketChallenge={bracketChallenge}
						/>
					))}
				</div>
			) : (
				<>
					{isOngoingLoading ? (
						<div className="mt-4 bg-gray-200 h-13">
							<Spinner
								colorTheme="dark"
								alignment="horizontal"
								size="sm"
							/>
						</div>
					) : (
						<div className="py-2 px-3 bg-gray-200 mt-4">
							No top entries to display
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default TopEntries;
