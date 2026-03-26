import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import BreadCrumbs from "../../../components/breadCrumbs";
import {
	type BracketChallengeInfo,
	type MetaInfo,
	type PaginatedResponse,
} from "../../../data/adminData";
import { useEffect, useState } from "react";
import apiClient from "../../../utils/axiosConfig";
import Loader from "../../../components/loader";
import Pagination from "../../../components/pagination";

// Import the custom debounce hook
import useDebounce from "../../../hooks/useDebounce"; // Adjust path if needed
import ToDelete from "../../../components/toDelete";
import StatusMessage from "../../../components/statusMessage";
import ContentBase from "../../../components/contentBase";
import { displayLocalDate } from "../../../utils/dateTime";

const ListBracketChallenges = () => {
	const [bracketChallenges, setBracketChallenges] = useState<
		BracketChallengeInfo[]
	>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [meta, setMeta] = useState<MetaInfo | null>(null);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [toDelete, setToDelete] = useState<BracketChallengeInfo | null>(null);

	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Use the debounced value of searchTerm
	const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

	const fetchBracketChallenges = async (page: number, term: string) => {
		setIsLoading(true);
		try {
			const response = await apiClient.get<
				PaginatedResponse<BracketChallengeInfo>
			>(
				`/admin/bracket-challenges?page=${page}${
					term ? `&search=${term}` : ""
				}`
			);
			setBracketChallenges(response.data.data);
			setMeta(response.data.meta);
		} catch (error) {
			console.error("Error fetching Bracket Challenges:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchBracketChallenges(currentPage, debouncedSearchTerm);
	}, [currentPage, debouncedSearchTerm]);

	//delete bracket challenge
	const deleteBracketChallenge = async (): Promise<void> => {
		if (!toDelete) return;
		setIsLoading(true);
		try {
			await apiClient.delete(`/admin/bracket-challenges/${toDelete.id}`);
			setBracketChallenges((prev) =>
				prev.filter((c) => c.id !== toDelete.id)
			);
			setSuccess("Bracket Challenge deleted successfully");
			if (meta) {
				const newTotal = bracketChallenges.length - 1;
				if (newTotal === 0 && meta.current_page > 1) {
					setCurrentPage((prev) => prev - 1);
				} else {
					fetchBracketChallenges(currentPage, debouncedSearchTerm);
				}
			}
		} catch (error) {
			console.error("Error deleting Bracket Challenge:", error);
			setError("Error deleting Bracket Challenge");
		} finally {
			setToDelete(null);
			setIsLoading(false);
		}
	};

	const clearMessaging = () => {
		setSuccess(null);
		setError(null);
		setToDelete(null);
	};

	//..
	const handlePageClick = (page: number) => {
		setCurrentPage(page);
		clearMessaging();
	};

	const handleDelete = (challenge: BracketChallengeInfo) => {
		setError(null);
		setSuccess(null);
		setToDelete(challenge);
	};

	// Update searchTerm immediately on input change
	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		clearMessaging();
		// Do NOT reset currentPage here. Reset it when the debounced search term actually triggers a fetch.
		// If you reset currentPage here, it would reset on every keystroke, which is not what we want.
	};

	// We need a separate effect to reset the page when the debounced search term changes
	// and it's different from the initial empty string (i.e., user actually typed something).
	useEffect(() => {
		// Only reset page to 1 if the debounced search term has changed
		// and is not the initial empty string (unless you want to reset on initial load too)
		if (debouncedSearchTerm !== searchTerm && debouncedSearchTerm !== "") {
			setCurrentPage(1);
		}
		// Alternatively, just always reset to page 1 when the debounced search term changes
		// setCurrentPage(1);
	}, [debouncedSearchTerm]);

	return (
		<ContentBase className="py-7 px-4">
			<div className="p-3 lg:p-5 bg-gray-100 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<BreadCrumbs />
				<div className="md:flex items-center space-y-2 md:space-y-0">
					<h1 className="text-xl font-bold flex-1">Bracket Challenges</h1>
					<Link
						to="/admin/bracket-challenges/create"
						className="text-sm bg-gray-700 hover:bg-gray-600 text-center text-white rounded p-2 text-xs font-bold"
					>
						<FontAwesomeIcon icon="plus" className="me-1" />
						NEW CHALLENGE
					</Link>
				</div>

				<input
					type="search"
					value={searchTerm}
					onChange={handleSearchInputChange}
					className="px-1 py-0.5 border-b border-gray-400 w-full mt-3 focus:outline-none"
					placeholder="Search Bracket Challenges here..."
				/>

				{success && (
					<StatusMessage
						type="success"
						message={success}
						onClose={() => setSuccess(null)}
					/>
				)}
				{error && (
					<StatusMessage
						type="error"
						message={error}
						onClose={() => setError(null)}
					/>
				)}

				{toDelete && (
					<ToDelete
						prompt={`Are you sure want to delete "${toDelete.name}"?`}
						onConfirm={deleteBracketChallenge}
						onCancel={() => setToDelete(null)}
					/>
				)}

				<div className="mt-3 overflow-x-auto">
					{bracketChallenges.length > 0 ? (
						<table className="w-full text-sm min-w-xl text-nowrap">
							<thead className="text-white bg-gray-700 font-semibold">
								<tr>
									<td className="px-2 py-1">ID</td>
									<td className="px-2 py-1">Name</td>
									<td className="px-2 py-1">League</td>
									<td className="px-2 py-1">Start Date</td>
									<td className="px-2 py-1">End Date</td>
									<td className="px-2 py-1">Is_Public</td>
									<td className="px-2 py-1">Actions</td>
								</tr>
							</thead>
							<tbody>
								{bracketChallenges.map((challenge) => (
									<tr key={challenge.id} className="even:bg-gray-200">
										<td className="px-2 py-1">{challenge.id}</td>
										<td className="px-2 py-1">{challenge.name}</td>
										<td className="px-2 py-1">{challenge.league}</td>
										<td className="px-2 py-1">
											{displayLocalDate(challenge.start_date)}
										</td>
										<td className="px-2 py-1">
											{displayLocalDate(challenge.end_date)}
										</td>
										<td className="px-2 py-1">
											<span
												className={`font-bold ${
													challenge.is_public
														? "text-green-600"
														: "text-red-600"
												}`}
											>
												{challenge.is_public ? "Yes" : "No"}
											</span>
										</td>
										<td className="px-2 py-1 flex items-center space-x-1">
											<Link
												to={`/admin/bracket-challenges/${challenge.id}`}
												className="block shadow cursor-pointer hover:bg-teal-500 bg-teal-600 text-center text-white rounded px-2 py-0.5 text-xs font-bold"
											>
												view | update
											</Link>
											<Link
												to={`/admin/bracket-challenges/${challenge.id}/edit`}
												className="block shadow cursor-pointer hover:bg-cyan-500 bg-cyan-600 text-center text-white rounded px-2 py-0.5 text-xs font-bold"
											>
												edit
											</Link>
											<button
												className="shadow cursor-pointer hover:bg-red-500 bg-red-600 text-center text-white rounded px-2 py-0.5 text-xs font-bold"
												onClick={() => {
													handleDelete(challenge);
												}}
											>
												delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p>
							{isLoading
								? "Loading Bracket Challenges..."
								: "No Bracket Challenges found."}
						</p>
					)}
				</div>
				<Pagination
					meta={meta}
					onPageChange={handlePageClick}
					className="mt-6"
				/>
			</div>
			{isLoading && <Loader />}
		</ContentBase>
	);
};

export default ListBracketChallenges;
