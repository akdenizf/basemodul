import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)!
);

async function run() {
  const { data, error } = await supabase
    .from("organization_billing_status")
    .select("*")
    .limit(1)
    .maybeSingle();
    
  console.log("Data:", data);
  console.log("Error:", error);
}
run();
