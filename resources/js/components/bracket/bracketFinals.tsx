import { BracketChallengeMatch, PlayoffTeam } from '@/types/bracket';
import { useMemo, useState } from 'react';
import BracketTeamSlot from './bracketTeamSlot';
import { useBracket } from '@/context/BracketChallengeProvider';
import BracketMatch from './bracketMatch';

const BracketFinals = ({ title }: { title?: string }) => {
  const { getFinalsMatch, clearMatch } = useBracket();

  const gameMatch = getFinalsMatch();

  const winner = useMemo(() => {
    if (!gameMatch || !gameMatch.winner_team_id) return null;
    return (
      gameMatch.teams.find((t) => t.id == gameMatch.winner_team_id) || null
    );
  }, [gameMatch]);

  if (!gameMatch) return null;

  return (
    <div className="-mt-16">
      <h2 className="mb-3 rounded-lg bg-amber-200 px-2 text-center font-bold tracking-wider text-gray-800 uppercase">
        {title || 'Grand Finals'}
      </h2>

      <BracketTeamSlot team={winner} placeholder="Finals Champion" />

      {/* line */}
      <div className="flex h-10 justify-center">
        <div className="border-s border-gray-400" />
      </div>

      <BracketMatch gameMatch={gameMatch} />
    </div>
  );
};

export default BracketFinals;
