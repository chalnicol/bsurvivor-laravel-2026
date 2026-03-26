interface SpinnerProps {
	alignment?: "horizontal" | "vertical";
	size?: "xs" | "sm" | "lg";
	colorTheme?: "light" | "dark";
	text?: string;
}
const Spinner = ({ text, alignment, size, colorTheme }: SpinnerProps) => {
	const getAlignmentClass = () => {
		switch (alignment) {
			case "horizontal":
				return "flex items-center gap-x-1";
			default:
				return "flex flex-col items-center gap-y-1";
		}
	};

	const getSpinnerSizeClass = () => {
		switch (size) {
			case "xs":
				return "w-5 h-5 border-4";
			case "sm":
				return "w-6 h-6 border-5";
			case "lg":
				return "w-8 h-8 border-7";
			default:
				return "w-7 h-7 border-6";
		}
	};

	const getTextSizeClass = () => {
		switch (size) {
			case "xs":
				return "text-xs font-semibold ";
			case "sm":
				return "text-sm font-semibold ";
			case "lg":
				return "text-lg font-bold";
			default:
				return "font-semibold";
		}
	};

	const getSpinnerColorClass = () => {
		switch (colorTheme) {
			case "light":
				return "border border-gray-400 border-t-gray-600";
			case "dark":
				return "border border-gray-600 border-t-gray-400";
			default:
				return "border border-gray-200 border-t-gray-400";
		}
	};

	const getTextColorClass = () => {
		switch (colorTheme) {
			case "light":
				return "text-gray-200";
			case "dark":
				return "text-gray-800";
			default:
				return "text-gray-200";
		}
	};

	return (
		<div className={`w-full h-full flex items-center justify-center`}>
			<div className={`${getAlignmentClass()}`}>
				<div
					className={`rounded-full animate-spin ${getSpinnerColorClass()} ${getSpinnerSizeClass()}`}
				></div>
				<div
					className={`block ${getTextColorClass()} ${getTextSizeClass()}`}
				>
					{text ? text : "LOADING"}
				</div>
			</div>
		</div>
	);
};
export default Spinner;
