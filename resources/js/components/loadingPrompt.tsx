import Icon from "./icon";

interface LoadingPromptProps {
	prompt?: string;
	size?: "sm" | "lg" | "xl";
}

const LoadingPrompt = ({ prompt, size }: LoadingPromptProps) => {
	const getWidthClass = () => {
		switch (size) {
			case "sm":
				return "w-32 rounded";
			case "lg":
				return "w-56 rounded-lg";
			case "xl":
				return "w-68 rounded-lg";
			default:
				return "w-44 rounded";
		}
	};

	return (
		<div className={`px-3 py-1.5 ${getWidthClass()}`}>
			<Icon className="w-full object-contain mx-auto animate-bounce" />
			<div className="flex items-center justify-center gap-x-2 border border-gray-300 py-2 rounded">
				<div className="border-3 w-4 h-4 rounded-full border-white border-t-gray-500 animate-spin"></div>
				<p className="text-white font-semibold">{prompt || "LOADING"}</p>
			</div>
		</div>
	);
};

export default LoadingPrompt;
