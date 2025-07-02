'use server';

import { MatchConfirmation } from '@/emails/match-emails';
import { getMatchById } from '@/lib/tables/matches';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMatchConfirmation({ matchId }: { matchId: string }): Promise<{ sendSuccess: boolean }> {
  const match = await getMatchById({ matchId });
  if (!match) return { sendSuccess: false };

  const { data, error } = await resend.emails.send({
    from: 'Coral Beach Tennis <no-reply@tennis.bm>',
    to: [match.challenger.email, match.defender.email],
    replyTo: 'tennis@coralbeach.bm',
    subject: 'Your match confirmation',
    text: match.challenger.firstName + ' ' + match.challenger.lastName + ' vs ' + match.defender.firstName + ' ' + match.defender.lastName,
    react: MatchConfirmation({ match }),
  });
  if (error) {
    console.error('Error sending email:', error);
    return { sendSuccess: false };
  }
  return { sendSuccess: true };
}
