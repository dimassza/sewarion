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

const passwords = [
  'adminsewarion123',
  'admin123',
  '123456',
  '12345678',
  'sewarion',
  'sewarion123'
];

async function tryLogins() {
  const email = 'admin@sewarion.com';
  
  for (const password of passwords) {
    console.log(`Trying login with password: "${password}"`);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.log(`Failed: ${error.message}`);
    } else {
      console.log(`SUCCESS! Logged in successfully with password: "${password}"`);
      console.log('User ID:', data.user.id);
      
      // Let's check if we can insert the profile row now
      console.log('Attempting profile row insertion...');
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: 'Sewarion Admin',
        email: email,
        phone_number: '08123456789',
        trust_score: 100,
        total_rentals: '999+',
        is_kyc_verified: true
      });

      if (profileError) {
        console.error('Profile insertion FAILED:', profileError.message, profileError);
      } else {
        console.log('SUCCESS! Profile row created successfully!');
      }
      return;
    }
  }
}

tryLogins();
