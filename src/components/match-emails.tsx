import { Match } from '@/types';
import { Body, Button, Container, Head, Heading, Html, Img, Preview, Section, Text, Tailwind } from '@react-email/components';

export function MatchConfirmation({ match }: { match: Match }) {
  const date = new Date(match.matchDate!).toLocaleDateString();
  const time = new Date(match.matchDate!).toLocaleTimeString();
  return (
    <Html>
      <Head />
      <Preview>
        {match.challenger.firstName +
          ' ' +
          match.challenger.lastName +
          ' vs ' +
          match.defender.firstName +
          ' ' +
          match.defender.lastName +
          ' at ' +
          date +
          ' ' +
          time}
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
            <Section className="bg-white p-8">
              <Heading className="mb-6 text-center text-2xl font-semibold text-gray-800">Match Confirmed</Heading>

              {/* Match Details */}
              <Section className="mb-6 rounded-lg bg-gray-50 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 text-center">
                    <Text className="mb-1 text-lg font-semibold text-gray-800">
                      {match.challenger.firstName} {match.challenger.lastName}
                    </Text>
                    <Text className="m-0 text-sm text-gray-600">Rank #{match.challenger.ladderRank}</Text>
                  </div>

                  <Text className="text-brand mx-4 text-lg font-semibold">vs</Text>

                  <div className="flex-1 text-center">
                    <Text className="mb-1 text-lg font-semibold text-gray-800">
                      {match.defender.firstName} {match.defender.lastName}
                    </Text>
                    <Text className="m-0 text-sm text-gray-600">Rank #{match.defender.ladderRank}</Text>
                  </div>
                </div>
              </Section>

              {match.matchDate && (
                <Section className="mb-6 text-center">
                  <Text className="mb-4 text-base text-gray-700">
                    Please be sure to book your court in the Coral Beach & Tennis Club app!
                  </Text>
                  <Text className="text-base text-gray-700">
                    <strong>Match Date:</strong> {new Date(match.matchDate).toLocaleDateString()}
                    <br />
                    <strong>Match Time:</strong> {new Date(match.matchDate).toLocaleTimeString()}
                  </Text>
                </Section>
              )}

              {/* Call to Action Buttons */}
              <Section className="mb-6 text-center">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    href="https://coralbeach.tennis.bm/"
                    className="bg-brand hover:bg-brand-dark rounded-md px-6 py-3 font-medium text-white"
                    style={{
                      backgroundColor: '#75acbe',
                      color: '#ffffff',
                      padding: '12px 24px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontWeight: '500',
                    }}
                  >
                    Enter Result
                  </Button>

                  <Button
                    href="https://coralbeach.tennis.bm/"
                    className="border-brand text-brand rounded-md border px-6 py-3 font-medium hover:bg-gray-50"
                    style={{
                      border: '1px solid #75acbe',
                      color: '#75acbe',
                      padding: '12px 24px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontWeight: '500',
                      backgroundColor: 'transparent',
                    }}
                  >
                    Reschedule
                  </Button>
                </div>
              </Section>

              <Section className="border-t border-gray-200 pt-6 text-center">
                <Text className="m-0 text-sm text-gray-500">Good luck to both players!</Text>
              </Section>
            </Section>

            {/* Footer with some spacing */}
            <Section className="h-4"></Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
