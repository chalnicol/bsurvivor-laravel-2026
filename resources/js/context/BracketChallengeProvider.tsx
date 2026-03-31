import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  BracketChallenge,
  BracketChallengeMatch,
  BracketChallengePrediction,
  Conference,
  PlayoffTeam,
} from '@/types/bracket';
import { router } from '@inertiajs/react';

interface RoundsInfo {
  rounds: number;
  names: string[];
}

interface BracketChallengeContextType {
  league: string;
  loading: boolean;
  mode: 'view' | 'create' | 'update';
  getMatchesByConference: (value?: Conference) => BracketChallengeMatch[];
  getFinalsMatch: () => BracketChallengeMatch | null;
  getLinkedMatchName: (matchId: number, slot: number) => string;
  promoteTeam: (matchId: number, teamId: number) => void;
  getPlayoffInfo: () => RoundsInfo;
  clearMatch: (matchId: number, conference?: Conference) => void;
  removeMatchWinner: (matchId: number) => void;
  clearAll: () => void;
  submit: () => void;
  update: () => void;
  revert: () => void;
  isSlotLocked: (matchId: number) => boolean;
  isFilledAny: boolean;
  predictionsFilledOut: boolean;
  canUpdateMatches: boolean;
  isUpdated: boolean;
  hasRealWinners: boolean;
}

const BracketChallengeContext =
  createContext<BracketChallengeContextType | null>(null);

