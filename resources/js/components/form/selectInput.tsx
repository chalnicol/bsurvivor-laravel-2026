import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils'; // Adjust path to your cn helper

interface SelectInputProps<T extends string | number> {
  options: { value: T; label: string }[];
  selected: T | null | undefined;
  onSelect: (value: T | null) => void;
  disabled?: boolean;
  className?: string; // Allow external styling
}

const SelectInput = <T extends string | number>({
  selected,
  options,
  onSelect,
  disabled,
  className,
}: SelectInputProps<T>) => {
  if (options.length === 0) {
    return (
      <p className="cursor-not-allowed truncate rounded border border-gray-400 bg-gray-800 px-3 py-2 text-xs text-slate-400 uppercase select-none">
        No selection available
      </p>
    );
  }

  return (
    <div
      className={cn(
        'max-h-42 overflow-y-auto rounded border border-gray-300',
        className,
      )}
    >
      {options.map((option) => {
        const isSelected = selected === option.value;

        return (
          <button
            key={option.value.toString()}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(isSelected ? null : option.value)}
            className={cn(
              // Base Styles
              'flex w-full cursor-pointer items-center gap-2 border-b border-gray-600 px-3 py-1.5 text-sm text-gray-300 last:border-b-0 hover:bg-gray-700',

              // Hover/Active States
              'text-gray-300 hover:bg-gray-700 hover:text-gray-200',

              // Selected State
              isSelected && 'bg-gray-800 font-medium text-slate-300',

              // Disabled State
              disabled && 'pointer-events-none text-slate-500 opacity-80',
            )}
          >
            <div className="flex-shrink-0">
              {isSelected ? (
                <Check size={12} className="text-gray-300" />
              ) : (
                <Circle size={12} className="text-gray-300" />
              )}
            </div>
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SelectInput;
