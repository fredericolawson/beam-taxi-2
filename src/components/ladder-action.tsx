'use client';

import { useFetchMatches } from '@/hooks/useFetchMatches';
import { Button } from './ui/button';
import { useSendChallenge } from '@/hooks/useSendChallenge';
import type { Player } from '@/types';
import { Loader2 } from 'lucide-react';

export function LadderAction({ player, currentPlayer }: { player: Player; currentPlayer: Player }) {
  const { sendChallenge } = useSendChallenge({
    challengerId: currentPlayer.id,
    opponentId: player.id,
  });

  const { isLoading: isLoadingMatches, matches } = useFetchMatches({
    challengerId: currentPlayer.id,
    opponentId: player.id,
  });

  if (isLoadingMatches) return <Loader2 className="mr-2 animate-spin" />;

  if (matches.length > 0)
    return (
      <Button size="sm" onClick={() => null}>
        Complete Match
      </Button>
    );

  if (player.id === currentPlayer.id) return null;
  if (player.ladderRank < currentPlayer.ladderRank - 3) return null;
  return (
    <Button variant="outline" size="sm" onClick={() => sendChallenge()}>
      Challenge Player
    </Button>
  );
}
