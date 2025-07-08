import { createClient } from '../supabase/server';
import { Trip } from '@/types';
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
      // This is the error code when no rows or multiple rows are returned
      return null;
    }
    throw new Error(error.message);
  }

  return trip as Trip;
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
