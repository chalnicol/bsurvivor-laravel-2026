const Icon = ({ className }: { className?: string }) => {
    return (
        <img
            src={`/storage/assets/logo/horizontal_logo.png`}
            alt="icon"
            className={className}
        />
    );
};

export default Icon;
