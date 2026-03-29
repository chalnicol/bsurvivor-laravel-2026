import { useBracket } from '@/context/BracketChallengeProvider';
import { cn, getImageUrl } from '@/lib/utils';
import { Conference, PlayoffTeam } from '@/types/bracket';
import gsap from 'gsap';
import { useEffect, useMemo, useRef, useState } from 'react';

const BracketTeamSlot = ({
  team,
  placeholder,
  conference,
  matchId,
  disabled,
  winnerId,
  wing,
}: {
  placeholder?: string;
  team: PlayoffTeam | null;
  conference?: Conference;
  matchId?: number;
  disabled?: boolean;
  winnerId?: number | null;
  wing?: 'left' | 'right';
}) => {
  const { mode, teamAdvance } = useBracket();

  const contRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    //..
    if (!team) return;
    teamAdvance(matchId || 0, team.id);
  };

  const isDisabled = disabled == true || !team || !matchId;

  // useEffect(() => {
  //   if (team && contRef.current) {
  //     gsap.fromTo(
  //       contRef.current,
  //       { scale: 0 },
  //       {
  //         scale: 1,
  //         duration: 0.6,
  //         ease: 'elastic.out(1, 0.8)',
  //         // ease: 'power4.out',
  //         transformOrigin: 'center center',
  //       },
  //     );
  //   }

  //   return () => {
  //     if (contRef.current) {
  //       gsap.killTweensOf(contRef.current);
  //     }
  //   };
  // }, [team]);

  const bgColorCls = useMemo(() => {
    if (!team || !winnerId) return '';
    if (mode == 'create' && winnerId == team.id) return 'bg-sky-900/60';
    return '';
  }, [mode, team, winnerId]);

  if (!wing) {
    return (
      <div
        ref={contRef}
        className={cn(
          'relative flex h-12 min-w-44 flex-shrink-0 items-center justify-center gap-x-2 overflow-hidden rounded-md border border-gray-400',
          isDisabled
            ? 'pointer-events-none cursor-default'
            : 'cursor-pointer hover:bg-gray-800 active:scale-95',
          bgColorCls,
        )}
        onClick={handleClick}
      >
        {team ? (
          <>
            <img
              src={getImageUrl(team.logo)}
              alt={team.short_name}
              className="absolute left-5 aspect-square h-22 object-contain opacity-70"
            />
            <div
              className={cn(
                'absolute left-14 leading-5 text-shadow-gray-800 text-shadow-lg',
                team.club_name.length > 12 ? 'text-xs' : '',
              )}
            >
              <p className={cn('font-bold text-amber-100')}>{team.club_name}</p>
              <p className="text-xs font-semibold text-amber-100">
                {team.monicker}
              </p>
            </div>
          </>
        ) : (
          <p className="px-3 py-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            {placeholder || 'Winner'}
          </p>
        )}
      </div>
    );
  }

  //..wing slots..
  return (
    <div
      ref={contRef}
      className={cn(
        'flex h-11 min-w-34 items-center overflow-hidden rounded border border-gray-400 select-none',
        isDisabled
          ? 'pointer-events-none cursor-default'
          : 'cursor-pointer hover:bg-gray-800 active:scale-95',
        wing == 'right' && 'flex-row-reverse',
        bgColorCls,
      )}
      onClick={handleClick}
    >
      {team ? (
        <>
          <div className="aspect-square h-full bg-gray-600 p-0.5">
            <img
              src={getImageUrl(team.logo)}
              alt={team.short_name}
              className="h-full w-full object-contain"
            />
          </div>

          <p
            className={cn(
              'flex flex-1 items-baseline px-2 text-2xl font-bold',
              conference == 'west' && 'flex-row-reverse',
            )}
          >
            <span>{team.short_name}</span>
            <span className="mx-0.5 text-[10px] font-semibold text-slate-400">
              {team.seed}
            </span>
          </p>
        </>
      ) : (
        <p className="px-3 py-1 text-[10px] font-bold tracking-wide text-slate-500 uppercase">
          {placeholder || 'Winner'}
        </p>
      )}
    </div>
  );
};

export default BracketTeamSlot;
