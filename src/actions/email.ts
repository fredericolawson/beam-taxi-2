'use server';

import MatchResult from '@/emails/match-result';
import MatchConfirmation from '../emails/match-confirmation';
import { getMatchById } from '@/lib/tables/matches';
import { Resend } from 'resend';
import { CompletedMatch, Match } from '@/types';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateICalContent(match: Match): string {
  const matchDate = new Date(match.matchDate!);

  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  return `BEGIN:VCALENDAR\r\n\
VERSION:2.0\r\n\
PRODID:-//Coral Beach Tennis//Match Confirmation//EN\r\n\
BEGIN:VEVENT\r\n\
UID:match-${match.id}@tennis.bm\r\n\
DTSTART:${formatDate(matchDate)}\r\n\
DTEND:${formatDate(new Date(matchDate.getTime() + 2 * 60 * 60 * 1000))}\r\n\
DTSTAMP:${formatDate(new Date())}\r\n\
SUMMARY:Tennis Match: ${match.challenger.firstName} ${match.challenger.lastName} vs ${
    match.defender.firstName
  } ${match.defender.lastName}\r\n\
DESCRIPTION:Tennis match between ${match.challenger.firstName} ${match.challenger.lastName}\
 and ${match.defender.firstName} ${match.defender.lastName}\r\n\
LOCATION:Coral Beach & Tennis Club, 34 South Road, Paget, Bermuda, PG 04\r\n\
ORGANIZER:mailto:tennis@coralbeach.bm\r\n\
ATTENDEE:mailto:${match.challenger.email}\r\n\
ATTENDEE:mailto:${match.defender.email}\r\n\
STATUS:CONFIRMED\r\n\
END:VEVENT\r\n\
END:VCALENDAR`;
}

export async function sendMatchConfirmation({ matchId }: { matchId: string }): Promise<{ sendSuccess: boolean }> {
  const match = await getMatchById({ matchId });
  if (!match) return { sendSuccess: false };

  const iCalContent = generateICalContent(match as Match);

  const { data, error } = await resend.emails.send({
    from: 'Coral Beach Tennis <no-reply@tennis.bm>',
    to: [match.challenger.email, match.defender.email],
    replyTo: 'tennis@coralbeach.bm',
    subject: 'Your match confirmation',
    text: match.challenger.firstName + ' ' + match.challenger.lastName + ' vs ' + match.defender.firstName + ' ' + match.defender.lastName,
    react: MatchConfirmation({ match: match as Match }),
    attachments: [
      {
        filename: 'tennis-match.ics',
        content: Buffer.from(iCalContent).toString('base64'),
        contentType: 'text/calendar',
      },
    ],
  });
  if (error) {
    console.error('Error sending email:', error);
    return { sendSuccess: false };
  }
  return { sendSuccess: true };
}

export async function sendMatchResult({ matchId }: { matchId: string }): Promise<{ sendSuccess: boolean }> {
  const match = await getMatchById({ matchId });
  if (!match) return { sendSuccess: false };

  const { data, error } = await resend.emails.send({
    from: 'Coral Beach Tennis <no-reply@tennis.bm>',
    to: [match.challenger.email, match.defender.email],
    replyTo: 'tennis@coralbeach.bm',
    subject: 'Your match result',
    text: match.challenger.firstName + ' ' + match.challenger.lastName + ' vs ' + match.defender.firstName + ' ' + match.defender.lastName,
    react: MatchResult({ match: match as CompletedMatch }),
  });
  if (error) {
    console.error('Error sending email:', error);
    return { sendSuccess: false };
  }
  return { sendSuccess: true };
}
