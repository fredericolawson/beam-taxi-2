'use server';

import { createClient } from '@/lib/supabase/server';
import type { Match } from '@/types';
import camelcaseKeys from 'camelcase-keys';
import { revalidatePath } from 'next/cache';

export async function challengePlayer({ challengerId, defenderId }: { challengerId: string; defenderId: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase.schema('ladder').from('matches').insert({
    opponent_id: defenderId,
    challenger_id: challengerId,
  });

  if (error) {
    console.error(error);
    return { error: error.message };
  }

  return { data, error };
}

/*
--------------------------------
Server Action to get bilateral matches between two players
--------------------------------
*/

export async function getBiMatches({ challengerId, defenderId }: { challengerId: string; defenderId: string }): Promise<Match[] | []> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('ladder')
    .from('matches')
    .select(
      '*, challenger:players!matches_challenger_id_fkey(*), opponent:players!matches_opponent_id_fkey(*), winner:players!matches_winner_id_fkey(*)'
    )
    .eq('challenger_id', challengerId)
    .eq('opponent_id', defenderId);
  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
  const matches = camelcaseKeys(data, { deep: true }) as Match[];
  return matches;
}

export async function getPendingBiMatch({ challengerId, defenderId }: { challengerId: string; defenderId: string }) {
  const matches = await getBiMatches({ challengerId, defenderId });
  const pendingMatches = matches.filter((match) => match.winnerId === null);
  return pendingMatches[0] as Match | null;
}

/*
--------------------------------
Server Action to submit a match result
--------------------------------
*/

export async function submitMatchResult({
  matchId,
  winnerId,
  score,
  completedOn,
}: {
  matchId: string;
  winnerId: string;
  score: string;
  completedOn: Date;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('ladder')
    .from('matches')
    .update({
      winner_id: winnerId,
      score: score,
      completed_on: completedOn,
    })
    .eq('id', matchId);
  if (error) {
    console.error('Error submitting match result:', error);
    return { error: error.message };
  }
  return { data, error };
}

/*
--------------------------------
Server Action to cancel a match
--------------------------------
*/

export async function cancelMatchAction({ matchId }: { matchId: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase.schema('ladder').from('matches').delete().eq('id', matchId);
  if (error) {
    console.error('Error cancelling match:', error);
    return { error: error.message };
  }
  revalidatePath('/');
  return { data, error };
}
