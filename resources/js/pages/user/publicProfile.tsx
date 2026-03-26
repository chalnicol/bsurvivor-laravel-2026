import { useParams } from "react-router-dom";

import ContentBase from "../../components/contentBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EndOfPage from "../../components/endOfPage";
import { useEffect, useState } from "react";
import type {
	BracketChallengeEntryInfo,
	ColorType,
	UserMiniInfo,
} from "../../data/adminData";
import apiClient from "../../utils/axiosConfig";
import { Link } from "react-router-dom";
import Detail from "../../components/detail";
import StatusPills from "../../components/statusPills";
import Loader from "../../components/loader";
import CustomButton from "../../components/customButton";
import StatusMessage from "../../components/statusMessage";
// import LoadAuth from "../../components/auth/loadAuth";
import { useAuth } from "../../context/auth/AuthProvider";

interface FriendsButtonInfo {
	label: string;
	color: ColorType;
	action: string;
}

interface FriendsInfo {
	buttons: FriendsButtonInfo[];
	info: string;
}
interface FriendsType {
	[key: string]: FriendsInfo;
}

const PublicProfile = () => {
	const { authLoading } = useAuth();

	const { username } = useParams<{ username: string }>();

	const [user, setUser] = useState<UserMiniInfo | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	// const [isProcessing, setIsProcessing] = useState(false);

	const [entries, setEntries] = useState<BracketChallengeEntryInfo[]>([]);
	const [friendshipStatus, setFriendshipStatus] = useState<string | null>(
		null
	);
	const [info, setInfo] = useState<string | null>(null);
	const [buttons, setButtons] = useState<FriendsButtonInfo[]>([]);

	const fetchUser = async () => {
		setIsLoading(true);
		try {
			const response = await apiClient.get(
				`/user/profile?username=${username}`
			);
			// console.log(response.data);
			const { user, entries, friendshipStatus } = response.data;
			setFriendshipStatus(friendshipStatus);
			setUser(user);
			setEntries(entries);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const friendQuery = async (action: string, user: UserMiniInfo) => {
		setIsLoading(true);
		try {
			await apiClient.post("/user/friends", {
				user_id: user.id,
				action: action,
			});
			// setFriends(response.data.friends);
			if (action == "add") {
				setFriendshipStatus("pending_sent");
			} else if (action == "accept") {
				setFriendshipStatus("friends");
			} else {
				setFriendshipStatus("none");
			}
		} catch (error: any) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (authLoading) return;
		fetchUser();
	}, [username, authLoading]);

	useEffect(() => {
		if (!friendshipStatus) return;
		if (friendshipStatus == "not_authenticated") return;
		setInfo(friendship[friendshipStatus].info);
		setButtons(friendship[friendshipStatus].buttons);
	}, [friendshipStatus]);

	const friendship: FriendsType = {
		not_friends: {
			buttons: [{ label: "ADD FRIEND", color: "blue", action: "add" }],
			info: "You are not friends with this user.",
		},
		friends: {
			buttons: [{ label: "UNFRIEND", color: "red", action: "remove" }],
			info: "You are friends with this user.",
		},
		pending_sent: {
			buttons: [{ label: "CANCEL", color: "amber", action: "cancel" }],
			info: "You have sent a friend request to this user.",
		},
		pending_received: {
			buttons: [
				{ label: "ACCEPT", color: "green", action: "accept" },
				{ label: "REJECT", color: "red", action: "reject" },
			],
			info: "You have pending friend request from this user.",
		},
		me: {
			buttons: [],
			info: "You are viewing your own profile.",
		},
	};

	// if (authLoading) {
	// 	return <LoadAuth />;
	// }

	return (
		<>
			<title>{`${user ? user.fullname : ""} | ${
				import.meta.env.VITE_APP_NAME
			}`}</title>

			<ContentBase className="px-4 py-7">
				<div className="p-3 bg-gray-100 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
					<h1 className="text-xl font-bold flex-1">
						<FontAwesomeIcon icon="caret-right" /> User Profile
					</h1>
					<p className="text-sm font-medium my-1">
						View user profile information.
					</p>

					{user ? (
						<div className="mt-5">
							{info && (
								<StatusMessage
									message={info}
									type="info"
									fixed={true}
									onClose={() => setInfo(null)}
								>
									{buttons.map((btn) => (
										<CustomButton
											key={btn.action}
											color={btn.color}
											onClick={() => friendQuery(btn.action, user)}
											size="sm"
											className="px-4"
											disabled={isLoading}
										>
											{btn.label.toUpperCase()}
										</CustomButton>
										// <button className="text-sm bg-gray-500 px-2 rounded text-white hover:bg-gray-600 font-semibold">
										// 	{btn.label.toUpperCase()}
										// </button>
									))}
								</StatusMessage>
							)}

							<div className="bg-gray-800 text-white p-4 mt-2 rounded">
								<div className="sm:flex gap-x-4">
									<div className="flex-none">
										<div className="w-18 mx-auto aspect-square border-2 border-gray-400 text-gray-400 rounded-full shadow-lg overflow-hidden flex items-center justify-center">
											<FontAwesomeIcon icon="user" size="2xl" />
										</div>
									</div>
									<div className="flex-1 space-y-2">
										<div>
											<p className="font-semibold text-xs border-gray-300 py-1">
												Username
											</p>
											<p className="py-1.5 px-3 rounded bg-gray-600">
												{user.username}
											</p>
										</div>
										<div>
											<p className="font-semibold text-xs border-gray-300 py-1">
												Full Name
											</p>
											<p className="py-1.5 px-3 rounded bg-gray-600">
												{user.fullname}
											</p>
										</div>

										{/* top entries */}
										<div className="my-4 overflow-x-hidden">
											<div className="min-w-sm">
												<p className="font-semibold text-sm py-1">
													Top Bracket Challenge Entries
												</p>

												{entries.length > 0 ? (
													<div className="space-y-1 mt-2">
														{entries.map((entry, index) => (
															<Link
																key={entry.id}
																to={`/bracket-challenge-entries/${entry.slug}`}
																className="border-t last:border-b border-gray-500 hover:bg-gray-700  block flex items-center gap-x-3 py-1"
															>
																<p className="text-2xl md:text-xl font-bold w-10 text-center">
																	0{index + 1}
																</p>
																<div className="flex-1 grid md:grid-cols-2 xl:grid-cols-3 text-sm gap-y-1">
																	<Detail label="Bracket Challenge">
																		{
																			entry.bracket_challenge
																				.name
																		}
																	</Detail>

																	<Detail label="Correct Picks Count">
																		{
																			entry.correct_predictions_count
																		}
																	</Detail>

																	<Detail label="Status">
																		<StatusPills
																			status={entry.status}
																		/>
																	</Detail>
																</div>
															</Link>
														))}
													</div>
												) : (
													<p className="py-1.5 border-t border-gray-400 text-gray-300 mt-0.5">
														No bracket challenge entries found.
													</p>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					) : (
						<p className="mt-4 bg-gray-300 px-3 py-2 rounded">
							{isLoading
								? "Fetching user information."
								: "User not found."}
						</p>
					)}
				</div>
				{isLoading && <Loader />}
				<EndOfPage />
			</ContentBase>
		</>
	);
};

export default PublicProfile;
