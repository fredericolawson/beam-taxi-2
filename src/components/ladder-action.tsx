'use client';

import { useFetchMatches } from '@/hooks/useFetchMatches';
import { Button } from './ui/button';
import { useSendChallenge } from '@/hooks/useSendChallenge';
import type { Player } from '@/types';
import { Loader2 } from 'lucide-react';
import { PlayerSheet } from './player-sheet';
import { MatchHistory } from './match-history';

export function LadderAction({ player, currentPlayer }: { player: Player; currentPlayer: Player }) {
  const { sendChallenge } = useSendChallenge({
    challengerId: currentPlayer.id,
    opponentId: player.id,
  });

  const { isLoading: isLoadingMatches, pendingMatches } = useFetchMatches({
    challengerId: currentPlayer.id,
    opponentId: player.id,
  });

  if (isLoadingMatches) return <Loader2 className="mr-2 animate-spin" />;

  if (pendingMatches.length > 0)
    return (
      <PlayerSheet player={player} currentPlayer={currentPlayer}>
        <Button size="sm">Complete Match</Button>
      </PlayerSheet>
    );

  if (player.id === currentPlayer.id) return null;

  if (player.ladderRank < currentPlayer.ladderRank - 3 || player.ladderRank > currentPlayer.ladderRank) return null;
  return (
    <PlayerSheet player={player} currentPlayer={currentPlayer}>
      <Button variant="outline" size="sm">
        Challenge Player
      </Button>
    </PlayerSheet>
  );
}
