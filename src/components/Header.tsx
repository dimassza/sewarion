import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ShieldCheck, User, ClipboardList, LogOut, ChevronDown, Bell, MessageSquare, Heart, Sun, Moon } from 'lucide-react';
import { LOGO_URLS } from '../data';
import type { AppContextType, Notification } from '../types';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

interface HeaderProps {
  appCtx: AppContextType;
}

export default function Header({ appCtx }: HeaderProps) {
  const { currentView, navigate, user, logout, theme, toggleTheme } = appCtx;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch and Subscribe to Real-time Notifications
  useEffect(() => {
    if (!user.isLoggedIn || !user.email) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_email', user.email)
            .order('created_at', { ascending: false })
            .limit(10);

          if (!error && data) {
            setNotifications(data);
          }
        } catch (err) {
          console.error('Gagal mengambil notifikasi cloud:', err);
        }
      }
    };

    fetchNotifications();

    let channel: any;
    if (isSupabaseConfigured()) {
      channel = supabase
        .channel(`notifications_${user.email}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_email=eq.${user.email}`
          },
          (payload) => {
            const newNotif = payload.new as Notification;
            setNotifications((prev) => [newNotif, ...prev.slice(0, 9)]);
          }
        )
        .subscribe();
    }

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [user.isLoggedIn, user.email]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAsRead = async (notifId?: string) => {
    if (!notifId) return;
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, is_read: true } : n))
    );

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notifId);
      } catch (err) {
        console.error('Gagal update status baca notifikasi:', err);
      }
    }
  };

  const handleNav = (targetView: Parameters<typeof navigate>[0]) => {
    navigate(targetView);
    setDropdownOpen(false);
    setDrawerOpen(false);
    setNotifOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleNav({ type: 'home' });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#e9f0e5]/90 dark:bg-[#0f140e]/95 backdrop-blur-md border-b border-[#bdcaba] dark:border-[#2b3a27] h-20 flex items-center px-4 md:px-10 transition-all duration-300">
        <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
          {/* Logo & Hamburger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden text-[#006b2c] hover:opacity-80 transition-opacity focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
            <a href="#" onClick={handleLogoClick} className="flex items-center gap-3 active:scale-95 transition-transform">
              <img
                src={LOGO_URLS.alt}
                className="h-9 w-auto object-contain"
                alt="SEWARION"
              />
              <span className="font-sans font-bold text-2xl tracking-tight text-[#006b2c]">
                SEWARION
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex gap-8 items-center">
            <a
              onClick={() => handleNav({ type: 'home' })}
              className={`font-sans text-sm font-semibold hover:text-[#006b2c] dark:hover:text-white cursor-pointer transition-colors ${
                currentView.type === 'home' ? 'text-[#006b2c] border-b-2 border-[#006b2c] pb-1' : 'text-[#3e4a3d] dark:text-[#9bb098]'
              }`}
            >
              Beranda
            </a>

            {user.isLoggedIn && (
              <a
                onClick={() => {
                  if (!user.isKycVerified) {
                    alert('Silakan verifikasi KYC terlebih dahulu untuk menyewakan barang.');
                    handleNav({ type: 'kyc' });
                  } else {
                    handleNav({ type: 'mulai-menyewakan' });
                  }
                }}
                className={`font-sans text-sm font-semibold hover:text-[#006b2c] dark:hover:text-white cursor-pointer transition-colors ${
                  currentView.type === 'mulai-menyewakan' ? 'text-[#006b2c] border-b-2 border-[#006b2c] pb-1' : 'text-[#3e4a3d] dark:text-[#9bb098]'
                }`}
              >
                Mulai Menyewakan
              </a>
            )}
            {user.isLoggedIn && (
              <a
                onClick={() => handleNav({ type: 'history' })}
                className={`font-sans text-sm font-semibold hover:text-[#006b2c] dark:hover:text-white cursor-pointer transition-colors ${
                  currentView.type === 'history' ? 'text-[#006b2c] border-b-2 border-[#006b2c] pb-1' : 'text-[#3e4a3d] dark:text-[#9bb098]'
                }`}
              >
                Riwayat Sewa
              </a>
            )}
            {user.isLoggedIn && (
              <a
                onClick={() => handleNav({ type: 'favorites' })}
                className={`font-sans text-sm font-semibold hover:text-[#006b2c] dark:hover:text-white cursor-pointer transition-colors ${
                  currentView.type === 'favorites' ? 'text-[#006b2c] border-b-2 border-[#006b2c] pb-1' : 'text-[#3e4a3d] dark:text-[#9bb098]'
                }`}
              >
                Favorit
              </a>
            )}
          </nav>

          {/* Right Header Area (Notifications & Profiles) */}
          <div className="flex items-center gap-3 relative">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/80 dark:hover:bg-[#1c2818]/60 text-[#546253] dark:text-[#9bb098] transition-colors focus:outline-none"
              title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {/* Real-time Notification Bell */}
            {user.isLoggedIn && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 rounded-full hover:bg-white/80 dark:hover:bg-[#1c2818]/60 text-[#546253] dark:text-[#9bb098] relative focus:outline-none transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-red-500 text-white text-[8px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifOpen && (
                  <div className="absolute right-0 top-12 w-80 bg-white dark:bg-[#151f14] border border-[#bdcaba] dark:border-[#2b3a27] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-[#bdcaba]/40 dark:border-[#2b3a27]/40 flex justify-between items-center bg-[#eff6ea]/30 dark:bg-[#1c2818]/20">
                      <span className="text-xs font-extrabold text-[#171d16] dark:text-[#dde5d9]">Notifikasi</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] text-[#006b2c] font-bold">
                          {unreadCount} Baru
                        </span>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-[#bdcaba]/20 dark:divide-[#2b3a27]/20">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-xs text-[#829281]">
                          Belum ada notifikasi masuk
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleMarkAsRead(notif.id)}
                            className={`p-3 text-left transition-colors cursor-pointer text-xs ${
                              notif.is_read ? 'bg-white dark:bg-[#151f14] text-[#546253] dark:text-[#9bb098]' : 'bg-[#e4f3e6]/20 dark:bg-[#006b2c]/10 text-[#171d16] dark:text-[#dde5d9] font-semibold'
                            }`}
                          >
                            <p className="leading-relaxed">
                              <span className="font-extrabold">{notif.sender_name}</span> {notif.content}
                            </p>
                            <span className="block text-[8px] text-[#829281] dark:text-[#9bb098]/70 mt-1">
                              {notif.created_at ? new Date(notif.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Dropdown trigger */}
            <div className="flex items-center relative" ref={dropdownRef}>
              {user.isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 hover:opacity-90 cursor-pointer focus:outline-none select-none"
                  >
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="font-sans text-xs font-extrabold text-[#171d16] dark:text-[#dde5d9]">{user.fullName}</span>
                      <span className="text-[10px] text-[#006b2c] flex items-center gap-0.5 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 fill-[#006b2c]/10" />
                        Score: {user.trustScore}/100
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#00873a] shadow-sm relative">
                      {user.avatarUrl ? (
                        <img
                          className="w-full h-full object-cover"
                          src={user.avatarUrl}
                          alt={user.fullName}
                        />
                      ) : (
                        <div className="w-full h-full bg-[#006b2c] text-white flex items-center justify-center font-bold text-sm">
                          {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#546253] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Action Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-12 w-56 bg-white dark:bg-[#151f14] border border-[#bdcaba] dark:border-[#2b3a27] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-[#bdcaba]/40 dark:border-[#2b3a27]/40">
                        <p className="text-xs text-[#829281]">Masuk sebagai</p>
                        <p className="text-sm font-extrabold text-[#171d16] dark:text-[#dde5d9] truncate">{user.fullName}</p>
                        <p className="text-[10px] text-[#546253] dark:text-[#9bb098] truncate">{user.email}</p>
                      </div>

                      <button
                        onClick={() => handleNav({ type: 'profile' })}
                        className="w-full text-left px-4 py-2.5 text-xs text-[#3e4a3d] dark:text-[#dde5d9] hover:bg-[#e9f0e5] dark:hover:bg-[#1c2818]/40 hover:text-[#006b2c] dark:hover:text-white font-bold flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Profil Saya
                      </button>

                      <button
                        onClick={() => handleNav({ type: 'history' })}
                        className="w-full text-left px-4 py-2.5 text-xs text-[#3e4a3d] dark:text-[#dde5d9] hover:bg-[#e9f0e5] dark:hover:bg-[#1c2818]/40 hover:text-[#006b2c] dark:hover:text-white font-bold flex items-center gap-2"
                      >
                        <ClipboardList className="w-4 h-4" />
                        Riwayat Sewa
                      </button>

                      <button
                        onClick={() => handleNav({ type: 'favorites' })}
                        className="w-full text-left px-4 py-2.5 text-xs text-[#3e4a3d] dark:text-[#dde5d9] hover:bg-[#e9f0e5] dark:hover:bg-[#1c2818]/40 hover:text-[#006b2c] dark:hover:text-white font-bold flex items-center gap-2"
                      >
                        <Heart className="w-4 h-4" />
                        Favorit Saya
                      </button>

                      <div className="border-t border-[#bdcaba]/40 dark:border-[#2b3a27]/40 my-1"></div>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-[#d6453d] dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleNav({ type: 'login' })}
                  className="bg-[#006b2c] text-white px-6 py-2.5 rounded-full font-sans text-sm font-semibold hover:bg-[#00873a] active:scale-95 transition-all shadow-md shadow-[#006b2c]/10"
                >
                  Masuk / Daftar
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Slide-in Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          <div
            ref={drawerRef}
            className="relative w-72 max-w-full bg-[#f7fcf5] dark:bg-[#141b12] h-full shadow-2xl p-6 flex flex-col justify-between border-l border-[#bdcaba] dark:border-[#2b3a27] z-10 transition-transform duration-300 animate-in slide-in-from-right"
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-sans font-black text-lg text-[#006b2c]">SEWARION</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-[#e9f0e5] dark:hover:bg-[#1c2818]/60 text-[#546253] dark:text-[#9bb098] transition-colors focus:outline-none"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-1 rounded-full hover:bg-[#e9f0e5] dark:hover:bg-[#1c2818]/60 text-[#546253] dark:text-[#9bb098]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {user.isLoggedIn && (
                <div className="bg-[#e9f0e5] dark:bg-[#1a2517] rounded-2xl p-4 mb-6 border border-[#bdcaba]/60 dark:border-[#2b3a27]/60">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#006b2c]">
                      {user.avatarUrl ? (
                        <img className="w-full h-full object-cover" src={user.avatarUrl} alt={user.fullName} />
                      ) : (
                        <div className="w-full h-full bg-[#006b2c] text-white flex items-center justify-center font-bold text-sm">
                          {user.fullName[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-extrabold text-[#171d16] dark:text-[#dde5d9] line-clamp-1">{user.fullName}</h4>
                      <p className="text-[10px] text-[#546253] dark:text-[#9bb098] line-clamp-1">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-[10px] text-[#006b2c] flex items-center gap-0.5 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 fill-[#006b2c]/10" />
                    KYC Score: {user.trustScore}/100
                  </div>
                </div>
              )}

              <nav className="flex flex-col gap-4 font-sans text-sm font-bold text-[#3e4a3d] dark:text-[#9bb098] text-left">
                <a
                  onClick={() => handleNav({ type: 'home' })}
                  className={`py-2 px-3.5 rounded-xl transition-all ${
                    currentView.type === 'home' ? 'bg-[#006b2c] text-white' : 'hover:bg-[#e9f0e5] dark:hover:bg-[#1c2818]/60 dark:text-[#dde5d9]'
                  }`}
                >
                  Beranda
                </a>

                {user.isLoggedIn ? (
                  <>
                    <a
                      onClick={() => handleNav({ type: 'profile' })}
                      className={`py-2 px-3.5 rounded-xl transition-all ${
                        currentView.type === 'profile' ? 'bg-[#006b2c] text-white' : 'hover:bg-[#e9f0e5] dark:hover:bg-[#1c2818]/60 dark:text-[#dde5d9]'
                      }`}
                    >
                      Profil Saya
                    </a>
                    <a
                      onClick={() => {
                        if (!user.isKycVerified) {
                          alert('Silakan verifikasi KYC terlebih dahulu untuk menyewakan barang.');
                          handleNav({ type: 'kyc' });
                        } else {
                          handleNav({ type: 'mulai-menyewakan' });
                        }
                      }}
                      className={`py-2 px-3.5 rounded-xl transition-all ${
                        currentView.type === 'mulai-menyewakan' ? 'bg-[#006b2c] text-white' : 'hover:bg-[#e9f0e5] dark:hover:bg-[#1c2818]/60 dark:text-[#dde5d9]'
                      }`}
                    >
                      Mulai Menyewakan
                    </a>
                    <a
                      onClick={() => handleNav({ type: 'history' })}
                      className={`py-2 px-3.5 rounded-xl transition-all ${
                        currentView.type === 'history' ? 'bg-[#006b2c] text-white' : 'hover:bg-[#e9f0e5] dark:hover:bg-[#1c2818]/60 dark:text-[#dde5d9]'
                      }`}
                    >
                      Riwayat Sewa
                    </a>
                    <a
                      onClick={() => handleNav({ type: 'favorites' })}
                      className={`py-2 px-3.5 rounded-xl transition-all ${
                        currentView.type === 'favorites' ? 'bg-[#006b2c] text-white' : 'hover:bg-[#e9f0e5] dark:hover:bg-[#1c2818]/60 dark:text-[#dde5d9]'
                      }`}
                    >
                      Barang Terfavorit
                    </a>
                  </>
                ) : (
                  <button
                    onClick={() => handleNav({ type: 'login' })}
                    className="mt-2 w-full py-3 bg-[#006b2c] text-white rounded-full text-center transition-colors hover:bg-[#00873a]"
                  >
                    Masuk / Daftar
                  </button>
                )}
              </nav>
            </div>

            {user.isLoggedIn && (
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  logout();
                }}
                className="w-full py-3 border border-[#d6453d]/30 dark:border-red-900/30 text-[#d6453d] dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
