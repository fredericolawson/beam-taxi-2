'use server';

import { createClient } from '@/lib/supabase/server';
import type { Match } from '@/types';
import camelcaseKeys from 'camelcase-keys';
import { revalidatePath } from 'next/cache';
import { updateLadderRanks } from './ladder';
import { sendMatchConfirmation, sendMatchResult } from './email';

export async function challengePlayer({ challengerId, defenderId }: { challengerId: string; defenderId: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase.schema('ladder').from('matches').insert({
    defender_id: defenderId,
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

export async function getBiMatches({ playerOneId, playerTwoId }: { playerOneId: string; playerTwoId: string }): Promise<Match[] | []> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('ladder')
    .from('matches')
    .select(
      '*, challenger:players!matches_challenger_id_fkey(*), defender:players!matches_defender_id_fkey(*), winner:players!matches_winner_id_fkey(*)'
    )
    .or(
      `and(challenger_id.eq.${playerOneId},defender_id.eq.${playerTwoId}),and(challenger_id.eq.${playerTwoId},defender_id.eq.${playerOneId})`
    );

  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
  const matches = camelcaseKeys(data, { deep: true }) as Match[];
  return matches;
}

export async function getPendingBiMatch({ playerOneId, playerTwoId }: { playerOneId: string; playerTwoId: string }) {
  const matches = await getBiMatches({ playerOneId, playerTwoId });
  const pendingMatches = matches.filter((match) => match.winnerId === null);
  return pendingMatches[0] as Match | null;
}

/*
--------------------------------
Server Action to set matchDate
--------------------------------
*/

export async function setMatchDate({ matchId, matchDate }: { matchId: string; matchDate: string | null }) {
  const supabase = await createClient();
  const { data, error } = await supabase.schema('ladder').from('matches').update({ match_date: matchDate }).eq('id', matchId);
  if (error) {
    console.error('Error setting match date:', error);
    return { error: error.message };
  }
  await sendMatchConfirmation({ matchId });
  return { data, error };
}

/*
--------------------------------
Server Action to submit a match result
--------------------------------
*/

export async function submitMatchResult({ matchId, winnerId, result }: { matchId: string; winnerId: string; result: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('ladder')
    .from('matches')
    .update({
      winner_id: winnerId,
      result: result,
    })
    .eq('id', matchId);
  if (error) {
    console.error('Error submitting match result:', error);
    return { error: error.message };
  }
  await sendMatchResult({ matchId });

  // Update ladder ranks if challenger wins
  await updateLadderRanks({ matchId, winnerId });

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
