import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedUserMetrics() {
    console.log('🚀 Starting user performance metrics seeding...\n');

    // Get the current user (you'll need to provide your user ID)
    const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, username, full_name')
        .limit(10);

    if (usersError) {
        console.error('Error fetching users:', usersError);
        return;
    }

    if (!users || users.length === 0) {
        console.log('No users found. Please sign up first.');
        return;
    }

    console.log('Found users:');
    users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.full_name || 'Unknown'} (@${user.username}) - ID: ${user.id}`);
    });

    // For demonstration, let's add metrics to the first user
    const targetUser = users[0];
    console.log(`\n📊 Adding sample performance metrics for: ${targetUser.full_name} (@${targetUser.username})\n`);

    // Check if metrics already exist
    const { data: existingMetrics } = await supabase
        .from('creator_performance_metrics')
        .select('*')
        .eq('user_id', targetUser.id)
        .single();

    if (existingMetrics) {
        console.log('⚠️  Performance metrics already exist for this user. Updating...');
        
        const { error: updateError } = await supabase
            .from('creator_performance_metrics')
            .update({
                credibility_score: 87,
                win_rate: 68.5,
                sharpe_ratio: 3.2,
                pnl_annualized_percent: 18.4,
                pnl_since_joining_percent: 76.8,
                avg_drawdown_percent: -2.8,
                pnl_absolute_dollars: 145000,
                specialty: 'Fixed Income',
                updated_at: new Date().toISOString()
            })
            .eq('user_id', targetUser.id);

        if (updateError) {
            console.error('❌ Error updating metrics:', updateError);
        } else {
            console.log('✅ Successfully updated performance metrics!');
        }
    } else {
        console.log('📝 Creating new performance metrics...');
        
        const { error: insertError } = await supabase
            .from('creator_performance_metrics')
            .insert({
                user_id: targetUser.id,
                credibility_score: 87,
                win_rate: 68.5,
                sharpe_ratio: 3.2,
                pnl_annualized_percent: 18.4,
                pnl_since_joining_percent: 76.8,
                avg_drawdown_percent: -2.8,
                pnl_absolute_dollars: 145000,
                specialty: 'Fixed Income',
                updated_at: new Date().toISOString()
            });

        if (insertError) {
            console.error('❌ Error inserting metrics:', insertError);
        } else {
            console.log('✅ Successfully created performance metrics!');
        }
    }

    console.log('\n🎉 Done! Refresh your My Feed page to see the metrics.\n');
    console.log('Sample metrics added:');
    console.log('  - Specialty: Fixed Income');
    console.log('  - P&L % (Annualized): +18.4%');
    console.log('  - P&L % Since Joining: +76.8%');
    console.log('  - Sharpe Ratio: 3.20');
    console.log('  - Average Drawdown: -2.8%');
    console.log('  - Credibility Score: 87/100');
}

seedUserMetrics().catch(console.error);


