import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    label?: string;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    children,
    label,
    className,
    color = 'primary',
    disabled,
    loading,
    ...props
}) => {
    return (
        <button
            className={cn(
                'flex cursor-pointer items-center justify-center gap-x-1 rounded border bg-gray-700 px-2 py-1 font-semibold transition-colors duration-300 ease-in-out hover:bg-gray-600 hover:shadow active:scale-95 disabled:pointer-events-none disabled:cursor-default disabled:bg-gray-700/90 disabled:text-gray-500',
                className,
            )}
            // onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader size={18} className="animate-spin" />}

            {children ? (
                children
            ) : (
                <span className="whitespace-nowrap">{label}</span>
            )}
        </button>
    );
};

export default CustomButton;
