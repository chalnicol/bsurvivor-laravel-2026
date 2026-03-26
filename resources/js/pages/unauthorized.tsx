import React from "react";
import { Link } from "react-router-dom";
import ContentBase from "../components/contentBase";

const Unauthorized: React.FC = () => {
	return (
		<>
			<title>{`UNAUTHORIZED | ${import.meta.env.VITE_APP_NAME}`}</title>
			<ContentBase className="px-4 py-6">
				<div className="rounded p-3 mb-4 bg-gray-800 h-50 text-white flex justify-center items-center space-x-4">
					<div className="text-center">
						<h1 className="text-3xl lg:text-5xl font-bold">401</h1>
						<h2 className="text-lg font-semibold">Unathorized</h2>
						<hr className="my-3" />
						<p className="text-center">
							You are not allowed to view this page. Go to{" "}
							<Link to="/" className="underline">
								Home
							</Link>
						</p>
					</div>
				</div>
			</ContentBase>
		</>
	);
};

export default Unauthorized;
