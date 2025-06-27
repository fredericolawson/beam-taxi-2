import { getBiMatches } from '@/actions/match';
import type { CompletedMatch, Match } from '@/types';
import { useState, useEffect } from 'react';

export function useFetchMatches({ challengerId, defenderId }: { challengerId: string; defenderId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [completedMatches, setCompletedMatches] = useState<CompletedMatch[]>([]);
  const [pendingMatch, setPendingMatch] = useState<Match | null>(null);

  const fetchMatches = async () => {
    setIsLoading(true);
    const matches = await getBiMatches({ challengerId, defenderId: defenderId });
    setCompletedMatches(matches.filter((m) => m.completedOn !== null) as CompletedMatch[]);
    setPendingMatch(matches.find((m) => m.completedOn === null) || null);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMatches();
  }, [challengerId, defenderId, fetchMatches]);

  return { isLoading, completedMatches, pendingMatch, fetchMatches };
}
