import { cn } from '@/lib/utils';

interface DetailProps {
    label: string;
    children: React.ReactNode;
    className?: string;
}
const Detail = ({ label, children, className }: DetailProps) => {
    return (
        <div className={cn(className)}>
            <p className="text-[10px] tracking-widest text-slate-400 uppercase">
                {label}
            </p>
            <div>{children}</div>
        </div>
    );
};
export default Detail;
