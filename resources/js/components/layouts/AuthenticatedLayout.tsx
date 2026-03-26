import Footer from "../footer";
import Navbar from "../navbar";

interface AuthenticatedLayoutProps {
	children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
	return (
		<div className="w-full min-h-dvh flex flex-col bg-gray-200">
			<Navbar className="flex-none" />
			<main className="w-full flex-grow">{children}</main>
			<Footer className="flex-none" />
		</div>
	);
};

export default AuthenticatedLayout;
