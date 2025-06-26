import type { Player, Match } from '@/types';
import camelcaseKeys from 'camelcase-keys';

export type RawPlayer = {
  id: string;
  user_id: string;
  ladder_rank: number;
  is_approved: boolean;
  created_at: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  matches: Match[];
};

export function checkPlayable({ player, currentPlayer }: { player: Player; currentPlayer: Player }) {
  const currentPlayerRank = currentPlayer.ladderRank;
  const playerRank = player.ladderRank;
  const isPlayable = playerRank >= currentPlayerRank - 3 && playerRank <= currentPlayerRank;

  return isPlayable as boolean;
}

export function parsePlayer(player: RawPlayer): Player {
  const camelcasePlayer = camelcaseKeys(player, { deep: true });
  return {
    ...camelcasePlayer,
    displayName: `${camelcasePlayer.firstName} ${camelcasePlayer.lastName}`,
  } as Player;
}
