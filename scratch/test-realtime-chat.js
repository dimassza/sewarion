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

async function testMediatorChatFlow() {
  const email = 'admin2@sewarion.com';
  const password = 'adminsewarion123';
  
  console.log('=== TEST MEDIATOR AUTHENTICATED CHAT FLOW ===');
  console.log(`1. Logging in as ${email}...`);
  
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    console.error('Authentication FAILED:', authError.message);
    process.exit(1);
  }

  console.log('SUCCESS! Authenticated UID:', authData.user.id);

  console.log('\n2. Attempting to insert a mediation message as admin2...');
  const testOrderId = 'SW-TEST-MEDIATION-OK';
  const testContent = 'Pesan uji coba sistem penengah Sewarion dari unit test.';

  const { data: insertData, error: insertError } = await supabase
    .from('messages')
    .insert({
      sender_email: email,
      receiver_email: 'mediator',
      content: testContent,
      order_id: testOrderId
    })
    .select();

  if (insertError) {
    console.error('INSERT FAILED! RLS or column schema block:', insertError.message, insertError);
    process.exit(1);
  }

  console.log('SUCCESS! Message inserted:', insertData);
  const messageId = insertData[0].id;

  console.log('\n3. Verifying if admin2 can read the inserted message back (Select Policy Check)...');
  const { data: selectData, error: selectError } = await supabase
    .from('messages')
    .select('*')
    .eq('id', messageId);

  if (selectError) {
    console.error('SELECT FAILED!', selectError.message);
    process.exit(1);
  }

  if (selectData && selectData.length > 0) {
    console.log('SUCCESS! Read back message from Supabase successfully:', selectData[0]);
  } else {
    console.error('FAILED! The Select policy filtered out the row (returned empty list). RLS policy issue persists.');
    process.exit(1);
  }

  console.log('\n4. Cleaning up test message...');
  const { error: deleteError } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId);

  if (deleteError) {
    console.error('Delete cleanup failed:', deleteError.message);
  } else {
    console.log('SUCCESS! Cleanup completed. Database is clean.');
  }

  console.log('\n=== INTEGRATION TEST COMPLETED SUCCESSFULLY! ===');
}

testMediatorChatFlow();
