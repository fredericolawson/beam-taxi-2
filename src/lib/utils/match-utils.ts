import { getMatchesByPlayerId } from '../tables/matches';

export async function getMatchHistory({ playerId }: { playerId: string }): Promise<('W' | 'L')[]> {
  const matches = await getMatchesByPlayerId({ playerId });
  return matches.map((match) => (match.winnerId === playerId ? 'W' : 'L'));
}
