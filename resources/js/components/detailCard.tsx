import { cn } from '@/lib/utils';

interface DetailProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}
const DetailCard = ({ label, children, className }: DetailProps) => {
  return (
    <div
      className={cn(
        'space-y-1 rounded border border-gray-400 px-3 py-1.5',
        className,
      )}
    >
      <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
        {label}
      </p>
      <div>{children}</div>
    </div>
  );
};
export default DetailCard;
