export function MatchHistorySummary({ historySummary }: { historySummary: string[] }) {
  if (historySummary.length === 0) return <div>—</div>;
  const slicedSummary = historySummary.slice(0, 6);
  return (
    <div className="flex gap-2">
      {slicedSummary.map((result, index) => (
        <ResultIcon key={index} result={result} />
      ))}
    </div>
  );
}

function ResultIcon({ result }: { result: string }) {
  if (result === 'W') {
    return <div className="bg-secondary flex h-4 w-4 items-center justify-center rounded-full border p-3 text-white">{result}</div>;
  }
  return <div className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 bg-gray-200 p-3">{result}</div>;
}
