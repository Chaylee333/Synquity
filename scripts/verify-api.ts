
import dotenv from 'dotenv';

// Load environment variables BEFORE importing anything that uses them
dotenv.config({ path: '.env.local' });

async function main() {
    console.log('Verifying fetchCreatorProfile...');

    // Dynamic imports to ensure env vars are loaded first
    const { fetchCreatorProfile } = await import('../src/lib/api');
    const { supabase } = await import('../src/lib/supabase');

    // Get a user ID (we'll just use the first user we find)
    const { data: users, error } = await supabase.from('profiles').select('id').limit(1);

    if (error || !users || users.length === 0) {
        console.error('Could not find any users to test with.');
        return;
    }

    const userId = users[0].id;
    console.log(`Testing with user ID: ${userId}`);

    try {
        const profile = await fetchCreatorProfile(userId);
        console.log('Successfully fetched profile:', profile);

        if (profile && profile.reputation_score !== undefined) {
            console.log('✅ Reputation score is present:', profile.reputation_score);
        } else {
            console.log('❌ Reputation score is MISSING');
        }
    } catch (err) {
        console.error('Error calling fetchCreatorProfile:', err);
    }
}

main().catch(console.error);
