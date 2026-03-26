import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import img from "../assets/logo/square_logo.png";

interface AdminThumbsProps {
	// children: React.ReactNode;
	resource: string;
	total: number;
	description: string;
	bgColor: string;
	withAddBtn?: boolean;
}
const AdminThumbs = ({
	resource,
	total,
	description,
	bgColor,
	withAddBtn,
}: AdminThumbsProps) => {
	// const backgroundClr: string = `bg-orange-100`;

	const backgroundClr = () => {
		switch (bgColor) {
			case "orange":
				return "bg-orange-100";
			case "blue":
				return "bg-blue-100";
			case "green":
				return "bg-green-100";
			case "yellow":
				return "bg-yellow-100";
			case "cyan":
				return "bg-cyan-100";
			default:
				return "bg-gray-100";
		}
		// return "bg-gray-200";
	};

	//capitalize first letter
	const capitalizeEachWord = (str: string) => {
		//remove
		const split = str.split("-");
		const capitalized = split.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		});
		return capitalized.join(" ");
	};

	return (
		<div
			className={`p-3 border rounded-lg shadow border-gray-400 flex flex-col overflow-hidden relative ${backgroundClr()}`}
		>
			<img
				src={img}
				alt="bgimg"
				draggable="false"
				className="absolute w-40 -right-8 -top-5 opacity-10 rotate-40"
			/>
			<div>
				<h2 className="font-semibold">
					{capitalizeEachWord(resource)} ({total})
				</h2>
				<p className="text-sm text-gray-500">{description}</p>
			</div>

			<div className="flex-1"></div>
			<div className="mt-5 space-x-2 flex">
				<Link
					to={`/admin/${resource}`}
					className="mt-2 cursor-pointer hover:bg-gray-700 bg-gray-800 text-white rounded px-3 py-1 text-xs font-bold block min-w-28 text-center flex-none"
				>
					VIEW LIST
				</Link>
				{withAddBtn && (
					<Link
						to={`/admin/${resource}/create`}
						className="mt-2 cursor-pointer hover:bg-red-700 bg-red-800 text-white rounded px-3 py-1 text-xs font-bold block min-w-24 text-center flex-none"
					>
						<FontAwesomeIcon icon="plus" className="me-1" />
						NEW
					</Link>
				)}
			</div>
		</div>
	);
};

export default AdminThumbs;
