import { Link } from "react-router-dom";
import type { BracketChallengeEntryInfo } from "../../data/adminData";
import Detail from "../detail";
import { displayLocalDate } from "../../utils/dateTime";
import StatusPills from "../statusPills";

interface BracketEntrySlotProps {
	entry: BracketChallengeEntryInfo;
}
const BracketEntrySlot = ({ entry }: BracketEntrySlotProps) => {
	return (
		<Link to={`/bracket-challenge-entries/${entry.slug}`} key={entry.id}>
			<div className="sm:grid md:grid-cols-2 lg:grid-cols-3 px-3 py-2 space-y-1 border hover:bg-gray-700 mb-1 text-sm bg-gray-800 text-white rounded">
				<Detail label="Entry Name">{entry.name}</Detail>
				<Detail label="League">{entry.bracket_challenge.league}</Detail>
				<Detail label="Bracket Challenge">
					{entry.bracket_challenge.name}
				</Detail>

				<Detail label="Date Submitted">
					{displayLocalDate(entry.created_at)}
				</Detail>
				<Detail label="Status">
					<StatusPills status={entry.status} />
				</Detail>
			</div>
		</Link>
	);
};

export default BracketEntrySlot;
