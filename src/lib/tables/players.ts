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

  return data.map(parsePlayer);
}

export async function getAllPlayers(): Promise<Player[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('ladder')
    .from('players')
    .select(`*`)
    .order('is_approved', { ascending: false })
    .order('ladder_rank', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching all players:', error);
    return [];
  }

  return data.map(parsePlayer);
}

export async function updatePlayerApproval(playerId: string, isApproved: boolean): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.schema('ladder').from('players').update({ is_approved: isApproved }).eq('id', playerId);

  if (error) {
    console.error('Error updating player approval:', error);
    return false;
  }

  return true;
}

export async function increasePlayerRank(playerId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('increase_player_rank', { player_id: playerId });

  if (error) {
    console.error('Error increasing player rank:', error);
    return false;
  }

  return data === true;
}

export async function getPlayerByUserId(userId: string): Promise<Player | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.schema('ladder').from('players').select('*').eq('user_id', userId);
  if (error) {
    console.error('Error fetching player:', error);
    return null;
  }
  if (data.length === 0) return null;
  return parsePlayer(data[0]);
}
