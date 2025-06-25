import { Player } from '@/types';

export function checkPlayable({ player, currentPlayer }: { player: Player; currentPlayer: Player }) {
  const currentPlayerRank = currentPlayer.ladderRank;
  const playerRank = player.ladderRank;
  const isPlayable = playerRank >= currentPlayerRank - 3 && playerRank <= currentPlayerRank;

  return isPlayable as boolean;
}
