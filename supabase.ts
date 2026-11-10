import { createClient } from '@supabase/supabase-js';

// These should be set in the platform settings as VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nyggjxkczfktfydkiwux.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_hDyr6sQ678vKWyO13QiPqQ_0H9GCfG3';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration is incomplete. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to test the connection to Supabase
 */
export const testSupabaseConnection = async () => {
    try {
        const { data, error } = await supabase.from('feedback').select('count');
        if (error) throw error;
        console.log('Supabase connection successful:', data);
        return true;
    } catch (err) {
        console.error('Supabase connection failed:', err);
        return false;
    }
};
