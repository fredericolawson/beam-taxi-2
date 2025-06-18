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

export async function getRequests(): Promise<Request[]> {
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

export async function getOpenRequests(): Promise<Request[]> {
  const requests = await getRequests();
  return requests.filter((request) => request.isComplete);
}

function processRequest(request: RawRequest): Request {
  return {
    ...request,
    start_date: request.start_date ? new Date(request.start_date) : new Date(),
    expires_on: request.expires_on ? new Date(request.expires_on) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    request_type: request.request_type ?? 'either',
    hurricane_insured: request.hurricane_insured ?? 'either',
    boat_length: request.boat_length ?? '',
    preferred_location: request.preferred_location ?? '',
    price_from: request.price_from ?? 250,
    price_to: request.price_to ?? 400,
    isComplete: isComplete(request),
  };
}

function processRequests(requests: RawRequest[]): Request[] {
  return requests.map(processRequest);
}

function isComplete(request: RawRequest) {
  if (
    request.description &&
    request.preferred_location &&
    request.request_type &&
    request.boat_length &&
    request.price_from &&
    request.price_to &&
    request.start_date &&
    request.expires_on
  ) {
    return true;
  }
  return false;
}
