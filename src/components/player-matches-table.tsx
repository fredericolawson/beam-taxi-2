import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { CompletedMatch, Player } from '@/types';
import { format } from 'date-fns';

export function PlayerMatchesTable({ matches, player }: { matches: CompletedMatch[] | null; player: Player }) {
  if (!matches) return null;
  return (
    <div className="w-full">
      <h2 className="heading-3">Match History</h2>
      <Table className="rounded-md border bg-white text-xs md:text-sm">
        <TableHeader>
          <MatchHeader />
        </TableHeader>
        <TableBody>
          {matches.length > 0 ? matches.map((match) => <MatchRow key={match.id} match={match} player={player} />) : <NoMatches />}
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
      <TableHead>Result</TableHead>
      <TableHead>Date</TableHead>
    </TableRow>
  );
}

function MatchRow({ match, player }: { match: CompletedMatch; player: Player }) {
  let opponent = match.challenger;
  if (match.challenger.id === player.id) opponent = match.defender;
  return (
    <TableRow>
      <TableCell>
        {opponent.firstName} {opponent.lastName}
      </TableCell>
      <TableCell>{match.winner.firstName}</TableCell>
      <TableCell>{match.result}</TableCell>
      <TableCell>{format(new Date(match.matchDate), 'd MMM yyyy')}</TableCell>
    </TableRow>
  );
}

function NoMatches() {
  return (
    <TableRow>
      <TableCell colSpan={4} className="text-center">
        No matches played yet
      </TableCell>
    </TableRow>
  );
}
