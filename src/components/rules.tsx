import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Trophy, Calendar } from 'lucide-react';

export function Rules() {
  return (
    <div className="w-full">
      <h1 className="heading-3 text-center">Ladder Rules</h1>

      <div className="grid gap-6">
        {/* Challenging Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Who can you challenge?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You may challenge a player up to <strong>three positions</strong> above you.
            </p>

            <div className="space-y-3">
              <div>
                <h4 className="mb-2 font-semibold">If the challenger wins:</h4>
                <ul className="list-inside list-disc space-y-1 text-sm">
                  <li>The challenger takes the defender's position in the ladder</li>
                  <li>The defender and every player between them move down one position</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2 font-semibold">If the defender wins:</h4>
                <ul className="list-inside list-disc text-sm">
                  <li>There is no change in the ladder</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match Format */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Match Format
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-medium">Superset:</span>
              <span>First to 8 games wins</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Tiebreaker:</span>
              <span>Played if both players reach 7 games</span>
            </div>
          </CardContent>
        </Card>

        {/* Match Scheduling */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Match Scheduling
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="bg-muted flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium">1</span>
                <p className="text-sm">When you select a challenger, you will be shown their contact details</p>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-muted flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium">2</span>
                <p className="text-sm">Players are responsible for scheduling their own matches</p>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-muted flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium">3</span>
                <p className="text-sm">When you complete the match, record the result and score in the app</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/*
# Who can you challenge?
You may challenge a player up to three positions above you.
If the challenger beats the defender:
- the challenger takes the defender's position in the ladder. 
- the defender, and every player between the challenger and the defender, move down one position.
If the defender beats the challenger:
- There is no change in the ladder.

# Match format
- one "superset" - first to 8 games win
- a tiebreaker if both players win 7 games

# Match scheduling
- When you select a challenger player, you will be shown their contact details. 
- Players are responsible for scheduling their own matches
- When you complete the match, record the result and score in the app. 





*/
