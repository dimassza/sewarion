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

async function checkPolicies() {
  console.log('=== CHECK DATABASE POLICIES ===');
  
  // Note: we can run a custom RPC or query pg_catalog if we have permissions,
  // or we can query pg_policies using an RPC if defined.
  // If we don't have access to pg_policies directly via REST API (since it is in pg_catalog),
  // let's try calling a simple SQL endpoint or test what happens if we query messages as admin2.
  
  // Let's test if admin2 can query profiles:
  const { data: adminAuth, error: adminAuthErr } = await supabase.auth.signInWithPassword({
    email: 'admin2@sewarion.com',
    password: 'adminsewarion123'
  });
  
  if (adminAuthErr) {
    console.error('Admin login failed:', adminAuthErr.message);
    return;
  }
  
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', adminAuth.user.id)
    .single();
    
  if (profileErr) {
    console.error('Error fetching admin profile:', profileErr.message);
  } else {
    console.log('Admin profile:', profile);
  }
}

checkPolicies();
