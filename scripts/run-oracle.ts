import dotenv from 'dotenv';

// Load environment variables BEFORE importing anything that uses them
dotenv.config({ path: '.env.local' });

async function main() {
    console.log('Running Oracle script...');
    // Dynamic import to ensure env vars are loaded first
    const { runOracle } = await import('../src/lib/oracle');
    await runOracle();
}

main().catch(console.error);
