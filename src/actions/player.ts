'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updatePlayer(playerId: string, values: { firstName: string; lastName: string; phone: string }) {
  const supabase = await createClient();

  // Get the current user to ensure they can only update their own record
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: new Error('User not authenticated') };
  }

  // Verify the player exists and belongs to this user
  const { data: existingPlayer, error: fetchError } = await supabase
    .schema('ladder')
    .from('players')
    .select('id, user_id, first_name, last_name, phone')
    .eq('id', playerId)
    .single();

  if (fetchError) {
    return { error: fetchError };
  }

  if (existingPlayer.user_id !== user.id) {
    return { error: new Error("Unauthorized: Cannot update another user's player record") };
  }

  const { error } = await supabase
    .schema('ladder')
    .from('players')
    .update({
      first_name: values.firstName,
      last_name: values.lastName,
      phone: values.phone,
    })
    .eq('id', playerId);

  if (error) return { error };

  revalidatePath('/profile');
  return { success: true };
}
