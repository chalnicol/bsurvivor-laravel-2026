import React, { useEffect, useRef } from 'react';
import { useOutsideClick } from '../hooks/use-outside-click';
import { cn } from '@/lib/utils';
import { show } from '@/actions/Laravel/Fortify/Http/Controllers/ConfirmablePasswordController';
import gsap from 'gsap';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  rules?: string[];
  label?: string;
  className?: string;
}
const TextInput: React.FC<TextInputProps> = ({
  rules,
  label,
  className,
  ...props
}) => {
  const [showRules, setShowRules] = React.useState(false);
  const parentRef = useOutsideClick<HTMLDivElement>(() => {
    // 2. Callback function: close the dropdown when an outside click occurs
    setShowRules(false);
  });

  const contRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (showRules && contRef.current) {
      gsap.fromTo(
        contRef.current,
        {
          scale: 0,
        },
        {
          scale: 1,
          duration: 0.4,
          ease: 'elastic.out(1, 0.8)',
          transformOrigin: 'top right',
        },
      );
    }
    return () => {
      if (contRef.current) {
        gsap.killTweensOf(contRef.current);
      }
    };
  }, [showRules]);

  return (
    <div className="space-y-1.5">
      {label && (
        <p className="ms-0.5 text-[10px] font-medium tracking-widest text-slate-400 uppercase">
          {label}
        </p>
      )}
      <div className="relative">
        <input
          {...props}
          className={cn(
            '`autofill:text-fill-gray-900 z-10 h-full w-full rounded border border-gray-500 bg-gray-900 px-2 py-1 text-white focus:ring-1 focus:ring-gray-800 focus:outline-none',
            className,
          )}
        />
        {rules && rules.length > 0 && (
          <>
            <div
              className="absolute top-1/2 right-2 z-10 -translate-y-1/2"
              tabIndex={-1}
              ref={parentRef}
            >
              <button
                tabIndex={-1}
                type="button"
                className={`z-20 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ${
                  showRules ? 'bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setShowRules((prev) => !prev)}
              >
                ?
              </button>
              {showRules && (
                <ul
                  ref={contRef}
                  className="absolute top-0 right-full min-w-40 list-inside list-disc space-y-1 rounded border border-gray-500 bg-gray-900/60 p-2 text-xs font-semibold whitespace-nowrap text-white shadow-lg"
                >
                  {rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TextInput;
