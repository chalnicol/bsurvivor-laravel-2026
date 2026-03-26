import gsap from 'gsap';
import { useEffect, useRef } from 'react';

const AuthBase = ({ children }: { children?: React.ReactNode }) => {
    const contRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contRef.current) {
            gsap.fromTo(
                contRef.current,
                { yPercent: 10, opacity: 0 },
                {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power1.out',
                },
            );
        }
        return () => {
            if (contRef.current) {
                gsap.killTweensOf(contRef.current);
            }
        };
    }, []);

    return (
        <div className="flex h-full w-full items-center justify-center overflow-hidden py-4">
            <div ref={contRef} className="w-full max-w-md">
                {children}
            </div>
        </div>
    );
};

export default AuthBase;
