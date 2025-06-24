import { getMatchHistory } from '@/lib/utils/match-utils';

export async function MatchHistory({ playerId }: { playerId: string }) {
  const matchHistory = await getMatchHistory({ playerId });

  return (
    <div className="flex gap-2">
      {matchHistory.map((result, index) => (
        <ResultIcon key={index} result={result} />
      ))}
    </div>
  );
}

function ResultIcon({ result }: { result: string }) {
  if (result === 'W') {
    return <div className="flex h-4 w-4 items-center justify-center rounded-full border bg-green-700 p-3 text-white">{result}</div>;
  }
  return <div className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 bg-gray-200 p-3">{result}</div>;
}
