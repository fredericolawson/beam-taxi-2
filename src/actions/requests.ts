'use server';

import { createClient } from '@/lib/supabase/server';
import { getUserServer } from '@/lib/utils/get-user-server';
import type { Request } from '@/types/request';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/*
==============================================
  createRequest
==============================================
*/

export async function createRequest({ description }: { description: string }) {
  const supabase = await createClient();
  const user = await getUserServer();
  if (!user) redirect('/auth/sign-up');
  const owner_id = user.id;

  const { data, error } = await supabase.from('requests').insert({ description, owner_id }).select().single();

  if (error) {
    console.error('Error creating request:', error);
    return null;
  }

  revalidatePath('/');
  revalidatePath(`/requests/${data.id}/edit`);
  redirect(`/requests/${data.id}/edit`);
}

/*
==============================================
  updateRequest
==============================================
*/

export async function updateRequest({ requestId, data }: { requestId: string; data: Partial<Request> }) {
  const supabase = await createClient();

  // Transform Date objects to ISO strings for database storage
  const transformedData = {
    ...data,
    ...(data.start_date && { start_date: data.start_date.toISOString() }),
    ...(data.expires_on && { expires_on: data.expires_on.toISOString() }),
  };

  const { data: updatedRequest, error } = await supabase.from('requests').update(transformedData).eq('id', requestId).select().single();
  if (error) {
    console.error('Error creating request:', error);
    return null;
  }

  revalidatePath(`/requests/${requestId}`);
  redirect(`/requests/${requestId}`);
}

/*
==============================================
  deleteRequest
==============================================
*/

export async function deleteRequest({ requestId }: { requestId: string }) {
  const supabase = await createClient();
  const { error } = await supabase.from('requests').delete().eq('id', requestId);
  if (error) {
    console.error('Error deleting request:', error);
    return null;
  }

  revalidatePath(`/requests/${requestId}`);
  redirect('/');
}
