import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runValidation() {
  console.log('🚀 Starting Final Validation Database Checks...\n');

  // 1. Check Organizations for Billing Columns
  const { data: orgs, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, plan_tier, call_limit, current_month_calls, duration_limit_minutes, current_month_duration_seconds')
    .limit(5);

  if (orgError) {
    console.error('❌ Billing columns check failed:', orgError.message);
  } else {
    console.log('✅ Billing columns exist in organizations table.');
    console.log('Sample Orgs:', orgs);
  }

  // 2. Check Tickets for Duration Column
  const { data: tickets, error: ticketError } = await supabase
    .from('tickets')
    .select('id, call_id, duration_seconds')
    .not('duration_seconds', 'is', null)
    .limit(5);

  if (ticketError) {
    console.error('❌ duration_seconds check failed:', ticketError.message);
  } else {
    console.log('✅ duration_seconds exists in tickets table.');
    console.log('Sample Tickets with duration:', tickets);
  }

  // 3. Check Billing View
  const { data: billingView, error: viewError } = await supabase
    .from('organization_billing_status')
    .select('*')
    .limit(5);

  if (viewError) {
    console.error('❌ organization_billing_status view failed:', viewError.message);
  } else {
    console.log('✅ organization_billing_status view is functional.');
    console.log('View Output:', billingView);
  }

  console.log('\n🏁 Validation Finished.');
}

runValidation();
