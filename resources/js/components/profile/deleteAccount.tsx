import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const DeleteAccount = () => {
	const { deleteAccount, isLoading, hasRole } = useAuth();
	const navigate = useNavigate();
	const [showConfirmation, setShowConfirmation] = useState(false);

	const confirmRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (showConfirmation && confirmRef.current) {
			gsap.fromTo(
				confirmRef.current,
				{ height: 0 },
				{
					height: "auto",
					duration: 0.5,
					ease: "elastic.out(1, 0.8)",
					transformOrigin: "50% 0",
				}
			);
		}
		return () => {
			if (confirmRef.current) {
				gsap.killTweensOf(confirmRef.current);
			}
		};
	}, [showConfirmation]);

	const handleDeleteClick = () => {
		setShowConfirmation(true); // Show the confirmation dialog
	};

	const handleConfirmDelete = async () => {
		const success = await deleteAccount();
		if (success) {
			navigate("/login");
		}
		setShowConfirmation(false); // Hide confirmation dialog regardless of success/failure
	};

	if (hasRole("admin")) {
		return (
			<div className="bg-gray-600 flex items-center justify-center h-20 rounded">
				You are not allowed to delete your account.
			</div>
		);
	}

	return (
		<div>
			<p>Deleting your account is permanent and cannot be undone.</p>
			<hr className="my-3" />
			{showConfirmation ? (
				<div
					ref={confirmRef}
					className="px-4 py-3 bg-gray-600 rounded text-white shadow overflow-hidden"
				>
					<p>Are you absolutely sure you want to delete your account?</p>
					<div className="space-x-2 mt-3">
						<button
							className={`px-4 py-1 rounded text-white font-bold  ${
								isLoading
									? "bg-amber-300 opacity-70"
									: "bg-amber-500 hover:bg-amber-400 cursor-pointer"
							}`}
							onClick={() => setShowConfirmation(false)}
							disabled={isLoading}
						>
							CANCEL
						</button>
						<button
							className={`px-4 py-1 rounded text-white font-bold  ${
								isLoading
									? "bg-red-400 opacity-70"
									: "bg-red-500 hover:bg-red-400 cursor-pointer"
							}`}
							onClick={handleConfirmDelete}
							disabled={isLoading}
						>
							DELETE
						</button>
					</div>
				</div>
			) : (
				<button
					className={`px-4 py-2 rounded text-white font-bold  ${
						isLoading
							? "bg-red-400 opacity-70"
							: "bg-red-600 hover:bg-red-500 cursor-pointer"
					}`}
					onClick={handleDeleteClick}
					disabled={isLoading}
				>
					DELETE ACCOUNT
				</button>
			)}
		</div>
	);
};

export default DeleteAccount;
