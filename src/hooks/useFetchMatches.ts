import { getBiMatches } from '@/actions/match';
import type { CompletedMatch, Match } from '@/types';
import { useState, useEffect } from 'react';

export function useFetchMatches({ challengerId, opponentId }: { challengerId: string; opponentId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [completedMatches, setCompletedMatches] = useState<CompletedMatch[]>([]);
  const [pendingMatch, setPendingMatch] = useState<Match | null>(null);

  const fetchMatches = async () => {
    setIsLoading(true);
    const matches = await getBiMatches({ challengerId, defenderId: opponentId });
    setCompletedMatches(matches.filter((m) => m.completedOn !== null) as CompletedMatch[]);
    setPendingMatch(matches.find((m) => m.completedOn === null) || null);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMatches();
  }, [challengerId, opponentId]);

  return { isLoading, completedMatches, pendingMatch, fetchMatches };
}
