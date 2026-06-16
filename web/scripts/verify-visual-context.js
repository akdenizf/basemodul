const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '../.env.local');
        if (!fs.existsSync(envPath)) {
            console.error('❌ .env.local file not found!');
            process.exit(1);
        }

        const envContent = fs.readFileSync(envPath, 'utf8');
        const envVars = {};

        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                let value = match[2].trim();
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                envVars[match[1].trim()] = value;
            }
        });

        return envVars;
    } catch (error) {
        console.error('❌ Error loading .env.local:', error);
        process.exit(1);
    }
}

async function verify() {
    console.log('🔍 Starting Visual Context Infrastructure Verification...');

    const env = loadEnv();
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase credentials in .env.local');
        console.error('   Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Check Table: ticket_attachments
    console.log('\nChecking Table: ticket_attachments...');
    const { error: tableError } = await supabase
        .from('ticket_attachments')
        .select('id')
        .limit(1);

    if (tableError) {
        // If table doesn't exist, we usually get a specific error code like 42P01 (undefined_table)
        // but the error message is often descriptive enough
        if (tableError.code === '42P01' || tableError.message.includes('does not exist')) {
            console.error('❌ Table "ticket_attachments" DOES NOT EXIST.');
            console.log('   👉 Please run "database/v6-visual-context.sql" in Supabase SQL Editor.');
        } else {
            console.error('❌ Error accessing "ticket_attachments":', tableError.message);
        }
    } else {
        console.log('✅ Table "ticket_attachments" found.');
    }

    // 2. Check Storage Bucket: ticket-evidence
    console.log('\nChecking Storage Bucket: ticket-evidence...');
    const { data: buckets, error: bucketError } = await supabase
        .storage
        .listBuckets();

    if (bucketError) {
        console.error('❌ Error listing buckets:', bucketError.message);
    } else {
        const bucket = buckets.find(b => b.name === 'ticket-evidence');
        if (bucket) {
            console.log('✅ Bucket "ticket-evidence" found.');
            if (bucket.public) {
                console.log('   ℹ️ Bucket is PUBLIC (Good for viewing, ensure RLS is tight).');
            } else {
                console.log('   ℹ️ Bucket is PRIVATE.');
            }
        } else {
            console.error('❌ Bucket "ticket-evidence" DOES NOT EXIST.');
            console.log('   👉 Please create a new public bucket named "ticket-evidence" in Supabase Storage.');
        }
    }

    console.log('\nVerification Complete.');
}

verify();
