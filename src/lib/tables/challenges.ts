import { createClient } from '@/lib/supabase/server';
import type { Challenge } from '@/types';

export async function getChallenges(): Promise<Challenge[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('ladder.challenges').select('*');
  if (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }

  return data as Challenge[];
}
