const TransparentIcon = ({ className }: { className: string }) => {
    return (
        <img
            src={'/storage/assets/logo/square_logo.png'}
            alt="icon"
            className={className}
            draggable="false"
        />
    );
};

export default TransparentIcon;
