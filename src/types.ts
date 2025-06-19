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

export type Challenge = {
  id: string;
  challengerId: string;
  opponentId: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  result: 'challenger_won' | 'opponent_won' | null;
  createdAt: string;
  updatedAt: string;
};
