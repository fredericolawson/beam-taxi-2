'use server';
import { TelegramBot } from '../lib/telegram';
import type { AssignedTrip, Driver, Trip } from '@/types';
import { getFirstDriver, listDriverTelegramIds } from '../lib/tables/drivers';

const bot = new TelegramBot();

export async function sendTripRequest({ trip }: { trip: Trip }) {
  const driverTelegramIds = await listDriverTelegramIds();

  // Send to all drivers in parallel
  await Promise.all(
    driverTelegramIds.map(async (driverTelegramId) => {
      // Send both messages in parallel for each driver
      await Promise.all([
        await bot.sendLocation(driverTelegramId, {
          latitude: trip.pickup_lat,
          longitude: trip.pickup_lng,
        }),
        bot.sendMessage(driverTelegramId, {
          text: `🚗 <b>NEW TRIP REQUEST</b>\n\n📍 <b>Pickup:</b> ${trip.pickup_address}\n🏁 <b>Destination:</b> ${trip.destination_address}\n💰 <b>Offer:</b> $${trip.offer_amount}\n⭐ <b>Rider:</b> ${trip.rider.name}`,
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🚗 ACCEPT', callback_data: `accept_${trip.id}` },
                { text: '❌ DECLINE', callback_data: `decline_${trip.id}` },
              ],
              [{ text: '📍 NAVIGATE', url: `https://maps.google.com/maps?daddr=${trip.pickup_lat},${trip.pickup_lng}` }],
            ],
          },
        }),
      ]);
    })
  );
}

export async function sendLocationPrompt({ driver_telegram_id }: { driver_telegram_id: string }) {
  await bot.sendMessage(driver_telegram_id, {
    text: `📍 <b>Share your live location</b> so the rider can track your arrival!`,
    reply_markup: {
      keyboard: [[{ text: '📍 Share Live Location', request_location: true }]],
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  });
}

export async function sendTripUnavailable({ driverId }: { driverId: string }) {
  return bot.sendMessage(driverId, {
    text: `⚠️ <b>TRIP UNAVAILABLE</b>\n\nSorry, this trip was just taken by another driver.\n\n🔍 More trips coming soon...`,
  });
}

export async function updateTripMessage({ trip, status }: { trip: AssignedTrip; status: 'confirmed' | 'cancelled' }) {
  if (status === 'confirmed') {
    return bot.editMessageText({
      chat_id: trip.driver.telegram_id,
      message_id: trip.message_id,
      text: `✅ <b>TRIP CONFIRMED</b>\n\nYou've been assigned this trip!\n\n📍 <b>Pickup:</b> ${trip.pickup_address}\n🏁 <b>Destination:</b> ${trip.destination_address}\n💰 <b>Fare:</b> $${trip.offer_amount}\n⭐ <b>Rider:</b> ${trip.rider.name}\n📞 <b>Rider Phone:</b> ${trip.rider.phone}`,
      reply_markup: {
        inline_keyboard: [[{ text: '📍 NAVIGATE', url: `https://maps.google.com/maps?daddr=${trip.pickup_lat},${trip.pickup_lng}` }]],
      },
    });
  } else if (status === 'cancelled') {
    return bot.editMessageText({
      chat_id: trip.driver.telegram_id,
      message_id: trip.message_id,
      text: `❌ <b>TRIP CANCELLED</b>\n\n📍 <b>Pickup:</b> ${trip.pickup_address}\n🏁 <b>Destination:</b> ${trip.destination_address}\n💰 <b>Fare:</b> $${trip.offer_amount}\n\n<i>Sorry, this trip has been cancelled.</i>`,
      reply_markup: {
        inline_keyboard: [],
      },
    });
  }
}
/*
==============================================
send trip confirmed
==============================================
*/
export async function sendTripConfirmed({ trip }: { trip: AssignedTrip }) {
  await bot.editMessageText({
    chat_id: trip.driver.telegram_id,
    message_id: trip.message_id,
    text: `✅ <b>TRIP CONFIRMED</b>\n\nYou've been assigned this trip!\n\n📍 <b>Pickup:</b> ${trip.pickup_address}\n🏁 <b>Destination:</b> ${trip.destination_address}\n💰 <b>Fare:</b> $${trip.offer_amount}\n⭐ <b>Rider:</b> ${trip.rider.name}\n📞 <b>Rider Phone:</b> ${trip.rider.phone}`,
  });
}

/*
==============================================
send trip cancelled
==============================================
*/
export async function sendTripCancelled({ trip }: { trip: AssignedTrip }) {
  await bot.editMessageText({
    chat_id: trip.driver.telegram_id,
    message_id: trip.message_id,
    text: `❌ <b>TRIP CANCELLED</b>\n\n📍 <b>Pickup:</b> ${trip.pickup_address}\n🏁 <b>Destination:</b> ${trip.destination_address}\n💰 <b>Fare:</b> $${trip.offer_amount}\n\n<i>Sorry, this trip has been cancelled.</i>`,
    reply_markup: {
      inline_keyboard: [],
    },
  });

  bot.sendMessage(trip.driver.telegram_id, {
    text: `❌ <b>TRIP CANCELLED</b>\n\n📍 <b>Pickup:</b> ${trip.pickup_address}\n🏁 <b>Destination:</b> ${trip.destination_address}\n💰 <b>Fare:</b> $${trip.offer_amount}\n\n<i>Sorry, this trip has been cancelled.</i>`,
  });
}
