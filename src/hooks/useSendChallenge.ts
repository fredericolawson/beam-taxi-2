'use client';

import { useState } from 'react';
import { challengePlayer } from '@/actions/match';
import { useFetchMatches } from './useFetchMatches';
import { revalidate } from '@/actions/revalidate';

export function useSendChallenge({ challengerId, opponentId }: { challengerId: string; opponentId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchMatches } = useFetchMatches({ challengerId, opponentId });

  const sendChallenge = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await challengePlayer({ challengerId, opponentId });
      if (error) {
        setError(error);
        return { error };
      }
      fetchMatches();
      revalidate('/');
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, sendChallenge };
}
