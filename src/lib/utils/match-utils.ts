import { getMatchesByPlayerId } from '../tables/matches';
import type { Match } from '@/types';

export async function getMatchHistory({ playerId }: { playerId: string }) {
  const matches = await getMatchesByPlayerId({ playerId });
  const historyDetail = matches.filter((match) => match.completedOn !== null);
  const historySummary = matches.map((match) => (match.winnerId === playerId ? 'W' : 'L'));

  return { historyDetail: historyDetail as Match[], historySummary };
}
