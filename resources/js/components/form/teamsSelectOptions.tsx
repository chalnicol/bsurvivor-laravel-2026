import { cn } from '@/lib/utils';
import { Team } from '@/types/bracket';
import CustomButton from '../customButton';
import { useState } from 'react';

interface TeamsSelectOptionsProps {
  teams: Team[];
  title: string;
  selected: number[]; // ordered array — index 0 = seed 1
  onSelect: (selected: number[]) => void;
  max?: number;
  onClose?: () => void;
}

const TeamsSelectOptions = ({
  teams,
  title,
  onSelect,
  selected,
  max = 8,
  onClose,
}: TeamsSelectOptionsProps) => {
  const [warning, setWarning] = useState<string | null>(null);

  const handleOptionClick = (id: number) => {
    if (selected.includes(id)) {
      // Remove and shift seeds up
      onSelect(selected.filter((item) => item !== id));
    } else {
      // Append — becomes the next seed
      if (max && selected.length >= max) return;

      onSelect([...selected, id]);
    }
  };

  const handleDoneClick = () => {
    if (selected.length < max) {
      setWarning(`You must select ${max} teams.`);
      return;
    }
    onClose && onClose();
  };

  return (
    <div className="rounded border border-gray-500 bg-gray-900 p-4 text-gray-300 shadow-lg shadow-gray-800">
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-xs text-slate-400">
          Select teams in seed order. First selected = Seed 1.
        </p>
      </div>

      {/* Team list */}
      <div className="mt-4 h-[30dvh] max-h-62 overflow-y-auto rounded border border-gray-500">
        {teams.map((t) => {
          const seedIndex = selected.indexOf(t.id);
          const isSelected = seedIndex !== -1;
          const isDisabled = selected.length >= Number(max) && !isSelected;

          return (
            <button
              key={t.id}
              onClick={() => handleOptionClick(t.id)}
              className={cn(
                'flex w-full cursor-pointer items-center justify-between border-b border-gray-700 px-3 py-1.5 last:border-0',
                'cursor-pointer text-sm transition-colors even:bg-gray-800 disabled:pointer-events-none',
                isSelected
                  ? 'text-amber-100'
                  : 'text-gray-300 hover:text-amber-100',
              )}
              disabled={isDisabled}
            >
              <div className="flex items-center gap-2">
                <p>
                  {t.club_name} {t.monicker}
                </p>
              </div>

              {isSelected && (
                <p className="rounded border border-amber-100 px-2 text-xs font-bold tracking-widest text-amber-100">
                  {seedIndex + 1}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Seed order preview */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] tracking-widest text-slate-400 uppercase">
            Seed Order
          </p>
          <p className="text-right text-[10px] tracking-widest text-slate-400 uppercase">
            Selected: {selected.length}
          </p>
        </div>

        <div className="mt-2 h-[20dvh] max-h-24 space-y-1 overflow-y-auto rounded border border-gray-500">
          {selected.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 p-1 lg:grid-cols-3">
              {selected.map((id, index) => {
                const team = teams.find((o) => o.id === id);
                if (!team) return null;

                return (
                  <div
                    key={id}
                    onClick={() => handleOptionClick(id)}
                    className="flex cursor-pointer items-center gap-1 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-xs text-gray-300 hover:bg-red-800/50"
                    title="Click to remove"
                  >
                    <span className="font-bold text-amber-100">
                      {index + 1}.
                    </span>
                    <span>
                      {team.club_name} {team.monicker}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="flex h-full w-full items-center justify-center bg-gray-800/50">
              No teams selected.
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <CustomButton
            label="Close"
            onClick={onClose}
            className="bg-gray-600 px-4 text-gray-300 hover:bg-gray-500 hover:bg-gray-700"
          />
          <CustomButton
            label="Done"
            onClick={handleDoneClick}
            className="bg-sky-900 px-4 text-gray-300 hover:bg-gray-700 hover:bg-sky-800"
          />
          {warning && <p className="py-1 text-sm text-amber-100">{warning}</p>}
        </div>
      </div>
    </div>
  );
};

export default TeamsSelectOptions;
