'use server';
import type { Mooring } from '@/types/mooring';
import { EmailTemplate } from '@/components/email-template';
import { Resend } from 'resend';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

export async function sendMessage({ mooring, user, message }: { mooring: Mooring; user: User; message: string }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = await createClient();
  console.log('mooring owner_id', mooring.owner_id);
  const { data: ownerData } = await supabase.auth.admin.getUserById(mooring.owner_id);
  console.log('ownerData', ownerData);
  const { data, error } = await resend.emails.send({
    from: user.email!,
    to: ownerData.user?.email!,
    subject: 'Message from ' + user.user_metadata.first_name! + ' ' + user.user_metadata.last_name!,
    react: EmailTemplate({ sender: user, message }) as React.ReactNode,
  });
  if (error) {
    console.error('Error sending message:', error);
    return null;
  }
  return data;
}
