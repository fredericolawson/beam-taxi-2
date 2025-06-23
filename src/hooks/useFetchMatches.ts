import { getBiMatches } from '@/actions/match';
import type { Match } from '@/types';
import { useState, useEffect } from 'react';

export function useFetchMatches({ challengerId, opponentId }: { challengerId: string; opponentId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [pendingMatches, setPendingMatches] = useState<Match[]>([]);

  const fetchMatches = async () => {
    setIsLoading(true);
    const matches = await getBiMatches({ challengerId, opponentId });
    setMatches(matches);
    setPendingMatches(matches.filter((m) => m.completedOn === null));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMatches();
  }, [challengerId, opponentId]);

  return { isLoading, matches, pendingMatches, fetchMatches };
}
