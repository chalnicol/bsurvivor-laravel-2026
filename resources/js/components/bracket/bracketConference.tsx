import { cn } from '@/lib/utils';
import { BracketSection, Conference } from '@/types/bracket';
import BracketMatch from './bracketMatch';
import { useBracket } from '@/context/BracketChallengeProvider';

const BracketConference = ({
  conference,
  wing,
  className,
  title,
}: {
  wing?: 'left' | 'right';
  conference?: Conference;
  className?: string;
  title?: string;
}) => {
  const { getMatchesByConference, getPlayoffInfo } = useBracket();

  const matches = getMatchesByConference(conference);

  const { rounds, names } = getPlayoffInfo();

  const clrClass = wing == 'right' ? 'text-rose-400' : 'text-blue-500';

  const orderClass = wing == 'right' && 'flex-row-reverse';

  return (
    <div className={cn('flex-shrink-0 space-y-4', className)}>
      <div className={cn('flex', orderClass)}>
        <p
          className={cn(
            'bg-gray-800 px-2 py-0.5 text-sm font-bold tracking-wider uppercase',
            clrClass,
          )}
        >
          {title || 'Conference'}
        </p>
      </div>

      <div
        className={cn('flex', rounds < 3 ? 'gap-x-6' : 'gap-x-4', orderClass)}
      >
        {Array.from({ length: rounds }).map((_, i) => {
          const roundMatches = matches.filter((m) => m.round_index == i + 1);
          return (
            <div
              key={i}
              className="flex flex-1 flex-col justify-center gap-y-2"
            >
              <p
                className={cn(
                  'text-xs font-semibold tracking-widest text-slate-300 uppercase',
                  wing == 'right' && 'text-right',
                )}
              >
                {names[i]}
              </p>

              <div
                className={cn(
                  'flex flex-col justify-around',
                  i == 0 ? 'gap-y-6' : 'gap-y-40',
                )}
              >
                {roundMatches.map((m) => (
                  <BracketMatch
                    key={m.id}
                    gameMatch={m}
                    conference={conference}
                    wing={wing}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BracketConference;
