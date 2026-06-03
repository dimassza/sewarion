import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProducts() {
  console.log('Fetching products list...');
  const start = Date.now();
  try {
    const { data, error } = await supabase.from('products').select('id, name, category, location, owner_id');
    if (error) {
      console.error('Error fetching basic info:', error);
      return;
    }
    console.log(`Fetched basic info of ${data?.length} products in ${Date.now() - start}ms.`);
    
    // Now fetch full data of first product to see size
    if (data && data.length > 0) {
      const fullStart = Date.now();
      const { data: fullData, error: fullError } = await supabase.from('products').select('*');
      if (fullError) {
        console.error('Error fetching full product data:', fullError);
        return;
      }
      const fullDuration = Date.now() - fullStart;
      const sizeBytes = Buffer.byteLength(JSON.stringify(fullData));
      console.log(`Fetched ALL full products (${data.length} items) in ${fullDuration}ms.`);
      console.log(`Total payload size: ${(sizeBytes / 1024 / 1024).toFixed(2)} MB`);
      
      for (const prod of fullData || []) {
        const coverSize = prod.image ? (Buffer.byteLength(prod.image) / 1024).toFixed(1) : 0;
        const imagesSize = prod.images ? (Buffer.byteLength(JSON.stringify(prod.images)) / 1024).toFixed(1) : 0;
        console.log(`Product: ${prod.name} (${prod.id})`);
        console.log(`  Cover size: ${coverSize} KB`);
        console.log(`  All images size: ${imagesSize} KB`);
      }
    } else {
      console.log('No products in the database.');
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

checkProducts();