export const BracketChallengeProvider = ({
  challenge,
  entryPredictions,
  children,
  mode = 'view',
}: {
  challenge: BracketChallenge;
  children: React.ReactNode;
  mode?: 'view' | 'create' | 'update';
  entryPredictions?: BracketChallengePrediction[];
}) => {
  const [league, setLeague] = useState<string>(
    challenge.league ? challenge.league.short_name.toLowerCase() : '',
  );

  const [loading, setLoading] = useState(false);

  const [matches, setMatches] = useState<BracketChallengeMatch[]>(
    challenge.matches || [],
  );

  const [predictions, setPredictions] = useState<BracketChallengePrediction[]>(
    [],
  );

  // const isFilledAny = predictions.some(
  //   (p) => p.predicted_winner_team_id !== null || p.,
  // );

  const isFilledAny = matches.some(
    (m) => m.winner_team_id !== null || m.predicted_winner_team_id !== null,
  );

  const predictionsFilledOut = !predictions.some(
    (p) => p.predicted_winner_team_id == null,
  );

  const hasRealWinners = challenge.matches.some(
    (m) => m.winner_team_id !== null,
  );

  const canUpdateMatches = mode == 'update' && challenge.can_update_matches;

  useEffect(() => {
    if (mode == 'update') return;
    if (entryPredictions) {
      populateMatches();
    } else {
      createEmptyPredictions();
    }
  }, []);

  const playoffRounds: Record<string, string[]> = {
    nba: ['Round 1', 'Semifinals', 'Conf. Finals'],
    mpbl: ['Quarterfinals', 'Semifinals', 'Division Finals'],
    pba: ['Quarterfinals', 'Semifinals'],
  };

  const isUpdated = useMemo((): boolean => {
    const realWinnerTeamIds = challenge.matches.filter(
      (m) => m.winner_team_id !== null,
    );

    const updateWinnerTeamIds = matches.filter(
      (m) => m.winner_team_id !== null,
    );

    return realWinnerTeamIds.length !== updateWinnerTeamIds.length;
  }, [challenge.matches, matches]);

  const isSlotLocked = (matchId: number): boolean => {
    const match =
      challenge.matches.find(
        (m) =>
          m.id == matchId && (m.winner_team_id !== null || m.round_index > 1),
      ) || null;

    return mode !== 'view' && match !== null;
  };

  const populateMatches = () => {
    if (!entryPredictions) return;

    // 1. Source of Truth (All teams from the initial Round 1 state)
    const allTeams: PlayoffTeam[] = matches
      .filter((m) => m.round_index === 1)
      .flatMap((m) => m.teams);

    let updatedMatches: BracketChallengeMatch[] = [...matches];
    const totalRounds = challenge?.total_rounds || 4;

    // 2. The Iteration (Start at Round 1 to set winners, but only update TEAMS from R2+)
    for (let r = 1; r <= totalRounds; r++) {
      updatedMatches = updatedMatches.map((currentMatch) => {
        // Find user's prediction for this specific match
        const prediction = entryPredictions.find(
          (p) => p.match_id === currentMatch.id,
        );

        // --- ROUND 1: Only update the winner ID ---
        if (currentMatch.round_index === 1 && r === 1) {
          return {
            ...currentMatch,
            predicted_winner_team_id:
              prediction?.predicted_winner_team_id || null,
          };
        }

        // --- ROUNDS 2+: Update Teams AND Winner ID ---
        if (currentMatch.round_index === r && r > 1) {
          // Find parent matches (the ones feeding into this match)
          const parents = updatedMatches.filter(
            (p) => p.next_match_id === currentMatch.id,
          );

          const newTeams: PlayoffTeam[] = parents.map((parent) => {
            const parentPred = entryPredictions.find(
              (p) => p.match_id === parent.id,
            );

            if (parentPred) {
              const winner = allTeams.find(
                (t) => t.id === parentPred.predicted_winner_team_id,
              );
              if (winner) {
                return { ...winner, slot: parent.next_match_slot || 1 };
              }
            }

            // Placeholder so the UI doesn't break
            return {
              id: 0,
              club_name: '',
              monicker: '',
              slot: parent.next_match_slot || 1,
            } as PlayoffTeam;
          });

          // Ensure Top/Bottom sorting
          const sortedTeams = newTeams.sort(
            (a, b) => (a.slot ?? 0) - (b.slot ?? 0),
          );

          return {
            ...currentMatch,
            teams: sortedTeams,
            predicted_winner_team_id:
              prediction?.predicted_winner_team_id || null,
          };
        }

        return currentMatch;
      });
    }

    setMatches(updatedMatches);
  };

  const createEmptyPredictions = () => {
    if (mode === 'create') {
      const newPredictions: BracketChallengePrediction[] =
        challenge.matches.map((m, i) => {
          return {
            id: Math.random() * 9999,
            match_id: m.id,
            predicted_winner_team_id: null,
            status: 'pending',
          };
        });
      setPredictions(newPredictions);
    }
  };

  const getPlayoffInfo = (): RoundsInfo => {
    return {
      rounds: challenge.total_rounds - 1 || 0,
      names: playoffRounds[league],
    };
  };

  const getFinalsMatch = () => {
    if (league == 'nba' || league == 'mpbl')
      return matches.find((m) => m.round_index == 4) || null;

    return matches.find((m) => m.round_index == 3) || null;
  };

  const getMatchesByConference = (value?: Conference) => {
    if (league == 'nba' && value == 'east')
      return matches.filter((m) => m.conference == 'east');
    if (league == 'nba' && value == 'west')
      return matches.filter((m) => m.conference == 'west');
    if (league == 'mpbl' && value == 'south')
      return matches.filter((m) => m.conference == 'south');
    if (league == 'mpbl' && value == 'north')
      return matches.filter((m) => m.conference == 'north');
    return matches;
  };

  const promoteTeam = (matchId: number, teamId: number) => {
    const currentMatch = matches.find((m) => m.id === matchId);
    if (!currentMatch) return;

    // Use optional chaining or defaults; can be null
    const targetMatchId = currentMatch.next_match_id;
    const targetSlot = currentMatch.next_match_slot;

    // 1. Get the team and create a copy with the new slot (if slot exists)
    const sourceTeam = currentMatch.teams.find((t) => t?.id === teamId);

    // We only create this if we actually have a target slot to assign
    const advancedTeam =
      sourceTeam && targetSlot !== null
        ? { ...sourceTeam, slot: targetSlot }
        : null;

    // 2. Update Predictions
    if (mode == 'create') {
      setPredictions((prev) =>
        prev.map((p) =>
          p.match_id === matchId
            ? { ...p, predicted_winner_team_id: teamId }
            : p,
        ),
      );
    }

    // 3. Update Matches
    setMatches((prev) => {
      return prev.map((m) => {
        // ALWAYS update the current match winner
        if (m.id === matchId) {
          return { ...m, predicted_winner_team_id: teamId };
        }

        // ONLY update target match if IDs match AND we have a valid slot/team
        if (targetMatchId !== null && m.id === targetMatchId && advancedTeam) {
          // Filter out anyone already in that specific slot to prevent duplicates
          const otherTeams = m.teams.filter((t) => t?.slot !== targetSlot);

          return {
            ...m,
            teams: [...otherTeams, advancedTeam],
          };
        }

        return m;
      });
    });
  };

  const clearMatch = (matchId: number, conference?: string) => {
    const currentMatch = matches.find((m) => m.id === matchId);
    if (!currentMatch) return;

    const matchesConf = !conference || currentMatch.conference === conference;
    const targetMatchIds = matches
      .filter((m) => m.next_match_id === matchId && matchesConf)
      .map((m) => m.id);

    // 2. Update Predictions (using the IDs we just found)
    if (mode == 'create') {
      setPredictions((prev) =>
        prev.map((p) => {
          // Clear if it's the specific match OR one of the target matches
          if (p.match_id === matchId || targetMatchIds.includes(p.match_id)) {
            return {
              ...p,
              predicted_winner_team_id: null,
            };
          }
          return p;
        }),
      );
    }

    // 3. Update Matches
    setMatches((prev) =>
      prev.map((m) => {
        // Clear winner for the target matches

        // Clear teams for the current match
        if (m.id === matchId) {
          // console.log('cleared');
          return { ...m, teams: [] };
        }
        if (targetMatchIds.includes(m.id)) {
          return { ...m, predicted_winner_team_id: null, winner_team_id: null };
        }
        return m;
      }),
    );
  };

  const clearAll = () => {
    setMatches((prev) =>
      prev.map((m) => {
        const teams = m.round_index !== 1 ? [] : m.teams;
        return {
          ...m,
          winner_team_id: null,
          predicted_winner_team_id: null,
          teams: teams,
        };
      }),
    );
    setPredictions((prev) =>
      prev.map((m) => {
        return {
          ...m,
          predicted_winner_team_id: null,
        };
      }),
    );
  };

  const removeMatchWinner = (matchId: number) => {
    //..
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          return { ...m, winner_team_id: null, predicted_winner_team_id: null };
        }
        return m;
      }),
    );
    setPredictions((prev) =>
      prev.map((p) => {
        if (p.match_id === matchId) {
          return { ...p, predicted_winner_team_id: null };
        }
        return p;
      }),
    );
  };

  const getLinkedMatchName = useCallback(
    (matchId: number, slot: number) => {
      const targetMatch = matches.find(
        (m) => m.next_match_id == matchId && m.next_match_slot == slot,
      );
      return targetMatch?.name || '';
    },
    [matches],
  );

  const revert = () => {
    if (mode == 'update') setMatches(challenge.matches);
  };

  const update = () => {
    //..
  };

  const submit = () => {
    //payload
    const entry_data = predictions.map((p) => {
      return {
        match_id: p.match_id,
        predicted_winner_team_id: p.predicted_winner_team_id,
      };
    });

    setLoading(true);
    router.post(
      `/bracket-challenges/${challenge.id}/submit-entry`,
      { entry_data },
      {
        onFinish: () => setLoading(false),
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );

    //..
    //..
  };

  const data: BracketChallengeContextType = {
    league,
    loading,
    mode,
    predictionsFilledOut,
    clearMatch,
    getMatchesByConference,
    getFinalsMatch,
    getPlayoffInfo,
    clearAll,
    promoteTeam,
    removeMatchWinner,
    getLinkedMatchName,
    update,
    revert,
    submit,
    isSlotLocked,
    isFilledAny,
    canUpdateMatches,
    isUpdated,
    hasRealWinners,
  };

  return (
    <BracketChallengeContext.Provider value={data}>
      {children}
    </BracketChallengeContext.Provider>
  );
};

export function useBracket() {
  const context = useContext(BracketChallengeContext);
  if (!context) throw new Error('useBracket must be used within AdminProvider');
  return context;
}

export default BracketChallengeProvider;
