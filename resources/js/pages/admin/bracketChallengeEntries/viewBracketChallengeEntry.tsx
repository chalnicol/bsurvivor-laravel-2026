import { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/breadCrumbs";
import { useParams } from "react-router-dom";
import { apiClient } from "../../../utils/api";
import Loader from "../../../components/loader";
import type { BracketChallengeEntryInfo } from "../../../data/adminData";
import Bracket from "../../../components/bracket/bracket";
import { BracketProvider } from "../../../context/bracket/BracketProvider";
import ContentBase from "../../../components/contentBase";
import Detail from "../../../components/detail";
import StatusPills from "../../../components/statusPills";

const ViewBracketChallengeEntry = () => {
	const { id } = useParams<{ id: string }>();

	const [bracketChallengeEntry, setBracketChallengeEnry] =
		useState<BracketChallengeEntryInfo | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetchBracketChallengeEntry = async () => {
		try {
			setIsLoading(true);
			const response = await apiClient.get(
				`/admin/bracket-challenge-entries/${id}`
			);
			setBracketChallengeEnry(response.data.data);
			// console.log(response.data.user);
		} catch (error) {
			console.error("Error fetching bracket challenge:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!id) {
			setIsLoading(false);
			return;
		}
		fetchBracketChallengeEntry();
	}, [id]);

	return (
		<ContentBase className="py-7 px-4">
			<div className="p-3 lg:p-5 border rounded-lg shadow-sm border-gray-400 bg-gray-100 overflow-x-hidden">
				<BreadCrumbs />
				<div className="md:flex items-center space-y-2 md:space-y-0">
					<h1 className="text-xl font-bold flex-1">
						Bracket Challenge Entry Details
					</h1>
				</div>
				{/* inset content here.. */}
				<div className="mt-4">
					{bracketChallengeEntry ? (
						<>
							<div className="bg-gray-800 text-white p-4 rounded border text-sm border border-gray-300">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
									<Detail label="Entry Name">
										{bracketChallengeEntry.name}
									</Detail>
									<Detail label="Entry By">
										{bracketChallengeEntry.user.username}
									</Detail>
									<Detail label="Bracket Challenge">
										{bracketChallengeEntry.bracket_challenge.name}
									</Detail>
									<Detail label="Status">
										<StatusPills
											status={bracketChallengeEntry.status}
										/>
									</Detail>
								</div>
								<hr className="my-2 border-gray-400" />
								{/* preview */}
								<div>
									<div>
										<BracketProvider
											bracketChallenge={
												bracketChallengeEntry.bracket_challenge
											}
											predictions={bracketChallengeEntry.predictions}
											bracketMode={"preview"}
										>
											<Bracket />
										</BracketProvider>
									</div>
								</div>
							</div>
						</>
					) : (
						<p className="bg-gray-200 px-3 py-2">
							{isLoading
								? "Loading bracket challenge entry details..."
								: "No bracket challenge entry data found."}
						</p>
					)}
				</div>
			</div>

			{isLoading && <Loader />}
		</ContentBase>
	);
};

export default ViewBracketChallengeEntry;
