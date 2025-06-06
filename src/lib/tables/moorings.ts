'use server';

import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { completeMoorings, isCompleteMooring, type CompleteMooring, type Mooring } from '@/types/mooring';

export async function getAvailableMoorings(): Promise<CompleteMooring[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('moorings').select('*').eq('is_available', true);
  if (error) {
    console.error('Error fetching available moorings:', error);
    return [];
  }

  return completeMoorings(data as Mooring[]);
}

export async function getMooringById(id: string): Promise<CompleteMooring | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('moorings').select('*').eq('id', id).maybeSingle();
  if (error) {
    console.error('Error fetching mooring by id:', error);
    return null;
  }
  return isCompleteMooring(data as Mooring) ? (data as CompleteMooring) : null;
}
