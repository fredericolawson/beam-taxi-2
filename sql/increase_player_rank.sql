-- Function to increase a player's rank (decrease ladder_rank by 1)
-- This swaps ranks with the player currently at the target rank
CREATE OR REPLACE FUNCTION increase_player_rank(player_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_rank INTEGER;
    target_rank INTEGER;
    other_player_id UUID;
BEGIN
    -- Get the current rank of the player
    SELECT ladder_rank INTO current_rank
    FROM ladder.players
    WHERE id = player_id;
    
    -- If player not found or already at rank 1, return false
    IF current_rank IS NULL OR current_rank <= 1 THEN
        RETURN FALSE;
    END IF;
    
    -- Calculate target rank (one rank higher)
    target_rank := current_rank - 1;
    
    -- Find the player currently at the target rank
    SELECT id INTO other_player_id
    FROM ladder.players
    WHERE ladder_rank = target_rank;
    
    -- If no player at target rank, just update the current player
    IF other_player_id IS NULL THEN
        UPDATE ladder.players
        SET ladder_rank = target_rank
        WHERE id = player_id;
    ELSE
        -- Swap ranks between the two players
        -- First, temporarily set one player to a negative rank to avoid unique constraint violation
        UPDATE ladder.players
        SET ladder_rank = -1
        WHERE id = player_id;
        
        -- Move the other player to the lower rank
        UPDATE ladder.players
        SET ladder_rank = current_rank
        WHERE id = other_player_id;
        
        -- Move the original player to the higher rank
        UPDATE ladder.players
        SET ladder_rank = target_rank
        WHERE id = player_id;
    END IF;
    
    RETURN TRUE;
END;
$$;