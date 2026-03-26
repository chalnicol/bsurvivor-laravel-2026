import { InertiaLinkProps, Link } from '@inertiajs/react';
import * as Icons from 'lucide-react';

interface NavLinkProps extends InertiaLinkProps {
    showIndicatorCount?: boolean;
    indicatorCount?: number;
    icon: string;
    label?: string;
    type: 'circle' | 'rect';
}

const DynamicIcon = ({
    name,
    ...props
}: {
    name: string;
    [key: string]: any;
}) => {
    const IconComponent = (Icons as any)[name];
    if (!IconComponent) return <Icons.HelpCircle {...props} />;
    return <IconComponent {...props} />;
};

const NavLink = ({
    showIndicatorCount,
    indicatorCount,
    icon,
    label,
    type = 'rect',
    ...props
}: NavLinkProps) => {
    if (type === 'circle') {
        return (
            <div className="relative">
                <Link
                    {...props}
                    className="flex aspect-square items-center justify-center gap-x-1 rounded-full border border-gray-300 px-1.5 text-gray-300 shadow hover:bg-gray-800 active:scale-95"
                >
                    <DynamicIcon name={icon} size={20} />
                </Link>
                {showIndicatorCount && showIndicatorCount && (
                    <p className="absolute top-0 -right-2 rounded-full bg-rose-500 px-1 text-xs font-bold text-white">
                        {indicatorCount || 0}
                    </p>
                )}
            </div>
        );
    }

    return (
        <Link
            {...props}
            className="flex cursor-pointer items-center gap-x-2 rounded border border-gray-500 px-2 py-1.5 text-white shadow transition duration-300 hover:bg-gray-800"
        >
            <DynamicIcon name={icon} size={16} />
            <span className="font-semibold">{label || 'Label'}</span>
            {showIndicatorCount && (
                <span className="ms-auto rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white">
                    {indicatorCount}
                </span>
            )}
        </Link>
    );
};

export default NavLink;
