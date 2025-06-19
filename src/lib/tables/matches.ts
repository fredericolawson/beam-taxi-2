import { createClient } from '@/lib/supabase/server';
import type { Match } from '@/types';

export async function getMatches(): Promise<Match[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('ladder.matches').select('*');
  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }

  return data as Match[];
}
