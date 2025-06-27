'use server';

import { createClient } from '@/lib/supabase/server';

export async function isUserAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.schema('ladder').from('admin_users').select('id').eq('user_id', userId).single();

  if (error || !data) {
    return false;
  }

  return true;
}

export async function getCurrentUserIsAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  return isUserAdmin(user.id);
}
