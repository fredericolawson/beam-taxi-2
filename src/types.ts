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
  opponent: Player;
  winner: Player | null;
  challengerId: string;
  opponentId: string;
  winnerId: string | null;
  completedOn: string | null;
  result: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PendingMatch = {
  id: string;
  challenger: Player;
  opponent: Player;
  challengerId: string;
  opponentId: string;
};

export type CompletedMatch = {
  id: string;
  challenger: Player;
  opponent: Player;
  winner: Player;
  challengerId: string;
  opponentId: string;
  winnerId: string;
  completedOn: string;
  result: string;
  createdAt: string;
};
