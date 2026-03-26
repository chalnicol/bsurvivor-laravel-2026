import { useOutsideClick } from '@/hooks/use-outside-click';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface DropdownSelectProps<T = number | string> {
  options: { label: string; value: T }[];
  optionsView: 'grid' | 'grand' | 'list';
  value: T | null | undefined;
  onChange: (value: T | null) => void;
  highlighted?: T | null;
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'dark' | 'light';
  renderedLabel?: (value: T | null | undefined) => string;
  disabled?: boolean;
  loading?: boolean;
  addEmpty?: boolean;
}

const DropdownSelectButton = <T,>({
  options,
  optionsView = 'list',
  size = 'md',
  value,
  onChange,
  highlighted,
  className,
  position = 'bottom-left',
  color = 'dark',
  renderedLabel,
  disabled,
  loading,
  addEmpty,
}: DropdownSelectProps<T>) => {
  const [showOptions, setShowOptions] = useState(false);
  const contRef = useOutsideClick<HTMLDivElement>(() => setShowOptions(false));

  const optionsRef = useRef<HTMLDivElement>(null);

  const optionsContainerPosition = {
    'bottom-left': 'top-full mt-1',
    'bottom-right': 'top-full mt-1 right-0',
    'top-left': 'bottom-full mb-1',
    'top-right': 'bottom-full mb-1 right-0',
  };

  const optionsContainerView = {
    grid: 'grid grid-cols-2 md:grid-cols-[repeat(3,minmax(45px,1fr))] max-h-32 overflow-y-auto overflow-x-hidden p-1.5 gap-1 min-w-full',
    grand:
      'grid grid-cols-2 md:grid-cols-[repeat(3,minmax(40px,1fr))] lg:grid-cols-[repeat(4,minmax(40px,1fr))] max-h-32 overflow-y-auto overflow-x-hidden p-1.5 gap-1 min-w-full',
    list: 'flex flex-col max-h-32 overflow-y-auto p-2 gap-1 min-w-full',
  };

  const selectButtonText = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const selectButtonColor = {
    dark: 'bg-gray-900 text-gray-200 divide-gray-500 hover:bg-gray-800 border-gray-300',
    light: 'bg-gray-200 text-gray-800 divide-gray-400 hover:bg-gray-100',
  };

  const optionsContainerColor = {
    dark: 'bg-gray-900 text-gray-200 border border-gray-100',
    light: 'bg-gray-200 text-gray-800',
  };

  const optionsText = {
    xs: 'text-[10px]',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const optionsColor = {
    dark: 'bg-gray-900 text-gray-200 border border-gray-400 hover:bg-gray-800',
    light: 'bg-gray-200 text-gray-800 border border-gray-400 hover:bg-gray-100',
  };

  const highlightedColor = {
    dark: 'text-slate-500',
    light: 'text-slate-500',
  };

  const selectedColor = {
    dark: 'bg-gray-900 text-amber-100 border border-amber-100',
    light: 'bg-gray-300 text-sky-900 border border-sky-900',
  };

  const getLabel = useCallback(() => {
    return options.find((option) => option.value === value)?.label ?? '-empty-';
  }, [value, options]);

  useEffect(() => {
    if (showOptions && optionsRef.current) {
      gsap.fromTo(
        optionsRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.6)',
          // ease: 'power3.out',
          transformOrigin:
            position === 'top-left' || position === 'top-right'
              ? 'bottom center'
              : 'top center',
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
    <div ref={contRef} className={cn('0 relative inline-block', className)}>
      <button
        type="button"
        className={cn(
          'flex w-full cursor-pointer items-center justify-between divide-x rounded border border-gray-500 disabled:pointer-events-none',
          selectButtonText[size],
          selectButtonColor[color],
        )}
        disabled={disabled}
        onClick={() => setShowOptions((prev) => !prev)}
      >
        <p className="flex flex-1 items-center px-3 py-1 text-left">
          {loading && (
            <Loader2 size={14} className="animate-spin text-gray-500" />
          )}

          {renderedLabel ? renderedLabel(value) : getLabel()}
        </p>
        <p className="px-1">
          <ChevronDown
            size={14}
            className={cn(
              'transition-transform duration-300',
              showOptions && 'rotate-180',
            )}
          />
        </p>
      </button>

      {showOptions && (
        <div
          ref={optionsRef}
          className={cn(
            'absolute z-50 rounded',
            optionsContainerView[optionsView],
            optionsContainerPosition[position],
            optionsContainerColor[color],
          )}
        >
          {options.map((option, i) => (
            <button
              key={i}
              type="button"
              className={cn(
                'cursor-pointer rounded border px-2 py-1 text-left transition-colors disabled:pointer-events-none',

                optionsText[size],
                optionsColor[color],
                highlighted === option.value && highlightedColor[color],
                option.value === value && selectedColor[color],
              )}
              disabled={option.value === value}
              onClick={() => {
                onChange(option.value);
                setShowOptions(false);
              }}
            >
              {option.label}
            </button>
          ))}
          {addEmpty && value !== null && (
            <button
              type="button"
              className={cn(
                'cursor-pointer rounded border px-2 py-0.5 text-left transition-colors',
                optionsText[size],
                optionsColor[color],
              )}
              onClick={() => {
                onChange(null);
                setShowOptions(false);
              }}
            >
              -empty-
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownSelectButton;
