'use client';

import { getMatchHistory } from '@/lib/utils/match-utils';
import { TableCell, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { CompletedMatch, Player } from '@/types';
import { cn } from '@/lib/utils';
import { MatchHistorySummary } from './match-history';
import { LadderAction } from './ladder-action';
import { PlayerSheet } from './player-sheet';

type History = {
  matches: CompletedMatch[];
  summary: string[];
};

export function LadderRow({ player, currentPlayer, history }: { player: Player; currentPlayer: Player; history: History }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      <TableRow
        className={cn('hover:bg-muted/50 cursor-pointer', player.id === currentPlayer.id && 'border-2 border-green-700')}
        onClick={() => setIsSheetOpen(true)}
      >
        <TableCell className="w-16 text-center">{player.ladderRank}</TableCell>
        <TableCell className="w-48">
          <span className="hover:underline">
            {player.firstName} {player.lastName}
          </span>
        </TableCell>
        <TableCell className="flex-1">
          <MatchHistorySummary historySummary={history.summary} />
        </TableCell>
        <TableCell className="w-32">
          <LadderAction player={player} currentPlayer={currentPlayer} />
        </TableCell>
      </TableRow>

      <PlayerSheet player={player} currentPlayer={currentPlayer} open={isSheetOpen} onOpenChange={setIsSheetOpen}></PlayerSheet>
    </>
  );
}
