const RolesPills = ({ roles }: { roles: string[] }) => {
	return (
		<>
			{roles.length > 0 ? (
				roles.map((role) => (
					<span
						key={role}
						className="border border-gray-400 bg-white font-semibold shadow text-xs px-2 rounded"
					>
						{role}
					</span>
				))
			) : (
				<p>--</p>
			)}
		</>
	);
};
export default RolesPills;
