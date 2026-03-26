import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import CustomButton from './customButton';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { ToastType } from '@/types/general';

const Toast = ({
  message,
  type,
  onClose,
  timeDelay = 3,
}: {
  message: string;
  type: ToastType;
  onClose?: () => void;
  timeDelay?: number;
}) => {
  const contRef = useRef<HTMLDivElement>(null);
  const timer = useRef<any>(null);

  const bgClass: Record<ToastType, string> = {
    success: 'bg-emerald-200 divide-emerald-500',
    error: 'bg-rose-200 border-rose-500 divide-rose-500',
    status: 'bg-sky-200 border-sky-500 divide-sky-500',
  };

  const txtClass: Record<ToastType, string> = {
    success: 'text-emerald-800',
    error: 'text-rose-800',
    status: 'text-sky-800',
  };

  const closeBtnClass: Record<ToastType, string> = {
    success: 'text-emerald-800 hover:bg-emerald-100',
    error: 'text-rose-800 hover:bg-rose-100',
    status: 'text-sky-800 hover:bg-sky-100',
  };

  useEffect(() => {
    if (contRef.current) {
      gsap.fromTo(
        contRef.current,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.8,
          ease: 'elastic.out(1, 0.8)',
          transformOrigin: 'center center',
        },
      );
    }

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(handleClose, timeDelay * 1000);

    return () => {
      if (contRef.current) {
        gsap.killTweensOf(contRef.current);
      }
      clearTimeout(timer.current);
    };
  }, [message]);

  const handleClose = () => {
    if (timer.current) clearTimeout(timer.current);

    if (contRef.current) {
      gsap.to(contRef.current, {
        scale: 0,
        duration: 0.8,
        ease: 'elastic.in(1, 0.8)',
        transformOrigin: 'center center',
        onComplete: () => {
          if (onClose) onClose();
        },
      });
    } else {
      if (onClose) onClose();
    }
  };

  return (
    <div
      ref={contRef}
      className={cn(
        'fixed bottom-10 left-4 z-50 flex max-w-3/4 divide-x overflow-hidden rounded',
        bgClass[type],
      )}
    >
      <p
        className={cn(
          'flex-1 px-4 py-2.5 text-sm font-semibold',
          txtClass[type],
        )}
      >
        {message}
      </p>
      <CustomButton
        onClick={handleClose}
        className={cn(
          'flex-shrink-0 rounded-none border-0 bg-transparent px-1 text-white',
          closeBtnClass[type],
        )}
      >
        <X size={14} />
      </CustomButton>
    </div>
  );
};
export default Toast;
