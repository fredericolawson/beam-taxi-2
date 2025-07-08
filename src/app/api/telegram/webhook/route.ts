import { createClient } from '@/lib/supabase/server';
import { TelegramBot } from '@/lib/telegram';
import { sendTripConfirmation, sendTripUnavailable, updateTripMessage } from '@/lib/telegram-messages';
import { NextRequest, NextResponse } from 'next/server';

const bot = new TelegramBot();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle callback queries (button presses)
    if (body.callback_query) {
      const callbackQuery = body.callback_query;
      const driverId = callbackQuery.from.id.toString();
      const data = callbackQuery.data;
      const messageId = callbackQuery.message.message_id;

      // Parse callback data
      const [action, tripId] = data.split('_');

      if (action === 'accept') {
        const success = await assignTripToDriver(tripId, driverId);

        if (success) {
          const trip = await getTripDetails(tripId);

          await sendTripConfirmation(driverId, trip);

          await updateTripMessage(driverId, messageId, trip, 'confirmed');

          await bot.answerCallbackQuery({
            callback_query_id: callbackQuery.id,
            text: 'Trip confirmed!',
          });
        } else {
          await sendTripUnavailable(driverId);

          const trip = await getTripDetails(tripId);
          await updateTripMessage(driverId, messageId, trip, 'unavailable');

          await bot.answerCallbackQuery({
            callback_query_id: callbackQuery.id,
            text: 'Trip unavailable',
            show_alert: true,
          });
        }
      } else if (action === 'decline') {
        await bot.answerCallbackQuery({
          callback_query_id: callbackQuery.id,
          text: 'Trip declined',
        });
      } else if (action === 'arrived') {
        await updateTripStatus(tripId, 'arrived');
        await bot.answerCallbackQuery({
          callback_query_id: callbackQuery.id,
          text: 'Marked as arrived',
        });
      }
    }

    // Handle regular messages (location sharing, etc.)
    if (body.message) {
      const message = body.message;
      const driverId = message.from.id.toString();

      // Handle location sharing
      if (message.location) {
        await updateDriverLocation(driverId, message.location);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}

// Helper functions
async function assignTripToDriver(tripId: string, driverId: string): Promise<boolean> {
  const supabase = await createClient();

  // Check if trip is still available and assign atomically
  const { data, error } = await supabase
    .from('trips')
    .update({
      driver_id: driverId,
      status: 'assigned',
      assigned_at: new Date().toISOString(),
    })
    .eq('id', tripId)
    .eq('status', 'pending') // Only assign if still pending
    .select()
    .single();

  return !error && data !== null;
}

async function getTripDetails(tripId: string) {
  const supabase = await createClient();

  const { data: trip } = await supabase
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

async function updateTripStatus(tripId: string, status: string) {
  const supabase = await createClient();

  await supabase.from('trips').update({ status }).eq('id', tripId);
}

async function updateDriverLocation(driverId: string, location: { latitude: number; longitude: number }) {
  const supabase = await createClient();

  await supabase.from('drivers').upsert({
    id: driverId,
    current_lat: location.latitude,
    current_lng: location.longitude,
    location_updated_at: new Date().toISOString(),
  });
}
