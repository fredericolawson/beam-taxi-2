'use server';

import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { completeMoorings, Mooring, type CompleteMooring } from '@/types/mooring';

export async function getAvailableMoorings(): Promise<CompleteMooring[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('moorings').select('*').eq('is_available', true);
  if (error) {
    console.error('Error fetching available moorings:', error);
    return [];
  }

  return completeMoorings(data as Mooring[]);
}
