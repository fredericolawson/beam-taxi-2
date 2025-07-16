'use server';
import { TelegramBot } from '../lib/telegram';
import type { Driver, Trip } from '@/types';
import { getTrip } from '../lib/tables/trips';
import { getFirstDriver } from '../lib/tables/drivers';

const bot = new TelegramBot();

export async function sendTripRequest({ trip }: { trip: Trip }) {
  console.log('trip', trip);
  const driver = await getFirstDriver();
  // Send pickup location first
  await bot.sendLocation(driver.telegram_id, {
    latitude: trip.pickup_lat,
    longitude: trip.pickup_lng,
  });

  // Then send trip details with action buttons

  const message = await bot.sendMessage(driver.telegram_id, {
    text: `🚗 <b>NEW TRIP REQUEST</b>\n
    \n📍 <b>Pickup:</b> ${trip.pickup_address}
    \n🏁 <b>Destination:</b> ${trip.destination_address}
    \n💰 <b>Offer:</b> $${trip.offer_amount}
    \n⭐ <b>Rider:</b> ${trip.rider.name}`,
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🚗 ACCEPT', callback_data: `accept_${trip.id}` },
          { text: '❌ DECLINE', callback_data: `decline_${trip.id}` },
        ],
        [{ text: '📍 NAVIGATE', url: `https://maps.google.com/maps?daddr=${trip.pickup_lat},${trip.pickup_lng}` }],
      ],
    },
  });

  return message;
}

export async function sendTripConfirmation({ driver, trip }: { driver: Driver; trip: Trip }) {
  await bot.sendMessage(driver.telegram_id, {
    text: `✅ <b>TRIP CONFIRMED</b>\n\nYou've been assigned this trip!\n\n📍 <b>Pickup:</b> ${trip.pickup_address}\n🏁 <b>Destination:</b> ${trip.destination_address}\n💰 <b>Fare:</b> $${trip.offer_amount}\n📞 <b>Rider Phone:</b> ${trip.rider.phone}\n\n🚗 Head to pickup location`,
    reply_markup: {
      inline_keyboard: [
        [{ text: '📍 NAVIGATE', url: `https://maps.google.com/maps?daddr=${trip.pickup_lat},${trip.pickup_lng}` }],
        [{ text: '✅ ARRIVED', callback_data: `arrived_${trip.id}` }],
      ],
    },
  });
  // Follow with location sharing prompt
  await bot.sendMessage(driver.telegram_id, {
    text: `📍 <b>Share your live location</b> so the rider can track your arrival!\n\nTap the 📎 button below → Location → Share Live Location (15 minutes)`,
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

export async function updateTripMessage({ driverId, messageId, trip, status }: { driverId: string; messageId: number; trip: Trip; status: 'confirmed' | 'unavailable' }) {
  if (status === 'confirmed') {
    return bot.editMessageText({
      chat_id: driverId,
      message_id: messageId,
      text: `✅ <b>TRIP CONFIRMED</b>\n\n📍 <b>Pickup:</b> ${trip.pickup_address}\n🏁 <b>Destination:</b> ${trip.destination_address}\n💰 <b>Fare:</b> $${trip.offer_amount}\n⭐ <b>Rider:</b> ${trip.rider.name}\n📞 <b>Rider Phone:</b> ${trip.rider.phone}`,
      reply_markup: {
        inline_keyboard: [[{ text: '📍 NAVIGATE', url: `https://maps.google.com/maps?daddr=${trip.pickup_lat},${trip.pickup_lng}` }]],
      },
    });
  } else {
    return bot.editMessageText({
      chat_id: driverId,
      message_id: messageId,
      text: `❌ <b>TRIP UNAVAILABLE</b>\n\n📍 <b>Pickup:</b> ${trip.pickup_address}\n🏁 <b>Destination:</b> ${trip.destination_address}\n💰 <b>Fare:</b> $${trip.offer_amount}\n\n<i>This trip was taken by another driver.</i>`,
      reply_markup: {
        inline_keyboard: [],
      },
    });
  }
}
