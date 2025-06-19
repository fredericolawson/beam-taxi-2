import { createClient } from '@/lib/supabase/server';
import type { Player } from '@/types';
import camelcaseKeys from 'camelcase-keys';

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

  return players.map((player) => ({
    ...player,
    displayName: `${player.firstName} ${player.lastName}`,
  }));
}
