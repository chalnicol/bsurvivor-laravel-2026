import { cn } from '@/lib/utils';
import CustomLink from './customLink';

interface EmptyPromptProps {
    message?: string;
    className?: string;
}
const EmptyPrompt = ({ message, className }: EmptyPromptProps) => {
    return (
        <div
            className={cn(
                'flex h-44 flex-col items-center justify-center space-y-3 rounded bg-gray-800 text-white',
                className,
            )}
        >
            <div className="font-medium">{message || 'No data found.'}</div>
            <CustomLink
                href="/"
                type="button"
                className="w-44 px-3 py-2 text-center"
            >
                HOME
            </CustomLink>
        </div>
    );
};

export default EmptyPrompt;
