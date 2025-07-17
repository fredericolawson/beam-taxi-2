import { createClient } from '@/lib/supabase/server';
import { TelegramBot } from '@/lib/telegram';
import { sendLocationPrompt, sendTripConfirmed, sendTripUnavailable } from '@/actions/telegram';
import { assignTripToDriver } from '@/actions/trip';
import { NextRequest, NextResponse } from 'next/server';
import { getDriverByTelegramId } from '@/lib/tables/drivers';
import { AssignedTrip, Trip } from '@/types';
import { storeMessageId } from '@/actions/trip';

const bot = new TelegramBot();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle callback queries (button presses)
    if (body.callback_query) {
      const callbackQuery = body.callback_query;
      const driver_telegram_id = callbackQuery.from.id.toString();
      const data = callbackQuery.data;
      const message_id = callbackQuery.message.message_id;

      // Parse callback data
      const [action, tripId] = data.split('_');

      if (action === 'accept') {
        try {
          // First check if driver exists
          const driver = await getDriverByTelegramId({ driver_telegram_id });
          if (!driver) return;

          const trip = await assignTripToDriver({ tripId, driver_id: driver.id, message_id });

          if (trip) {
            await sendTripConfirmed({ trip });
            await sendLocationPrompt({ driver_telegram_id });
            await bot.answerCallbackQuery({
              callback_query_id: callbackQuery.id,
              text: 'Trip confirmed!',
            });
          } else {
            await sendTripUnavailable({ driver_telegram_id, message_id });
            await bot.answerCallbackQuery({
              callback_query_id: callbackQuery.id,
              text: 'Trip is no longer available',
              show_alert: true,
            });
          }
        } catch (error) {
          console.error('Error accepting trip:', error);
          await bot.answerCallbackQuery({
            callback_query_id: callbackQuery.id,
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
            show_alert: true,
          });
        }
      } else if (action === 'decline') {
        await bot.answerCallbackQuery({
          callback_query_id: callbackQuery.id,
          text: 'Trip declined',
        });
      }
    }

    // Handle regular messages (location sharing, etc.)
    if (body.message) {
      const message = body.message;
      const driver_telegram_id = message.from.id.toString();
      const driver = await getDriverByTelegramId({ driver_telegram_id });
      // Handle location sharing
      if (message.location) {
        try {
          await updateDriverLocation({ driverId: driver.id, location: message.location });
        } catch (error) {
          console.error('Error updating driver location:', error);
          await bot.sendMessage(driver_telegram_id, {
            text: `Error updating location: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown webhook error',
      },
      { status: 500 }
    );
  }
}

// Helper functions

async function updateDriverLocation({ driverId, location }: { driverId: string; location: { latitude: number; longitude: number } }) {
  const supabase = await createClient();

  const { error } = await supabase
    .schema('taxi')
    .from('drivers')
    .update({
      current_lat: location.latitude,
      current_lng: location.longitude,
      location_updated_at: new Date().toISOString(),
    })
    .eq('id', driverId);

  if (error) throw error;
  console.log('Driver location updated');
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ success: true });
}
