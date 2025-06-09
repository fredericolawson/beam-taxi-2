'use server';

import 'server-only';

import { createClient } from '@/lib/supabase/server';
import type { RawRequest, Request } from '@/types/request';

export async function getRequestById(id: string): Promise<Request | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('requests').select('*').eq('id', id).maybeSingle();
  if (error) {
    console.error('Error fetching mooring by id:', error);
    return null;
  }
  return processRequest(data) as Request;
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
  return processRequests(data) as Request[];
}

export async function getRequestsByOwner(userId: string): Promise<Request[]> {
  if (!userId) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from('requests').select('*').eq('owner_id', userId).order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching moorings for owner ${userId}:`, error);
    return [];
  }
  return processRequests(data) as Request[];
}

function processRequest(request: RawRequest): Request {
  return {
    ...request,
    start_date: new Date(request.start_date),
    expires_on: new Date(request.expires_on),
  };
}

function processRequests(requests: RawRequest[]): Request[] {
  return requests.map(processRequest);
}
