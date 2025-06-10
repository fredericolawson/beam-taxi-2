'use server';
import type { Mooring } from '@/types/mooring';
import { EmailTemplate } from '@/components/email-template';
import { Resend } from 'resend';
import { User } from '@supabase/supabase-js';
import { adminAuthClient } from '@/lib/supabase/authClient';
import { Request } from '@/types/request';

export async function sendMessage({ object, user, message }: { object: Mooring | Request; user: User; message: string }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data: ownerData } = await adminAuthClient.getUserById(object.owner_id);
  if (!ownerData.user) throw new Error('Owner not found');

  const { data, error } = await resend.emails.send({
    from: 'HeyBuoy <inquiry@heybuoy.beam.bm>',
    to: ownerData.user.email!,
    subject: 'Message from ' + user.user_metadata.first_name! + ' ' + user.user_metadata.last_name!,
    react: EmailTemplate({ sender: user, message }) as React.ReactNode,
    replyTo: user.email!,
  });
  if (error) {
    console.error('Error sending message:', error);
    return null;
  }
  return data;
}
