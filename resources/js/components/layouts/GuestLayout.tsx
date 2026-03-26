import Navbar from "../navbar";

interface AuthenticatedLayoutProps {
	children: React.ReactNode;
}

const GuestLayout = ({ children }: AuthenticatedLayoutProps) => {
	return (
		<div className="w-full min-h-dvh bg-gray-200">
			<Navbar />
			<main className="w-full">{children}</main>
		</div>
	);
};

export default GuestLayout;
