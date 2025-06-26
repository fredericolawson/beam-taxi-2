'use server';

import { createClient } from '@/lib/supabase/server';
import type { Match, CompletedMatch } from '@/types';
import camelcaseKeys from 'camelcase-keys';

export async function getMatches(): Promise<Match[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('ladder')
    .from('matches')
    .select(
      '*, challenger:players!matches_challenger_id_fkey(*), defender:players!matches_defender_id_fkey(*), winner:players!matches_winner_id_fkey(*)'
    )
    .order('completed_on', { ascending: false });
  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
  const matches = camelcaseKeys(data, { deep: true }) as Match[];

  return matches;
}

/*
--------------------------------
Completed Matches
--------------------------------
*/

export async function getCompletedMatches(): Promise<CompletedMatch[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('ladder')
    .from('matches')
    .select(
      '*, challenger:players!matches_challenger_id_fkey(*), defender:players!matches_defender_id_fkey(*), winner:players!matches_winner_id_fkey(*)'
    )
    .order('completed_on', { ascending: false })
    .not('winner_id', 'is', null);
  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
  const matches = camelcaseKeys(data, { deep: true }) as CompletedMatch[];

  return matches;
}

export async function getMatchesByPlayerId({ playerId }: { playerId: string }): Promise<Match[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('ladder')
    .from('matches')
    .select(
      '*, challenger:players!matches_challenger_id_fkey(*), defender:players!matches_defender_id_fkey(*), winner:players!matches_winner_id_fkey(*)'
    )
    .or(`defender_id.eq.${playerId},winner_id.eq.${playerId}`)
    .not('winner_id', 'is', null)
    .order('completed_on', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching matches by player id:', error);
    return [];
  }
  const matches = camelcaseKeys(data, { deep: true }) as Match[];
  return matches;
}
