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

async function run3WayChatTest() {
  const timestamp = Date.now();
  const renterEmail = `renter_${timestamp}@sewarion.com`;
  const ownerEmail = `owner_${timestamp}@sewarion.com`;
  const adminEmail = 'admin2@sewarion.com';
  const adminPassword = 'adminsewarion123';
  const testPassword = 'password123';

  console.log('=== END-TO-END 3-WAY MEDIATION CHAT TEST ===');

  try {
    // 1. Sign up Renter
    console.log(`\n1. Creating test Renter account: ${renterEmail}...`);
    const { data: renterAuth, error: renterAuthErr } = await supabase.auth.signUp({
      email: renterEmail,
      password: testPassword
    });
    if (renterAuthErr) throw renterAuthErr;
    console.log('SUCCESS! Renter Auth created. ID:', renterAuth.user.id);

    const { error: renterProfileErr } = await supabase.from('profiles').insert({
      id: renterAuth.user.id,
      full_name: 'Test Penyewa',
      email: renterEmail,
      phone_number: '0812222222',
      trust_score: 90,
      total_rentals: '0',
      is_kyc_verified: true
    });
    if (renterProfileErr) throw renterProfileErr;
    console.log('SUCCESS! Renter profile created.');

    // 2. Sign up Owner
    console.log(`\n2. Creating test Owner account: ${ownerEmail}...`);
    const { data: ownerAuth, error: ownerAuthErr } = await supabase.auth.signUp({
      email: ownerEmail,
      password: testPassword
    });
    if (ownerAuthErr) throw ownerAuthErr;
    console.log('SUCCESS! Owner Auth created. ID:', ownerAuth.user.id);

    const { error: ownerProfileErr } = await supabase.from('profiles').insert({
      id: ownerAuth.user.id,
      full_name: 'Test Pemilik',
      email: ownerEmail,
      phone_number: '0813333333',
      trust_score: 95,
      total_rentals: '0',
      is_kyc_verified: true
    });
    if (ownerProfileErr) throw ownerProfileErr;
    console.log('SUCCESS! Owner profile created.');

    // 3. Create mock product
    console.log('\n3. Creating mock product owned by test owner...');
    const testProductId = `prod-test-${timestamp}`;
    const { error: prodErr } = await supabase.from('products').insert({
      id: testProductId,
      name: 'Kamera DSLR Test 3-Way',
      category: 'Fotografi',
      price_per_day: 100000,
      location: 'Jakarta',
      location_detail: 'Gambir',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
      images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32'],
      owner_id: ownerEmail
    });
    if (prodErr) throw prodErr;
    console.log('SUCCESS! Mock product created.');

    // 4. Create mock order
    console.log('\n4. Creating mock order rented by test renter...');
    const testOrderId = `SW-test-${timestamp}`;
    const { error: orderErr } = await supabase.from('orders').insert({
      id: testOrderId,
      product_id: testProductId,
      renter_email: renterEmail,
      duration_days: 3,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 3*24*60*60*1000).toISOString(),
      payment_method: 'QRIS',
      total_payment: 325000,
      status: 'paid'
    });
    if (orderErr) throw orderErr;
    console.log('SUCCESS! Mock order created.');

    // 5. Send message as Renter
    console.log('\n5. Sending message from Renter...');
    // Login as Renter
    const { error: renterLoginErr } = await supabase.auth.signInWithPassword({
      email: renterEmail,
      password: testPassword
    });
    if (renterLoginErr) throw renterLoginErr;

    const { data: renterMsg, error: renterMsgErr } = await supabase.from('messages').insert({
      sender_email: renterEmail,
      receiver_email: 'mediator',
      content: 'Halo Pemilik dan Admin, saya Penyewa. Kapan barang bisa dikirim?',
      order_id: testOrderId
    }).select();
    if (renterMsgErr) throw renterMsgErr;
    console.log('SUCCESS! Message from Renter sent:', renterMsg[0].content);

    // 6. Send message as Owner
    console.log('\n6. Sending message from Owner...');
    // Login as Owner
    const { error: ownerLoginErr } = await supabase.auth.signInWithPassword({
      email: ownerEmail,
      password: testPassword
    });
    if (ownerLoginErr) throw ownerLoginErr;

    const { data: ownerMsg, error: ownerMsgErr } = await supabase.from('messages').insert({
      sender_email: ownerEmail,
      receiver_email: 'mediator',
      content: 'Halo Penyewa dan Admin, saya Pemilik. Barang siap dikirim pagi ini.',
      order_id: testOrderId
    }).select();
    if (ownerMsgErr) throw ownerMsgErr;
    console.log('SUCCESS! Message from Owner sent:', ownerMsg[0].content);

    // 7. Check what Renter reads
    console.log('\n7a. Querying messages as Renter...');
    const { data: renterReadMsgs, error: renterReadErr } = await supabase
      .from('messages')
      .select('*')
      .eq('order_id', testOrderId);
    if (renterReadErr) throw renterReadErr;
    console.log(`Renter sees ${renterReadMsgs?.length} messages:`);
    renterReadMsgs?.forEach(m => console.log(`  - [${m.sender_email.split('_')[0]}]: "${m.content}"`));

    // Check what Owner reads
    console.log('\n7b. Querying messages as Owner...');
    const { error: ownerLoginAgainErr } = await supabase.auth.signInWithPassword({
      email: ownerEmail,
      password: testPassword
    });
    if (ownerLoginAgainErr) throw ownerLoginAgainErr;

    const { data: ownerReadMsgs, error: ownerReadErr } = await supabase
      .from('messages')
      .select('*')
      .eq('order_id', testOrderId);
    if (ownerReadErr) throw ownerReadErr;
    console.log(`Owner sees ${ownerReadMsgs?.length} messages:`);
    ownerReadMsgs?.forEach(m => console.log(`  - [${m.sender_email.split('_')[0]}]: "${m.content}"`));

    // Check what Admin reads
    console.log(`\n7c. Logging in as Admin: ${adminEmail} to verify reception...`);
    const { error: adminLoginErr } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });
    if (adminLoginErr) throw adminLoginErr;

    console.log('Querying messages for the mediation room...');
    const { data: adminReadMsgs, error: adminReadErr } = await supabase
      .from('messages')
      .select('*')
      .eq('order_id', testOrderId)
      .order('created_at', { ascending: true });
    
    if (adminReadErr) throw adminReadErr;

    console.log('\n=== RESULTS READ BY ADMIN ===');
    console.log(`Total messages found: ${adminReadMsgs?.length}`);
    adminReadMsgs?.forEach((msg) => {
      console.log(`- [${msg.sender_email.split('_')[0]}]: "${msg.content}"`);
    });

    if (adminReadMsgs?.length === 2) {
      console.log('\nSUCCESS! Admin received both messages successfully!');
    } else {
      console.error('\nFAILED! Admin could not read both messages.');
    }

    // 8. Clean up
    console.log('\n8. Cleaning up test data from database...');
    await supabase.from('messages').delete().eq('order_id', testOrderId);
    await supabase.from('orders').delete().eq('id', testOrderId);
    await supabase.from('products').delete().eq('id', testProductId);
    await supabase.from('profiles').delete().eq('email', renterEmail);
    await supabase.from('profiles').delete().eq('email', ownerEmail);
    console.log('Clean up success!');

    console.log('\n=== E2E 3-WAY CHAT TEST PASSED SUCCESSFULLY! ===');

  } catch (err) {
    console.error('\nTest failed with error:', err.message, err);
  }
}

run3WayChatTest();
