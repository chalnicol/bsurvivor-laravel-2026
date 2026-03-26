import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/AuthProvider";
import FormRules from "../formRules";
import { userDetailsRules } from "../../data/adminData";

const EditInfo = () => {
	const { user, isLoading, updateProfile } = useAuth();
	// const navigate = useNavigate();
	const [username, setUsername] = useState<string>("");
	const [fullname, setFullName] = useState<string>("");
	const [email, setEmail] = useState<string>("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await updateProfile(username, email, fullname);
	};

	const resetForms = () => {
		if (user) {
			setEmail(user.email);
			setUsername(user.username);
			setFullName(user.fullname);
		}
	};

	useEffect(() => {
		resetForms();
	}, [user]);

	if (!user) {
		return null;
	}

	return (
		<div>
			<form className="space-y-2" onSubmit={handleSubmit}>
				<div>
					<div className="flex items-center font-semibold text-sm border-b py-1 space-x-1">
						<FormRules
							colorTheme="light"
							rules={userDetailsRules.fullname}
						/>
						<p>Full Name</p>
					</div>

					<input
						type="text"
						value={fullname}
						onChange={(e) => setFullName(e.target.value)}
						className="mt-2 w-full px-3 py-1.5 rounded bg-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						placeholder="full name here"
						required
						disabled={isLoading}
					/>
				</div>
				<div>
					<div className="flex items-center font-semibold text-sm border-b py-1 space-x-1">
						<FormRules
							colorTheme="light"
							rules={userDetailsRules.username}
						/>
						<p>Username</p>
					</div>

					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="mt-2 w-full px-3 py-1.5 rounded bg-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						placeholder="username here"
						required
						disabled={isLoading}
					/>
				</div>
				<div>
					<div className="flex items-center font-semibold text-sm border-b py-1 space-x-1">
						<FormRules
							colorTheme="light"
							rules={userDetailsRules.email}
						/>
						<p>E-mail</p>
					</div>
					<input
						type="text"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="mt-2 w-full px-3 py-1.5 rounded bg-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						placeholder="username here"
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

export default EditInfo;
