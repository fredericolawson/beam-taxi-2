# Move Pending Match State to LadderTable

## Overview

Refactor pending match state management to move it from individual `LadderRow` components up to the parent `LadderTable` component. This will eliminate prop drilling and make state coordination easier.

## Alternative: Option 1 - Add Refresh Trigger (Simpler Approach)

### Overview

Instead of moving state up, add a refresh trigger mechanism that allows components several layers down to force the existing `useEffect` in `LadderRow` to re-run.

### Implementation Plan - Option 1

#### Step 1: Update LadderRow Component

- [ ] Add `refreshTrigger` state: `const [refreshTrigger, setRefreshTrigger] = useState(0)`
- [ ] Add `refreshTrigger` to the `useEffect` dependency array: `[isSheetOpen, refreshTrigger]`
- [ ] Create refresh callback: `const refreshPendingMatch = useCallback(() => setRefreshTrigger(prev => prev + 1), [])`
- [ ] Pass `refreshPendingMatch` down to `PlayerSheet` instead of generic `refresh`

#### Step 2: Update PlayerSheet Component

- [ ] Accept `refreshPendingMatch` prop instead of `refresh`
- [ ] Pass `refreshPendingMatch` down to `ChallengePlayer`

#### Step 3: Update ChallengePlayer Component

- [ ] Replace `onMatchUpdate` prop with `refreshPendingMatch`
- [ ] Call `refreshPendingMatch()` after successful challenge creation

#### Benefits of Option 1

- Minimal code changes
- Preserves existing architecture
- Quick to implement and test
- No risk of breaking existing functionality

#### Drawbacks of Option 1

- Still has individual API calls per row
- Maintains prop drilling pattern
- Doesn't address the architectural concerns
- Each row still independently manages its own state

---

## Option 2: Move State Up (Recommended)

## Current State

- Each `LadderRow` independently fetches its own pending match data
- `ChallengePlayer` needs to trigger refreshes several layers up
- Awkward callback passing through component hierarchy

## Target State

- `LadderTable` owns all pending match state
- Single fetch for all pending matches
- Clean callback structure for updates
- Props flow down naturally

## Implementation Plan

### Step 1: Update LadderTable Component

- [ ] Add state for storing all pending matches: `Map<string, Match>` where key is `${challengerId}-${defenderId}`
- [ ] Add loading state for pending matches
- [ ] Create `fetchPendingMatches` function that fetches matches for all visible player pairs
- [ ] Add `refreshMatches` callback function to be passed down
- [ ] Add useEffect to fetch pending matches on mount and when players change

### Step 2: Update LadderRow Component

- [ ] Remove local `pendingMatch` state
- [ ] Remove local `pendingMatchLoading` state
- [ ] Remove the `useEffect` that fetches pending match data
- [ ] Accept new props: `pendingMatch: Match | null` and `onRefreshMatches: () => void`
- [ ] Pass `onRefreshMatches` down to `PlayerSheet`

### Step 3: Update PlayerSheet Component

- [ ] Accept `onRefreshMatches` prop
- [ ] Pass it down to child components that need it
- [ ] Remove the `refresh` prop (replace with `onRefreshMatches`)

### Step 4: Update ChallengePlayer Component

- [ ] Replace `onMatchUpdate` prop with `onRefreshMatches`
- [ ] Call `onRefreshMatches` after successful challenge creation
- [ ] Remove any other refresh logic that's now redundant

### Step 5: Update getBiMatches Usage

- [ ] In `LadderTable`, call `getBiMatches` for all relevant player pairs
- [ ] Consider batching or optimizing these calls if performance becomes an issue
- [ ] Cache results in the Map structure for efficient lookup

### Step 6: Handle Edge Cases

- [ ] Ensure proper loading states during fetches
- [ ] Handle errors gracefully
- [ ] Consider what happens when sheet opens/closes (may need separate trigger)
- [ ] Test that challenges are immediately reflected in the UI

## Benefits After Refactor

- Single source of truth for pending match data
- No more prop drilling of callbacks
- Easier to debug and maintain
- Better performance (fewer API calls)
- More predictable data flow

## Files to Modify

- `src/components/ladder-table.tsx`
- `src/components/ladder-row.tsx`
- `src/components/player-sheet.tsx`
- `src/components/challenge.tsx`

## Testing Checklist

- [ ] Pending matches display correctly on ladder
- [ ] Creating a challenge updates the UI immediately
- [ ] Opening/closing player sheets works correctly
- [ ] Loading states work properly
- [ ] Error handling still functions
- [ ] No duplicate API calls
- [ ] Performance is acceptable
