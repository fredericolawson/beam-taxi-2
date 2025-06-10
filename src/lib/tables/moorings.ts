'use server';

import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { completeMoorings } from '@/types/mooring';
import type { CompleteMooring, Mooring, MooringWithOwner } from '@/types/mooring';

export async function getAvailableMoorings(): Promise<CompleteMooring[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('moorings').select('*').eq('is_available', true);
  if (error) {
    console.error('Error fetching available moorings:', error);
    return [];
  }

  return completeMoorings(data as Mooring[]);
}

export async function getMooringById(id: string): Promise<Mooring | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('moorings').select('*').eq('id', id).maybeSingle();

  if (error) {
    console.error('Error fetching mooring by id:', error);
    return null;
  }

  if (!data) return null;

  return data as Mooring;
}

export async function getMooringsByOwner(userId: string): Promise<Mooring[]> {
  if (!userId) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from('moorings').select('*').eq('owner_id', userId).order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching moorings for owner ${userId}:`, error);
    return [];
  }
  return data as Mooring[];
}
