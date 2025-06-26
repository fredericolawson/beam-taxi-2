'use client';

import { Player } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useSendChallenge } from '@/hooks/useSendChallenge';

export function ChallengePlayer({ player, currentPlayer }: { player: Player; currentPlayer: Player }) {
  const { isLoading, error, sendChallenge } = useSendChallenge({
    challengerId: currentPlayer.id,
    opponentId: player.id,
  });

  if (error) return <div className="text-red-500">{error}</div>;

  const handleSendChallenge = async () => {
    const result = await sendChallenge();
    if (result.error) toast.error(result.error);

    toast.success('Challenge sent');
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
        <Button onClick={handleSendChallenge} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            'Schedule Match'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
