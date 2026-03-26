import { cn } from '@/lib/utils';
import { InertiaLinkProps, Link } from '@inertiajs/react';

type LinkType = 'button' | 'text';

interface CustomLinkProps extends InertiaLinkProps {
  label?: string;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  type?: LinkType;
}

const CustomLink = ({
  label,
  className,
  children,
  disabled = false,
  type = 'text',
  ...props
}: CustomLinkProps) => {
  const defaultClass: Record<LinkType, string> = {
    button:
      'inline-flex items-center justify-center bg-gray-700 rounded px-3 py-1 font-semibold text-white',
    text: 'inline-block text-gray-300',
  };

  if (disabled && disabled === true) {
    return (
      <div className={cn(defaultClass[type], className)}>
        {children || label}
      </div>
    );
  }
  return (
    <Link
      className={cn(
        defaultClass[type],
        type === 'button' ? 'hover:bg-gray-600' : 'hover:text-gray-400',
        className,
      )}
      {...props}
    >
      {children || label}
    </Link>
  );
};

export default CustomLink;
