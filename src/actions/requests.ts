'use server';

import { createClient } from '@/lib/supabase/server';
import type { Request } from '@/types/request';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateRequest({ requestId, data }: { requestId: string; data: Partial<Request> }) {
  const supabase = await createClient();

  // Transform Date objects to ISO strings for database storage
  const transformedData = {
    ...data,
    ...(data.start_from && { start_from: data.start_from.toISOString() }),
    ...(data.start_to && { start_to: data.start_to.toISOString() }),
  };

  const { data: updatedRequest, error } = await supabase.from('requests').update(transformedData).eq('id', requestId).select().single();
  if (error) {
    console.error('Error creating request:', error);
    return null;
  }

  revalidatePath(`/requests/${requestId}`);
  redirect(`/requests/${requestId}`);
}

export async function deleteRequest({ requestId }: { requestId: string }) {
  const supabase = await createClient();
  const { error } = await supabase.from('requests').delete().eq('id', requestId);
  return { error };
}

export async function createRequest({ requestName }: { requestName: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-up');

  const { data, error } = await supabase.from('requests').insert({ name: requestName, owner_id: user.id }).select().single();

  if (error) {
    console.error('Error creating request:', error);
    return null;
  }

  revalidatePath('/');
  revalidatePath(`/requests/${data.id}/edit`);
  redirect(`/requests/${data.id}/edit`);
}
