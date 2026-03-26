import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import CustomLink from './customLink';

interface FooterProps {
    className?: string;
}
const Footer = ({ className }: FooterProps) => {
    return (
        <footer
            className={cn(
                'border-t border-gray-700 bg-slate-950 text-sm text-white',
                className,
            )}
        >
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-center space-y-1 gap-x-3 py-2 md:flex-row md:space-y-0">
                <p>&copy; 2025 Basketball Survivor. All rights reserved.</p>
                <div className="space-x-3">
                    <CustomLink
                        href="/terms-of-service"
                        className="text-gray-500 underline hover:text-gray-400"
                    >
                        Terms of Service
                    </CustomLink>
                    <CustomLink
                        href="/privacy-policy"
                        className="text-gray-500 underline hover:text-gray-400"
                    >
                        Privacy Policy
                    </CustomLink>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
