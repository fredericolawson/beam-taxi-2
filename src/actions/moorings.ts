'use server';

import { createClient } from '@/lib/supabase/server';
import { Mooring } from '@/types/mooring';

export async function updateMooring({ mooringId, data }: { mooringId: string; data: Partial<Mooring> }) {
  const supabase = await createClient();
  const { data: updatedMooring, error } = await supabase.from('moorings').update(data).eq('id', mooringId).select().single();
  return { updatedMooring, error };
}

export async function deleteMooring({ mooringId }: { mooringId: string }) {
  const supabase = await createClient();
  const { error } = await supabase.from('moorings').delete().eq('id', mooringId);
  return { error };
}
