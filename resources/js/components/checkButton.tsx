import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';

interface AddressModalProps {
    disabled: boolean;
    checked: boolean;
    onChange: () => void;
    className?: string;
    label: string;
}

const CheckButton: React.FC<AddressModalProps> = ({
    label,
    disabled,
    checked,
    onChange,
    className,
}) => {
    return (
        <button
            type="button"
            className={cn(
                'flex cursor-pointer items-center gap-1 rounded-full border border-gray-400 py-1 ps-1.5 pe-2.5 shadow hover:bg-gray-700',
                className,
            )}
            onClick={onChange}
            disabled={disabled}
        >
            <span>
                <Circle
                    size={13}
                    className={`text-white ${checked ? 'fill-current' : ''}`}
                />
            </span>

            <span className="text-xs font-semibold text-slate-300">
                {label}
            </span>
        </button>
    );
};

export default CheckButton;
