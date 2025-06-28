'use client';

import { Button } from './ui/button';
import type { Match, Player } from '@/types';
import { CheckCircle, PlusCircle } from 'lucide-react';
import { checkPlayable } from '@/lib/utils/player-utils';
import { useState } from 'react';
import { useEffect } from 'react';
import { getBiMatches } from '@/actions/match';
import { LoadingSpinner } from './loading-spinner';

export function LadderAction({ player, currentPlayer }: { player: Player; currentPlayer: Player }) {
  const [pendingMatch, setPendingMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isPlayable = checkPlayable({ player, currentPlayer });

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      const matches = await getBiMatches({ challengerId: currentPlayer.id, defenderId: player.id });
      setPendingMatch(matches.find((m) => m.winnerId === null) || null);
      setIsLoading(false);
    };
    fetchMatches();
  }, [currentPlayer.id, player.id]);

  if (player.id === currentPlayer.id) return null;
  if (isLoading) return <Loading />;
  if (pendingMatch) return <CompleteMatchButton />;
  if (isPlayable && !pendingMatch) return <ChallengePlayerButton />;

  return null;
}

function ChallengePlayerButton() {
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
      <LoadingSpinner />
    </div>
  );
}
