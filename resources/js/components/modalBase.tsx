interface ModalBaseProps {
	children: React.ReactNode;
}
const ModalBase = ({ children }: ModalBaseProps) => {
	return (
		<div className="fixed left-0 bottom-0 w-full h-[calc(100dvh-56px)] flex items-center justify-center overflow-x-hidden overflow-y-auto z-10 bg-gray-900/80 p-6">
			{children}
		</div>
	);
};
export default ModalBase;
