import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSupabaseUrl } from "@/lib/supabase/env";

// V4.0 Interface Definitions for 3-Tier Matching Logic
export interface Tenant {
  id: string;
  tenant_id: string;
  name: string;
  phone: string | null;
  address: string;
  unit: string;
  email: string | null;
}

export interface MatchResult {
  type: 'MATCH' | 'REVIEW' | 'UNKNOWN';
  confidence: number;
  tenant: Tenant | null;
}

// Use the singleton admin client
const supabase = getSupabaseAdmin();

/**
 * V4.0 3-Tier Tenant Matching Function
 * 
 * Implements the Confidence-Based Intake Protocol with:
 * - Tier 1: Phone Exact Match (confidence 1.0)
 * - Tier 2: Fuzzy High Match (>= 0.7)
 * - Tier 3: Fuzzy Low Match (0.4-0.7) 
 * - Fallback: Unknown (< 0.4)
 * 
 * Uses 40/60 weighted similarity (name/address)
 */
export async function findTenant(
  search_phone: string,
  search_name: string,
  search_address: string
): Promise<MatchResult> {
  // Handle build-time or missing environment
  const supabaseUrl = getSupabaseUrl();
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    return { type: 'UNKNOWN', confidence: 0, tenant: null };
  }
  
  try {
    // Call the new match_tenant RPC function
    const { data, error } = await supabase.rpc('match_tenant', {
      search_phone,
      search_name,
      search_address
    });
    
    if (error) {
      console.error('RPC match_tenant error:', error);
      return { type: 'UNKNOWN', confidence: 0, tenant: null };
    }
    
    if (!data || data.length === 0) {
      return { type: 'UNKNOWN', confidence: 0, tenant: null };
    }
    
    const bestMatch = data[0];
    const confidence = parseFloat(bestMatch.similarity_score);
    
    // Convert database result to Tenant interface
    const tenant: Tenant = {
      id: bestMatch.id,
      tenant_id: bestMatch.tenant_id,
      name: bestMatch.name,
      phone: bestMatch.phone,
      address: bestMatch.address,
      unit: bestMatch.unit,
      email: bestMatch.email
    };
    
    // Apply 3-Tier Logic based on confidence thresholds
    if (confidence === 1.0) {
      // Tier 1: Phone Exact Match
      return { type: 'MATCH', confidence: 1.0, tenant };
    } else if (confidence >= 0.7) {
      // Tier 2: Fuzzy High Match
      return { type: 'MATCH', confidence, tenant };
    } else if (confidence >= 0.4) {
      // Tier 3: Fuzzy Low Match (requires review)
      return { type: 'REVIEW', confidence, tenant };
    } else {
      // Fallback: No meaningful match
      return { type: 'UNKNOWN', confidence: 0, tenant: null };
    }
    
  } catch (error) {
    console.error('findTenant error:', error);
    return { type: 'UNKNOWN', confidence: 0, tenant: null };
  }
}
