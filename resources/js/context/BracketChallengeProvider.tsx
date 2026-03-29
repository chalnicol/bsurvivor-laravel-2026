import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  BracketChallenge,
  BracketChallengeMatch,
  BracketChallengePrediction,
  Conference,
} from '@/types/bracket';

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

  teamAdvance: (matchId: number, teamId: number) => void;
  getPlayoffInfo: () => RoundsInfo;
  clearMatch: (matchId: number, conference?: Conference) => void;
  clearAll: () => void;
  submit: () => void;
  hasPrediction: boolean;
  isFilled: boolean;
  removeMatchWinner: (matchId: number) => void;
}

const BracketChallengeContext =
  createContext<BracketChallengeContextType | null>(null);

export const BracketChallengeProvider = ({
  challenge,
  entryPredictions,
  children,
  mode = 'create',
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

  const hasPrediction = predictions.some(
    (p) => p.predicted_winner_team_id !== null,
  );

  const isFilled = !predictions.some((p) => p.predicted_winner_team_id == null);

  useEffect(() => {
    if (mode !== 'create') return;
    if (entryPredictions) {
      setPredictions(entryPredictions);
    } else {
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
  }, []);

  const playoffRounds: Record<string, string[]> = {
    nba: ['Round 1', 'Semifinals', 'Conf. Finals'],
    mpbl: ['Quarterfinals', 'Semifinals', 'Division Finals'],
    pba: ['Quarterfinals', 'Semifinals'],
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

  const teamAdvance = (matchId: number, teamId: number) => {
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
          return { ...m, winner_team_id: teamId };
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
            return { ...p, predicted_winner_team_id: null };
          }
          return p;
        }),
      );
    }

    // 3. Update Matches
    setMatches((prev) =>
      prev.map((m) => {
        // Clear winner for the target matches
        if (targetMatchIds.includes(m.id)) {
          return { ...m, winner_team_id: null };
        }
        // Clear teams for the current match
        if (m.id === matchId) {
          return { ...m, teams: [] };
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
          return { ...m, winner_team_id: null };
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

  const submit = () => {
    //..
  };

  const data: BracketChallengeContextType = {
    league,
    loading,
    mode,
    isFilled,
    clearMatch,
    getMatchesByConference,
    getFinalsMatch,
    getPlayoffInfo,
    hasPrediction,
    clearAll,
    teamAdvance,
    submit,
    removeMatchWinner,
    getLinkedMatchName,
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
