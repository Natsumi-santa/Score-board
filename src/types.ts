export interface MatchRecord {
  id: string;
  matchNumber: number;
  booyahs: number;
  roundsWon: number;
  kills: number;
}

export interface Team {
  id: string;
  name: string;
  booyahs: number;
  roundsWon: number;
  kills: number;
  matchHistory: MatchRecord[];
}

export type QualificationStatus = 'Qualified' | 'Contender' | 'Eliminated';

export interface TeamStanding extends Team {
  totalPoints: number;
  rank: number;
  status: QualificationStatus;
}
