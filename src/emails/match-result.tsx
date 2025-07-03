import { CompletedMatch, Match, Player } from '@/types';
import { Body, Button, Container, Head, Heading, Html, Img, Preview, Section, Text, Tailwind } from '@react-email/components';
import { MatchDetails, Template } from './components';
import { defaultCompletedMatch } from './mock';

function MatchDateTime({ match }: { match: Match | CompletedMatch }) {
  const { matchDate, matchTime } = MatchDetails(match);
  return (
    <Section className="mb-6 text-center">
      <Text className="text-base text-gray-700">
        <strong>Match Date:</strong> {matchDate}
        <br />
        <strong>Match Time:</strong> {matchTime}
      </Text>
    </Section>
  );
}

function MatchSummary({ match }: { match: CompletedMatch }) {
  const { challengerName, defenderName } = MatchDetails(match);
  return (
    <Section className="mb-6 items-center justify-center rounded-lg bg-gray-50 p-6">
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
      <div className="flex-1 text-center">
        <Text className="text-center text-sm text-gray-600">Winner</Text>
        <Text className="m-0 text-center text-lg font-semibold text-gray-800">{match.winner.firstName}</Text>
        <Text className="m-0 text-center text-lg font-semibold text-gray-800">{match.result}</Text>
      </div>
    </Section>
  );
}

export default function MatchResult({ match = defaultCompletedMatch }: { match: CompletedMatch }) {
  return (
    <Template match={match}>
      <Section className="bg-white p-8">
        <Heading className="mb-6 text-center text-2xl font-semibold text-gray-800">Match Result</Heading>

        <MatchSummary match={match} />
        <MatchDateTime match={match} />

        {/* Call to Action Buttons */}
        <Section className="mb-6 text-center">
          <div className="flex items-center justify-center gap-4">
            <Button
              href="https://coralbeach.tennis.bm/"
              className="bg-brand hover:bg-brand-dark rounded-md px-6 py-3 font-medium text-white"
            >
              View Ladder
            </Button>
          </div>
        </Section>
      </Section>
    </Template>
  );
}
