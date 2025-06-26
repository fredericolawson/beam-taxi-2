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

import { RecordMatchResult } from './pending-match';
import { MatchResult } from './match-result';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { PlayerMatchesTable } from './player-matches-table';
import { MatchHistorySummary } from './match-history';
import { Challenge } from './challenge';

export function PlayerSheet({
  children,
  player,
  currentPlayer,
  history,
}: {
  children: React.ReactNode;
  player: Player;
  currentPlayer: Player;
  history: { matches: CompletedMatch[]; summary: string[] };
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </SheetTrigger>
      <SheetContent className="bg-muted flex !max-w-xl flex-col md:p-4">
        <SheetHeader className="border-b">
          <SheetTitle className="text-2xl font-bold">{player.displayName}</SheetTitle>
          <MatchHistorySummary historySummary={history.summary} />
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <Challenge player={player} currentPlayer={currentPlayer} />
          <PlayerMatchesTable matches={history.matches} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function BilateralMatches({ completedMatches, pendingMatch }: { completedMatches: CompletedMatch[]; pendingMatch: Match | null }) {
  return (
    <div className="flex flex-col gap-4">
      <RecordMatchResult match={pendingMatch} key={pendingMatch?.id} />
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
