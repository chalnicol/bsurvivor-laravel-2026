import { useEffect, useState } from "react";
import CustomButton from "./customButton";
import type { ColorType } from "../data/adminData";

interface RefreshButtonProps {
	children: React.ReactNode;
	delay?: number;
	size?: "sm" | "lg" | "xl";
	color?: ColorType;
	onClick: () => void;
	disabled?: boolean;
	className?: string;
}
const RefreshButton = ({
	children,
	delay,
	color,
	size,
	className,
	disabled,
	onClick,
}: RefreshButtonProps) => {
	const [isDisabled, setIsDisabled] = useState<boolean>(false);

	const timeDelay = delay ? delay : 10;

	const addedProps = { className, size, color };

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (isDisabled) {
			timer = setTimeout(() => setIsDisabled(false), timeDelay * 1000);
		}
		return () => {
			clearTimeout(timer);
		};
	}, [isDisabled]);

	const handleClick = () => {
		onClick();
		setIsDisabled(true);
	};

	return (
		<CustomButton
			{...addedProps}
			onClick={handleClick}
			disabled={disabled || isDisabled}
		>
			{children}
		</CustomButton>
	);
};
export default RefreshButton;
