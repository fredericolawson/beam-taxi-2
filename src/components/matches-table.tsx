import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { CompletedMatch } from '@/types';

export function MatchesTable({ matches }: { matches: CompletedMatch[] }) {
  return (
    <Table className="rounded-md border bg-white">
      <TableHeader>
        <MatchHeader />
      </TableHeader>
      <TableBody>
        {matches.map((match) => (
          <MatchRow key={match.id} match={match} />
        ))}
      </TableBody>
    </Table>
  );
}

function MatchHeader() {
  return (
    <TableRow>
      <TableHead>Challenger</TableHead>
      <TableHead>Defender</TableHead>
      <TableHead>Result</TableHead>
      <TableHead>Winner</TableHead>
      <TableHead>Date</TableHead>
    </TableRow>
  );
}

function MatchRow({ match }: { match: CompletedMatch }) {
  return (
    <TableRow>
      <TableCell>
        {match.challenger.firstName} {match.challenger.lastName}
      </TableCell>
      <TableCell>
        {match.defender.firstName} {match.defender.lastName}
      </TableCell>
      <TableCell>{match.result}</TableCell>
      <TableCell>
        {match.winner.firstName} {match.winner.lastName}
      </TableCell>
      <TableCell>{new Date(match.completedOn + 'T00:00:00').toLocaleDateString()}</TableCell>
    </TableRow>
  );
}
