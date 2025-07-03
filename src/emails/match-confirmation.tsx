import { CompletedMatch, Match, Player } from '@/types';
import { Body, Button, Container, Head, Heading, Html, Img, Preview, Section, Text, Tailwind } from '@react-email/components';
import { MatchDetails, Template } from './components';
import { defaultMatch } from './mock';

function MatchDateTime({ match }: { match: Match | CompletedMatch }) {
  const { matchDate, matchTime } = MatchDetails(match);
  return (
    <Section className="mb-6 text-center">
      <Text className="mb-4 text-base text-gray-700">Please be sure to book your court in the Coral Beach & Tennis Club app!</Text>
      <Text className="text-base text-gray-700">
        <strong>Match Date:</strong> {matchDate}
        <br />
        <strong>Match Time:</strong> {matchTime}
      </Text>
    </Section>
  );
}

function MatchSummary({ match }: { match: Match | CompletedMatch }) {
  const { challengerName, defenderName } = MatchDetails(match);
  return (
    <Section className="mb-6 rounded-lg bg-gray-50 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 text-center">
          <Text className="mb-1 text-lg font-semibold text-gray-800">{challengerName}</Text>
          <Text className="m-0 text-sm text-gray-600">Rank #{match.challenger.ladderRank}</Text>
        </div>

        <Text className="text-brand mx-4 text-lg font-semibold">vs</Text>

        <div className="flex-1 text-center">
          <Text className="mb-1 text-lg font-semibold text-gray-800">{defenderName}</Text>
          <Text className="m-0 text-sm text-gray-600">Rank #{match.defender.ladderRank}</Text>
        </div>
      </div>
    </Section>
  );
}

export default function MatchConfirmation({ match = defaultMatch }: { match: Match }) {
  return (
    <Template match={match}>
      <Section className="bg-white p-8">
        <Heading className="mb-6 text-center text-2xl font-semibold text-gray-800">Match Confirmed</Heading>

        <MatchSummary match={match} />
        <MatchDateTime match={match} />

        {/* Call to Action Buttons */}
        <Section className="mb-6 text-center">
          <div className="flex items-center justify-center gap-4">
            <Button
              href="https://coralbeach.tennis.bm/"
              className="bg-brand hover:bg-brand-dark rounded-md px-6 py-3 font-medium text-white"
            >
              Enter Result
            </Button>

            <Button
              href="https://coralbeach.tennis.bm/"
              className="border-brand text-brand border-brand rounded-md border px-6 py-3 font-medium hover:bg-gray-50"
              style={{
                border: '1px solid #75acbe',
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
    </Template>
  );
}
