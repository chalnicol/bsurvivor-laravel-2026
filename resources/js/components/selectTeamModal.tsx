import ModalBase from "./modalBase";
import type { AnyTeamInfo } from "../data/adminData";

interface SelectTeamModalProps {
	league: string;
	searchTerm: string;
	filteredNbaTeams: AnyTeamInfo[];
	filteredPbaTeams: AnyTeamInfo[];
	onClose: () => void;
	onClearClick: () => void;
	onTeamSelect: (team: AnyTeamInfo) => void;
	onSearchTermChange: (searchTerm: string) => void;
	getCurrenTeamDataIndex: (team: AnyTeamInfo) => number | null;
}
const SelectTeamModal = ({
	league,
	searchTerm,
	filteredNbaTeams,
	filteredPbaTeams,
	getCurrenTeamDataIndex,
	onSearchTermChange,
	onClearClick,
	onClose,
	onTeamSelect,
}: SelectTeamModalProps) => {
	return (
		<ModalBase>
			<div className="w-11/12 max-w-xl bg-white m-auto border border-gray-300 rounded-lg p-4 shadow-lg relative">
				<button
					className="absolute top-5 right-5 border rounded font-bold bg-amber-600 text-white px-1.5 py-0.5 text-xs cursor-pointer hover:bg-amber-500 cursor-pointer"
					onClick={onClose}
				>
					CLOSE
				</button>
				<h4 className="font-semibold text-lg">Select Teams</h4>
				<div>
					<input
						type="search"
						id="search"
						className="border rounded border-gray-400 w-full px-3 py-2 mt-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
						placeholder="Search team..."
						value={searchTerm}
						onChange={(e) => onSearchTermChange(e.target.value)}
						autoComplete="off"
					/>
				</div>
				<div className="border border-gray-400 bg-gray-300 h-50 mt-2 overflow-y-scroll">
					{/* <p className="p-2">this is the content...</p> */}
					{league === "NBA" &&
						filteredNbaTeams.map((team) => (
							<div
								key={team.id}
								className="p-2 border-b border-gray-300 even:bg-gray-100 odd:bg-white hover:bg-blue-100 cursor-pointer text-sm flex items-center"
								onClick={() => onTeamSelect(team)}
							>
								<span className="flex-1">
									{team.fname} {team.lname}
								</span>

								{getCurrenTeamDataIndex(team) && (
									<div className="w-7 h-4 rounded-full bg-gray-600 text-xs text-white font-semibold text-center leading-4">
										{getCurrenTeamDataIndex(team)}
									</div>
								)}
							</div>
						))}
					{league === "PBA" &&
						filteredPbaTeams.map((team) => (
							<div
								key={team.id}
								className="p-2 border-b border-gray-300 even:bg-gray-100 odd:bg-white  hover:bg-blue-100 cursor-pointer text-sm flex items-center"
								onClick={() => onTeamSelect(team)}
							>
								<span className="flex-1">
									{team.fname} {team.lname}
								</span>

								{getCurrenTeamDataIndex(team) && (
									<div className="w-7 h-4 rounded-full bg-gray-600 text-xs text-white font-semibold text-center leading-4">
										{getCurrenTeamDataIndex(team)}
									</div>
								)}
							</div>
						))}
				</div>
				<div className="space-x-2">
					<button
						className="p-2 bg-red-600 text-white text-sm mt-3 w-26 rounded cursor-pointer font-bold hover:bg-red-600 transition duration-200"
						onClick={onClearClick}
					>
						CLEAR
					</button>

					<button
						className="p-2 bg-gray-700 text-white text-sm mt-3 w-26 rounded cursor-pointer font-bold hover:bg-gray-600 transition duration-200"
						onClick={onClose}
					>
						DONE
					</button>
				</div>
			</div>
		</ModalBase>
	);
};
export default SelectTeamModal;
