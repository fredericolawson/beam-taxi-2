'use client';

import { Match, Player } from '@/types';
import { RecordMatchResult } from './pending-match';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { SiWhatsapp } from 'react-icons/si';
import { Loader2, MailIcon, PhoneIcon } from 'lucide-react';
import { checkPlayable } from '@/lib/utils/player-utils';
import { Loading } from './loading';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { challengePlayer, getPendingBiMatch } from '@/actions/match';

export function Challenge({ player, currentPlayer }: { player: Player; currentPlayer: Player }) {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingMatch, setPendingMatch] = useState<Match | null>(null);

  const fetchMatch = async () => {
    setIsLoading(true);
    const match = await getPendingBiMatch({ challengerId: currentPlayer.id, defenderId: player.id });
    setPendingMatch(match);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMatch();
  }, [currentPlayer.id, player.id]);

  if (isLoading) return <Loading />;

  return (
    <>
      <ChallengePlayer player={player} currentPlayer={currentPlayer} pendingMatch={pendingMatch} fetchMatch={fetchMatch} />
      <PlayerContact player={player} pendingMatch={pendingMatch} />
      <RecordMatchResult match={pendingMatch} key={pendingMatch?.id} setPendingMatch={setPendingMatch} />
    </>
  );
}

function ChallengePlayer({
  player,
  currentPlayer,
  pendingMatch,
  fetchMatch,
}: {
  player: Player;
  currentPlayer: Player;
  pendingMatch: Match | null;
  fetchMatch: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isPlayable = checkPlayable({ player, currentPlayer });

  if (!isPlayable || pendingMatch) return null;
  if (player.id === currentPlayer.id) return null;

  const sendChallenge = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await challengePlayer({ challengerId: currentPlayer.id, defenderId: player.id });
      if (error) setError(error);
      fetchMatch();
    } finally {
      setIsLoading(false);
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
        <Button onClick={sendChallenge} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 animate-spin" /> : 'Schedule Match'}
        </Button>
      </CardContent>
    </Card>
  );
}

function PlayerContact({ player, pendingMatch }: { player: Player; pendingMatch: Match | null }) {
  if (!pendingMatch) return null;
  const phone = player.phone.replace(/ /g, '');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Your Match</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 md:flex-row">
          <PlayerPhone player={player} />
          <PlayerEmail player={player} />
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <Button variant="outline" className="flex-1" asChild>
              <a href={`https://wa.me/${phone}`} target="_blank">
                <SiWhatsapp className="h-4 w-4" />
                Send WhatsApp
              </a>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <a href={`tel:${phone}`} target="_blank">
                <PhoneIcon className="h-4 w-4" />
                Call
              </a>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <a href={`mailto:${player.email}`} target="_blank">
                <MailIcon className="h-4 w-4" />
                Email
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PlayerPhone({ player }: { player: Player }) {
  return (
    <div className="flex w-full flex-col gap-1 text-sm">
      <span className="text-xs">Phone</span>
      <span className="bg-muted rounded-md p-2">{player.phone}</span>
    </div>
  );
}

function PlayerEmail({ player }: { player: Player }) {
  return (
    <div className="flex w-full flex-col gap-1 text-sm">
      <span className="text-xs">Email</span>
      <span className="bg-muted rounded-md p-2">
        <a href={`mailto:${player.email}`}>{player.email}</a>
      </span>
    </div>
  );
}
