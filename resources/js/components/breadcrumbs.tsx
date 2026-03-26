import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// You'll need to import the icon you're using if you haven't already globally
// For example: import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
// And then add it to the library: library.add(faCaretRight);

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface PathInfo {
	str: string;
	link: string;
}

const BreadCrumbs = () => {
	const location = useLocation();
	const [links, setLinks] = useState<PathInfo[]>([]);

	useEffect(() => {
		// Split pathname and remove any empty strings from the array (e.g., from leading/trailing slashes)
		const pathSegments = location.pathname.split("/").filter(Boolean);

		let breadcrumbPath: PathInfo[] = [];
		let currentLink = "";

		// Always add a "Home" breadcrumb for the root
		// breadcrumbPath.push({
		// 	str: "Home",
		// 	link: "/",
		// });

		pathSegments.forEach((segment) => {
			// Build the full link for the current segment
			currentLink += `/${segment}`;

			// Format the segment for display (e.g., 'bracket-challenges' -> 'Bracket Challenges')
			const formattedSegment = segment
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");

			breadcrumbPath.push({
				str: formattedSegment,
				link: currentLink,
			});
		});

		setLinks(breadcrumbPath);
	}, [location.pathname]); // IMPORTANT: Add location.pathname as a dependency

	return (
		<div className="text-xs space-x-1.5 mb-1">
			{links.map((item, index) => (
				<div key={index} className="inline-flex items-center space-x-1">
					{/* Check if it's the last item */}
					{index < links.length - 1 ? (
						<>
							<Link to={item.link} className="underline">
								{item.str}
							</Link>
							{/* Only show separator if it's not the last item */}
							<FontAwesomeIcon icon="caret-right" size="sm" />
						</>
					) : (
						// Last item, not a link
						<span>{item.str}</span>
					)}
				</div>
			))}
		</div>
	);
};

export default BreadCrumbs;
