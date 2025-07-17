'use server';

import type { AssignedTrip, Trip, TripInsert } from '@/types';
import { createClient } from '@/lib/supabase/server';
import { sendTripRequest, sendTripCancelled } from './telegram';
import { revalidatePath } from 'next/cache';

export async function createTrip({ tripRequest }: { tripRequest: TripInsert }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('taxi')
    .from('trips')
    .insert(tripRequest)
    .select(
      `
    *,
    rider:riders (
      name,
      phone
    )
  `
    )
    .single();
  if (error) throw error;
  const trip = data as Trip;
  await sendTripRequest({ trip });

  return trip;
}
export async function storeMessageId({ trip_id, message_id }: { trip_id: string; message_id: number }) {
  const supabase = await createClient();
  const { error } = await supabase.schema('taxi').from('trips').update({ message_id }).eq('id', trip_id);
  if (error) throw error;
  console.log('Message ID stored', trip_id, message_id);
}

export async function getActiveTrips({ riderId }: { riderId: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema('taxi')
    .from('trips')
    .select(
      `
      *,
      rider:riders (
        name,
        phone
      ),
      driver:drivers (
        name,
        phone
      )
    `
    )
    .eq('rider_id', riderId)
    .is('cancelled_at', null)
    .order('requested_at', { ascending: false });

  if (error) throw error;

  return data.map((trip) => ({
    ...trip,
    status: trip.assigned_at ? 'assigned' : 'pending',
  }));
}

/*
==============================================
assign driver
==============================================
*/

export async function assignTripToDriver({ tripId, driver_id, message_id }: { tripId: string; driver_id: string; message_id: number }) {
  const supabase = await createClient();

  // Check if trip is still available and assign atomically
  const { data, error } = await supabase
    .schema('taxi')
    .from('trips')
    .update({
      driver_id,
      assigned_at: new Date().toISOString(),
      message_id,
    })
    .eq('id', tripId)
    .is('driver_id', null) // Changed from .eq() to .is()
    .select(`*, driver:drivers (*), rider:riders (*)`)
    .single();

  if (error) {
    console.error('error', error);
    if (error.code === 'PGRST116') {
      return false;
    }
    throw new Error(error.message);
  }

  return data as AssignedTrip;
}

/*
==============================================
cancel trip
==============================================
*/
export async function cancelTrip({ trip_id }: { trip_id: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('taxi')
    .from('trips')
    .update({ cancelled_at: new Date() })
    .eq('id', trip_id)
    .select(`*, driver:drivers (*), rider:riders (*)`)
    .single();
  if (error) throw error;
  if (data.driver_id) {
    const trip = data as AssignedTrip;
    await sendTripCancelled({ trip });
  }
  revalidatePath('/');
  return data;
}
