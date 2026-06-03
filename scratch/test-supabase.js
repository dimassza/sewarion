import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEmails() {
  const { data, error } = await supabase.from('profiles').select('email, full_name, is_kyc_verified');
  if (error) {
    console.error('Error fetching emails:', error.message);
  } else {
    console.log('=== REGISTERED PROFILES IN CLOUD DB ===');
    console.log(data);
  }
}

checkEmails();
