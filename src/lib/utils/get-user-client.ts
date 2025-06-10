'use client';
import { createClient } from '@/lib/supabase/client';

export async function getUserClient() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ?? null;
}
