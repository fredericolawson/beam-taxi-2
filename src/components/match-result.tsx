import type { CompletedMatch } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { format } from 'date-fns';
import { CalendarIcon, FlagIcon, Trophy } from 'lucide-react';

export function MatchResult({ match }: { match: CompletedMatch }) {
  if (!match) return null;
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>
          {match.challenger.firstName} {match.challenger.lastName} vs {match.opponent.firstName} {match.opponent.lastName}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <ResultItem
          label="Winner"
          value={`${match.winner.firstName} ${match.winner.lastName}`}
          icon={<Trophy className="text-green-700" />}
        />
        <ResultItem label="Result" value={match.result} icon={<FlagIcon />} />
        <ResultItem label="Completed On" value={format(new Date(match.completedOn), 'PPP')} icon={<CalendarIcon />} />
      </CardContent>
    </Card>
  );
}

function ResultItem({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      {icon}
      <div className="flex flex-col">
        <span className="text-xs">{label}</span>
        <span>{value}</span>
      </div>
    </div>
  );
}
