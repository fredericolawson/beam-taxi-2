## Ladder logic

ladderRank is inverted — 1 is the best ranked player
I can challenge people up to three positions better than me
If I beat the person I challenge, I take their ladder rank. They and everyone between them and me moves down one position.
ladder_rank is a field on the player record in Supabase

## Tech design

### updateLadderRanks() Implementation Notes

**Function Signature:**
```typescript
updateLadderRanks({ matchId, winnerId }: { matchId: string; winnerId: string })
```

**Algorithm Steps:**
1. **Fetch match data** - Get challenger_id, defender_id, winner_id from matches table
2. **Determine scenario** - Only update ranks if challenger wins (challenger_id === winner_id)
3. **Calculate affected range** - All players between challenger and defender ranks (inclusive)
4. **Batch rank updates** - Use single transaction with multiple UPDATE statements
5. **Revalidate cache** - Clear ladder display cache after successful update

**Database Updates Required:**
- Winner gets defender's rank (challenger takes defender's position)
- All players between original positions move down +1 rank
- Use Supabase transaction for atomicity

**Example:** 
- Challenger rank 7 beats Defender rank 4
- Challenger becomes rank 4
- Former ranks 4,5,6 become ranks 5,6,7

**Edge Cases:**
- Defender wins: No rank changes needed
- Concurrent matches: Handle with database constraints/retry logic
- Invalid match states: Validate before processing

**Performance Considerations:**
- Batch updates in single transaction
- Limit affected players (max 3 positions per rules)
- Use database-level rank constraints if needed
