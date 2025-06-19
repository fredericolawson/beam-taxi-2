import { getMatches } from '@/lib/tables/matches';
import { MatchesTable } from '@/components/matches-table';

export default async function Matches() {
  const matches = await getMatches();
  const completedMatches = matches.filter((match) => match.status === 'completed');
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Completed Matches</h1>
      <MatchesTable matches={completedMatches} />
    </div>
  );
}
