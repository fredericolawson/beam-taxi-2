'use server';

import { createClient } from '@/lib/supabase/server';
import { Mooring } from '@/types/mooring';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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

export async function createMooring({ mooringName }: { mooringName: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-up');

  const { data, error } = await supabase.from('moorings').insert({ name: mooringName, owner_id: user.id }).select().single();

  if (error) {
    console.error('Error creating mooring:', error);
    return null;
  }

  revalidatePath('/');
  revalidatePath(`/moorings/${data.id}/edit`);
  redirect(`/moorings/${data.id}/edit`);
}
