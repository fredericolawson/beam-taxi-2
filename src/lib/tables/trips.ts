import { createClient } from '../supabase/server';

export async function getTrip(tripId: string) {
  const supabase = await createClient();

  const { data: trip, error } = await supabase
    .schema('taxi')
    .from('trips')
    .select(
      `
      *,
      riders (
        name,
        phone
      )
    `
    )
    .eq('id', tripId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: trip.id,
    pickup: {
      address: trip.pickup_address,
      lat: trip.pickup_lat,
      lng: trip.pickup_lng,
    },
    destination: {
      address: trip.destination_address,
      lat: trip.destination_lat,
      lng: trip.destination_lng,
    },
    fare: trip.estimated_fare,
    rider: {
      name: trip.riders.name,
      phone: trip.riders.phone,
    },
  };
}
