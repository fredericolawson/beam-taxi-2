export type RawPlayer = {
  id: string;
  user_id: string;
  ladder_rank: number;
  is_approved: boolean;
  created_at: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  matches: Match[];
};

export type Player = {
  id: string;
  userId: string;
  ladderRank: number;
  isApproved: boolean;
  createdAt: string;
  firstName: string;
  lastName: string;
  phone: string;
  displayName: string;
  email: string;
  matches: Match[];
};

export type Match = {
  id: string;
  challenger: Player;
  defender: Player;
  winner: Player | null;
  challengerId: string;
  defenderId: string;
  winnerId: string | null;

  matchDate: string | null;
  result: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PendingMatch = {
  id: string;
  challenger: Player;
  defender: Player;
  challengerId: string;
  defenderId: string;
};

export type CompletedMatch = {
  id: string;
  challenger: Player;
  defender: Player;
  winner: Player;
  challengerId: string;
  defenderId: string;
  winnerId: string;

  matchDate: string;
  result: string;
  createdAt: string;
};
