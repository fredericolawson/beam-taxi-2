'use server';

import { TripInsert } from '@/types';
import { createClient } from '@/lib/supabase/server';

export async function createTrip({ trip }: { trip: TripInsert }) {
  const supabase = await createClient();

  const { data, error } = await supabase.schema('taxi').from('trips').insert(trip).select().single();

  if (error) throw error;

  return data;
}
