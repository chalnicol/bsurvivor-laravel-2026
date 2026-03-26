import { useBracket } from "../../context/bracket/BracketProvider";
import { useAuth } from "../../context/auth/AuthProvider";
import Conference from "./conference";
import Finals from "./finals";
import StatusMessage from "../statusMessage";
import { Link } from "react-router-dom";
import { useRef } from "react";
import LoadingPrompt from "../loadingPrompt";

const Bracket = () => {
	const { isAuthenticated } = useAuth();
	const { league } = useBracket();

	const {
		error,
		success,
		isLoading,
		mode,
		// isActive,
		submitSuccess,
		hasProgressed,
		hasPredictions,
		previewState,
		toggleBracket,
		resetMessage,
		refreshBracket,
		updateBracket,
		submitPicks,
		resetBracket,
	} = useBracket();

	const bracketRef = useRef(null);

	const handleSubmit = () => {
		if (!isAuthenticated) return;
		submitPicks();
	};

	return (
		<>
			{error && (
				<StatusMessage
					message={error}
					type="error"
					onClose={resetMessage}
				/>
			)}
			{success && (
				<StatusMessage
					message={success}
					type="success"
					onClose={resetMessage}
				/>
			)}
			{submitSuccess && (
				<StatusMessage
					message={submitSuccess}
					type="success"
					fixed={true}
					onClose={resetMessage}
				>
					<Link
						to="/entries"
						className="text-white bg-green-900 hover:bg-green-800 rounded px-3 py-1 text-xs"
					>
						VIEW MY ENTRIES PAGE
					</Link>
				</StatusMessage>
			)}

			<div className="w-full rounded relative text-black select-none">
				<div ref={bracketRef} className="overflow-x-auto thin-scrollbar">
					{league == "NBA" && (
						<div className="flex gap-x-6 items-center min-w-4xl mb-3">
							<Conference
								league={"NBA"}
								conference={"EAST"}
								className="flex-1"
							/>
							<Finals league="NBA" className="flex-none" />
							<Conference
								league={"NBA"}
								conference={"WEST"}
								className="flex-1"
							/>
						</div>
					)}
					{league == "PBA" && (
						<div className="flex items-center sm:justify-center gap-x-4 mb-3">
							<Conference league="PBA" className="max-w-lg flex-none" />
							<Finals league="PBA" className="flex-none" />
						</div>
					)}
				</div>
				{isLoading && (
					<div className="absolute top-0 left-0 w-full h-full bg-gray-900/70 flex items-center justify-center">
						<LoadingPrompt prompt="SAVING" size="sm" />
					</div>
				)}
			</div>

			{mode == "submit" && !hasProgressed && (
				<>
					<hr className="my-2 border-gray-400" />
					<div className="flex items-center space-x-2 mt-3">
						<button
							className={`px-3 py-2 text-white min-w-30 rounded font-bold transition duration-200 ${
								isLoading
									? "bg-rose-400 opacity-70"
									: " bg-rose-600 hover:bg-rose-500 cursor-pointer"
							}`}
							onClick={resetBracket}
							disabled={isLoading}
						>
							RESET
						</button>
						{isAuthenticated && (
							<button
								className={`px-3 py-2 text-white min-w-30 rounded font-bold transition duration-200 ${
									isLoading
										? "bg-sky-400 opacity-70"
										: "bg-sky-600 hover:bg-sky-500 cursor-pointer"
								}`}
								onClick={handleSubmit}
								disabled={isLoading}
							>
								SUBMIT PICKS
							</button>
						)}
					</div>
				</>
			)}
			{mode == "update" && (
				<>
					<hr className="my-2 border-gray-400" />
					<div className="flex items-center space-x-2 mt-3">
						<button
							className={`px-3 py-2 text-white flex-1 w-full sm:flex-none sm:w-auto sm:min-w-30 rounded font-bold transition duration-200 ${
								isLoading
									? "bg-orange-400 opacity-70"
									: " bg-orange-600 hover:bg-orange-500 cursor-pointer"
							}`}
							onClick={resetBracket}
							disabled={isLoading}
						>
							RESET BRACKET
						</button>
						{hasProgressed && (
							<button
								className={`px-3 py-2 text-white flex-1 w-full sm:flex-none sm:w-auto sm:min-w-30 rounded font-bold transition duration-200 ${
									isLoading
										? "bg-blue-400 opacity-70"
										: " bg-blue-600 hover:bg-blue-500 cursor-pointer"
								}`}
								onClick={refreshBracket}
								disabled={isLoading}
							>
								REVERT TO SAVED
							</button>
						)}
						<button
							className={`px-3 py-2 text-white flex-1 w-full sm:flex-none sm:w-auto sm:min-w-30 rounded font-bold transition duration-200 ${
								isLoading
									? "bg-green-400 opacity-70"
									: "bg-green-600 hover:bg-green-500 cursor-pointer"
							}`}
							onClick={updateBracket}
							disabled={isLoading}
						>
							UPDATE BRACKET
						</button>
					</div>
				</>
			)}
			{mode == "preview" && hasPredictions && (
				<>
					<hr className="my-2 border-gray-400" />
					{/* legend */}
					<div className="md:flex items-center justify-between space-y-3 md:space-y-0">
						<div className="flex-none grid grid-cols-2 justify-end md:order-2 gap-x-4">
							<div className="flex items-center gap-x-2">
								<div className="w-3 h-auto aspect-square bg-green-600 flex-none border border-green-500"></div>
								<span className="font-semibold">CORRECT PICK</span>
							</div>

							<div className="flex items-center gap-x-2">
								<div className="w-3 h-auto aspect-square bg-red-700 flex-none border border-red-600"></div>
								<span className="font-semibold">WRONG PICK</span>
							</div>

							<div className="flex items-center gap-x-2">
								<div className="w-3 h-auto aspect-square bg-yellow-800 flex-none border border-yellow-700"></div>
								<span className="font-semibold">INVALID PICK</span>
							</div>

							<div className="flex items-center gap-x-2">
								<div className="w-3 h-auto aspect-square bg-yellow-600 flex-none border border-yellow-500"></div>
								<span className="font-semibold">PICKED/ADVANCED</span>
							</div>
						</div>

						<button
							className={`flex-none cursor-pointer w-full md:w-65 px-3 py-2 rounded text-white font-bold md:order-1 ${
								previewState == "entry"
									? "bg-sky-600 hover:bg-sky-500"
									: "bg-green-600 hover:bg-green-500"
							}`}
							onClick={toggleBracket}
						>
							{/* {previewState === "entry"
								? "TOGGLE CHALLENGE RESULTS/ENTRY"
								: "VIEW BRACKET CHALLENGE ENTRY"} */}
							TOGGLE CHALLENGE RESULTS/ENTRY
						</button>
					</div>
				</>
			)}
		</>
	);
};

export default Bracket;
