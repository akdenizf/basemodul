-- V4.0 RPC Function: match_tenant with 40/60 weighted similarity
-- This function implements the 3-Tier Matching Logic for Callfolio

-- Enable pg_trgm extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS match_tenant(TEXT, TEXT, TEXT);

-- Create the match_tenant RPC function
CREATE OR REPLACE FUNCTION match_tenant(
    search_phone TEXT,
    search_name TEXT,
    search_address TEXT
)
RETURNS TABLE(
    id UUID,
    tenant_id TEXT,
    name TEXT,
    phone TEXT,
    address TEXT,
    unit TEXT,
    email TEXT,
    similarity_score NUMERIC
) AS $$
BEGIN
    -- First, check for exact phone match (Tier 1: Phone Match)
    -- This gets highest priority with score 1.0
    IF search_phone IS NOT NULL AND search_phone != '' THEN
        RETURN QUERY
        SELECT 
            t.id,
            t.tenant_id,
            t.name,
            t.phone,
            t.address,
            t.unit,
            t.email,
            1.0::NUMERIC as similarity_score
        FROM tenants t
        WHERE t.phone = search_phone
        ORDER BY t.created_at DESC
        LIMIT 1;
        
        -- If we found an exact phone match, return immediately
        IF FOUND THEN
            RETURN;
        END IF;
    END IF;
    
    -- If no phone match, proceed with fuzzy text matching (Tier 2 & 3)
    -- Use 40% name similarity + 60% address similarity weighting
    RETURN QUERY
    SELECT 
        t.id,
        t.tenant_id,
        t.name,
        t.phone,
        t.address,
        t.unit,
        t.email,
        -- Weighted similarity: 40% name + 60% address
        (
            COALESCE(similarity(t.name, search_name), 0) * 0.4 +
            COALESCE(similarity(t.address, search_address), 0) * 0.6
        )::NUMERIC as similarity_score
    FROM tenants t
    WHERE 
        -- Only include results with meaningful similarity
        (
            COALESCE(similarity(t.name, search_name), 0) > 0.2 OR
            COALESCE(similarity(t.address, search_address), 0) > 0.3
        )
        -- Exclude exact phone matches (already handled above)
        AND (search_phone IS NULL OR search_phone = '' OR t.phone != search_phone)
    ORDER BY similarity_score DESC, t.created_at DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON FUNCTION match_tenant IS 'V4.0 3-Tier tenant matching with 40/60 weighted similarity (name/address). Returns phone exact matches first (score 1.0), then fuzzy matches ordered by weighted similarity.';

-- Grant execute permissions (adjust as needed for your setup)
-- GRANT EXECUTE ON FUNCTION match_tenant TO your_app_user;