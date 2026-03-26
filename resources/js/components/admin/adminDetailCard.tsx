import { cn } from '@/lib/utils';

interface AdminDetailCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const AdminDetailCard = ({
  title,
  className,
  children,
}: AdminDetailCardProps) => {
  return (
    <div
      className={cn(
        'flex min-h-18 flex-col gap-1.5 rounded border border-gray-600 bg-gray-800/70 p-2',
        className,
      )}
    >
      <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
        {title}
      </span>
      <div>{children}</div>
    </div>
  );
};

export default AdminDetailCard;
