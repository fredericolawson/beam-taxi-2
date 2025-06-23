import { getMatchHistory } from '@/lib/utils/match-history';

export async function MatchHistory({ playerId }: { playerId: string }) {
  const matchHistory = await getMatchHistory({ playerId });

  if (matchHistory.length === 0) return <NoMatchHistory />;

  return (
    <div className="flex gap-2">
      {matchHistory.map((result, index) => (
        <ResultIcon key={index} result={result} />
      ))}
    </div>
  );
}

function NoMatchHistory() {
  return <div className="text-muted-foreground w-fit rounded-md bg-gray-200 px-4 py-2 text-center text-xs">No Matches Played</div>;
}

function ResultIcon({ result }: { result: string }) {
  if (result === 'W') {
    return <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-700 p-3 text-white">{result}</div>;
  }
  return <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 p-3">{result}</div>;
}
