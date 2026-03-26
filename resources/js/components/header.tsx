interface HeaderProps {
    title: string;
}
const Header = ({ title }: HeaderProps) => {
    return (
        <div className="relative flex h-30 items-center justify-center overflow-hidden rounded-t">
            <img
                src={'/storage/assets/images/about.jpg'}
                alt="about"
                className="h-full w-full object-cover object-[center_23%]"
            />
            <div className="absolute h-full w-full bg-gray-900 opacity-50"></div>
            <div className="absolute z-10 text-3xl font-bold text-white">
                {title}
            </div>
        </div>
    );
};
export default Header;
