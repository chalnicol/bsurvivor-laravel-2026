import { useState } from "react";
import { useAuth } from "../../context/auth/AuthProvider";
import FormRules from "../formRules";
import { userDetailsRules } from "../../data/adminData";

const ChangePassword = () => {
	const { updatePassword, isLoading } = useAuth();

	const [currentPassword, setCurrentPassword] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");

	const resetForms = () => {
		setCurrentPassword("");
		setPassword("");
		setPasswordConfirmation("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const newResponse = await updatePassword(
			currentPassword,
			password,
			passwordConfirmation
		);
		if (newResponse) {
			resetForms();
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit} className="space-y-2">
				<div>
					<p className="font-semibold text-sm border-b py-1">
						Current Password
					</p>
					<input
						type="password"
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						className="mt-2 w-full px-3 py-1.5 rounded bg-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						// placeholder="password here"
						required
						disabled={isLoading}
					/>
				</div>
				<div>
					{/* <p className="font-semibold text-sm border-b py-1">
						New Password
					</p> */}
					<div className="flex items-center font-semibold text-sm border-b py-1 space-x-1">
						<FormRules
							colorTheme="light"
							rules={userDetailsRules.password}
						/>
						<p>New Password</p>
					</div>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="mt-2 w-full px-3 py-1.5 rounded bg-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						// placeholder="password here"
						required
						disabled={isLoading}
					/>
				</div>
				<div>
					<p className="font-semibold text-sm border-b py-1">
						Confirm New Password
					</p>
					<input
						type="password"
						value={passwordConfirmation}
						onChange={(e) => setPasswordConfirmation(e.target.value)}
						className="mt-2 w-full px-3 py-1.5 rounded bg-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						// placeholder="password here"
						required
						disabled={isLoading}
					/>
				</div>

				<div className="space-x-2 mt-6 text-sm">
					<button
						type="button"
						className={`text-white font-bold py-1.5 px-4 min-w-30 rounded transition duration-200 ${
							isLoading
								? "bg-gray-500 opacity-70"
								: "bg-gray-600 hover:bg-gray-500 cursor-pointer"
						}`}
						onClick={resetForms}
						disabled={isLoading}
					>
						RESET
					</button>

					<button
						className={`text-white font-bold py-1.5 min-w-30 rounded transition duration-200 ${
							isLoading
								? "bg-gray-500 opacity-70"
								: "bg-gray-600 hover:bg-gray-500 cursor-pointer"
						}`}
						disabled={isLoading}
					>
						SAVE
					</button>
				</div>
			</form>
		</div>
	);
};

export default ChangePassword;
