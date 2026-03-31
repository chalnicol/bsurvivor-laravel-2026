import { cn, getImageUrl } from '@/lib/utils';
import {
  BracketChallengeMatch,
  Conference,
  PlayoffTeam,
} from '@/types/bracket';
import BracketTeamSlot from './bracketTeamSlot';
import { useBracket } from '@/context/BracketChallengeProvider';
import { RefreshCcw, X } from 'lucide-react';

const BracketMatch = ({
  conference,
  wing,
  gameMatch,
  className,
}: {
  gameMatch: BracketChallengeMatch;
  className?: string;
  conference?: Conference;
  wing?: 'left' | 'right';
}) => {
  const { clearMatch, getLinkedMatchName, removeMatchWinner, loading, mode } =
    useBracket();
  const isDisabled =
    gameMatch.teams.length < 2 ||
    gameMatch.predicted_winner_team_id != null ||
    gameMatch.winner_team_id != null;

  const showClearButton =
    mode !== 'view' &&
    gameMatch.teams.length > 0 &&
    gameMatch.round_index > 1 &&
    !gameMatch.predicted_winner_team_id &&
    !gameMatch.winner_team_id;

  const showRefreshButton =
    !wing &&
    !loading &&
    mode !== 'view' &&
    (gameMatch.predicted_winner_team_id || gameMatch.winner_team_id);

  // const order = wing == 'right' ? 'flex-row-reverse' : '';

  const order = (): string => {
    if (!wing) return 'justify-center';
    if (wing == 'right') return 'flex-row-reverse';

    return '';
  };

  return (
    <div className={cn('min-w-32 space-y-1', className)}>
      <div className="space-y-1.5">
        {Array.from({ length: 2 }).map((_, i) => {
          const team = gameMatch.teams.find((t) => t.slot == i + 1) || null;

          return (
            <BracketTeamSlot
              key={`team${i}`}
              team={team}
              conference={conference}
              matchId={gameMatch.id}
              disabled={isDisabled}
              winnerId={
                gameMatch.winner_team_id || gameMatch.predicted_winner_team_id
              }
              wing={wing}
              placeholder={`${getLinkedMatchName(gameMatch.id, i + 1)} WINNER`}
            />
          );
        })}
      </div>

      <div className={cn('flex items-center justify-between gap-x-2', order())}>
        <p
          className={cn(
            'text-[10px] font-semibold tracking-widest text-slate-400 uppercase',
            wing == 'right' && 'text-right',
          )}
        >
          {wing ? `ID : ${gameMatch.name}` : 'Final Match'}
        </p>
        {showClearButton && (
          <button
            className="cursor-pointer bg-amber-600 px-1 text-[10px] tracking-widest uppercase hover:bg-amber-500 disabled:pointer-events-none"
            onClick={() => clearMatch(gameMatch.id, conference)}
            title="Clear Match"
            disabled={loading}
          >
            <X size={13} />
          </button>
        )}
        {showRefreshButton && (
          <button
            className="cursor-pointer bg-amber-600 px-1 text-[10px] tracking-widest uppercase hover:bg-amber-500 disabled:pointer-events-none"
            onClick={() => removeMatchWinner(gameMatch.id)}
            title="Refresh Match Winner"
            disabled={loading}
          >
            <RefreshCcw size={13} />
          </button>
        )}
      </div>
    </div>
  );
};

export default BracketMatch;
