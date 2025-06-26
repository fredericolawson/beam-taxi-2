'use server';

import { createClient } from '@/lib/supabase/server';
import type { Player } from '@/types';
import camelcaseKeys from 'camelcase-keys';
import { parsePlayer } from '@/lib/utils/player-utils';

export async function getPlayers(): Promise<Player[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('ladder')
    .from('players')
    .select(`*`)
    .eq('is_approved', true)
    .order('ladder_rank', { ascending: true });
  if (error) {
    console.error('Error fetching players:', error);
    return [];
  }

  const players = camelcaseKeys(data, { deep: true }) as Player[];

  return players.map(parsePlayer);
}

export async function getPlayerByUserId(userId: string): Promise<Player | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.schema('ladder').from('players').select('*').eq('user_id', userId);
  if (error) {
    console.error('Error fetching player:', error);
    return null;
  }
  if (data.length === 0) return null;
  const player = camelcaseKeys(data[0], { deep: true }) as Player;
  if (!player) return null;
  return parsePlayer(player);
}
