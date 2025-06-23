import { createClient } from '@/lib/supabase/server';
import type { Match } from '@/types';
import camelcaseKeys from 'camelcase-keys';

export async function getMatches(): Promise<Match[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('ladder')
    .from('matches')
    .select(
      '*, challenger:players!matches_challenger_id_fkey(*), opponent:players!matches_opponent_id_fkey(*), winner:players!matches_winner_id_fkey(*)'
    )
    .order('completed_on', { ascending: true });
  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
  const matches = camelcaseKeys(data, { deep: true }) as Match[];

  return matches;
}

export async function getMatchesByPlayerId({ playerId }: { playerId: string }): Promise<Match[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('ladder')
    .from('matches')
    .select('*')
    .or(`opponent_id.eq.${playerId},winner_id.eq.${playerId}`)
    .not('winner_id', 'is', null);
  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
  const matches = camelcaseKeys(data, { deep: true }) as Match[];
  return matches;
}
