'use client';

import { Player } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { challengePlayer } from '@/actions/match';

export function ChallengePlayer({ player, currentPlayer }: { player: Player; currentPlayer: Player }) {
  return (
    <>
      <SendChallenge player={player} currentPlayer={currentPlayer} />
    </>
  );
}

export function SendChallenge({ player, currentPlayer }: { player: Player; currentPlayer: Player }) {
  const [isLoading, setIsLoading] = useState(false);

  const challengerId = currentPlayer.id;

  const sendChallenge = async () => {
    setIsLoading(true);
    const { data, error } = await challengePlayer({ challengerId, opponentId: player.id });
    setIsLoading(false);
    if (error) {
      toast.error(`Failed to challenge player: ${error}`);
    } else {
      console.log(data);
      toast.success('Challenge sent');
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
          {isLoading ? 'Sending...' : 'Challenge'}
        </Button>
      </CardContent>
    </Card>
  );
}
