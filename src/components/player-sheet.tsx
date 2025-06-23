'use client';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { CompletedMatch, Match, Player } from '@/types';
import { Button } from './ui/button';
import { ChallengePlayer } from './challenge-player';
import { PendingMatch } from './pending-match';
import { getBilateralMatches } from '@/actions/match';
import { useEffect, useState } from 'react';
import { MatchResult } from './match-result';
import { Loader2, PhoneIcon } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

export function PlayerSheet({
  children,
  player,
  currentPlayer,
  matchHistory,
}: {
  children: React.ReactNode;
  player: Player;
  currentPlayer: Player;
  matchHistory: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);

  const challengerId = currentPlayer.id;
  const opponentId = player.id;

  const fetchMatches = async () => {
    setIsLoading(true);
    const matches = await getBilateralMatches({ challengerId, opponentId });
    setMatches(matches);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMatches();
  }, [challengerId, opponentId]);

  const isPendingMatch = matches.some((match) => match.completedOn === null);

  if (isLoading)
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (player.id === currentPlayer.id) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <div className="cursor-pointer">{children}</div>
        </SheetTrigger>
        <SheetContent className="bg-muted flex flex-col">
          <SheetHeader className="border-b">
            <SheetTitle className="text-2xl font-bold">{player.displayName}</SheetTitle>
            {matchHistory}
          </SheetHeader>
          <Profile player={player} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </SheetTrigger>
      <SheetContent className="bg-muted flex flex-col">
        <SheetHeader className="border-b">
          <SheetTitle className="text-2xl font-bold">{player.displayName}</SheetTitle>
          {matchHistory}
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <PlayerContact player={player} isPendingMatch={isPendingMatch} />
          <ChallengePlayer player={player} currentPlayer={currentPlayer} isPendingMatch={isPendingMatch} />
          <BilateralMatches matches={matches} fetchMatches={fetchMatches} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function BilateralMatches({ matches, fetchMatches }: { matches: Match[]; fetchMatches: () => void }) {
  const pendingMatches = matches.filter((match) => match.completedOn === null);
  const completedMatches = matches.filter((match) => match.completedOn !== null) as CompletedMatch[];

  return (
    <div className="flex flex-col gap-4">
      {pendingMatches.map((match) => (
        <PendingMatch match={match} key={match.id} onSuccess={fetchMatches} />
      ))}
      <CompletedMatches matches={completedMatches} />
    </div>
  );
}

function CompletedMatches({ matches }: { matches: CompletedMatch[] }) {
  if (matches.length === 0) return null;
  return (
    <div className="flex flex-col gap-4">
      <Separator className="mt-4" />
      <h2 className="text-center text-lg font-bold">Your Completed Matches</h2>
      {matches.map((match) => (
        <MatchResult match={match} key={match.id} />
      ))}
    </div>
  );
}

function PlayerContact({ player, isPendingMatch }: { player: Player; isPendingMatch: boolean }) {
  if (!isPendingMatch) return null;
  const phone = player.phone.replace(/ /g, '');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Your Match</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 text-sm">
          <span className="text-xs">Phone</span>
          <span className="bg-muted mb-2 w-full rounded-md p-2">{player.phone}</span>
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <Button variant="outline" className="flex-1" asChild>
              <a href={`https://wa.me/${phone}`} target="_blank">
                <SiWhatsapp className="h-4 w-4 text-green-500" />
                Send WhatsApp
              </a>
            </Button>
            <Button variant="secondary" className="flex-1">
              <PhoneIcon className="h-4 w-4" />
              Call
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <span className="text-xs">Email</span>
          <span className="bg-muted rounded-md p-2">
            <a href={`mailto:${player.email}`}>{player.email}</a>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function Profile({ player }: { player: Player }) {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1 text-sm">
            <span className="text-xs">Phone</span>
            <span className="bg-muted rounded-md p-2">{player.phone}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
