import { getMatchesByPlayerId } from '../tables/matches';
import type { CompletedMatch } from '@/types';

export async function getMatchHistory({ playerId }: { playerId: string }) {
  const matches = await getMatchesByPlayerId({ playerId });
  const completedMatches = matches.filter((match) => match.winnerId !== null);
  const historySummary = completedMatches.map((match) => (match.winnerId === playerId ? 'W' : 'L'));

  return { completedMatches: completedMatches as CompletedMatch[], historySummary };
}
