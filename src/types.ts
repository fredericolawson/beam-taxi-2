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
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  result: 'challenger_won' | 'opponent_won' | null;
  createdAt: string;
  updatedAt: string;
};
