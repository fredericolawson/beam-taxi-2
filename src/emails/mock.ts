import { CompletedMatch, Match, Player } from '@/types';

export const mockPlayer1: Player = {
  id: 'player-1-id',
  userId: 'user-1-id',
  ladderRank: 5,
  isApproved: true,
  createdAt: '2024-01-01T10:00:00Z',
  firstName: 'John',
  lastName: 'Smith',
  phone: '+1-441-123-4567',
  displayName: 'John Smith',
  email: 'john.smith@example.com',
  matches: [],
};

export const mockPlayer2: Player = {
  id: 'player-2-id',
  userId: 'user-2-id',
  ladderRank: 3,
  isApproved: true,
  createdAt: '2024-01-01T10:00:00Z',
  firstName: 'Sarah',
  lastName: 'Johnson',
  phone: '+1-441-987-6543',
  displayName: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  matches: [],
};

// Default match object for testing
export const defaultMatch: Match = {
  id: 'match-123',
  challenger: mockPlayer1,
  defender: mockPlayer2,
  winner: null,
  challengerId: mockPlayer1.id,
  defenderId: mockPlayer2.id,
  winnerId: null,
  matchDate: '2024-12-20T14:00:00Z',
  result: null,
  createdAt: '2024-12-15T10:00:00Z',
  updatedAt: '2024-12-15T10:00:00Z',
};

// Completed match for testing completed match scenarios
export const defaultCompletedMatch: CompletedMatch = {
  id: 'completed-match-456',
  challenger: mockPlayer1,
  defender: mockPlayer2,
  winner: mockPlayer2,
  challengerId: mockPlayer1.id,
  defenderId: mockPlayer2.id,
  winnerId: mockPlayer2.id,
  matchDate: '2024-12-18T14:00:00Z',
  result: '8-6',
  createdAt: '2024-12-15T10:00:00Z',
};
