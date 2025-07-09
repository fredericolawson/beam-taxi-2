'use server';

import type { TripInsert } from '@/types';
import { createClient } from '@/lib/supabase/server';

export async function createTrip({ trip }: { trip: TripInsert }) {
  const supabase = await createClient();

  const { data, error } = await supabase.schema('taxi').from('trips').insert(trip).select().single();

  if (error) throw error;

  return data;
}

export async function cancelTrip({ trip_id }: { trip_id: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema('taxi')
    .from('trips')
    .update({ cancelled_at: new Date() })
    .eq('id', trip_id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getActiveTrips({ riderId }: { riderId: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema('taxi')
    .from('trips')
    .select(`
      *,
      rider:riders (
        name,
        phone
      ),
      driver:drivers (
        name,
        phone
      )
    `)
    .eq('rider_id', riderId)
    .is('cancelled_at', null)
    .order('requested_at', { ascending: false });

  if (error) throw error;

  return data.map(trip => ({
    ...trip,
    status: trip.assigned_at ? 'assigned' : 'pending'
  }));
}
