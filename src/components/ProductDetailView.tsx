import { useState, useEffect } from 'react';
import { Star, MapPin, Share2, Heart, ShieldCheck, CheckCircle2, ArrowRight, MessageSquare } from 'lucide-react';
import { ACCESSORIES_ITEMS, FOTO_THUMBS, VENDOR_PORTRAIT } from '../data';
import type { AppContextType, Product } from '../types';
import DateRangePicker from './DateRangePicker';
import { getBookedDatesForProduct } from '../storage';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import ChatDrawer from './ChatDrawer';

interface ProductDetailViewProps {
  appCtx: AppContextType;
  productId: string;
}

export default function ProductDetailView({ appCtx, productId }: ProductDetailViewProps) {
  const { products, navigate, user, favorites, toggleFavorite } = appCtx;
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');
  const isLiked = favorites.includes(productId);
  const [selectedMainImg, setSelectedMainImg] = useState<string | null>(null);

  // Date range picker states
  const [startDateObj, setStartDateObj] = useState<Date | null>(null);
  const [endDateObj, setEndDateObj] = useState<Date | null>(null);
  const [totalDays, setTotalDays] = useState(0);

  // Dynamic Owner Profile states
  const [ownerProfile, setOwnerProfile] = useState<any>(null);
  const [loadingOwner, setLoadingOwner] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const currentProduct = products.find((p) => p.id === productId) || products[0];

  const mainImage = selectedMainImg || currentProduct.image;

  // 1. Fetch Owner Profile from Cloud Database
  useEffect(() => {
    const fetchOwner = async () => {
      if (!currentProduct.ownerId || currentProduct.ownerId === 'system') {
        setOwnerProfile(null);
        return;
      }
      setLoadingOwner(true);
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', currentProduct.ownerId)
            .single();

          if (!error && data) {
            setOwnerProfile(data);
          }
        } catch (err) {
          console.error('Gagal mengambil profil pemilik:', err);
        }
      }
      setLoadingOwner(false);
    };

    fetchOwner();
  }, [currentProduct.ownerId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link produk berhasil disalin!');
  };

  const handleDateSelect = (range: { startDate: Date; endDate: Date; totalDays: number }) => {
    setStartDateObj(range.startDate);
    setEndDateObj(range.endDate);
    setTotalDays(range.totalDays);
  };

  const handleBookNow = () => {
    if (!user.isLoggedIn) {
      navigate({ type: 'login' });
      return;
    }
    if (!startDateObj || !endDateObj) {
      alert('Mohon pilih rentang tanggal sewa terlebih dahulu!');
      return;
    }
    navigate({
      type: 'checkout',
      productId: currentProduct.id,
      totalDays,
      startDate: startDateObj.toISOString(),
      endDate: endDateObj.toISOString()
    });
  };

  const getWhatsAppLink = (phone?: string) => {
    if (!phone) return '#';
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    }
    return `https://wa.me/${cleaned}`;
  };

  // Dynamic Thumbnail list builder
  const productImages = currentProduct.images && currentProduct.images.length > 0
    ? currentProduct.images
    : [currentProduct.image, ...FOTO_THUMBS];

  // Pricing calculations
  const originalPrice = currentProduct.pricePerDay;
  const grossRentPrice = originalPrice * totalDays;
  const serviceFee = totalDays > 0 ? Math.round(grossRentPrice * 0.025) : 0; // 2.5% service fee
  const totalPayment = grossRentPrice + serviceFee;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-10 py-8 font-sans">
      {/* Breadcrumb */}
      <nav className="flex gap-2 items-center mb-6 text-[#6e7b6c] dark:text-[#829281] text-xs font-medium">
        <a onClick={() => navigate({ type: 'home' })} className="hover:text-[#006b2c] dark:hover:text-[#7ffc97] cursor-pointer">
          Beranda
        </a>
        <span>/</span>
        <a onClick={() => navigate({ type: 'home' })} className="hover:text-[#006b2c] dark:hover:text-[#7ffc97] cursor-pointer">
          Koleksi
        </a>
        <span>/</span>
        <span className="text-[#171d16] dark:text-[#dde5d9] font-semibold line-clamp-1">{currentProduct.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left main content col */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Visual Carousel */}
          <section className="space-y-4">
            <div className="aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-white dark:bg-[#151c14] border border-[#bdcaba]/30 dark:border-[#2f3d2d] relative shadow-md group">
              <img
                src={mainImage}
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => toggleFavorite(currentProduct.id)}
                  className="w-10 h-10 rounded-full bg-white/95 dark:bg-[#151c14]/95 backdrop-blur-md flex items-center justify-center shadow-md active:scale-90 transition-all text-red-500"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-[#6e7b6c] dark:text-[#b4c3b2]'}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-white/95 dark:bg-[#151c14]/95 backdrop-blur-md flex items-center justify-center text-[#6e7b6c] dark:text-[#b4c3b2] shadow-md active:scale-90 transition-all hover:text-[#006b2c] dark:hover:text-[#7ffc97]"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Selection */}
            <div className="grid grid-cols-4 gap-3">
              {productImages.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMainImg(img)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    (selectedMainImg === img || (selectedMainImg === null && idx === 0))
                      ? 'border-[#006b2c] dark:border-[#00873a] ring-2 ring-[#006b2c]/10 dark:ring-[#00873a]/10 scale-98'
                      : 'border-[#bdcaba]/40 dark:border-[#2f3d2d] hover:opacity-85'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Detail ${idx + 1}`} />
                </button>
              ))}
            </div>
          </section>

          {/* Product Header */}
          <section className="space-y-4">
            <h1 className="font-sans font-bold text-2xl md:text-3xl text-[#171d16] dark:text-[#dde5d9] tracking-tight leading-tight">
              {currentProduct.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#6e7b6c] dark:text-[#829281] py-1">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-[#171d16] dark:text-[#dde5d9] font-bold">4.9</span>
                <span>(42 ulasan terverifikasi)</span>
              </div>
              <span className="hidden sm:inline text-[#bdcaba] dark:text-[#2f3d2d]">|</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{currentProduct.locationDetail} ({currentProduct.location})</span>
              </div>
            </div>
          </section>

          {/* Tab selectors for Description & Specifications */}
          <section className="space-y-4">
            <div className="border-b border-[#bdcaba]/50 dark:border-[#2f3d2d] flex gap-8">
              <button
                onClick={() => setActiveTab('desc')}
                className={`pb-4 font-sans text-sm font-semibold transition-all focus:outline-none ${
                  activeTab === 'desc'
                    ? 'text-[#006b2c] dark:text-[#7ffc97] border-b-2 border-[#006b2c] dark:border-[#7ffc97]'
                    : 'text-[#6e7b6c] dark:text-[#829281] hover:text-[#006b2c] dark:hover:text-[#7ffc97]'
                }`}
              >
                Deskripsi Barang
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-4 font-sans text-sm font-semibold transition-all focus:outline-none ${
                  activeTab === 'specs'
                    ? 'text-[#006b2c] dark:text-[#7ffc97] border-b-2 border-[#006b2c] dark:border-[#7ffc97]'
                    : 'text-[#6e7b6c] dark:text-[#829281] hover:text-[#006b2c] dark:hover:text-[#7ffc97]'
                }`}
              >
                Spesifikasi Teknis
              </button>
            </div>

            <div className="font-sans text-sm text-[#3e4a3d] dark:text-[#b4c3b2] leading-relaxed space-y-4 min-h-[140px]">
              {activeTab === 'desc' ? (
                <div className="space-y-3">
                  <p>{currentProduct.description || 'Barang rental terpercaya berkualitas prima.'}</p>
                  <p className="text-xs text-[#6e7b6c] dark:text-[#829281]">✓ Fisik mulus terawat dirawat secara berkala oleh pemilik.</p>
                </div>
              ) : (
                <ul className="space-y-2 border border-[#bdcaba]/30 dark:border-[#2f3d2d]/30 p-4 rounded-xl bg-white dark:bg-[#151c14] shadow-sm">
                  {currentProduct.specs && currentProduct.specs.length > 0 ? (
                    currentProduct.specs.map((spec, i) => (
                      <li key={i} className="flex gap-2 items-center text-xs py-1 border-b border-[#eff6ea] dark:border-[#1a2318] last:border-b-0 text-[#171d16] dark:text-[#dde5d9]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#006b2c] dark:bg-[#7ffc97] flex-shrink-0"></span>
                        {spec}
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="text-xs text-[#171d16] dark:text-[#dde5d9]">Teknologi sensor canggih</li>
                      <li className="text-xs text-[#171d16] dark:text-[#dde5d9]">Termasuk baterai + charger original</li>
                    </>
                  )}
                </ul>
              )}
            </div>
          </section>

          {/* Dynamic Vendor / Owner Trust Box */}
          <section className="p-6 rounded-2xl bg-white dark:bg-[#151c14] border border-[#bdcaba]/40 dark:border-[#2f3d2d] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-[#dde5d9] dark:bg-[#1a2318] border-2 border-[#7ffc97] flex items-center justify-center font-bold text-lg text-white">
                  {ownerProfile?.avatar_url ? (
                    <img src={ownerProfile.avatar_url} alt="Owner Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#006b2c] flex items-center justify-center">
                      {ownerProfile?.full_name ? ownerProfile.full_name[0].toUpperCase() : 'J'}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#006b2c] text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-[#151c14] shadow-sm">
                  <span className="text-[10px] font-bold">✓</span>
                </div>
              </div>
              <div className="text-left">
                <h3 className="font-sans font-bold text-[#171d16] dark:text-[#dde5d9]">
                  {ownerProfile?.full_name || 'Jakarta Lens Hub (System)'}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#006b2c]/10 dark:bg-[#7ffc97]/10 text-[#006b2c] dark:text-[#7ffc97] text-[10px] font-bold">
                    {ownerProfile ? 'Pemilik Terverifikasi' : 'Mitra Sewarion'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center border-t sm:border-t-0 sm:border-l border-[#bdcaba]/40 dark:border-[#2f3d2d]/40 pt-4 sm:pt-0 sm:pl-8">
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-[10px] text-[#6e7b6c] dark:text-[#829281] font-bold uppercase tracking-wider">Trust Score</p>
                  <p className="font-sans font-extrabold text-2xl text-[#006b2c] dark:text-[#7ffc97]">
                    {ownerProfile?.trust_score || 98}<span className="text-xs text-[#6e7b6c] dark:text-[#829281] font-normal">/100</span>
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[#6e7b6c] dark:text-[#829281] font-bold uppercase tracking-wider">Total Sewa</p>
                  <p className="font-sans font-extrabold text-2xl text-[#171d16] dark:text-[#dde5d9]">
                    {ownerProfile?.total_rentals || '1.2k+'}
                  </p>
                </div>
              </div>

              {/* Chat Button inside Web app */}
              {user.isLoggedIn && !(user.email && user.email.toLowerCase().startsWith('admin') && user.email.toLowerCase().endsWith('@sewarion.com')) && (
                <button
                  onClick={() => setChatOpen(true)}
                  className="bg-[#006b2c] hover:bg-[#00873a] text-white px-5 py-2.5 rounded-full font-sans text-xs font-bold transition-all active:scale-95 shadow-sm flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Chat Layanan Sewarion
                </button>
              )}
            </div>
          </section>
        </div>

        {/* Right Sticky Booking Box */}
        <aside className="lg:col-span-4 sticky top-28 space-y-4 text-left">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#151c14] border border-[#bdcaba]/40 dark:border-[#2f3d2d] shadow-xl shadow-[#171d16]/5 dark:shadow-none">
            <div className="mb-6">
              <p className="text-xs text-[#6e7b6c] dark:text-[#829281] font-medium">Harga Sewa</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-sans font-extrabold text-3xl text-[#006b2c] dark:text-[#7ffc97]">
                  Rp {originalPrice.toLocaleString('id-ID')}
                </span>
                <span className="text-[#6e7b6c] dark:text-[#829281] text-xs font-medium">/ hari</span>
              </div>
            </div>

            {/* Date Picker Component */}
            <div className="space-y-4 mb-6">
              <DateRangePicker
                bookedRanges={getBookedDatesForProduct(currentProduct.id)}
                onSelect={handleDateSelect}
                initialStart={startDateObj}
                initialEnd={endDateObj}
              />

              {/* Live Calculator breakdown */}
              {totalDays > 0 ? (
                <div className="p-4 rounded-xl bg-[#eff6ea]/50 dark:bg-[#1a2318]/30 border border-[#bdcaba]/30 dark:border-[#2f3d2d]/30 space-y-2.5 animate-in fade-in duration-350">
                  <div className="flex justify-between text-xs text-[#3e4a3d] dark:text-[#b4c3b2] font-medium">
                    <span>{totalDays} hari x Rp {originalPrice.toLocaleString('id-ID')}</span>
                    <span>Rp {grossRentPrice.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#3e4a3d] dark:text-[#b4c3b2] font-medium">
                    <span>Jaminan Sewa Tanpa Deposit</span>
                    <span className="text-[#006b2c] dark:text-[#7ffc97] font-bold">Gratis</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#3e4a3d] dark:text-[#b4c3b2] font-medium">
                    <span>Biaya Administrasi (2.5%)</span>
                    <span>Rp {serviceFee.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="pt-2 border-t border-[#bdcaba]/50 dark:border-[#2f3d2d]/50 flex justify-between items-center">
                    <span className="text-xs font-extrabold text-[#171d16] dark:text-[#dde5d9]">Total Pembayaran</span>
                    <span className="text-sm font-extrabold text-[#006b2c] dark:text-[#7ffc97]">
                      Rp {totalPayment.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#1d271b] border border-dashed border-[#bdcaba] dark:border-[#2f3d2d]/55 text-center text-xs text-[#829281]">
                  Silakan pilih tanggal sewa pada kalender di atas untuk memuat rincian kalkulasi harga.
                </div>
              )}
            </div>

            {user.isLoggedIn ? (
              <button
                onClick={handleBookNow}
                disabled={totalDays === 0}
                className={`block w-full py-4 rounded-full font-sans text-sm font-bold text-center shadow-md transition-all ${
                  totalDays > 0
                    ? 'bg-[#006b2c] hover:bg-[#00873a] text-white cursor-pointer active:scale-[0.98]'
                    : 'bg-[#6e7b6c]/20 dark:bg-[#6e7b6c]/10 text-[#6e7b6c]/50 dark:text-[#6e7b6c]/30 cursor-not-allowed'
                }`}
              >
                Sewa Sekarang
              </button>
            ) : (
              <button
                onClick={() => navigate({ type: 'login' })}
                className="block w-full py-4 rounded-full bg-[#006b2c] hover:bg-[#00873a] text-white font-sans text-sm font-bold text-center active:scale-[0.98] transition-transform"
              >
                Login untuk Menyewa
              </button>
            )}

            <p className="text-center mt-3 text-[10px] text-[#6e7b6c] dark:text-[#829281] flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#006b2c] dark:text-[#7ffc97]" />
              Pembayaran Aman & Terlindungi Sewarion Trust
            </p>
          </div>

          {/* Rental Tips */}
          <div className="p-5 rounded-2xl bg-[#006b2c]/10 dark:bg-[#006b2c]/15 border border-[#006b2c]/20 dark:border-[#006b2c]/30 space-y-4">
            <div>
              <h4 className="font-sans text-xs font-bold text-[#006b2c] dark:text-[#7ffc97] mb-2 uppercase tracking-wide">Tips Penyewa</h4>
              <ul className="space-y-2 text-[11px] text-[#3e4a3d] dark:text-[#b4c3b2] leading-relaxed">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#006b2c] dark:text-[#7ffc97] flex-shrink-0 mt-0.5" />
                  <span>Selalu periksa kelengkapan fisik & sensor saat serah terima barang sewa.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#006b2c] dark:text-[#7ffc97] flex-shrink-0 mt-0.5" />
                  <span>Simpan di tempat yang kering dan hindari paparan kelembaban tinggi.</span>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t border-[#006b2c]/20 dark:border-[#006b2c]/30">
              <h4 className="font-sans text-xs font-bold text-red-600 dark:text-red-400 mb-2 uppercase tracking-wide">Kebijakan Keterlambatan</h4>
              <p className="text-[10px] text-[#3e4a3d] dark:text-[#b4c3b2] leading-relaxed">
                Pengembalian barang di luar masa tenggang <strong>2 jam</strong> dari batas waktu kontrak akan dikenakan denda keterlambatan sebesar <strong>10% dari tarif harian per jam</strong>.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Recommended gear add-ons */}
      <section className="mt-20 text-left">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-sans font-bold text-xl text-[#171d16] dark:text-[#dde5d9] tracking-tight">Peralatan Pendukung</h2>
            <p className="text-xs text-[#6e7b6c] dark:text-[#829281]">Sering disewa bersama dengan barang pilihan Anda ini</p>
          </div>
          <button
            onClick={() => alert('Sistem rekomendasi dinamis akan memuat lebih banyak item dalam rilis penuh.')}
            className="text-[#006b2c] dark:text-[#7ffc97] font-bold text-xs flex items-center gap-1 focus:outline-none"
          >
            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {ACCESSORIES_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => alert(`Aksesoris "${item.name}" ditambahkan sebagai pelengkap!`)}
              className="group cursor-pointer flex flex-col"
            >
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-white dark:bg-[#151c14] border border-[#bdcaba]/30 dark:border-[#2f3d2d] shadow-sm mb-3 relative group">
                <img
                  src={item.image}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={item.name}
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-[#006b2c] dark:bg-[#006b2c] text-white text-[9px] font-bold py-1 px-2.5 rounded-full shadow-sm">
                    + Sewa Bersama
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-[#6e7b6c] dark:text-[#829281] font-bold uppercase tracking-wider">{item.category}</span>
              <h4 className="font-sans font-bold text-sm text-[#171d16] dark:text-[#dde5d9] line-clamp-1 group-hover:text-[#006b2c] dark:group-hover:text-[#7ffc97] transition-colors mt-0.5">
                {item.name}
              </h4>
              <p className="font-sans text-xs font-bold text-[#006b2c] dark:text-[#7ffc97] mt-1">
                Rp {item.price.toLocaleString('id-ID')}<span className="text-xs text-[#6e7b6c] dark:text-[#829281] font-normal"> / hari</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Real-time Message Chat Drawer */}
      {user.isLoggedIn && (
        <ChatDrawer
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          currentUserEmail={user.email}
          otherUserEmail="admin@sewarion.com"
          otherUserName="Admin Sewarion (Layanan & Pengiriman)"
        />
      )}
    </div>
  );
}
