import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

const isPlaceholder = (val: string) => {
  return (
    !val ||
    val.trim() === '' ||
    val.includes('placeholder') ||
    val.includes('your-project-id') ||
    val.includes('your-supabase-')
  );
};

export const isSupabaseConfigured = (): boolean => {
  if (typeof window !== 'undefined' && localStorage.getItem('sewarion_force_offline') === 'true') {
    return false;
  }
  return !isPlaceholder(supabaseUrl) && !isPlaceholder(supabaseAnonKey);
};

const safeUrl = isSupabaseConfigured() ? supabaseUrl : 'https://placeholder-url.supabase.co';
const safeKey = isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-key';

export const supabase = createClient(safeUrl, safeKey, {
  global: {
    fetch: (url, options) => {
      console.log(`[SUPABASE HTTP START] Url: ${url}`);
      return fetch(url, options)
        .then((res) => {
          console.log(`[SUPABASE HTTP SUCCESS] Url: ${url} | Status: ${res.status}`);
          return res;
        })
        .catch((err) => {
          console.error(`[SUPABASE HTTP ERROR] Url: ${url} | Error:`, err.message || err);
          throw err;
        });
    }
  }
});

console.log(`[SUPABASE] Inisialisasi Klien. URL: ${safeUrl}. Terkonfigurasi: ${isSupabaseConfigured()}`);
