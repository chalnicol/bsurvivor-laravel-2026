import { cn } from '@/lib/utils';
import { Conference, Team } from '@/types/bracket';
import CustomButton from '../customButton';

interface TeamsSelectedViewProps {
  title?: string;
  selected: Team[];
  onChangeClick: () => void;
  disabled?: boolean;
}

const TeamsSelectedView = ({
  title,
  selected,
  onChangeClick,
  disabled,
}: TeamsSelectedViewProps) => {
  return (
    <div className="rounded border border-gray-300 p-3 text-gray-300">
      <div className="flex items-center justify-between">
        <p className="flex-shrink-0 font-semibold">{title}</p>
        <CustomButton
          type="button"
          label={selected.length > 0 ? 'Edit' : 'Add'}
          onClick={onChangeClick}
          className="border-gray-300 bg-transparent px-3 py-1 text-xs text-gray-300 hover:bg-gray-800"
          disabled={disabled}
        />
      </div>

      <div className="mt-2 overflow-hidden rounded border border-gray-600 bg-gray-800 text-sm">
        {selected.length > 0 ? (
          <>
            <div className="grid grid-cols-[minmax(50px,80px)_1fr] border-b border-gray-500 bg-gray-900">
              <p className="px-2 py-1">Seed</p>
              <p className="px-2 py-1">Team</p>
            </div>
            <div className="h-35 overflow-y-auto">
              {selected.map((team, i) => (
                <div
                  key={team.id}
                  className={cn(
                    'grid grid-cols-[minmax(50px,80px)_1fr] last:border-0 even:bg-gray-900',
                  )}
                >
                  <p className="px-2 py-1">{i + 1}</p>
                  <p className="px-2 py-1">
                    {team.club_name} {team.monicker}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="flex h-35 items-center justify-center text-base">
            No teams selected.
          </p>
        )}
      </div>

      <p className="mt-1.5 text-right text-[10px] tracking-widest text-slate-400 uppercase">
        Selected: {selected.length}
      </p>
    </div>
  );
};

export default TeamsSelectedView;
