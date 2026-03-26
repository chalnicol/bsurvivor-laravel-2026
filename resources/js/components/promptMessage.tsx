import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

type PromptType = 'error' | 'warning' | 'info' | 'success';

interface PromptMessageProps {
  type: PromptType;
  message?: string;
  errors?: Record<string, string>;
  className?: string;
  onClose?: () => void;
}

const PromptMessage = ({
  type, // Destructured fix
  message,
  errors,
  className = '',
  onClose,
}: PromptMessageProps) => {
  const promptRef = useRef<HTMLDivElement>(null);

  // 1. Map for Container Colors
  const containerClass: Record<PromptType, string> = {
    error: 'bg-rose-700/50 border-rose-500',
    warning: 'bg-yellow-50 border-yellow-500',
    info: 'bg-sky-50 border-sky-500',
    success: 'bg-emerald-100 border-emerald-500',
  };

  // 2. Map for Main Message text
  const messageTextClass: Record<PromptType, string> = {
    error: 'text-rose-300',
    warning: 'text-yellow-900',
    info: 'text-sky-900',
    success: 'text-green-900',
  };

  // 3. Map for Label text (the "EMAIL:" part)
  const labelTextClass: Record<PromptType, string> = {
    error: 'text-rose-200',
    warning: 'text-yellow-700',
    info: 'text-sky-700',
    success: 'text-green-700',
  };

  // 4. Map for Divider lines and Bullet points
  const detailClass: Record<PromptType, string> = {
    error: 'border-rose-200 text-rose-600',
    warning: 'border-yellow-200 text-yellow-600',
    info: 'border-sky-200 text-sky-600',
    success: 'border-green-200 text-green-600',
  };

  const closeBtnClass: Record<PromptType, string> = {
    error: 'text-white hover:bg-rose-300 bg-rose-400',
    warning: 'text-white hover:bg-amber-400 bg-amber-500',
    info: 'text-white hover:bg-sky-400 bg-sky-500',
    success: 'text-white hover:bg-green-500 bg-green-600',
  };

  const hasFieldErrors = errors && Object.keys(errors).length > 0;

  useEffect(() => {
    // If the component mounts and it's not visible, scroll to it
    if (promptRef.current) {
      promptRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []); // Empty dependency array = run once on mount

  return (
    <div
      ref={promptRef}
      className={cn(
        'relative rounded-e border-l-4',
        containerClass[type],
        className,
      )}
    >
      <div className="flex">
        <div className="flex-1 px-3 py-2">
          {hasFieldErrors && (
            <div className={`space-y-0.5 ${detailClass[type]}`}>
              {Object.entries(errors).map(([key, messages]) => (
                <div key={key} className="space-y-0.5 space-x-1 leading-tight">
                  <span
                    className={cn(
                      'truncate text-xs font-bold uppercase',
                      labelTextClass[type],
                    )}
                  >
                    {key.replace('_', ' ')} :
                  </span>
                  <span className={cn('text-sm', messageTextClass[type])}>
                    {messages}
                  </span>
                </div>
              ))}
            </div>
          )}

          {message && (
            <p className={`${messageTextClass[type]} text-sm font-semibold`}>
              {message}
            </p>
          )}
        </div>
        {onClose && (
          <div>
            <button
              className={cn(
                'mx-2 mt-2.5 flex aspect-square w-4 cursor-pointer items-center justify-center rounded-full',
                closeBtnClass[type],
              )}
              onClick={onClose}
            >
              <X size={11} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptMessage;
