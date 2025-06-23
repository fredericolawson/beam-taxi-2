'use client';

import { useFetchMatches } from '@/hooks/useFetchMatches';
import { Button } from './ui/button';
import type { Player } from '@/types';
import { CheckCircle, Loader2, PlusCircle } from 'lucide-react';
import { PlayerSheet } from './player-sheet';

export function LadderAction({ player, currentPlayer }: { player: Player; currentPlayer: Player }) {
  const { isLoading: isLoadingMatches, pendingMatch } = useFetchMatches({
    challengerId: currentPlayer.id,
    opponentId: player.id,
  });

  if (isLoadingMatches) return <Loading />;
  if (player.id === currentPlayer.id) return null;

  return (
    <PlayerSheet player={player} currentPlayer={currentPlayer}>
      {pendingMatch && <CompleteMatchButton />}
      {!pendingMatch && <ChallengePlayerButton player={player} currentPlayer={currentPlayer} />}
    </PlayerSheet>
  );
}

function ChallengePlayerButton({ player, currentPlayer }: { player: Player; currentPlayer: Player }) {
  if (player.ladderRank < currentPlayer.ladderRank - 3 || player.ladderRank > currentPlayer.ladderRank) return null;
  return (
    <Button variant="outline" size="sm" className="w-38">
      <PlusCircle className="h-4 w-4" />
      Challenge Player
    </Button>
  );
}

function CompleteMatchButton() {
  return (
    <Button variant="secondary" size="sm" className="w-38">
      <CheckCircle className="h-4 w-4" />
      Submit Result
    </Button>
  );
}

function Loading() {
  return (
    <div className="flex w-38 items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
}
