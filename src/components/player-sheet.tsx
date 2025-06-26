'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { CompletedMatch, Match, Player } from '@/types';

import { PlayerMatchesTable } from './player-matches-table';
import { MatchHistorySummary } from './match-history';
import { Challenge } from './challenge';

export function PlayerSheet({
  player,
  currentPlayer,
  history,
  open,
  onOpenChange,
}: {
  player: Player;
  currentPlayer: Player;
  history: { matches: CompletedMatch[]; summary: string[] };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild></SheetTrigger>
      <SheetContent className="bg-muted flex !max-w-xl flex-col md:p-4">
        <SheetHeader className="border-b">
          <SheetTitle className="text-2xl font-bold">{player.displayName}</SheetTitle>
          <MatchHistorySummary historySummary={history.summary} />
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <Challenge player={player} currentPlayer={currentPlayer} />
          <PlayerMatchesTable matches={history.matches} player={player} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
