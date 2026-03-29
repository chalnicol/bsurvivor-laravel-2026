import { cn } from '@/lib/utils';
import { PillColor } from '@/types/general';

const Pill = ({
  color = 'gray',
  text,
  size = 'xxs',
}: {
  color?: PillColor;
  text?: string;
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
}) => {
  const clrClass = {
    emerald: 'bg-emerald-600 text-gray-200',
    amber: 'bg-amber-400 text-zinc-800',
    sky: 'bg-sky-400 text-gray-900 ',
    rose: 'bg-rose-700 text-gray-300',
    gray: 'bg-slate-500 text-slate-300',
  };

  const textSize = {
    xxs: 'text-[10px]',
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <span
      className={cn(
        'px-2 font-semibold tracking-widest text-gray-900 uppercase',
        clrClass[color],
        textSize[size],
      )}
    >
      {text || 'Pill'}
    </span>
  );
};

export default Pill;
