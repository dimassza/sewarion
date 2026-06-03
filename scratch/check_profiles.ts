import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

console.log('Using URL:', supabaseUrl);
console.log('Using Key:', supabaseAnonKey ? 'Found' : 'Missing');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log('\n--- 1. Testing Connection ---');
  try {
    const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
    if (pError) {
      console.error('Error fetching profiles:', pError);
    } else {
      console.log('Fetched profiles successfully. Count:', profiles?.length);
      console.log('Profiles data:');
      console.dir(profiles, { depth: null });
    }
  } catch (err) {
    console.error('Exception fetching profiles:', err);
  }

  console.log('\n--- 2. Checking specific profile logins ---');
  const emails = ['pemilik123@gmail.com', 'penyewa123@gmail.com'];
  for (const email of emails) {
    console.log(`\nLogging in as ${email}...`);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: email.split('123')[0] + '123*'
      });

      if (error) {
        console.error(`Login failed for ${email}:`, error.message);
      } else {
        console.log(`Login successful. User ID: ${data.user?.id}`);
        // Now try to fetch the profile for this user ID
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user?.id)
          .single();
        
        if (profileError) {
          console.error(`Profile fetch failed for ${email} with User ID ${data.user?.id}:`, profileError);
        } else {
          console.log(`Profile fetch successful for ${email}:`, profile);

          // Now test the exact orders queries from App.tsx
          console.log(`Testing fetchOrders for ${email}...`);
          try {
            const { data: renterData, error: renterError } = await supabase
              .from('orders')
              .select(`
                id,
                product_id,
                renter_email,
                duration_days,
                start_date,
                end_date,
                payment_method,
                total_payment,
                status,
                created_at,
                products (
                  id, name, category, price_per_day, location, location_detail, image, images, is_available, description, specs, owner_id
                )
              `)
              .eq('renter_email', email);

            if (renterError) {
              console.error('  Renter query error:', renterError);
            } else {
              console.log('  Renter query success. Rows:', renterData?.length);
            }

            const { data: ownerData, error: ownerError } = await supabase
              .from('orders')
              .select(`
                id,
                product_id,
                renter_email,
                duration_days,
                start_date,
                end_date,
                payment_method,
                total_payment,
                status,
                created_at,
                products!inner (
                  id, name, category, price_per_day, location, location_detail, image, images, is_available, description, specs, owner_id
                )
              `)
              .eq('products.owner_id', email);

            if (ownerError) {
              console.error('  Owner query error:', ownerError);
            } else {
              console.log('  Owner query success. Rows:', ownerData?.length);
            }
          } catch (err) {
            console.error('  Exception querying orders:', err);
          }
        }
      }
    } catch (err) {
      console.error(`Exception during check for ${email}:`, err);
    }
  }
}

check();
