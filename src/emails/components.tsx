import { CompletedMatch, Match } from '@/types';
import { Body, Button, Container, Head, Heading, Html, Img, Preview, Section, Text, Tailwind } from '@react-email/components';

export function Template({ children, match }: { children: React.ReactNode; match: Match | CompletedMatch }) {
  const { matchTitle, matchDate, matchTime } = MatchDetails(match);
  return (
    <Html>
      <Head />
      <Preview>
        {matchTitle} at {matchDate} {matchTime}
      </Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: '#75acbe',
                'brand-dark': '#5a8fa4',
              },
            },
          },
        }}
      >
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto max-w-2xl">
            {/* Header Banner with Logo */}
            <Section className="bg-brand p-8 text-center">
              <Img
                src="https://coralbeach.tennis.bm/logo.png"
                alt="Coral Beach & Tennis Club"
                className="mx-auto"
                style={{ maxHeight: '100px', height: '100px' }}
              />
            </Section>

            {/* Email Content */}

            {children}

            {/* Footer with some spacing */}
            <Section className="h-4"></Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export function MatchDetails(match: Match | CompletedMatch) {
  const challengerName = `${match.challenger.firstName} ${match.challenger.lastName}`;
  const defenderName = `${match.defender.firstName} ${match.defender.lastName}`;
  const matchTitle = `${challengerName} vs ${defenderName}`;
  const matchDate = new Date(match.matchDate!).toLocaleDateString('en-GB', {
    timeZone: 'Atlantic/Bermuda',
  });
  const matchTime = new Date(match.matchDate!).toLocaleTimeString('en-GB', {
    timeZone: 'Atlantic/Bermuda',
  });
  return {
    matchTitle,
    matchDate,
    matchTime,
    challengerName,
    defenderName,
  };
}
