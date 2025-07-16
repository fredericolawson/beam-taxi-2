import { createClient } from '../supabase/server';
import type { Trip, RawTrip } from '@/types';
import { getDriverByTelegramId } from './drivers';

export async function getTrip({ tripId }: { tripId: string }) {
  const supabase = await createClient();

  const { data: trip, error } = await supabase
    .schema('taxi')
    .from('trips')
    .select(
      `
      *,
      rider:riders (
        name,
        phone
      )
    `
    )
    .eq('id', tripId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(error.message);
  }

  return processTripData(trip) as Trip;
}
export async function listTripsByRiderId({ riderId }: { riderId: string }) {
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
    .eq('rider_id', riderId);
  if (error) {
    console.error('error', error);
    throw error;
  }

  return data.map(processTripData) as Trip[];
}

export async function assignTripToDriver({ tripId, driverTelegramId }: { tripId: string; driverTelegramId: string }): Promise<boolean> {
  const supabase = await createClient();

  const driver = await getDriverByTelegramId({ telegramId: driverTelegramId });

  // Check if trip is still available and assign atomically
  const { data, error } = await supabase
    .schema('taxi')
    .from('trips')
    .update({
      driver_id: driver.id,
      assigned_at: new Date().toISOString(),
    })
    .eq('id', tripId)
    .is('driver_id', null) // Changed from .eq() to .is()
    .select()
    .single();

  if (error) {
    console.error('error', error);
    if (error.code === 'PGRST116') {
      return false;
    }
    throw new Error(error.message);
  }

  return true;
}

function processTripData(trip: RawTrip): Trip {
  const status = trip.cancelled_at ? 'cancelled' : trip.assigned_at ? 'assigned' : 'pending';

  return {
    ...trip,
    status,
  };
}
