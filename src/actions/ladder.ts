'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Player } from '@/types';

export async function updateLadderRanks({ matchId, winnerId }: { matchId: string; winnerId: string }) {
  try {
    const supabase = await createClient();

    // Get match details
    const { data: match, error } = await supabase
      .schema('ladder')
      .from('matches')
      .select(
        'challenger_id, defender_id, challenger:players!matches_challenger_id_fkey(ladder_rank), defender:players!matches_defender_id_fkey(ladder_rank)'
      )
      .eq('id', matchId)
      .single();

    if (error) {
      console.error('Error fetching match:', error);
      return;
    }

    if (!match) {
      console.error('No match found for ID:', matchId);
      return;
    }

    console.log('Match data:', match);
    console.log('Challenger data:', match.challenger);
    console.log('Defender data:', match.defender);

    if (winnerId !== match.challenger_id) {
      console.log('Winner is not challenger, no rank update needed');
      return;
    }

    if (!match.challenger || !match.defender) {
      console.error('Missing challenger or defender data:', {
        challenger: match.challenger,
        defender: match.defender,
      });
      return;
    }

    const challengerRank = (match.challenger as unknown as { ladder_rank: number }).ladder_rank;
    const defenderRank = (match.defender as unknown as { ladder_rank: number }).ladder_rank;

    console.log('Updating ranks:', { challengerRank, defenderRank });

    // Update ranks in transaction
    const { error: rpcError } = await supabase.rpc('update_ladder_ranks', {
      winner_id: winnerId,
      old_rank: challengerRank,
      new_rank: defenderRank,
    });

    if (rpcError) {
      console.error('Error updating ladder ranks:', rpcError);
      return;
    }

    console.log('Successfully updated ladder ranks');
    revalidatePath('/');
  } catch (error) {
    console.error('Unexpected error in updateLadderRanks:', error);
  }
}
