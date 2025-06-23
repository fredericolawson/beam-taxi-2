import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Player } from '@/types';
import { PlayerSheet } from './player-sheet';
import { MatchHistory } from './match-history';
import { LadderAction } from './ladder-action';
import { cn } from '@/lib/utils';

export function LadderTable({ players, currentPlayer }: { players: Player[]; currentPlayer: Player }) {
  return (
    <Table>
      <TableHeader>
        <LadderHeader />
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <LadderRow key={player.id} player={player} currentPlayer={currentPlayer} />
        ))}
      </TableBody>
    </Table>
  );
}

function LadderHeader() {
  return (
    <TableRow>
      <TableHead className="w-16">Rank</TableHead>
      <TableHead className="w-48">Name</TableHead>
      <TableHead className="flex-1">Recent Results</TableHead>
      <TableHead className="w-32">Action</TableHead>
    </TableRow>
  );
}

function LadderRow({ player, currentPlayer }: { player: Player; currentPlayer: Player }) {
  return (
    <TableRow className={cn(player.id === currentPlayer.id && 'bg-gray-100')}>
      <TableCell className="w-16">{player.ladderRank}</TableCell>
      <TableCell className="w-48">
        <PlayerSheet player={player} currentPlayer={currentPlayer}>
          <span className="cursor-pointer hover:underline">
            {player.firstName} {player.lastName}
          </span>
        </PlayerSheet>
      </TableCell>
      <TableCell className="flex-1">
        <MatchHistory playerId={player.id} />
      </TableCell>
      <TableCell className="w-32">
        <LadderAction player={player} currentPlayer={currentPlayer} />
      </TableCell>
    </TableRow>
  );
}
