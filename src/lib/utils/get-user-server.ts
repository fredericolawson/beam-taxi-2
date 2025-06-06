import { createClient } from '@/lib/supabase/server';

export async function getUserServer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
