'use server';

import { createClient } from '@/lib/supabase/server';

export async function challengePlayer({ challengerId, opponentId }: { challengerId: string; opponentId: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase.schema('ladder').from('matches').insert({
    challenger_id: challengerId,
    opponent_id: opponentId,
  });

  if (error) {
    console.error(error);
    return { error: error.message };
  }

  return { data, error };
}
