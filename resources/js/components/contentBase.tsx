import { cn } from '@/lib/utils';

interface ContentBaseProps {
    children: React.ReactNode;
    className?: string;
}
const ContentBase = ({ children, className }: ContentBaseProps) => {
    return (
        <div className={cn('mx-auto max-w-7xl p-4', className)}>{children}</div>
    );
};

export default ContentBase;
