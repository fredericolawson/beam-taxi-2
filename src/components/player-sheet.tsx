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
import { ChallengePlayer } from './send-challenge';
import { PendingMatch } from './pending-match';
import { MatchResult } from './match-result';
import { Loader2, PhoneIcon } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { useFetchMatches } from '@/hooks/useFetchMatches';
import { checkPlayable } from '@/lib/utils/player-utils';
import { MatchesTable } from './matches-table';

export function PlayerSheet({
  children,
  player,
  currentPlayer,
  completedMatches,
}: {
  children: React.ReactNode;
  player: Player;
  currentPlayer: Player;
  completedMatches: CompletedMatch[];
}) {
  const { isLoading, pendingMatch, fetchMatches } = useFetchMatches({
    challengerId: currentPlayer.id,
    opponentId: player.id,
  });
  console.log(completedMatches);

  if (isLoading) return <LoadingMatches />;
  const isPlayable = checkPlayable({ player, currentPlayer });
  const isCurrentPlayer = player.id === currentPlayer.id;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </SheetTrigger>
      <SheetContent className="bg-muted flex flex-col">
        <SheetHeader className="border-b">
          <SheetTitle className="text-2xl font-bold">{player.displayName}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          {pendingMatch && <PlayerContact player={player} />}
          {!pendingMatch && isPlayable && !isCurrentPlayer && (
            <ChallengePlayer player={player} currentPlayer={currentPlayer} onChallengeSuccess={fetchMatches} />
          )}
          <BilateralMatches completedMatches={completedMatches} pendingMatch={pendingMatch} />
          {completedMatches.length > 0 && <MatchesTable matches={completedMatches} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function BilateralMatches({ completedMatches, pendingMatch }: { completedMatches: CompletedMatch[]; pendingMatch: Match | null }) {
  return (
    <div className="flex flex-col gap-4">
      <PendingMatch match={pendingMatch} key={pendingMatch?.id} />
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

function PlayerContact({ player }: { player: Player }) {
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

function LoadingMatches() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
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
