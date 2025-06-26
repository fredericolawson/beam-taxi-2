import { getMatchesByPlayerId } from '../tables/matches';
import type { CompletedMatch } from '@/types';

export async function getMatchHistory({ playerId }: { playerId: string }) {
  const matches = await getMatchesByPlayerId({ playerId });
  const completedMatches = matches.filter((match) => match.winnerId !== null);
  const historySummary = completedMatches.map((match) => (match.winnerId === playerId ? 'W' : 'L'));
  const history = { matches: completedMatches as CompletedMatch[], summary: historySummary };

  return history;
}
