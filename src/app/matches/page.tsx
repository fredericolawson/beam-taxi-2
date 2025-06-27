import { getCompletedMatches } from '@/lib/tables/matches';
import { MatchesTable } from '@/components/matches-table';

export default async function Matches() {
  const completedMatches = await getCompletedMatches();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="heading-1">Completed Matches</h1>
      <MatchesTable matches={completedMatches} />
    </div>
  );
}
