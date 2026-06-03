-- ==========================================
-- SEWARION — DATABASE SCHEMA SETUP
-- ==========================================
-- Jalankan query SQL ini di SQL Editor dashboard Supabase Anda (https://supabase.com)
-- untuk membuat semua tabel, indeks, dan trigger secara otomatis.

-- 1. Buat Tabel PROFILES (menyimpan data biometrik, KYC, dan trust score)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text unique not null,
  phone_number text not null,
  trust_score integer default 80,
  total_rentals text default '0',
  is_kyc_verified boolean default false,
  nik_number text,
  date_of_birth text,
  home_address text,
  ktp_image text,     -- Base64
  selfie_image text,  -- Base64
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Aktifkan Row Level Security (RLS) di tabel profiles
alter table public.profiles enable row level security;

-- Buat Policy agar semua pengguna bisa membaca profil (untuk melihat info pemilik barang)
create policy "Profiles are viewable by everyone" on public.profiles
  for select using (true);

-- Buat Policy agar pengguna hanya bisa mengupdate profil mereka sendiri
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Buat Policy agar pengguna bisa menginsert profil mereka sendiri
create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);


-- 2. Buat Tabel PRODUCTS (menyimpan barang sewaan)
create table if not exists public.products (
  id text primary key, -- prod-12345
  name text not null,
  category text not null,
  price_per_day integer not null,
  location text not null,
  location_detail text not null,
  image text not null, -- Base64
  images text[] not null, -- Array of Base64
  is_available boolean default true,
  description text,
  specs text[],
  owner_id text not null, -- email dari profiles
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Aktifkan RLS di tabel products
alter table public.products enable row level security;

create policy "Products are viewable by everyone" on public.products
  for select using (true);

create policy "Authenticated users can insert products" on public.products
  for insert with check (auth.role() = 'authenticated');

create policy "Owners can update or delete their products" on public.products
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.email = products.owner_id
    )
  );


-- 3. Buat Tabel ORDERS (menyimpan transaksi sewa)
create table if not exists public.orders (
  id text primary key, -- SW-20261234
  product_id text references public.products(id) on delete cascade not null,
  renter_email text not null,
  duration_days integer not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  payment_method text not null,
  total_payment integer not null,
  status text not null default 'pending', -- pending, paid, completed, expired
  late_days integer,
  late_hours integer,
  late_fee integer,
  late_fee_paid boolean default false,
  actual_return_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Aktifkan RLS di tabel orders
alter table public.orders enable row level security;

create policy "Users can view their own orders or orders for their products" on public.orders
  for select using (
    renter_email = (select email from public.profiles where id = auth.uid()) or
    exists (
      select 1 from public.products
      where products.id = orders.product_id and products.owner_id = (select email from public.profiles where id = auth.uid())
    )
  );

create policy "Authenticated users can create orders" on public.orders
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update their orders" on public.orders
  for update using (
    renter_email = (select email from public.profiles where id = auth.uid()) or
    exists (
      select 1 from public.products
      where products.id = orders.product_id and products.owner_id = (select email from public.profiles where id = auth.uid())
    )
  );


-- 4. Buat Tabel MESSAGES (menyimpan obrolan chat real-time & mediasi)
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_email text not null,
  receiver_email text not null,
  content text not null,
  order_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Aktifkan RLS di tabel messages
alter table public.messages enable row level security;

-- Policy select: pengirim, penerima, admin, atau penyewa/pemilik dari order_id terkait bisa membaca pesan
create policy "Users can view messages sent to/by them or for their orders" on public.messages
  for select using (
    sender_email = (select email from public.profiles where id = auth.uid()) or
    receiver_email = (select email from public.profiles where id = auth.uid()) or
    (select email from public.profiles where id = auth.uid()) = 'admin@sewarion.com' or
    exists (
      select 1 from public.orders o
      join public.products p on o.product_id = p.id
      where o.id = messages.order_id and (
        o.renter_email = (select email from public.profiles where id = auth.uid()) or
        p.owner_id = (select email from public.profiles where id = auth.uid())
      )
    )
  );

create policy "Authenticated users can send messages" on public.messages
  for insert with check (
    sender_email = (select email from public.profiles where id = auth.uid())
  );



-- 5. Buat Tabel NOTIFICATIONS (menyimpan notifikasi masuk)
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_email text not null,
  sender_name text not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Aktifkan RLS di tabel notifications
alter table public.notifications enable row level security;

create policy "Users can view their own notifications" on public.notifications
  for select using (
    user_email = (select email from public.profiles where id = auth.uid())
  );

create policy "Authenticated users can create notifications" on public.notifications
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update their notifications" on public.notifications
  for update using (
    user_email = (select email from public.profiles where id = auth.uid())
  );

-- ==========================================
-- AKSI TAMBAHAN (SELESAI)
-- ==========================================
-- Selamat! Skema database Supabase Anda telah terpasang dengan baik.
-- Pastikan Anda juga mengaktifkan opsi "Realtime" untuk tabel "messages" dan "notifications"
-- di menu Database -> Replication -> Source -> tables di dashboard Supabase Anda.
