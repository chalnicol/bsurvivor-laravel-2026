import { OptionDetails } from '@/types/general';
import CustomButton from './customButton';
import { cn } from '@/lib/utils';
import { ArrowBigDown, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { show } from '@/routes/admin/users';
import gsap from 'gsap';
import { useOutsideClick } from '@/hooks/use-outside-click';

const ActionMenu = ({
  options,
  className,
  disabled,
  menuView = 'right',
}: {
  options: OptionDetails[];
  className?: string;
  disabled?: boolean;
  menuView?: 'left' | 'right';
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const optionsRef = useRef<HTMLDivElement>(null);
  const parentMenuRef = useOutsideClick<HTMLDivElement>(() => {
    // 2. Callback function: close the dropdown when an outside click occurs
    setShowOptions(false);
  });

  useEffect(() => {
    if (showOptions && optionsRef.current) {
      gsap.fromTo(
        optionsRef.current,
        {
          height: 0,
        },
        {
          height: 'auto',
          duration: 0.6,
          ease: 'elastic.out(1, 0.8)',
          transformOrigin: 'top center',
        },
      );
    }
    return () => {
      if (optionsRef.current) {
        gsap.killTweensOf(optionsRef.current);
      }
    };
  }, [showOptions]);

  return (
    <div ref={parentMenuRef} className="relative">
      <button
        type="button"
        className={cn(
          'flex h-full cursor-pointer items-center gap-x-1 rounded border border-gray-400 px-2 py-1 text-xs font-semibold text-gray-300 uppercase hover:bg-gray-800 disabled:pointer-events-none disabled:opacity-80',
          className,
        )}
        onClick={() => setShowOptions((prev) => !prev)}
        disabled={disabled}
      >
        <span>Menu</span>
        <ChevronDown
          size={14}
          className={cn(
            'transition-transform duration-300 ease-in-out',
            showOptions && 'rotate-180',
          )}
        />
      </button>
      {showOptions && (
        <div
          ref={optionsRef}
          className={cn(
            'absolute top-full mt-1 flex min-w-40 cursor-pointer flex-col divide-y divide-gray-600 overflow-hidden rounded border border-gray-500 bg-gray-900 shadow-lg shadow-gray-700',
            menuView == 'left' ? 'left-0' : 'right-0',
          )}
        >
          {options.map((option, index) => (
            <button
              key={index}
              className="block cursor-pointer px-3 py-2 text-left text-sm tracking-wide text-gray-200 hover:bg-gray-800/50"
              onClick={() => {
                setShowOptions(false);
                option.callback();
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
