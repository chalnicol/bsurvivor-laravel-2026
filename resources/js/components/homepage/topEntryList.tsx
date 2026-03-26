import type { BracketChallengeInfo } from "../../data/adminData";
// import { useAdmin } from "../../context/admin/AdminProvider";
import { Link } from "react-router-dom";
import StatusPills from "../statusPills";
import { useAuth } from "../../context/auth/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "../../utils/cn";

interface topEntryListProps {
	bracketChallenge: BracketChallengeInfo;
}

const TopEntryList = ({ bracketChallenge }: topEntryListProps) => {
	const txtColorClass: Record<string, string> = {
		NBA: "text-red-500",
		PBA: "text-blue-500",
	};

	const { user, isAuthenticated } = useAuth();

	return (
		<div className="overflow-hidden border border-gray-500 rounded px-4 py-3 bg-gray-800">
			<Link
				to={`/bracket-challenges/${bracketChallenge.slug}`}
				className="inline group text-white inline-block"
			>
				<p className="font-semibold text-lg group-hover:text-gray-400 group-hover:underline">
					{bracketChallenge.name}
				</p>
				<p className="text-xs">
					<span className="text-slate-300">League :</span>
					<span
						className={cn(
							"ms-1.5",
							txtColorClass[bracketChallenge.league],
						)}
					>
						{bracketChallenge.league}
					</span>
				</p>
			</Link>

			<div className="mt-3">
				{bracketChallenge.entries.length > 0 ? (
					<>
						{/* <p className="text-gray-700 text-sm font-bold text-white mb-2">
							TOP SUBMITTED ENTRIES
						</p> */}

						{bracketChallenge.entries.map((entry, index) => (
							<Link
								to={`/bracket-challenge-entries/${entry.slug}`}
								key={entry.id}
								className=" text-sm text-white border-t border-gray-600 block flex items-center justify-center gap-x-3 hover:bg-gray-700/50 px-3 py-2"
							>
								<div className="flex-none w-10 text-2xl font-bold">
									{index + 1 < 10 ? `0${index + 1}` : index + 1}
								</div>
								<div className="flex-1 grid grid-cols-[2fr_1fr] md:grid-cols-[2fr_2fr_1fr] gap-x-3 gap-y-2">
									<div className="col-span-2 md:col-span-1 border-b border-gray-500 pb-2 md:border-0 md:pb-0">
										<p className="text-[10px] tracking-widest uppercase text-slate-400">
											User
										</p>
										<p
											className={cn(
												isAuthenticated &&
													user &&
													user.id == entry.user.id &&
													"text-yellow-400 font-semibold",
											)}
										>
											{entry.user.username}
										</p>
									</div>

									<div>
										<p className="text-[10px] tracking-widest uppercase text-slate-400">
											Correct Picks Count
										</p>
										<p>{entry.correct_predictions_count}</p>
									</div>

									<div>
										<p className="text-[10px] tracking-widest uppercase text-slate-400">
											Status
										</p>
										<StatusPills status={entry.status} />
									</div>
								</div>
							</Link>
						))}
					</>
				) : (
					<>
						<p className="text-white px-2 py-1">
							No entries submitted for this challenge.
						</p>
					</>
				)}
			</div>
		</div>
	);
};

export default TopEntryList;
