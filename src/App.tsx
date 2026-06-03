import React, { useState, useEffect, useCallback } from 'react';
import type { Product, User, Order, ViewState, AppContextType } from './types';
import { AppContext } from './context';
import { DEFAULT_PRODUCTS, DEFAULT_USER } from './data';
import {
  getCurrentSession, saveCurrentSession, clearSession,
  getProducts as getStoredProducts, saveProducts as saveStoredProducts,
  getOrders as getStoredOrders, saveOrders as saveStoredOrders,
  addOrderToStorage, updateOrderStatus,
  isInitialized, markInitialized,
  findUserByEmail, saveUsers, hashPassword
} from './storage';
import { supabase, isSupabaseConfigured } from './supabaseClient';

// Import Views & Components
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import HomeView from './components/HomeView';
import ProductDetailView from './components/ProductDetailView';
import CheckoutView from './components/CheckoutView';
import PaymentPendingView from './components/PaymentPendingView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import KYCView from './components/KYCView';
import MulaiMenyewakanView from './components/MulaiMenyewakanView';
import HistoryView from './components/HistoryView';
import FavoritesView from './components/FavoritesView';
import ProfileView from './components/ProfileView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'login' });
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('sewarion_theme') as 'light' | 'dark') || 'light';
  });

  // Floating debug console log state
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('sewarion_theme', next);
      return next;
    });
  }, []);

  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      originalLog(...args);
      const str = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
      setDebugLogs((prev) => [...prev, '[LOG] ' + str].slice(-12));
    };

    console.error = (...args) => {
      originalError(...args);
      const str = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
      setDebugLogs((prev) => [...prev, '[ERROR] ' + str].slice(-12));
    };

    const handleWindowError = (event: ErrorEvent) => {
      console.error(`Uncaught Error: ${event.message} at ${event.filename}:${event.lineno}`);
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error(`Unhandled Rejection: ${event.reason}`);
    };

    window.addEventListener('error', handleWindowError);
    window.addEventListener('unhandledrejection', handleRejection);

    console.log('Konsol Diagnostik Web Aktif! 🚀');

    return () => {
      console.log = originalLog;
      console.error = originalError;
      window.removeEventListener('error', handleWindowError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  // 1. Fetch products from Supabase or LocalStorage
  const fetchProducts = useCallback(async () => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: Product[] = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            pricePerDay: p.price_per_day,
            location: p.location,
            locationDetail: p.location_detail,
            image: p.image,
            images: p.images,
            isAvailable: p.is_available,
            description: p.description,
            specs: p.specs,
            ownerId: p.owner_id
          }));
          setProducts(mapped);
          return;
        }
      } catch (err) {
        console.error('Gagal mengambil produk dari cloud:', err);
      }
    }

    // Local fallback
    const storedProducts = getStoredProducts();
    
    // Saring dan bersihkan barang demo yang dihapus (seperti steam-deck-oled)
    const filteredStored = storedProducts.filter((p) => p.id !== 'steam-deck-oled');
    
    // Sinkronkan data default produk dengan data terbaru di code (misalnya update foto/deskripsi)
    const syncedStored = filteredStored.map((sp) => {
      const match = DEFAULT_PRODUCTS.find((dp) => dp.id === sp.id);
      if (match) {
        return {
          ...sp,
          name: match.name,
          category: match.category,
          pricePerDay: match.pricePerDay,
          image: match.image,
          images: match.images,
          description: match.description,
          specs: match.specs,
          location: match.location,
          locationDetail: match.locationDetail,
        };
      }
      return sp;
    });

    // Gabungkan produk default baru ke local storage jika belum ada
    const missingDefaults = DEFAULT_PRODUCTS.filter(
      (dp) => !syncedStored.some((sp) => sp.id === dp.id)
    );
    
    const merged = [...syncedStored, ...missingDefaults];
    saveStoredProducts(merged);
    setProducts(merged);
  }, []);

  // 2. Fetch orders from Supabase or LocalStorage
  const fetchOrders = useCallback(async (email: string) => {
    if (isSupabaseConfigured()) {
      try {
        // Query 1: Orders where user is the renter
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

        // Query 2: Orders where user is the product owner (using products!inner join)
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

        if (!renterError && !ownerError && (renterData || ownerData)) {
          const combined = [...(renterData || []), ...(ownerData || [])];
          // Remove duplicates
          const uniqueOrders = Array.from(new Map(combined.map((o) => [o.id, o])).values());
          // Sort descending by created_at
          uniqueOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

          const mapped: Order[] = uniqueOrders.map((o: any) => {
            const dbProd = o.products;
            const mappedProd: Product = {
              id: dbProd.id,
              name: dbProd.name,
              category: dbProd.category,
              pricePerDay: dbProd.price_per_day,
              location: dbProd.location,
              locationDetail: dbProd.location_detail,
              image: dbProd.image,
              images: dbProd.images,
              isAvailable: dbProd.is_available,
              description: dbProd.description,
              specs: dbProd.specs,
              ownerId: dbProd.owner_id
            };
            return {
              id: o.id,
              product: mappedProd,
              durationDays: o.duration_days,
              startDate: o.start_date,
              endDate: o.end_date,
              paymentMethod: o.payment_method,
              totalPayment: o.total_payment,
              status: o.status,
              userEmail: o.renter_email,
              createdAt: o.created_at
            };
          });
          setOrders(mapped);
          return;
        } else {
          if (renterError) console.error('Error fetching renter orders:', renterError);
          if (ownerError) console.error('Error fetching owner orders:', ownerError);
        }
      } catch (err) {
        console.error('Gagal mengambil order dari cloud:', err);
      }
    }

    // Local fallback
    setOrders(getStoredOrders(email));
  }, []);

  // Consolidated function to handle user session mapping and navigation
  const handleUserSession = useCallback(async (session: any) => {
    if (!session?.user) {
      console.log('[AUTH] Sesi tidak ditemukan. Membersihkan data sesi local.');
      clearSession();
      setUser(DEFAULT_USER);
      setOrders([]);
      setCurrentView({ type: 'login' });
      return;
    }

    const userId = session.user.id;
    const userEmail = session.user.email;
    console.log(`[AUTH] Memproses sesi pengguna untuk: ${userEmail} (${userId})`);

    try {
      // 6-second timeout promise to handle slow connection hangs
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT_EXCEEDED')), 6000)
      );

      console.log(`[AUTH] Mengambil data profil ke database cloud...`);
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: profile, error: profileError } = await Promise.race([
        profilePromise,
        timeoutPromise
      ]) as any;

      if (profileError) {
        console.error('[AUTH] Gagal mengambil data profil dari database:', profileError.message, profileError);
        
        // Fallback: Jika baris profil tidak ditemukan (PGRST116), otomatis buat profil default
        if (profileError.code === 'PGRST116') {
          console.log('[AUTH] Baris profil kosong. Membuat profil default otomatis untuk mencegah stuck...');
          
          const fallbackUser: User = {
            fullName: session.user.user_metadata?.full_name || userEmail?.split('@')[0] || 'Pengguna Sewarion',
            email: userEmail || '',
            isLoggedIn: true,
            trustScore: 80,
            totalRentals: '0',
            isKycVerified: false,
            phoneNumber: session.user.user_metadata?.phone_number || '08123456789'
          };

          const { error: insertError } = await supabase.from('profiles').insert({
            id: userId,
            full_name: fallbackUser.fullName,
            email: fallbackUser.email,
            phone_number: fallbackUser.phoneNumber,
            trust_score: fallbackUser.trustScore,
            total_rentals: fallbackUser.totalRentals,
            is_kyc_verified: fallbackUser.isKycVerified
          });

          if (insertError) {
            console.error('[AUTH] Gagal membuat profil default di database:', insertError.message);
            // Sign out agar user tidak terjebak dalam session loading
            await supabase.auth.signOut();
          } else {
            console.log('[AUTH] Profil default berhasil dibuat!');
            setUser(fallbackUser);
            saveCurrentSession(fallbackUser);
            fetchOrders(fallbackUser.email);
            setCurrentView((prev) => (prev.type === 'register' ? { type: 'kyc' } : { type: 'home' }));
          }
          return;
        } else {
          // Error lain (misalnya jaringan, kebijakan RLS), keluarkan sesi agar aman
          await supabase.auth.signOut();
          return;
        }
      }

      if (profile) {
        console.log(`[AUTH] Profil berhasil dimuat: ${profile.full_name}`);
        const logged: User = {
          fullName: profile.full_name,
          email: profile.email,
          isLoggedIn: true,
          trustScore: profile.trust_score,
          totalRentals: profile.total_rentals,
          isKycVerified: profile.is_kyc_verified,
          avatarUrl: profile.avatar_url,
          nikNumber: profile.nik_number,
          ktpImage: profile.ktp_image,
          selfieImage: profile.selfie_image,
          phoneNumber: profile.phone_number
        };
        setUser(logged);
        saveCurrentSession(logged);
        fetchOrders(profile.email);
        setCurrentView((prev) => (prev.type === 'register' ? { type: 'kyc' } : { type: 'home' }));
      }
    } catch (err: any) {
      console.error('[AUTH] Terjadi eksepsi saat memproses profil:', err);
      
      // Jika terjadi timeout koneksi, coba cari profil lokal dan login secara offline
      if (err?.message === 'TIMEOUT_EXCEEDED' && userEmail) {
        console.warn(`[AUTH] Koneksi ke database lambat/timeout. Mencoba masuk luring untuk ${userEmail}...`);
        const localUser = findUserByEmail(userEmail);
        if (localUser) {
          console.log(`[AUTH] Fallback luring sukses! Masuk sebagai ${localUser.fullName} dari data local.`);
          const logged: User = {
            fullName: localUser.fullName,
            email: localUser.email,
            isLoggedIn: true,
            trustScore: localUser.trustScore,
            totalRentals: localUser.totalRentals,
            isKycVerified: localUser.isKycVerified,
            avatarUrl: localUser.avatarUrl,
            phoneNumber: localUser.phoneNumber
          };
          setUser(logged);
          saveCurrentSession(logged);
          fetchOrders(localUser.email);
          setCurrentView({ type: 'home' });
          return;
        }
      }
      
      await supabase.auth.signOut();
    }
  }, [fetchOrders]);

  // Initialize: Auth Session Observer & Seeds
  useEffect(() => {
    const initApp = async () => {
      // Seed local defaults on first startup
      if (!isInitialized()) {
        saveStoredProducts(DEFAULT_PRODUCTS);
        
        try {
          const hashPemilik = await hashPassword('pemilik123*');
          const hashPenyewa = await hashPassword('penyewa123*');
          
          saveUsers([
            {
              fullName: 'Fahri Pemilik',
              email: 'pemilik123@gmail.com',
              passwordHash: hashPemilik,
              trustScore: 95,
              totalRentals: '12',
              isKycVerified: true,
              registeredAt: new Date().toISOString(),
              avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFhO6XxswJRyg70DHau79pW54rsK8g7aLZC7TkyUfc9EPmHvXUXQm07OQ6Gb5ubSBHb2qpraIIjgwH2VP0rLOqYByD5MWlW4Ig0UJDr0KijMImnFgMgCZ2pYaENNrNBYGvR2Dgzw-hjC9kcoFKUK2DVCVXFa5-IrjBSiOniSjiE7DyNrN7DzrMUwcUndNjHVQ3K4uWaM_OQep2EitOVvYFksYt_2003r0Xd7Xf0BAsO5RmdUB8dgI1T8S0DS9mmZm9sxq2_aCL_ss',
              phoneNumber: '08123456789'
            },
            {
              fullName: 'Budi Penyewa',
              email: 'penyewa123@gmail.com',
              passwordHash: hashPenyewa,
              trustScore: 98,
              totalRentals: '3',
              isKycVerified: true,
              registeredAt: new Date().toISOString(),
              avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjfkcTYzg6Th3t6VHO77W12O7JL0Hem_CFXY2RlrpADfmvyRsJ-UVyxkbPKZMU2JhHVi9PfiT5iVA4-trvzJaMwT2K5v1eziUehxHczscYDLtsS-DE1KIK3K9GZ_BYdQAXvXCQuAMQl8nrv72u3h93Heh1491GXmiH7p6BcFxHS7J4cWcjET6LE_TVuEQwO-8kyqT4GcSk2SDEpGl33ooe62XHFbNlyR1CRzCNZgjaj6ELOk64VdYVr8bJ2HW193Gp8Q3MAioaslE',
              phoneNumber: '08987654321'
            }
          ]);
          console.log('[SEED] Default mock users seeded successfully!');
        } catch (err) {
          console.error('[SEED] Gagal membuat user default offline:', err);
        }
        
        markInitialized();
      }

      fetchProducts();

      // Selalu mulai dari halaman login untuk keperluan demo (membersihkan sesi saat startup)
      clearSession();
      setUser(DEFAULT_USER);
      setOrders([]);

      if (isSupabaseConfigured()) {
        try {
          await supabase.auth.signOut();
        } catch (err) {
          console.error('[AUTH] Gagal sign out dari Supabase saat inisialisasi:', err);
        }
      }

      setCurrentView({ type: 'login' });
    };

    initApp();

    // Set up auth state change listeners
    let authSubscription: any;
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log(`[AUTH] Deteksi event onAuthStateChange: ${event}`);
        await handleUserSession(session);
      });
      authSubscription = subscription;
    }

    return () => {
      if (authSubscription) authSubscription.unsubscribe();
    };
  }, [fetchProducts, fetchOrders, handleUserSession]);

  // Sync scroll on navigate
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Load favorites from local storage when user logs in or out
  useEffect(() => {
    if (user.isLoggedIn && user.email) {
      const stored = localStorage.getItem(`sewarion_favorites_${user.email}`);
      setFavorites(stored ? JSON.parse(stored) : []);
    } else {
      setFavorites([]);
    }
  }, [user.email, user.isLoggedIn]);

  const toggleFavorite = useCallback((productId: string) => {
    if (!user.isLoggedIn) {
      setCurrentView({ type: 'login' });
      return;
    }
    setFavorites((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem(`sewarion_favorites_${user.email}`, JSON.stringify(updated));
      return updated;
    });
  }, [user.email, user.isLoggedIn]);

  const navigate = useCallback((view: ViewState) => {
    setCurrentView(view);
  }, []);

  const handleSetUser = useCallback((newUser: User) => {
    setUser(newUser);
    if (newUser.isLoggedIn) {
      saveCurrentSession(newUser);
      fetchOrders(newUser.email);
    }
  }, [fetchOrders]);

  const handleSetProducts = useCallback(async (newProducts: Product[]) => {
    setProducts(newProducts);
    saveStoredProducts(newProducts);

    // If configured, sync inserts or deletes with Supabase products table
    if (isSupabaseConfigured()) {
      try {
        if (newProducts.length > products.length) {
          // Added product
          const added = newProducts[0];
          await supabase.from('products').insert({
            id: added.id,
            name: added.name,
            category: added.category,
            price_per_day: added.pricePerDay,
            location: added.location,
            location_detail: added.locationDetail,
            image: added.image,
            images: added.images,
            is_available: added.isAvailable,
            description: added.description,
            specs: added.specs,
            owner_id: added.ownerId
          });
        } else if (newProducts.length < products.length) {
          // Deleted product
          const deletedIds = products
            .filter((p) => !newProducts.some((np) => np.id === p.id))
            .map((p) => p.id);
          if (deletedIds.length > 0) {
            await supabase.from('products').delete().in('id', deletedIds);
          }
        }
      } catch (err) {
        console.error('Gagal sinkronisasi produk ke database cloud:', err);
      }
    }
  }, [products]);

  const addOrder = useCallback(async (order: Order) => {
    const orderWithUser = { ...order, userEmail: user.email, createdAt: new Date().toISOString() };
    setOrders((prev) => [orderWithUser, ...prev]);
    addOrderToStorage(orderWithUser);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('orders').insert({
          id: orderWithUser.id,
          product_id: orderWithUser.product.id,
          renter_email: orderWithUser.userEmail,
          duration_days: orderWithUser.durationDays,
          start_date: orderWithUser.startDate,
          end_date: orderWithUser.endDate,
          payment_method: orderWithUser.paymentMethod,
          total_payment: orderWithUser.totalPayment,
          status: orderWithUser.status
        });

        // Insert cloud notification for the product owner
        const ownerEmail = orderWithUser.product.ownerId;
        if (ownerEmail && ownerEmail !== 'system') {
          await supabase.from('notifications').insert({
            user_email: ownerEmail,
            sender_name: user.fullName,
            content: `telah memesan sewa barang Anda: ${orderWithUser.product.name}`,
            is_read: false
          });
        }
      } catch (err) {
        console.error('Gagal mengirim order ke database cloud:', err);
      }
    }
  }, [user]);

  const updateOrder = useCallback(async (orderId: string, status: Order['status'], updates?: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, ...updates } : o))
    );
    updateOrderStatus(orderId, status, updates);

    if (isSupabaseConfigured()) {
      try {
        const payload: any = { status };
        if (updates) {
          if (updates.lateFee !== undefined) payload.late_fee = updates.lateFee;
          if (updates.lateDays !== undefined) payload.late_days = updates.lateDays;
          if (updates.lateHours !== undefined) payload.late_hours = updates.lateHours;
          if (updates.lateFeePaid !== undefined) payload.late_fee_paid = updates.lateFeePaid;
          if (updates.actualReturnDate !== undefined) payload.actual_return_date = updates.actualReturnDate;
        }
        await supabase
          .from('orders')
          .update(payload)
          .eq('id', orderId);

        // Notify owner if paid successfully
        const targetOrder = orders.find((o) => o.id === orderId);
        if (status === 'paid' && targetOrder) {
          const ownerEmail = targetOrder.product.ownerId;
          if (ownerEmail && ownerEmail !== 'system') {
            await supabase.from('notifications').insert({
              user_email: ownerEmail,
              sender_name: user.fullName,
              content: `telah menyelesaikan pembayaran sewa barang Anda: ${targetOrder.product.name}`,
              is_read: false
            });
          }
        }
      } catch (err) {
        console.error('Gagal mengupdate order di database cloud:', err);
      }
    }
  }, [orders, user]);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured()) {
      supabase.auth.signOut().catch((err) => {
        console.error('Gagal logout dari cloud:', err);
      });
    }
    clearSession();
    setUser(DEFAULT_USER);
    setOrders([]);
    setCurrentView({ type: 'login' });
  }, []);

  const appContextValue: AppContextType = {
    currentView,
    navigate,
    user,
    setUser: handleSetUser,
    products,
    setProducts: handleSetProducts,
    orders,
    addOrder,
    updateOrder,
    logout,
    favorites,
    toggleFavorite,
    theme,
    toggleTheme
  };

  const isAuthView = currentView.type === 'login' || currentView.type === 'register';

  const renderActiveView = () => {
    switch (currentView.type) {
      case 'home':
        return <HomeView appCtx={appContextValue} />;
      case 'product-detail':
        return <ProductDetailView appCtx={appContextValue} productId={currentView.productId} />;
      case 'checkout':
        return (
          <CheckoutView
            appCtx={appContextValue}
            productId={currentView.productId}
            totalDays={currentView.totalDays}
            startDate={currentView.startDate}
            endDate={currentView.endDate}
          />
        );
      case 'payment-pending':
        return <PaymentPendingView appCtx={appContextValue} order={currentView.order} />;
      case 'login':
        return <LoginView appCtx={appContextValue} />;
      case 'register':
        return <RegisterView appCtx={appContextValue} />;
      case 'kyc':
        return <KYCView appCtx={appContextValue} />;
      case 'mulai-menyewakan':
        return <MulaiMenyewakanView appCtx={appContextValue} />;
      case 'history':
        return <HistoryView appCtx={appContextValue} />;
      case 'favorites':
        return <FavoritesView appCtx={appContextValue} />;
      case 'profile':
        return <ProfileView appCtx={appContextValue} />;
      default:
        return <HomeView appCtx={appContextValue} />;
    }
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <div className="min-h-screen bg-[#f7fcf5] text-[#171d16] dark:bg-[#0f140e] dark:text-[#dde5d9] flex flex-col antialiased transition-colors duration-300">
        {!isAuthView && <Header appCtx={appContextValue} />}

        <main className={`flex-grow transition-all duration-300 ${isAuthView ? '' : 'pt-20 pb-20 md:pb-10'}`}>
          {renderActiveView()}
        </main>

        {!isAuthView && <Footer appCtx={appContextValue} />}
        {!isAuthView && <BottomNav appCtx={appContextValue} />}

        {/* Floating Debug Console (Commented out for presentation)
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          width: '320px',
          maxHeight: '220px',
          background: 'rgba(23, 29, 22, 0.95)',
          border: '1px solid #006b2c',
          color: '#7ffc97',
          fontSize: '10px',
          fontFamily: 'monospace',
          padding: '12px',
          borderRadius: '16px',
          overflowY: 'auto',
          zIndex: 99999,
          textAlign: 'left',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          pointerEvents: 'auto'
        }}>
          <div style={{ fontWeight: 'bold', borderBottom: '1px solid rgba(127, 252, 151, 0.3)', paddingBottom: '4px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>LIVE LOGGER CONSOLE</span>
            <button
              onClick={() => {
                const current = localStorage.getItem('sewarion_force_offline') === 'true';
                localStorage.setItem('sewarion_force_offline', current ? 'false' : 'true');
                window.location.reload();
              }}
              style={{
                background: localStorage.getItem('sewarion_force_offline') === 'true' ? '#e65100' : '#006b2c',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '8px',
                padding: '3px 8px',
                borderRadius: '6px',
                marginLeft: 'auto',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                letterSpacing: '0.5px'
              }}
            >
              {localStorage.getItem('sewarion_force_offline') === 'true' ? '🔌 OFFLINE MODE' : '⚡ CLOUD MODE'}
            </button>
            <button onClick={() => setDebugLogs([])} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '9px' }}>[CLEAR]</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {debugLogs.length === 0 ? (
              <span style={{ color: '#829281' }}>Menunggu log aktivitas...</span>
            ) : (
              debugLogs.map((log, idx) => (
                <div key={idx} style={{ 
                  color: log.startsWith('[ERROR]') ? '#ffd9de' : '#7ffc97',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  paddingBottom: '2px',
                  wordBreak: 'break-all'
                }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
        */}
      </div>
    </AppContext.Provider>
  );
}
