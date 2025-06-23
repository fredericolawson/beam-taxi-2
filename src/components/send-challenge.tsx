'use client';

import { Player } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { challengePlayer } from '@/actions/match';
import { Loader2 } from 'lucide-react';

export function SendChallenge({
  player,
  currentPlayer,
  isPendingMatch,
  fetchMatches,
}: {
  player: Player;
  currentPlayer: Player;
  isPendingMatch: boolean;
  fetchMatches: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const challengerId = currentPlayer.id;
  if (isPendingMatch) return null;

  const sendChallenge = async () => {
    setIsLoading(true);
    const { error } = await challengePlayer({ challengerId, opponentId: player.id });
    setIsLoading(false);
    if (error) toast.error(`Failed to challenge player: ${error}`);
    else {
      toast.success('Challenge sent');
      fetchMatches();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Challenge player?</CardTitle>
        <CardDescription>
          Challenge {player.displayName} to a match and if they accept your details will be swapped so you can schedule your match.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => sendChallenge()} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            'Challenge'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
