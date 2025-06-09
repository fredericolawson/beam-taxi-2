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

export async function getOpenRequests(): Promise<Request[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .gt('expires_on', new Date().toISOString())
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching open requests:', error);
    return [];
  }
  return data as Request[];
}

export async function getRequestsByOwner(userId: string): Promise<Request[]> {
  if (!userId) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from('requests').select('*').eq('owner_id', userId).order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching moorings for owner ${userId}:`, error);
    return [];
  }
  return data as Request[];
}
