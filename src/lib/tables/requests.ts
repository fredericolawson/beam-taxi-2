'use server';

import 'server-only';

import { createClient } from '@/lib/supabase/server';
import type { Request } from '@/types/request';

export async function getRequestById(id: string): Promise<Request | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('requests').select('*').eq('id', id).maybeSingle();
  if (error) {
    console.error('Error fetching mooring by id:', error);
    return null;
  }
  return data as Request;
}
