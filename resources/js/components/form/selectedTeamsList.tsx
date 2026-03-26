import type { AnyTeamInfo } from "../../data/adminData";

interface SelectedTeamsListProps {
	label: string;
	selectedTeams: AnyTeamInfo[];
	// onChangeClick: (conference: "EAST" | "WEST" | null) => void;
	onChangeClick: () => void;
	className?: string;
}

const SelectedTeamsList = ({
	label,
	selectedTeams,
	onChangeClick,
	className,
}: SelectedTeamsListProps) => {
	const teamLengthString: string =
		selectedTeams.length > 0 ? `(${selectedTeams.length})` : "";
	return (
		<div className={`border border-gray-300 shadow ${className}`}>
			<div className="flex items-center justify-between font-bold text-xs bg-gray-700 text-white p-2">
				<h3>
					{label} {teamLengthString}
				</h3>
				<button
					type="button"
					className="px-2 py-0.5 border rounded cursor-pointer hover:bg-gray-600"
					onClick={onChangeClick}
				>
					Change
				</button>
			</div>
			<div className="h-45 lg:h-72 overflow-y-auto">
				{selectedTeams.length > 0 ? (
					selectedTeams.map((team, index) => (
						<div
							key={index}
							className="p-2 even:bg-gray-200 odd:bg-gray-100 text-sm"
						>
							{index + 1}. {team.fname} {team.lname}
						</div>
					))
				) : (
					<p className="p-3 text-sm text-gray-500">No teams selected</p>
				)}
			</div>
		</div>
	);
};

export default SelectedTeamsList;
