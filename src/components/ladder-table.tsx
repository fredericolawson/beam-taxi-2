import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Player } from '@/types';
import { PlayerSheet } from './player-sheet';

export function Ladder({ players, currentPlayer }: { players: Player[]; currentPlayer: Player }) {
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
      <TableHead>Rank</TableHead>
      <TableHead>Name</TableHead>
    </TableRow>
  );
}

function LadderRow({ player, currentPlayer }: { player: Player; currentPlayer: Player }) {
  return (
    <TableRow>
      <TableCell>{player.ladderRank}</TableCell>
      <TableCell>
        <PlayerSheet player={player} currentPlayer={currentPlayer}>
          <span className="cursor-pointer hover:underline">
            {player.firstName} {player.lastName}
          </span>
        </PlayerSheet>
      </TableCell>
    </TableRow>
  );
}
