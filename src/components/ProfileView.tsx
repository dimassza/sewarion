import React, { useMemo, useState } from 'react';
import { User, Mail, ShieldAlert, ShieldCheck, Trash2, LogOut, Calendar, Package, ArrowUpRight, TrendingUp, Wallet, DollarSign, CheckCircle2, ArrowRight, X, Loader2 } from 'lucide-react';
import type { AppContextType } from '../types';
import { findUserByEmail } from '../storage';

interface ProfileViewProps {
  appCtx: AppContextType;
}

export default function ProfileView({ appCtx }: ProfileViewProps) {
  const { user, products, setProducts, logout, navigate } = appCtx;

  // Withdrawal States
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutBank, setPayoutBank] = useState('BCA');
  const [payoutAccountNumber, setPayoutAccountNumber] = useState('');
  const [payoutStatus, setPayoutStatus] = useState<'idle' | 'success'>('idle');

  // Dynamic user specific earnings (Fahri Pemilik vs Budi Penyewa)
  const isDemoOwner = user.email === 'pemilik123@gmail.com';
  const grossEarnings = isDemoOwner ? 2850000 : 0;
  const adminFeeDeducted = Math.round(grossEarnings * 0.05);
  const netEarnings = grossEarnings - adminFeeDeducted;
  const withdrawableBalance = isDemoOwner ? 850000 : 0;

  const trustBadge = useMemo(() => {
    const score = user.trustScore || 0;
    if (score >= 95) {
      return {
        title: 'Platinum Verified Renter',
        color: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/25 dark:text-emerald-400 dark:border-emerald-500/20',
        dotColor: 'bg-emerald-500',
        benefits: ['Bebas Deposit 100%', 'Prioritas Pelayanan 24/7', 'Asuransi Proteksi Kerusakan Mikro Gratis']
      };
    } else if (score >= 85) {
      return {
        title: 'Gold Verified Renter',
        color: 'bg-amber-500/10 text-amber-800 border-amber-500/25 dark:text-amber-400 dark:border-amber-500/20',
        dotColor: 'bg-amber-500',
        benefits: ['Bebas Deposit 100%', 'Diskon Biaya Platform 2%']
      };
    } else if (score >= 75) {
      return {
        title: 'Silver Renter',
        color: 'bg-slate-400/10 text-slate-800 border-slate-400/25 dark:text-slate-300 dark:border-slate-400/20',
        dotColor: 'bg-slate-400',
        benefits: ['Bebas Deposit 80%', 'Akses Sewa Gadget Reguler']
      };
    } else {
      return {
        title: 'Bronze Renter',
        color: 'bg-amber-700/10 text-amber-900 border-amber-700/25 dark:text-amber-500 dark:border-amber-700/20',
        dotColor: 'bg-amber-700',
        benefits: ['Memerlukan Deposit Minimal 50%']
      };
    }
  }, [user.trustScore]);

  // Retrieve additional info from storage if available
  const registeredInfo = useMemo(() => {
    if (!user.email) return null;
    return findUserByEmail(user.email);
  }, [user.email]);

  // Filter products uploaded by the current user
  const userProducts = useMemo(() => {
    return products.filter((p) => p.ownerId === user.email);
  }, [products, user.email]);

  // Format member date
  const memberSince = useMemo(() => {
    if (registeredInfo?.registeredAt) {
      try {
        const date = new Date(registeredInfo.registeredAt);
        const months = [
          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
      } catch {
        return 'Juni 2026';
      }
    }
    return 'Juni 2026';
  }, [registeredInfo]);

  // Handle deleting a product
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus barang sewaan ini?')) {
      const updatedProducts = products.filter((p) => p.id !== productId);
      setProducts(updatedProducts);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
      {/* Upper Profile Section */}
      <div className="bg-gradient-to-br from-[#e9f0e5] to-white dark:from-[#1b2518] dark:to-[#0f140e] border border-[#bdcaba] dark:border-[#2f3d2d] rounded-3xl p-6 md:p-8 shadow-xl shadow-[#006b2c]/5 dark:shadow-none mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Avatar Area */}
          <div className="relative">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-[#006b2c] dark:border-[#00873a] shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-[#006b2c] to-[#00873a] flex items-center justify-center text-white text-3xl md:text-4xl font-extrabold shadow-lg">
                {getInitials(user.fullName)}
              </div>
            )}
            <div className={`absolute bottom-1 right-1 p-1.5 rounded-full border-2 border-white dark:border-[#151c14] shadow-md ${user.isKycVerified ? 'bg-[#006b2c]' : 'bg-[#e26d5c]'}`}>
              {user.isKycVerified ? (
                <ShieldCheck className="w-4 h-4 text-white" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-white" />
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2 justify-center md:justify-start">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#171d16] dark:text-[#dde5d9] font-display">{user.fullName || 'Pengguna Sewarion'}</h1>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold self-center ${
                  user.isKycVerified
                    ? 'bg-[#e4f3e6] dark:bg-[#122818] text-[#006b2c] dark:text-[#7ffc97] border border-[#a3d9b2] dark:border-[#0f5424]'
                    : 'bg-[#fdf0ee] dark:bg-[#2d120f] text-[#d6453d] dark:text-[#ff7f7f] border border-[#f9c7c2] dark:border-[#540f0c]'
                }`}>
                  {user.isKycVerified ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      KYC Terverifikasi
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Belum Verifikasi KYC
                    </>
                  )}
                </span>
                
                {user.isKycVerified && (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide self-center border ${trustBadge.color} shadow-2xs`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${trustBadge.dotColor} animate-pulse`} />
                    {trustBadge.title}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-[#546253] dark:text-[#829281] mb-4 justify-center md:justify-start">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#006b2c] dark:text-[#7ffc97]" />
                {user.email}
              </span>
              <span className="hidden sm:inline text-[#bdcaba] dark:text-[#2f3d2d]">•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#006b2c] dark:text-[#7ffc97]" />
                Bergabung sejak {memberSince}
              </span>
            </div>

            {/* Trust Score & Rentals Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto md:mx-0">
              <div className="bg-white/80 dark:bg-[#151c14]/80 backdrop-blur-sm border border-[#bdcaba]/50 dark:border-[#2f3d2d]/50 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-[#546253] dark:text-[#829281] uppercase tracking-wider">Trust Score</span>
                  <span className="text-sm font-extrabold text-[#006b2c] dark:text-[#7ffc97]">{user.trustScore}/100</span>
                </div>
                <div className="w-full bg-[#e9f0e5] dark:bg-[#1a2318] rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#006b2c] to-[#00873a] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${user.trustScore}%` }}
                  />
                </div>
              </div>

              <div className="bg-white/80 dark:bg-[#151c14]/80 backdrop-blur-sm border border-[#bdcaba]/50 dark:border-[#2f3d2d]/50 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#546253] dark:text-[#829281] uppercase tracking-wider block">Total Sewa</span>
                  <span className="text-lg font-extrabold text-[#171d16] dark:text-[#dde5d9]">{user.totalRentals || '0'} Transaksi</span>
                </div>
                <div className="bg-[#e9f0e5] dark:bg-[#1a2318] p-2.5 rounded-xl text-[#006b2c] dark:text-[#7ffc97]">
                  <Package className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Unlocked Benefits */}
            {user.isKycVerified && (
              <div className="mt-5 pt-4 border-t border-[#bdcaba]/35 dark:border-[#2f3d2d]/35 text-left">
                <span className="text-[9px] font-extrabold text-[#546253] dark:text-[#829281] uppercase tracking-wider block mb-2 pl-0.5">Benefit Keanggotaan Terbuka</span>
                <div className="flex flex-wrap gap-2">
                  {trustBadge.benefits.map((benefit, idx) => (
                    <span key={idx} className="bg-[#eff6ea] dark:bg-[#1a2318] text-[#006b2c] dark:text-[#7ffc97] border border-[#a3d9b2]/60 dark:border-[#0f5424]/60 rounded-full px-3 py-1 text-[10.5px] font-bold flex items-center gap-1 shadow-2xs">
                      ✓ {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* KYC Alert Banner */}
      {!user.isKycVerified && (
        <div className="bg-gradient-to-r from-[#d6453d]/10 via-[#d6453d]/5 to-transparent dark:from-[#d6453d]/20 dark:via-[#d6453d]/10 border border-[#d6453d]/20 dark:border-[#d6453d]/30 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left flex-col sm:flex-row">
            <div className="bg-[#fdf0ee] dark:bg-[#2d120f] p-3 rounded-full text-[#d6453d] dark:text-[#ff7f7f] border border-[#f9c7c2] dark:border-[#540f0c]">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#9d2c26] dark:text-[#ff8f8a] text-base">Akun Anda Belum Terverifikasi</h3>
              <p className="text-xs text-[#b8544e] dark:text-[#ffb3b0] mt-0.5">Lakukan verifikasi identitas (KYC) sekarang agar Anda dapat menyewa barang tanpa deposit dan mulai menyewakan barang Anda.</p>
            </div>
          </div>
          <button
            onClick={() => navigate({ type: 'kyc' })}
            className="whitespace-nowrap bg-[#d6453d] text-white px-5 py-2.5 rounded-full text-xs font-extrabold hover:bg-[#b8544e] active:scale-95 transition-all shadow-md shadow-[#d6453d]/15 flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
          >
            Verifikasi Sekarang
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dasbor Keuangan Mitra / Owner Revenue Dashboard */}
      {user.isKycVerified && (
        <div className="bg-white dark:bg-[#151c14] border border-[#bdcaba] dark:border-[#2f3d2d] rounded-3xl p-6 md:p-8 shadow-sm mb-8 text-left animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-[#bdcaba]/50 dark:border-[#2f3d2d]/50 gap-4">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-5 h-5 text-[#006b2c] dark:text-[#7ffc97]" />
              <h2 className="text-xl font-extrabold text-[#171d16] dark:text-[#dde5d9]">Dasbor Keuangan Mitra</h2>
            </div>
            
            {/* Tarik Saldo Button */}
            {withdrawableBalance > 0 && (
              <button
                onClick={() => {
                  setPayoutAccountNumber('');
                  setPayoutStatus('idle');
                  setShowPayoutModal(true);
                }}
                className="bg-[#006b2c] hover:bg-[#00873a] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-md shadow-[#006b2c]/10 flex items-center gap-1.5 cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                Tarik Saldo Payout
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#f4fcf0] dark:bg-[#151d13] border border-[#bdcaba]/35 dark:border-[#2f3d2d]/35 rounded-2xl p-4">
              <span className="text-[10px] text-[#546253] dark:text-[#829281] font-bold uppercase tracking-wider block">Pendapatan Kotor</span>
              <span className="text-lg font-black text-[#171d16] dark:text-[#dde5d9] mt-1 block">Rp {grossEarnings.toLocaleString('id-ID')}</span>
            </div>
            <div className="bg-[#fdf0ee] dark:bg-[#2d120f]/50 border border-[#bdcaba]/35 dark:border-[#2f3d2d]/35 rounded-2xl p-4">
              <span className="text-[10px] text-[#546253] dark:text-[#829281] font-bold uppercase tracking-wider block">Komisi Sewarion (5%)</span>
              <span className="text-lg font-black text-[#d6453d] dark:text-[#ff7f7f] mt-1 block">Rp {adminFeeDeducted.toLocaleString('id-ID')}</span>
            </div>
            <div className="bg-[#f4fcf0] dark:bg-[#151d13] border border-[#bdcaba]/35 dark:border-[#2f3d2d]/35 rounded-2xl p-4">
              <span className="text-[10px] text-[#546253] dark:text-[#829281] font-bold uppercase tracking-wider block">Pendapatan Bersih</span>
              <span className="text-lg font-black text-[#006b2c] dark:text-[#7ffc97] mt-1 block">Rp {netEarnings.toLocaleString('id-ID')}</span>
            </div>
            <div className="bg-[#eff6ea] dark:bg-[#1a2318] border border-[#006b2c]/20 dark:border-[#006b2c]/30 rounded-2xl p-4 relative overflow-hidden">
              <span className="text-[10px] text-[#006b2c] dark:text-[#7ffc97] font-bold uppercase tracking-wider block">Saldo Siap Tarik</span>
              <span className="text-lg font-black text-[#006b2c] dark:text-[#7ffc97] mt-1 block">Rp {withdrawableBalance.toLocaleString('id-ID')}</span>
              <div className="absolute -bottom-6 -right-6 w-14 h-14 bg-[#006b2c]/5 rounded-full blur-xs" />
            </div>
          </div>

          {/* Earnings Graph & Simulation */}
          <div className="bg-[#eff6ea]/35 dark:bg-[#1a2318]/35 border border-[#bdcaba]/40 dark:border-[#2f3d2d]/40 rounded-2xl p-4 md:p-6">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="text-xs font-bold text-[#171d16] dark:text-[#dde5d9]">Tren Penghasilan 4 Minggu Terakhir</h4>
                <p className="text-[10px] text-[#6e7b6c] dark:text-[#829281] mt-0.5">Sewa barang meningkat pesat di wilayah {isDemoOwner ? 'Jakarta Barat' : 'Anda'}</p>
              </div>
              <span className="text-xs font-extrabold text-[#006b2c] dark:text-[#7ffc97] bg-white dark:bg-[#151c14] border border-[#bdcaba]/35 dark:border-[#2f3d2d]/35 px-2.5 py-1 rounded-lg">
                +18.4% bulan ini
              </span>
            </div>
            
            {/* SVG Line Chart */}
            <div className="w-full h-32 relative bg-white/70 dark:bg-[#151c14]/70 rounded-xl border border-[#bdcaba]/30 dark:border-[#2f3d2d]/30 p-2 overflow-hidden flex flex-col justify-end">
              <svg className="w-full h-24" viewBox="0 0 500 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" className="text-[#006b2c] dark:text-[#7ffc97]" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="currentColor" className="text-[#006b2c] dark:text-[#7ffc97]" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
                <path
                  d="M 0 80 Q 75 70 150 30 T 300 50 T 450 15 L 500 15 L 500 100 L 0 100 Z"
                  fill="url(#chartGrad)"
                />
                <path
                  d="M 0 80 Q 75 70 150 30 T 300 50 T 450 15 L 500 15"
                  fill="none"
                  stroke="#006b2c"
                  className="dark:stroke-[#7ffc97]"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="150" cy="30" r="3.5" fill="#006b2c" className="dark:fill-[#7ffc97]" stroke="#fff" strokeWidth="1.5" />
                <circle cx="300" cy="50" r="3.5" fill="#006b2c" className="dark:fill-[#7ffc97]" stroke="#fff" strokeWidth="1.5" />
                <circle cx="450" cy="15" r="3.5" fill="#006b2c" className="dark:fill-[#7ffc97]" stroke="#fff" strokeWidth="1.5" />
              </svg>
              <div className="flex justify-between text-[8px] text-[#6e7b6c] dark:text-[#829281] font-bold uppercase tracking-wider px-1 pt-1.5 border-t border-[#eff6ea] dark:border-[#1a2318]">
                <span>Minggu 1</span>
                <span>Minggu 2</span>
                <span>Minggu 3</span>
                <span>Minggu 4 (Kini)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barang Saya / User-uploaded products */}
      <div className="bg-white dark:bg-[#151c14] border border-[#bdcaba] dark:border-[#2f3d2d] rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#bdcaba]/50 dark:border-[#2f3d2d]/50">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-[#006b2c] dark:text-[#7ffc97]" />
            <h2 className="text-xl font-extrabold text-[#171d16] dark:text-[#dde5d9]">Barang Sewaan Saya</h2>
          </div>
          <button
            onClick={() => {
              if (!user.isKycVerified) {
                alert('Silakan verifikasi KYC terlebih dahulu untuk menyewakan barang.');
                navigate({ type: 'kyc' });
              } else {
                navigate({ type: 'mulai-menyewakan' });
              }
            }}
            className="text-xs font-bold text-[#006b2c] dark:text-[#7ffc97] hover:underline"
          >
            + Tambah Barang Baru
          </button>
        </div>

        {userProducts.length === 0 ? (
          <div className="text-center py-12 px-4 border-2 border-dashed border-[#bdcaba]/50 dark:border-[#2f3d2d]/50 rounded-2xl">
            <Package className="w-12 h-12 text-[#bdcaba] dark:text-[#2f3d2d]/70 mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#546253] dark:text-[#b4c3b2]">Anda belum mendaftarkan barang apapun untuk disewakan.</p>
            <p className="text-xs text-[#829281] dark:text-[#829281] mt-1 mb-5">Hasilkan uang tambahan dengan menyewakan kamera, laptop, atau perlengkapan camping yang jarang Anda gunakan!</p>
            <button
              onClick={() => {
                if (!user.isKycVerified) {
                  navigate({ type: 'kyc' });
                } else {
                  navigate({ type: 'mulai-menyewakan' });
                }
              }}
              className="bg-[#006b2c] text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-[#00873a] transition-colors"
            >
              Mulai Menyewakan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProducts.map((product) => (
              <div
                key={product.id}
                className="group border border-[#bdcaba]/80 dark:border-[#2f3d2d] rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 bg-white dark:bg-[#151c14]"
              >
                <div className="aspect-[4/3] w-full bg-[#e9f0e5] dark:bg-[#1a2318] overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-[#006b2c] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {product.category}
                  </div>
                  {product.isPromoted && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-0.5 uppercase z-10">
                      ⭐ Sponsor Aktif
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-extrabold text-[#171d16] dark:text-[#dde5d9] text-sm group-hover:text-[#006b2c] dark:group-hover:text-[#7ffc97] transition-colors line-clamp-1 mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-[#546253] dark:text-[#829281] mb-3">
                    <span>{product.location}</span>
                    <span>•</span>
                    <span className="line-clamp-1">{product.locationDetail}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#bdcaba]/30 dark:border-[#2f3d2d]/30 pt-3 mt-1">
                    <div>
                      <span className="text-[10px] text-[#829281] block">Harga per hari</span>
                      <span className="font-extrabold text-sm text-[#006b2c] dark:text-[#7ffc97]">
                        Rp {product.pricePerDay.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 rounded-lg text-[#d6453d] dark:text-[#ff7f7f] hover:bg-[#fdf0ee] dark:hover:bg-[#2d120f] border border-transparent hover:border-[#f9c7c2] dark:hover:border-[#540f0c] transition-all active:scale-90"
                      title="Hapus Barang"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout Action */}
      <div className="flex justify-center">
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 border border-[#d6453d]/30 dark:border-[#d6453d]/50 text-[#d6453d] dark:text-[#ff7f7f] hover:bg-[#fdf0ee] dark:hover:bg-[#2d120f] hover:border-[#d6453d] px-8 py-3 rounded-full text-sm font-extrabold tracking-wide transition-all active:scale-95 shadow-sm font-sans"
        >
          <LogOut className="w-4 h-4" />
          Keluar dari Akun
        </button>
      </div>

      {/* Payout Cash Withdrawal Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#151c14] rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl border border-[#bdcaba]/40 dark:border-[#2f3d2d]/40 relative">
            <button
              onClick={() => setShowPayoutModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-[#eff6ea] dark:hover:bg-[#1a2318] rounded-full text-[#6e7b6c] dark:text-[#829281] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-[#006b2c]/10 rounded-full flex items-center justify-center text-[#006b2c] dark:text-[#7ffc97] mx-auto mb-4">
              <Wallet className="w-6 h-6" />
            </div>

            <h3 className="font-sans font-bold text-lg text-[#171d16] dark:text-[#dde5d9] mb-2">Penarikan Dana Mitra</h3>
            <p className="font-sans text-xs text-[#6e7b6c] dark:text-[#829281] mb-5">Tarik saldo Sewarion Anda ke rekening bank atau dompet digital pribadi Anda.</p>

            {payoutStatus === 'idle' ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!payoutAccountNumber.trim()) {
                    alert('Mohon isi nomor rekening Anda!');
                    return;
                  }
                  setIsWithdrawing(true);
                  setTimeout(() => {
                    setIsWithdrawing(false);
                    setPayoutStatus('success');
                  }, 2000);
                }}
                className="space-y-4 text-left"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#546253] dark:text-[#829281] uppercase pl-0.5">Jumlah Penarikan</label>
                  <input
                    type="text"
                    readOnly
                    value={`Rp ${withdrawableBalance.toLocaleString('id-ID')}`}
                    className="w-full bg-[#eff6ea]/55 dark:bg-[#1a2318]/55 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-10 px-3 text-xs font-bold text-[#006b2c] dark:text-[#7ffc97] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#546253] dark:text-[#829281] uppercase pl-0.5">Pilih Bank / Dompet</label>
                  <select
                    value={payoutBank}
                    onChange={(e) => setPayoutBank(e.target.value)}
                    className="w-full bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-10 px-2 text-xs font-bold text-[#171d16] dark:text-[#dde5d9]"
                  >
                    <option value="BCA" className="dark:bg-[#151c14]">BCA (Bank Central Asia)</option>
                    <option value="Mandiri" className="dark:bg-[#151c14]">Mandiri</option>
                    <option value="GoPay" className="dark:bg-[#151c14]">GoPay</option>
                    <option value="OVO" className="dark:bg-[#151c14]">OVO</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#546253] dark:text-[#829281] uppercase pl-0.5">Nomor Rekening / HP</label>
                  <input
                    type="text"
                    value={payoutAccountNumber}
                    onChange={(e) => setPayoutAccountNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-10 px-3 text-xs text-[#171d16] dark:text-[#dde5d9] outline-none"
                    placeholder="Contoh: 8012345678"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isWithdrawing}
                  className="w-full h-11 bg-[#006b2c] hover:bg-[#00873a] text-white font-sans text-xs font-bold uppercase rounded-full tracking-wider transition-all active:scale-95 disabled:opacity-75 flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                >
                  {isWithdrawing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Memproses Transfer...
                    </>
                  ) : (
                    <span>Konfirmasi Penarikan</span>
                  )}
                </button>
              </form>
            ) : (
              <div className="py-4 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center text-emerald-600 dark:text-[#7ffc97] mb-4 animate-bounce">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-[#171d16] dark:text-[#dde5d9] mb-1">Transfer Berhasil!</h4>
                <p className="text-[11px] text-[#6e7b6c] dark:text-[#829281] leading-relaxed">
                  Dana sebesar <strong>Rp {withdrawableBalance.toLocaleString('id-ID')}</strong> telah berhasil dikirim ke rekening {payoutBank} ({payoutAccountNumber}) Anda secara instan.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowPayoutModal(false);
                  }}
                  className="mt-6 bg-[#006b2c] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#00873a] transition-all cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
