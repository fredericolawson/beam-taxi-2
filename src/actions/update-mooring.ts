'use server';

import { createClient } from '@/lib/supabase/server';
import { getUserServer } from '@/lib/utils/get-user-server';
import type { Mooring } from '@/types/mooring';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function updateMooring(mooringId: string, updateData: Partial<Mooring>) {
  const user = await getUserServer();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('moorings').update(updateData).eq('id', mooringId).eq('owner_id', user.id); // RLS makes this eq redundant but adds clarity
  if (error) {
    console.error('Error updating mooring:', error);
    return null;
  }

  revalidatePath('/');
  revalidatePath(`/moorings/${mooringId}`);
  redirect(`/moorings/${mooringId}`);
}
