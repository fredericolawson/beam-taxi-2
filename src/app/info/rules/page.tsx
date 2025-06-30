import { Rules } from '@/components/rules';

export default function RulesPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Rules />
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
