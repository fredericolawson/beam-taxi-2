'use server';
import { TelegramBot } from './telegram';
import type { TripRequest } from '@/types';
import { getTrip } from './tables/trips';

const bot = new TelegramBot();

export async function sendTripRequest(tripId: string) {
  const trip = await getTrip(tripId);
  const driverId = '6749327457';
  // Send pickup location first
  await bot.sendLocation(driverId, {
    latitude: trip.pickup.lat,
    longitude: trip.pickup.lng,
  });

  // Then send trip details with action buttons

  const message = await bot.sendMessage(driverId, {
    text: `🚗 <b>NEW TRIP REQUEST</b>\n\n📍 <b>Pickup:</b> ${trip.pickup.address}\n🏁 <b>Destination:</b> ${trip.destination.address}\n💰 <b>Estimated:</b> $${trip.fare}\n⭐ <b>Rider:</b> ${trip.rider.name}`,
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🚗 ACCEPT', callback_data: `accept_${trip.id}` },
          { text: '❌ DECLINE', callback_data: `decline_${trip.id}` },
        ],
        [{ text: '📍 NAVIGATE', url: `https://maps.google.com/maps?daddr=${trip.pickup.lat},${trip.pickup.lng}` }],
      ],
    },
  });

  return message;
}

export async function sendTripConfirmation(driverId: string, trip: TripRequest) {
  await bot.sendMessage(driverId, {
    text: `✅ <b>TRIP CONFIRMED</b>\n\nYou've been assigned this trip!\n\n📍 <b>Pickup:</b> ${trip.pickup.address}\n🏁 <b>Destination:</b> ${trip.destination.address}\n💰 <b>Fare:</b> $${trip.fare}\n\n🚗 Head to pickup location`,
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📍 NAVIGATE', url: `https://maps.google.com/maps?daddr=${trip.pickup.lat},${trip.pickup.lng}` },
          { text: '📞 CALL RIDER', url: `tel:${trip.rider.phone}` },
        ],
        [{ text: '✅ ARRIVED', callback_data: `arrived_${trip.id}` }],
      ],
    },
  });
  // Follow with location sharing prompt
  await bot.sendMessage(driverId, {
    text: `📍 <b>Share your live location</b> so the rider can track your arrival!\n\nTap the 📎 button below → Location → Share Live Location (15 minutes)`,
    reply_markup: {
      keyboard: [[{ text: '📍 Share Live Location', request_location: true }]],
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  });
}

export async function sendTripUnavailable(driverId: string) {
  return bot.sendMessage(driverId, {
    text: `⚠️ <b>TRIP UNAVAILABLE</b>\n\nSorry, this trip was just taken by another driver.\n\n🔍 More trips coming soon...`,
  });
}

export async function updateTripMessage(driverId: string, messageId: number, trip: TripRequest, status: 'confirmed' | 'unavailable') {
  if (status === 'confirmed') {
    return bot.editMessageText({
      chat_id: driverId,
      message_id: messageId,
      text: `✅ <b>TRIP CONFIRMED</b>\n\n📍 <b>Pickup:</b> ${trip.pickup.address}\n🏁 <b>Destination:</b> ${trip.destination.address}\n💰 <b>Fare:</b> $${trip.fare}\n⭐ <b>Rider:</b> ${trip.rider.name}`,
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📍 NAVIGATE', url: `https://maps.google.com/maps?daddr=${trip.pickup.lat},${trip.pickup.lng}` },
            { text: '📞 CALL RIDER', url: `tel:${trip.rider.phone}` },
          ],
        ],
      },
    });
  } else {
    return bot.editMessageText({
      chat_id: driverId,
      message_id: messageId,
      text: `❌ <b>TRIP UNAVAILABLE</b>\n\n📍 <b>Pickup:</b> ${trip.pickup.address}\n🏁 <b>Destination:</b> ${trip.destination.address}\n💰 <b>Fare:</b> $${trip.fare}\n\n<i>This trip was taken by another driver.</i>`,
      reply_markup: {
        inline_keyboard: [],
      },
    });
  }
}
