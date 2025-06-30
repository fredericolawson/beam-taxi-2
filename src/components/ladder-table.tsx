import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Player } from '@/types';
import { getMatchHistory } from '@/lib/utils/match-utils';
import { LadderRow } from './ladder-row';

export function LadderTable({ players, currentPlayer }: { players: Player[]; currentPlayer: Player }) {
  return (
    <Table className="w-full rounded-md border bg-white">
      <TableHeader>
        <LadderHeader />
      </TableHeader>
      <TableBody>
        {players.map(async (player) => {
          const history = await getMatchHistory({ playerId: player.id });
          return <LadderRow key={player.id} player={player} currentPlayer={currentPlayer} history={history} />;
        })}
      </TableBody>
    </Table>
  );
}

function LadderHeader() {
  return (
    <TableRow>
      <TableHead className="w-16 text-center">Rank</TableHead>
      <TableHead className="w-48">Name</TableHead>
      <TableHead className="w-42">Recent Results</TableHead>
      <TableHead className="w-48">Last Match</TableHead>
      <TableHead className="w-32">Action</TableHead>
    </TableRow>
  );
}
