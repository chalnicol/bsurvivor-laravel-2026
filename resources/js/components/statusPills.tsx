interface StatusPillsProps {
	status: string;
}
const StatusPills = ({ status }: StatusPillsProps) => {
	const bgClass = (): string => {
		switch (status) {
			case "won":
				return "bg-green-600";
			case "eliminated":
				return "bg-red-600";
			case "active":
				return "bg-blue-600";
			default:
				return "bg-gray-600";
		}
	};

	return (
		<span
			className={`text-xs font-bold select-none rounded px-2 text-white ${bgClass()}`}
		>
			{status.toLocaleUpperCase()}
		</span>
	);
};

export default StatusPills;
