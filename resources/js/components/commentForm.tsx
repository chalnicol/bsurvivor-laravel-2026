import { useEffect, useRef } from "react";
import gsap from "gsap";

interface CommentFormProps {
	textValue: string;
	isLoading: boolean;
	placeholderText?: string;
	btnSizes?: "sm" | "lg";
	btnSubmitLabel?: string;
	className?: string;
	onSubmit: () => void;
	onCancel: () => void;
	onChange: (textValue: string) => void;
}

const CommentForm = ({
	textValue,
	isLoading,
	btnSizes,
	btnSubmitLabel,
	placeholderText,
	className,
	onChange,
	onSubmit,
	onCancel,
}: CommentFormProps) => {
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const contRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, [inputRef.current]);

	useEffect(() => {
		if (contRef.current) {
			gsap.fromTo(
				contRef.current,
				{ height: 0 },
				{ height: "auto", duration: 0.3, ease: "power4.out" }
			);
		}
		return () => {
			if (contRef.current) {
				gsap.killTweensOf(contRef.current);
			}
		};
	}, []);

	const closeAnim = () => {
		if (contRef.current) {
			gsap.to(contRef.current, {
				height: 0,
				duration: 0.3,
				ease: "power4.in",
				onComplete: onCancel,
			});
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit();
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();

			event.currentTarget.form?.dispatchEvent(
				new Event("submit", { cancelable: true, bubbles: true })
			);
		}
	};

	const btnClass = (): string => {
		switch (btnSizes) {
			case "sm":
				return "text-xs px-3 py-0.5";
			case "lg":
				return "px-5 py-1";
			default:
				return "px-5 py-1";
		}
	};

	return (
		<div ref={contRef} className={`overflow-hidden bg-red-50 ${className}`}>
			<form
				onSubmit={handleSubmit}
				className={btnSizes == "sm" ? "space-y-1" : "space-y-1.5"}
			>
				<textarea
					ref={inputRef}
					value={textValue}
					className="rounded border border-gray-400 bg-gray-200 placeholder:text-gray-500 w-full px-3 py-1 text-sm md:text-base focus:outline-none focus:ring-gray-400 focus:border-gray-400 block"
					onKeyDown={handleKeyDown}
					onChange={(e) => onChange(e.target.value)}
					placeholder={
						placeholderText ? placeholderText : "input comment here"
					}
					required
				/>
				<div
					className={`${btnSizes == "sm" ? "space-x-1" : "space-x-1.5"}`}
				>
					<button
						type="button"
						className={`text-white rounded text-sm font-bold ${btnClass()} ${
							isLoading
								? "bg-rose-500 opacity-50"
								: "bg-rose-600 hover:bg-rose-500 cursor-pointer"
						}`}
						onClick={closeAnim}
						disabled={isLoading}
					>
						CANCEL
					</button>

					<button
						className={`text-white rounded text-sm font-bold ${btnClass()} ${
							isLoading
								? "bg-blue-400 opacity-50"
								: "bg-blue-500 hover:bg-blue-400 cursor-pointer"
						}`}
						disabled={isLoading}
					>
						{btnSubmitLabel ? btnSubmitLabel : "SUBMIT"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default CommentForm;
