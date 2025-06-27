import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { CompletedMatch, Player } from '@/types';
import { Separator } from '@/components/ui/separator';

export function PlayerMatchesTable({ matches, player }: { matches: CompletedMatch[] | null; player: Player }) {
  if (!matches) return null;
  return (
    <div>
      <h2 className="text-center font-semibold">Match History</h2>
      <Table className="rounded-md border bg-white">
        <TableHeader>
          <MatchHeader />
        </TableHeader>
        <TableBody>
          {matches.map((match) => (
            <MatchRow key={match.id} match={match} player={player} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function MatchHeader() {
  return (
    <TableRow>
      <TableHead>Opponent</TableHead>
      <TableHead>Winner</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Result</TableHead>
    </TableRow>
  );
}

function MatchRow({ match, player }: { match: CompletedMatch; player: Player }) {
  let opponent = match.challenger;
  if (match.challenger.id === player.id) opponent = match.defender;
  return (
    <TableRow className="text-sm">
      <TableCell>
        {opponent.firstName} {opponent.lastName}
      </TableCell>
      <TableCell>
        {match.winner.firstName} {match.winner.lastName}
      </TableCell>
      <TableCell>{new Date(match.completedOn).toLocaleDateString()}</TableCell>
      <TableCell>{match.result}</TableCell>
    </TableRow>
  );
}
