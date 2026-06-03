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

async function testInsert() {
  console.log('=== TESTING MESSAGE INSERT WITH ORDER_ID ===');
  
  // Attempt inserting a test message
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_email: 'admin2@sewarion.com',
      receiver_email: 'mediator',
      content: 'Uji coba pesan mediasi dari script penengah.',
      order_id: 'SW-TEST-1234'
    })
    .select();

  if (error) {
    console.error('INSERT FAILED!', error.message, error);
  } else {
    console.log('INSERT SUCCESS!', data);
    
    // Clean up test message
    const { error: deleteError } = await supabase
      .from('messages')
      .delete()
      .eq('id', data[0].id);
      
    if (deleteError) {
      console.error('Clean up failed:', deleteError.message);
    } else {
      console.log('Clean up success!');
    }
  }
}

testInsert();
