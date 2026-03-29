import { User, UserBase } from './auth';

export type BracketSection = 'left' | 'right' | 'center';

export type Conference = 'east' | 'west' | 'north' | 'south';

export interface Team {
  id: number;
  club_name: string;
  monicker: string;
  logo?: string;
  slug: string;
  short_name: string;
  conference?: Conference;
  created_at: string;
  updated_at: string;
  league_id: number;
  league?: League;
}

export type LeagueType = 'nba' | 'mpbl' | 'pba';

export interface League {
  id: number;
  name: string;
  short_name: string;
  logo?: string;
  slug: string;
  created_at: string;
  updated_at: string;
  teams_count: number;
  bracket_challenges_count: number;
  teams?: Team[];
  bracket_challenges?: BracketChallenge[];
}

export interface PlayoffTeam extends Team {
  seed: number;
  slot: number;
}

export interface BracketChallengeMatch {
  id: number;
  name: string;
  round_index: number;
  match_index: number;
  conference?: string | null;
  next_match_id: number | null;
  next_match_slot: number | null;
  league_id: number;
  league?: League;
  teams: PlayoffTeam[];
  created_at: string;
  updated_at: string;
  winner_team_id: number | null;
}

export interface BracketChallengePrediction {
  id: number;
  match_id: number;
  match?: BracketChallengeMatch;
  predicted_winner_team_id: number | null;
  status: 'pending' | 'correct' | 'incorrect' | 'void';
}

export interface NbaTeamsSeedData<T = number> {
  league: 'nba';
  teams: {
    east: T[];
    west: T[];
  };
}

export interface MpblTeamsSeedData<T = number> {
  league: 'mpbl';
  teams: {
    north: T[];
    south: T[];
  };
}

export interface PbaTeamsSeedData<T = number> {
  league: 'pba';
  teams: T[];
}

export type TeamsSeedData =
  | NbaTeamsSeedData<Team>
  | MpblTeamsSeedData<Team>
  | PbaTeamsSeedData<Team>;

export type TeamIdsSeedData =
  | NbaTeamsSeedData
  | MpblTeamsSeedData
  | PbaTeamsSeedData;

export type BracketChallengeStatus = 'draft' | 'published' | 'completed';

export interface BracketChallenge {
  id: number;
  slug: string;
  name: string;
  description?: string;
  status: BracketChallengeStatus;
  team_count: number;
  total_rounds: number;
  matches: BracketChallengeMatch[];
  submission_start: string;
  submission_end: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  league_id: number;
  league?: League;
  entries: BracketChallengeEntry[];
  entries_count: number;
  seed_data: TeamIdsSeedData;
  is_open: boolean;
  is_locked: boolean;
}

export interface BracketChallengeEntry {
  id: number;
  name: string;
  slug: string;
  bracket_challenge_id: number;
  bracket_challenge: BracketChallenge;
  user_id: number;
  user: UserBase;
  predictions: BracketChallengePrediction[];
  status: 'active' | 'eliminated' | 'won';
  comments: Comment[];
  comments_count: number;
  votes: Votes;
  created_at: string;
  updated_at: string;
}

export interface Votes {
  likes: number;
  dislikes: number;
}

export interface Comment {
  id: number;
  type: string;
  body: string;
  is_published: boolean;
  user_id: number;
  user: UserBase;
  created_at: string;
  updated_at: string;
  parent_id: number | null;
  replies: Comment[];
  parent?: Comment;
  replies_count: number;
  last_page?: number;
  current_page?: number;
  votes: Votes;
  user_vote: 'like' | 'dislike' | null;
}
