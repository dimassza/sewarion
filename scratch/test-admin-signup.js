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

async function registerAdmin() {
  const email = 'admin@sewarion.com';
  const password = 'adminsewarion123';
  
  console.log(`=== REGISTERING ${email} IN SUPABASE ===`);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: 'Sewarion Admin',
        phone_number: '081234567890'
      }
    }
  });

  if (error) {
    console.error('Sign up error:', error.message, error);
    return;
  }

  if (data.user) {
    console.log('User created in auth.users! ID:', data.user.id);
    
    // Attempt inserting the profile row
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: 'Sewarion Admin',
      email: email,
      phone_number: '081234567890',
      trust_score: 100,
      total_rentals: '999+',
      is_kyc_verified: true
    });

    if (profileError) {
      console.error('Profile insertion error:', profileError.message, profileError);
    } else {
      console.log('SUCCESS! Admin profile successfully registered and created in database!');
    }
  }
}

registerAdmin();
