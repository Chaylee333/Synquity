import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string) => {
    // Check for Vite environment
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
        return (import.meta as any).env[key];
    }
    // Check for Node environment
    if (typeof process !== 'undefined' && process.env) {
        return process.env[key];
    }
    return undefined;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Key missing. Check .env file.');
    // Don't throw immediately to allow for build time checks, but client creation will fail if used
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
