const Hero = () => {
    return (
        <div className="h-60 overflow-hidden rounded-b border border-gray-700 md:h-80">
            <img
                src={'/storage/assets/images/hero_image.jpg'}
                alt=""
                className="h-full w-full object-cover object-[center_75%]"
            />
        </div>
    );
};

export default Hero;
