'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updatePlayer(playerId: string, values: {}) {
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
    .select('id, user_id')
    .eq('id', playerId)
    .single();

  if (fetchError) {
    return { error: fetchError };
  }

  if (existingPlayer.user_id !== user.id) {
    return { error: new Error("Unauthorized: Cannot update another user's player record") };
  }

  // Note: All user data (email, phone, first_name, last_name) is now automatically
  // synced from auth.users via database triggers. This function is kept for
  // future player-specific fields that aren't in auth metadata.

  revalidatePath('/profile');
  return { success: true };
}
