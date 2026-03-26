import { useCallback, useEffect, useMemo, useState } from "react";
import BreadCrumbs from "../../../components/breadCrumbs";
import ErrorDisplay from "../../../components/errorDisplay";
import type {
	nbaTeamData,
	// pbaTeamData,
	AnyTeamInfo,
	BracketChallengeInfo,
	pbaTeamData,
} from "../../../data/adminData";
import { useAdmin } from "../../../context/admin/AdminProvider";
import Loader from "../../../components/loader";
import apiClient from "../../../utils/axiosConfig";
import { useParams } from "react-router-dom";
import StatusMessage from "../../../components/statusMessage";
import SelectTeamModal from "../../../components/selectTeamModal";
import ContentBase from "../../../components/contentBase";
import { convertDateToFormFormat } from "../../../utils/dateTime";
import SelectedTeamsList from "../../../components/form/selectedTeamsList";

const EditBracketChallenge = () => {
	const { id } = useParams<{ id: string }>();

	const {
		areTeamsAndLeaguesPopulated,
		fetchTeamsAndLeagues,
		nbaTeams,
		pbaTeams,
		// leagues,
		isLoading: isLoadingTeamsAndLeagues,
	} = useAdmin();

	const [bracketChallenge, setBracketChallenges] =
		useState<BracketChallengeInfo | null>(null);
	const [league, setLeague] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");
	const [isPublic, setIsPublic] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [conference, setConference] = useState<"EAST" | "WEST">("EAST");
	const [showAddTeamModal, setShowAddTeamModal] = useState<boolean>(false);

	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({}); // To hold validation errors

	const [selectedNbaTeamsData, setSelectedNbaTeamsData] =
		useState<nbaTeamData | null>(null);
	const [selectedPbaTeamsData, setSelectedPbaTeamsData] =
		useState<pbaTeamData | null>(null);

	useEffect(() => {
		if (!areTeamsAndLeaguesPopulated) {
			fetchTeamsAndLeagues();
		}
	}, [areTeamsAndLeaguesPopulated]);

	useEffect(() => {
		const fetchBracketChallenge = async () => {
			setIsLoading(true);
			try {
				const response = await apiClient.get(
					`/admin/bracket-challenges/${id}/edit`
				);
				setBracketChallenges(response.data.data);
			} catch (error) {
				// console.error("Error fetching bracket challenge:", error);
				setError("Failed to fetch bracket challenge.");
			} finally {
				setIsLoading(false);
			}
		};
		fetchBracketChallenge();
	}, [id]);

	useEffect(() => {
		if (bracketChallenge) {
			setLeague(bracketChallenge.league);
			setName(bracketChallenge.name);
			setDescription(bracketChallenge.description || "");
			setStartDate(convertDateToFormFormat(bracketChallenge.start_date));
			setEndDate(convertDateToFormFormat(bracketChallenge.end_date));
			setIsPublic(bracketChallenge.is_public);
			if (bracketChallenge.league === "NBA") {
				setSelectedNbaTeamsData(
					bracketChallenge.bracket_data as nbaTeamData
				);
			} else {
				setSelectedPbaTeamsData(
					bracketChallenge.bracket_data as pbaTeamData
				);
			}
		}
	}, [bracketChallenge]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Handle form submission logic here
		if (league == "") return;

		//prepare to submit data..
		const toSubmitData = {
			name: name,
			description: description,
			start_date: startDate,
			end_date: endDate,
			is_public: isPublic,
			// league: league,
			bracket_data:
				league === "NBA" ? selectedNbaTeamsData : selectedPbaTeamsData,
		};

		console.log(toSubmitData);

		const editBracketChallenge = async () => {
			try {
				setIsLoading(true);
				setError(null);
				setSuccess;
				setFieldErrors({}); // Clear validation errors)
				await apiClient.put<BracketChallengeInfo>(
					`/admin/bracket-challenges/${id}`,
					toSubmitData
				);
				// clearForms();
				setSuccess("Challenge updated successfully!");
			} catch (error: any) {
				if (error.type === "validation") {
					setFieldErrors(error.errors);
					// setError(error.message); // Often 'The given data was invalid.'
				} else if (
					error.type === "server" ||
					error.type === "general" ||
					error.type === "network" ||
					error.type === "client"
				) {
					setError(error.message);
				} else {
					// Fallback for any other unexpected error type
					setError("An unknown error occurred.");
				}
			} finally {
				setIsLoading(false);
			}
		};
		editBracketChallenge();
	};

	const handleTeamSelect = (team: AnyTeamInfo) => {
		if (league === "NBA") {
			//push to nbaTeamsData.. limit to 8 teams
			if (conference === "EAST") {
				setSelectedNbaTeamsData((prevData) => {
					if (!prevData) {
						return {
							league: "NBA",
							teams: {
								east: [team.id],
								west: [],
							},
						};
					}
					//..
					const selected = prevData.teams.east.includes(team.id);
					if (selected) {
						// If the team is already selected in EAST, unselect it
						return {
							...prevData,
							teams: {
								east: prevData.teams.east.filter(
									(id) => id !== team.id
								),
								west: prevData.teams.west,
							},
						};
					} else {
						// If the team is not selected in EAST, check if we can add it
						if (prevData.teams.east.length < 8) {
							// If less than 8 teams in EAST, add the new team
							return {
								...prevData,
								teams: {
									east: [...prevData.teams.east, team.id],
									west: prevData.teams.west,
								},
							};
						} else {
							// If 8 teams already in EAST, do not add the new team
							console.log(
								"Cannot add more than 8 teams to the East conference."
							);
							return prevData; // Return the previous state to prevent adding
						}
					}
				});
			} else if (conference === "WEST") {
				setSelectedNbaTeamsData((prevData) => {
					if (!prevData) {
						return {
							league: "NBA",
							teams: {
								east: [],
								west: [team.id],
							},
						};
					}
					const selected = prevData.teams.west.includes(team.id);

					if (selected) {
						// If the team is already selected in WEST, unselect it
						return {
							...prevData,
							teams: {
								east: prevData.teams.east,
								west: prevData.teams.west.filter(
									(id) => id !== team.id
								),
							},
						};
					} else {
						// If the team is not selected in WEST, check if we can add it
						if (prevData.teams.west.length < 8) {
							// If less than 8 teams in WEST, add the new team
							return {
								...prevData,
								teams: {
									east: prevData.teams.east,
									west: [...prevData.teams.west, team.id],
								},
							};
						} else {
							// If 8 teams already in WEST, do not add the new team
							console.log(
								"Cannot add more than 8 teams to the West conference."
							);
							return prevData; // Return the previous state to prevent adding
						}
					}
				});
			}
		} else if (league === "PBA") {
			setSelectedPbaTeamsData((prevData) => {
				if (!prevData) {
					return {
						league: "PBA",
						teams: [team.id],
					};
				}

				const selected = prevData.teams.includes(team.id);

				if (selected) {
					// If the team is already selected, unselect it
					// return prevData.teams.filter((id) => id !== team.id);
					return {
						...prevData,
						teams: prevData.teams.filter((id) => id !== team.id),
					};
				} else {
					// If the team is not selected
					if (prevData.teams.length < 8) {
						// If less than 8 teams selected
						return {
							...prevData,
							teams: [...prevData.teams, team.id],
						};
					} else {
						// If 8 teams already selected
						console.log("Cannot add more than 8 teams.");
						return prevData;
					}
				}
			});
		}
	};

	const handleCloseModalClick = () => {
		setShowAddTeamModal(false);
		setSearchTerm("");
	};

	const handleClearClick = () => {
		if (league === "NBA") {
			if (conference === "EAST") {
				setSelectedNbaTeamsData((prev) => {
					if (prev) {
						return {
							...prev,
							teams: {
								east: [],
								west: prev.teams.west,
							},
						};
					}
					return prev;
				});
			} else if (conference === "WEST") {
				setSelectedNbaTeamsData((prev) => {
					if (prev) {
						return {
							...prev,
							teams: {
								east: prev.teams.east,
								west: [],
							},
						};
					}
					return prev;
				});
			}
		} else if (league === "PBA") {
			setSelectedPbaTeamsData({
				league: "PBA",
				teams: [],
			});
		}
	};

	const handleOpenModalClick = (conference: "EAST" | "WEST" | null) => {
		setShowAddTeamModal(true);
		if (conference) {
			setConference(conference);
		}
		setSearchTerm("");
	};

	const handleSearchTermChange = (searchTerm: string) => {
		setSearchTerm(searchTerm);
	};

	const filteredNbaTeams = useMemo(() => {
		// return nbaTeams.filter(
		// 	(team) =>
		// 		team.conference === conference &&
		// 		team.name.toLowerCase().includes(searchTerm.toLowerCase())
		// );
		return nbaTeams.filter((team) => {
			// Type Guard: Check if 'team' is an NBATeamInfo
			if (team.league === "NBA") {
				// Inside this block, 'team' is now correctly inferred as NBATeamInfo
				return (
					team.conference === conference &&
					(team.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
						team.lname.toLowerCase().includes(searchTerm.toLowerCase()))
				);
			}
			// If it's not an NBA team, it shouldn't be included in filteredNbaTeams
			return false;
		});
	}, [nbaTeams, conference, searchTerm]);

	const filteredPbaTeams = useMemo(() => {
		return pbaTeams.filter((team) => {
			// Type Guard: Check if 'team' is an PBATeamInfo
			if (team.league === "PBA") {
				// Inside this block, 'team' is now correctly inferred as NBATeamInfo
				return (
					team.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
					team.lname.toLowerCase().includes(searchTerm.toLowerCase())
				);
			}
			// If it's not an PBA team, it shouldn't be included in filteredNbaTeams
			return false;
		});
	}, [pbaTeams, searchTerm]);

	const selectedNBATeams = useMemo(() => {
		//get teams from selectedNbaTeamsData and order by as per the selectedNbaTeamsData
		if (!selectedNbaTeamsData) return null;
		const eastTeams = nbaTeams
			.filter((team) => selectedNbaTeamsData.teams.east.includes(team.id))
			.sort(
				(a, b) =>
					selectedNbaTeamsData?.teams.east.indexOf(a.id) -
					selectedNbaTeamsData?.teams.east.indexOf(b.id)
			);
		const westTeams = nbaTeams
			.filter((team) => selectedNbaTeamsData?.teams.west.includes(team.id))
			.sort(
				(a, b) =>
					selectedNbaTeamsData?.teams.west.indexOf(a.id) -
					selectedNbaTeamsData?.teams.west.indexOf(b.id)
			);

		return {
			east: eastTeams,
			west: westTeams,
		};
	}, [nbaTeams, selectedNbaTeamsData]);

	const selectedPBATeams = useMemo(() => {
		if (!selectedPbaTeamsData) return null;
		return pbaTeams
			.filter((team) => selectedPbaTeamsData.teams.includes(team.id))
			.sort(
				(a, b) =>
					selectedPbaTeamsData.teams.indexOf(a.id) -
					selectedPbaTeamsData.teams.indexOf(b.id)
			);
	}, [pbaTeams, selectedPbaTeamsData]);

	const getCurrenTeamDataIndex = useCallback(
		(team: AnyTeamInfo) => {
			if (team.league === "NBA") {
				if (team.conference === "EAST") {
					if (!selectedNbaTeamsData) return null;
					const eastIndex = selectedNbaTeamsData.teams.east.indexOf(
						team.id
					);
					return eastIndex !== -1 ? eastIndex + 1 : null;
				}
				if (team.conference === "WEST") {
					if (!selectedNbaTeamsData) return null;
					const westIndex = selectedNbaTeamsData.teams.west.indexOf(
						team.id
					);
					return westIndex !== -1 ? westIndex + 1 : null;
				}
			} else if (team.league === "PBA") {
				if (!selectedPbaTeamsData) return null;
				const teamIndex = selectedPbaTeamsData.teams.indexOf(team.id);
				return teamIndex !== -1 ? teamIndex + 1 : null;
			}
			return null;
		},
		[league, selectedNbaTeamsData, selectedPbaTeamsData]
	);

	return (
		<ContentBase className="py-7 px-4">
			<div className="p-4 md:p-6 bg-gray-100 rounded-lg shadow border border-gray-400">
				<BreadCrumbs />

				<h1 className="text-lg font-bold mb-4">Edit Bracket Challenge</h1>

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

				<form onSubmit={handleSubmit}>
					<div className="md:flex gap-x-6 lg:gap-x-12 space-y-4 md:space-y-0">
						<div className="flex-1">
							{/* Example input fields */}
							<div className="mb-2">
								<label htmlFor="league" className="text-xs">
									Select League
								</label>
								<input
									type="text"
									id="league"
									value={league}
									className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									readOnly
								/>
								<p className="text-xs text-amber-700 mt-1">
									Note: The "League" input cannot be changed.
								</p>
							</div>
							<div className="mb-2">
								<label htmlFor="challengeName" className="text-xs">
									Name
								</label>
								<input
									type="text"
									id="challengeName"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									placeholder="Enter challenge name"
									required
								/>
								{fieldErrors.name && (
									<ErrorDisplay errors={fieldErrors.name} />
								)}
							</div>
							<div className="mb-2">
								<label htmlFor="description" className="text-xs">
									Description
								</label>
								<textarea
									id="description"
									className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									placeholder="Enter challenge description"
									rows={3}
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								></textarea>
								{fieldErrors.description && (
									<ErrorDisplay errors={fieldErrors.description} />
								)}
							</div>
							<div className="mb-2">
								<label htmlFor="startDate" className="text-xs">
									Start Date
								</label>
								<input
									type="date"
									id="startDate"
									value={startDate}
									onChange={(e) => setStartDate(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									required
								/>
								{fieldErrors.start_date && (
									<ErrorDisplay errors={fieldErrors.start_date} />
								)}
							</div>
							<div className="mb-2">
								<label htmlFor="endDate" className="text-xs">
									End Date
								</label>
								<input
									type="date"
									id="endDate"
									value={endDate}
									onChange={(e) => setEndDate(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									required
								/>
								{fieldErrors.end_date && (
									<ErrorDisplay errors={fieldErrors.end_date} />
								)}
							</div>
							<div className="mb-6 flex items-center text-gray-600">
								<input
									type="checkbox"
									id="is_public"
									name="is_public"
									className="w-4 h-4 me-2"
									disabled={isLoading}
									checked={isPublic}
									onChange={(e) => setIsPublic(e.target.checked)}
								/>
								<label htmlFor="is_public">Is Public</label>
							</div>
						</div>
						<div className="flex-1 lg:flex-2">
							<div className="mb-6">
								<label htmlFor="league" className="text-xs">
									Select Teams <span>(in order)</span>
								</label>
								<hr className="border-gray-400" />
								{league === "NBA" && (
									<div className="mt-2 lg:flex gap-x-4 space-y-4 lg:space-y-0">
										<div className="flex-1">
											<SelectedTeamsList
												selectedTeams={selectedNBATeams?.east || []}
												label="East Teams"
												onChangeClick={() =>
													handleOpenModalClick("EAST")
												}
											/>
											{fieldErrors["bracket_data.teams.east"] && (
												<ErrorDisplay
													errors={
														fieldErrors["bracket_data.teams.east"]
													}
												/>
											)}
										</div>
										<div className="flex-1">
											<SelectedTeamsList
												selectedTeams={selectedNBATeams?.west || []}
												label="West Teams"
												onChangeClick={() =>
													handleOpenModalClick("WEST")
												}
											/>
											{fieldErrors["bracket_data.teams.west"] && (
												<ErrorDisplay
													errors={
														fieldErrors["bracket_data.teams.west"]
													}
												/>
											)}
										</div>
									</div>
								)}
								{league === "PBA" && (
									<div className="mt-2">
										<SelectedTeamsList
											selectedTeams={selectedPBATeams || []}
											label="Teams"
											onChangeClick={() =>
												handleOpenModalClick(null)
											}
										/>
										{fieldErrors["bracket_data.teams"] && (
											<ErrorDisplay
												errors={fieldErrors["bracket_data.teams"]}
											/>
										)}
									</div>
								)}
								{league === "" && (
									<div className="w-full bg-gray-200 h-22 mt-2 flex items-center justify-center rounded border border-gray-400 shadow">
										Please select a league to set teams.
									</div>
								)}
							</div>
						</div>
					</div>
					<button
						type="submit"
						className="bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition duration-200 cursor-pointer"
					>
						UPDATE CHALLENGE
					</button>
				</form>
			</div>

			{/* Modal for selecting teams */}
			{showAddTeamModal && (
				<SelectTeamModal
					league={league}
					searchTerm={searchTerm}
					filteredNbaTeams={filteredNbaTeams}
					filteredPbaTeams={filteredPbaTeams}
					getCurrenTeamDataIndex={getCurrenTeamDataIndex}
					onSearchTermChange={handleSearchTermChange}
					onClearClick={handleClearClick}
					onClose={handleCloseModalClick}
					onTeamSelect={handleTeamSelect}
				/>
			)}
			{(isLoading || isLoadingTeamsAndLeagues) && <Loader />}
		</ContentBase>
	);
};

export default EditBracketChallenge;
