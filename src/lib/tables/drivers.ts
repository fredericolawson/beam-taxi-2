import { createClient } from '@/lib/supabase/server';
import { Driver } from '@/types';

export async function getFirstDriver() {
  const supabase = await createClient();
  const { data, error } = await supabase.schema('taxi').from('drivers').select('*').limit(1);
  if (error) throw error;
  return data[0] as Driver;
}

export async function listDriverTelegramIds() {
  const supabase = await createClient();
  const { data, error } = await supabase.schema('taxi').from('drivers').select('telegram_id');
  if (error) throw error;
  return data.map((driver) => driver.telegram_id);
}

export async function getDriverByTelegramId({ telegramId }: { telegramId: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase.schema('taxi').from('drivers').select('*').eq('telegram_id', telegramId).single();

  if (error) throw error;

  return data as Driver;
}
