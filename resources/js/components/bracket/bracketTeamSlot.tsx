import { useBracket } from '@/context/BracketChallengeProvider';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { cn, getImageUrl } from '@/lib/utils';
import { Conference, PlayoffTeam } from '@/types/bracket';
import gsap from 'gsap';
import { ShieldQuestion } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

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
  const { mode, promoteTeam, isSlotLocked, loading } = useBracket();

  const contRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const parentRef = useOutsideClick<HTMLButtonElement>(() => {
    setShowFullInfo(false);
  });

  const [showFullInfo, setShowFullInfo] = useState(false);

  const handleClick = () => {
    //..
    if (!team || mode == 'view') return;
    promoteTeam(matchId || 0, team.id);
  };

  const isDisabled =
    disabled == true || !team || !matchId || mode == 'view' || loading;

  useEffect(() => {
    if (team && isSlotLocked(matchId || 0) && contRef.current) {
      gsap.fromTo(
        contRef.current,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
          // ease: 'power4.out',
          transformOrigin: 'center center',
        },
      );
    }

    return () => {
      if (contRef.current) {
        gsap.killTweensOf(contRef.current);
      }
    };
  }, [team]);

  useEffect(() => {
    if (showFullInfo && infoRef.current) {
      gsap.fromTo(
        infoRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          yPercent: 0,
          duration: 0.4,
          ease: 'elastic.out(1, 0.6)',
          transformOrigin: wing == 'left' ? 'top left' : 'top right',
        },
      );
    }

    return () => {
      if (infoRef.current) {
        gsap.killTweensOf(infoRef.current);
      }
    };
  }, [showFullInfo]);

  const bgColorCls = useMemo(() => {
    if (!team || !winnerId) return '';
    if (mode !== 'view' && winnerId == team.id) return 'bg-emerald-600/20';
    return '';
  }, [mode, team, winnerId]);

  const emptySlot: React.ReactNode = (
    <p className="flex h-11 h-full items-center justify-center rounded border border-gray-500 text-[10px] font-bold tracking-wide text-slate-500 uppercase">
      {placeholder || 'Winner'}
    </p>
  );

  if (!wing) {
    return (
      <div ref={contRef} className="h-12 min-w-44 flex-shrink-0">
        {team ? (
          <button
            className={cn(
              'relative flex h-full w-full cursor-pointer items-center justify-center gap-x-2 overflow-hidden rounded border border-gray-400 hover:bg-gray-800 active:scale-95 disabled:pointer-events-none disabled:cursor-default',
              bgColorCls,
            )}
            onClick={handleClick}
            disabled={isDisabled}
          >
            <img
              src={getImageUrl(team.logo)}
              alt={team.short_name}
              className="absolute right-3 aspect-square h-22 object-contain opacity-70"
            />
            <div
              className={cn(
                'absolute left-4 text-left text-xs text-shadow-gray-800 text-shadow-lg',
              )}
            >
              <p className={cn('font-bold text-amber-100')}>{team.club_name}</p>
              <p className="text-sm font-semibold text-amber-200">
                {team.monicker}
              </p>
            </div>
          </button>
        ) : (
          <>{emptySlot}</>
        )}
      </div>
    );
  }

  //..wing slots..
  return (
    <div ref={contRef} className="relative h-12 min-w-34 select-none">
      {team ? (
        <>
          <button
            ref={parentRef}
            className={cn(
              'absolute z-10 cursor-pointer p-0.5 text-gray-400 disabled:pointer-events-none',
              wing == 'right' ? 'left-0' : 'right-0',
            )}
            disabled={loading}
            onClick={() => setShowFullInfo((prev) => !prev)}
          >
            <ShieldQuestion size={12} />
          </button>

          {showFullInfo && (
            <div
              ref={infoRef}
              className={cn(
                'absolute z-50 flex h-fit w-max items-center rounded border border-gray-500 bg-gray-800 px-4 py-1',
                wing == 'right' ? 'right-full mr-2' : 'left-full ml-2',
              )}
            >
              {/* 2. The Triangle (The "Pointer") */}
              <div
                className={cn(
                  'absolute top-4 h-3 w-3 -translate-y-1/2 rotate-45 border-gray-500 bg-gray-800',
                  wing == 'right'
                    ? '-right-1.5 border-t border-r'
                    : '-left-1.5 border-b border-l',
                )}
              ></div>

              <div className="relative whitespace-nowrap">
                <p className="text-sm font-bold text-gray-300">
                  {team.club_name}
                </p>
                <p className="font-semibold text-slate-400">{team.monicker}</p>
              </div>
            </div>
          )}
          <button
            className={cn(
              'flex h-full w-full cursor-pointer items-center overflow-hidden rounded border border-gray-500 text-gray-300 hover:bg-gray-800 disabled:pointer-events-none disabled:cursor-default',
              wing == 'right' && 'flex-row-reverse',
              bgColorCls,
            )}
            onClick={handleClick}
            disabled={isDisabled}
          >
            <div className="aspect-square h-full overflow-hidden bg-gray-800 p-1">
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
          </button>
        </>
      ) : (
        <>{emptySlot}</>
      )}
    </div>
  );
};

export default BracketTeamSlot;
