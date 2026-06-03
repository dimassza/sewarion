import React, { useState, useMemo } from 'react';
import { Search, MapPin, Sparkles, SlidersHorizontal, ArrowUpDown, X, Tag, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AppContextType, Product } from '../types';
import { INDONESIAN_PROVINCES } from '../data/regions';

interface HomeViewProps {
  appCtx: AppContextType;
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'newest';

// Category Fallback Images for Catalog Carousel Preview
const CATEGORY_CAROUSEL_IMAGES: Record<string, string[]> = {
  'Fotografi': [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=600&auto=format&fit=crop&q=80'
  ],
  'Elektronik': [
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&auto=format&fit=crop&q=80'
  ],
  'Peralatan Camping': [
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1478131148053-7667689d3119?w=600&auto=format&fit=crop&q=80'
  ],
  'Gaming': [
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80'
  ],
  'Audio': [
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=80'
  ],
  'Fashion': [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80'
  ],
  'Kendaraan': [
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&auto=format&fit=crop&q=80'
  ],
  'Peralatan Lainnya': [
    'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530124560072-aae84ca2940e?w=600&auto=format&fit=crop&q=80'
  ]
};

interface ProductCardProps {
  p: Product;
  navigate: (view: any) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  formatPrice: (price: number) => string;
}

function ProductCard({ p, navigate, favorites, toggleFavorite, formatPrice }: ProductCardProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const displayImages = useMemo(() => {
    const base = p.images && p.images.length > 0 ? p.images : [p.image];
    if (base.length === 1) {
      const fallbacks = CATEGORY_CAROUSEL_IMAGES[p.category] || [];
      const list = [base[0]];
      fallbacks.forEach((fb) => {
        if (fb !== base[0] && list.length < 3) {
          list.push(fb);
        }
      });
      return list;
    }
    return base;
  }, [p]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div
      onClick={() => navigate({ type: 'product-detail', productId: p.id })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveIdx(0);
      }}
      className={`group rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
        p.isPromoted
          ? 'border-amber-400/80 shadow-[0_4px_16px_rgba(245,158,11,0.12)] bg-gradient-to-b from-amber-50/15 via-white to-white dark:from-[#2a2216] dark:via-[#162215]/80 dark:to-[#162215]/80 dark:border-amber-500/50 dark:shadow-[0_4px_20px_rgba(245,158,11,0.1)] hover:border-amber-500 hover:shadow-[0_6px_22px_rgba(245,158,11,0.2)] dark:hover:shadow-[0_6px_25px_rgba(245,158,11,0.25)]'
          : 'bg-white dark:bg-[#162215]/80 border-[#bdcaba]/35 dark:border-[#2b3a27] hover:shadow-xl hover:border-[#006b2c]/20 dark:hover:border-[#00873a]/30'
      }`}
    >
      {/* Product Media */}
      <div className="relative aspect-square overflow-hidden bg-[#eff6ea] dark:bg-[#0f140e]">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
          src={displayImages[activeIdx]}
          alt={p.name}
          loading="lazy"
        />

        {/* Carousel Overlay Navigation Controls */}
        {isHovered && displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/95 dark:bg-black/75 shadow-md text-[#171d16] dark:text-white flex items-center justify-center hover:bg-white dark:hover:bg-black transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/95 dark:bg-black/75 shadow-md text-[#171d16] dark:text-white flex items-center justify-center hover:bg-white dark:hover:bg-black transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
            {displayImages.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  activeIdx === idx ? 'bg-[#006b2c] dark:bg-[#7ffc97] scale-120' : 'bg-black/20 dark:bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {p.isAvailable && (
          <div className="absolute top-2 left-2 bg-[#006b2c] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
            Tersedia
          </div>
        )}
        {p.isPromoted && (
          <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5 tracking-wider uppercase z-10">
            ⭐ Sponsor
          </div>
        )}
        
        {/* Favorite Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(p.id);
          }}
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/95 dark:bg-[#151f14]/95 backdrop-blur-xs flex items-center justify-center shadow-md active:scale-90 transition-transform hover:bg-[#eff6ea] dark:hover:bg-[#1c2818]/60 border dark:border-[#2b3a27]"
        >
          <Heart className={`w-4 h-4 ${favorites.includes(p.id) ? 'fill-red-500 text-red-500' : 'text-[#6e7b6c] dark:text-[#dde5d9]'}`} />
        </button>

        {!p.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <span className="bg-white/90 dark:bg-[#151f14]/90 text-[#171d16] dark:text-[#dde5d9] text-xs font-bold px-3 py-1.5 rounded-full">
              Tidak Tersedia
            </span>
          </div>
        )}
      </div>

      {/* Info Block */}
      <div className="p-4 flex flex-col justify-between flex-grow text-left">
        <div>
          <span className="text-[10px] text-[#6e7b6c] dark:text-[#9bb098] font-bold uppercase tracking-wider">
            {p.category}
          </span>
          <h3 className="font-sans font-bold text-sm text-[#171d16] dark:text-[#dde5d9] line-clamp-1 group-hover:text-[#006b2c] dark:group-hover:text-[#7ffc97] transition-colors mt-0.5">
            {p.name}
          </h3>
        </div>

        {/* Pricing and Location */}
        <div className="mt-4 pt-3 border-t border-[#eff6ea] dark:border-[#2b3a27]/30">
          <p className="font-sans text-sm font-bold text-[#006b2c] dark:text-[#7ffc97]">
            {formatPrice(p.pricePerDay)}
            <span className="text-[#3e4a3d] dark:text-[#9bb098] text-xs font-normal">/hari</span>
          </p>
          <div className="flex items-center gap-1 mt-1 text-[#6e7b6c] dark:text-[#9bb098]">
            <MapPin className="w-3 h-3" />
            <span className="font-sans text-[11px] font-medium line-clamp-1">
              {p.locationDetail}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeView({ appCtx }: HomeViewProps) {
  const { products, navigate, user, favorites, toggleFavorite } = appCtx;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Semua');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Hero Image
  const heroImage =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD2twud52NiJEH8y4LoOwOvLTSz-UIJBupFGZt5Obg9noe4xQ5Kj9STf6W1xw3S6pFoBXWrMmVFO5vXM5g3tItCbz3imEiQf9phbtMNvYMTwNC0FNeTmFs2aRM0JnEmWKusGHMYnYo5UUD4aYvVu3xOpuVwYCAc9AvAP0YvV3YkceDX_2uxEqaHmZ0yV4JNa4d_alUVwqAjZ4jxn7HgfhI2VTH3-eocO_cQMwRQ-lb53RyP-ojEnO5MO2DCRjd1Ib4IWz-57JZoSuU';

  // Dynamically generate unique categories from products
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => cats.add(p.category));
    return ['Semua', ...Array.from(cats).sort()];
  }, [products]);

  // Powerful search: filter across name, category, description, location, locationDetail
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    let results = products.filter((p) => {
      // Search across multiple fields
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.description || '').toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.locationDetail.toLowerCase().includes(query);

      const matchesLocation = selectedLocation === 'Semua' || p.location === selectedLocation;
      const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;

      return matchesSearch && matchesLocation && matchesCategory;
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        results = [...results].sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case 'price-desc':
        results = [...results].sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case 'newest':
        results = [...results].reverse();
        break;
      default:
        // Default sort: Promoted / Sponsored listings first
        results = [...results].sort((a, b) => {
          const aProm = a.isPromoted ? 1 : 0;
          const bProm = b.isPromoted ? 1 : 0;
          return bProm - aProm;
        });
        break;
    }

    return results;
  }, [products, searchQuery, selectedLocation, selectedCategory, sortBy]);

  const hasActiveFilters = searchQuery || selectedLocation !== 'Semua' || selectedCategory !== 'Semua';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('Semua');
    setSelectedCategory('Semua');
    setSortBy('default');
  };

  // Handle search submit — scroll to catalog
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = document.getElementById('catalog-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCtaClick = () => {
    if (user.isLoggedIn && user.isKycVerified) {
      navigate({ type: 'mulai-menyewakan' });
    } else if (user.isLoggedIn) {
      navigate({ type: 'kyc' });
    } else {
      navigate({ type: 'login' });
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `Rp ${(price / 1000).toLocaleString('id-ID')}rb`;
    }
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full px-4 md:px-10 pt-8 pb-16 overflow-hidden max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 z-10 flex flex-col gap-5 justify-center text-left">
            <div className="inline-flex items-center gap-2 bg-[#006b2c]/10 dark:bg-[#006b2c]/20 text-[#006b2c] dark:text-[#7ffc97] py-1.5 px-3.5 rounded-full text-xs font-semibold self-start shadow-sm border border-[#006b2c]/10 dark:border-[#2b3a27]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sewa Tanpa Jaminan Deposit</span>
            </div>
            <h1 className="font-sans font-bold text-4xl lg:text-5xl text-[#171d16] dark:text-[#dde5d9] leading-tight tracking-tight">
              Sewa Apa Saja,<br className="hidden md:inline" /> Jadi Lebih Mudah.
            </h1>
            <p className="font-sans text-base text-[#3e4a3d] dark:text-[#9bb098] max-w-[90%] leading-relaxed">
              Nikmati platform rental P2P modern pertama tanpa deposit tunai. Dari gir kamera
              profesional hingga gadget harian terupdate, semua tersedia dalam satu genggaman.
            </p>
          </div>

          {/* Hero Right Media */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[4/5] md:max-h-[480px] w-full shadow-2xl relative group bg-[#dde5d9] dark:bg-[#1a2517]">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                src={heroImage}
                alt="SEWARION Premium Gear Showcase"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Abstract design blobs */}
        <div className="absolute -top-10 -right-20 w-80 h-80 bg-[#7ffc97] opacity-20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-20 w-60 h-60 bg-[#ffd9de] opacity-15 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Floating Search Form */}
      <section className="px-4 md:px-10 -mt-10 relative z-20 max-w-7xl mx-auto">
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white/90 dark:bg-[#131b11]/90 backdrop-blur-md p-6 rounded-3xl shadow-xl shadow-[#171d16]/5 border border-[#bdcaba]/40 dark:border-[#2b3a27] flex flex-col gap-4 max-w-4xl mx-auto"
        >
          {/* Main Search Input */}
          <div className="flex items-center gap-3 bg-[#eff6ea] dark:bg-[#0f140e] px-4 py-3 rounded-2xl border border-[#bdcaba] dark:border-[#2b3a27] focus-within:border-[#006b2c] dark:focus-within:border-[#00873a] focus-within:ring-1 focus-within:ring-[#006b2c] transition-all">
            <Search className="text-[#6e7b6c] dark:text-[#9bb098] w-5 h-5 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none focus:ring-0 w-full font-sans text-sm text-[#171d16] dark:text-[#dde5d9] placeholder-[#6e7b6c] dark:placeholder-[#9bb098]/60"
              placeholder="Cari kamera, laptop, drone, tenda..."
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#6e7b6c] dark:text-[#9bb098] hover:text-[#171d16] dark:hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location Filter */}
            <div className="flex items-center gap-3 bg-[#eff6ea] dark:bg-[#0f140e] px-4 py-3 rounded-2xl border border-[#bdcaba] dark:border-[#2b3a27] focus-within:border-[#006b2c] dark:focus-within:border-[#00873a] transition-all">
              <MapPin className="text-[#6e7b6c] dark:text-[#9bb098] w-5 h-5 flex-shrink-0" />
              <div className="w-full flex flex-col text-left">
                <span className="text-[10px] text-[#6e7b6c] dark:text-[#9bb098] font-bold uppercase tracking-wider">
                  Kota / Wilayah
                </span>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-transparent border-none p-0 outline-none focus:ring-0 w-full font-sans text-sm font-semibold text-[#171d16] dark:text-[#dde5d9] cursor-pointer"
                >
                  <option value="Semua" className="dark:bg-[#151f14]">Semua Kota</option>
                  {INDONESIAN_PROVINCES.map((prov) => (
                    <optgroup key={prov.id} label={prov.name} className="text-xs font-bold text-[#006b2c] dark:text-[#7ffc97] bg-[#eff6ea] dark:bg-[#151f14]">
                      {prov.cities.map((city) => (
                        <option key={city} value={city} className="text-sm font-medium text-[#171d16] dark:text-[#dde5d9] bg-white dark:bg-[#151f14]">
                          {city}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            {/* Kategori Input Dropdown */}
            <div className="flex items-center gap-3 bg-[#eff6ea] dark:bg-[#0f140e] px-4 py-3 rounded-2xl border border-[#bdcaba] dark:border-[#2b3a27] focus-within:border-[#006b2c] dark:focus-within:border-[#00873a] transition-all">
              <Tag className="text-[#6e7b6c] dark:text-[#9bb098] w-5 h-5 flex-shrink-0" />
              <div className="w-full flex flex-col text-left">
                <span className="text-[10px] text-[#6e7b6c] dark:text-[#9bb098] font-bold uppercase tracking-wider">
                  Kategori Barang
                </span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent border-none p-0 outline-none focus:ring-0 w-full font-sans text-sm font-semibold text-[#171d16] dark:text-[#dde5d9] cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="dark:bg-[#151f14]">
                      {cat === 'Semua' ? 'Semua Kategori' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#006b2c] hover:bg-[#00873a] text-white font-sans text-sm font-bold py-4 rounded-2xl transition-all active:scale-[0.99] shadow-lg shadow-[#006b2c]/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Cek Ketersediaan Barang</span>
          </button>
        </form>
      </section>

      {/* Catalog & Filter Grid */}
      <section id="catalog-section" className="px-4 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 text-left">
          <div>
            <h2 className="font-sans font-bold text-2xl text-[#171d16] dark:text-[#dde5d9] tracking-tight">
              Terpopuler
            </h2>
            <p className="font-sans text-xs text-[#3e4a3d] dark:text-[#9bb098] mt-1">
              {hasActiveFilters ? (
                <span className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3 h-3" />
                  Menampilkan {filteredProducts.length} dari {products.length} barang
                </span>
              ) : (
                'Kategori sewa terfavorit pilihan kontributor minggu ini.'
              )}
            </p>
          </div>

          {/* Category Pills + Sort */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full md:w-auto">
            {/* Sort Dropdown */}
            <div className="relative">
              <div className="flex items-center gap-1.5 bg-white dark:bg-[#151f14] border border-[#bdcaba] dark:border-[#2b3a27] rounded-full px-3 py-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#6e7b6c] dark:text-[#9bb098]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent border-none outline-none focus:ring-0 font-sans text-xs font-semibold text-[#3e4a3d] dark:text-[#dde5d9] pr-2 cursor-pointer"
                >
                  <option value="default" className="dark:bg-[#151f14]">Urutkan</option>
                  <option value="price-asc" className="dark:bg-[#151f14]">Harga Terendah</option>
                  <option value="price-desc" className="dark:bg-[#151f14]">Harga Tertinggi</option>
                  <option value="newest" className="dark:bg-[#151f14]">Terbaru</option>
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-1.5 px-4 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#006b2c] dark:bg-[#00873a] text-white border-[#006b2c] dark:border-[#00873a] shadow-sm'
                      : 'bg-white dark:bg-[#151f14] text-[#3e4a3d] dark:text-[#dde5d9] border-[#bdcaba] dark:border-[#2b3a27] hover:bg-[#eff6ea] dark:hover:bg-[#1c2818]/60'
                  }`}
                >
                  {cat === 'Semua' ? 'Semua' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 bg-[#eff6ea] dark:bg-[#1c2818]/40 text-[#3e4a3d] dark:text-[#dde5d9] text-xs font-medium px-3 py-1.5 rounded-full border border-[#bdcaba]/40 dark:border-[#2b3a27]/40">
                Pencarian: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#6e7b6c] dark:text-[#9bb098] hover:text-[#171d16] dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedLocation !== 'Semua' && (
              <span className="inline-flex items-center gap-1.5 bg-[#eff6ea] dark:bg-[#1c2818]/40 text-[#3e4a3d] dark:text-[#dde5d9] text-xs font-medium px-3 py-1.5 rounded-full border border-[#bdcaba]/40 dark:border-[#2b3a27]/40">
                Lokasi: {selectedLocation}
                <button
                  onClick={() => setSelectedLocation('Semua')}
                  className="text-[#6e7b6c] dark:text-[#9bb098] hover:text-[#171d16] dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory !== 'Semua' && (
              <span className="inline-flex items-center gap-1.5 bg-[#eff6ea] dark:bg-[#1c2818]/40 text-[#3e4a3d] dark:text-[#dde5d9] text-xs font-medium px-3 py-1.5 rounded-full border border-[#bdcaba]/40 dark:border-[#2b3a27]/40">
                Kategori: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('Semua')}
                  className="text-[#6e7b6c] dark:text-[#9bb098] hover:text-[#171d16] dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-[#006b2c] dark:text-[#7ffc97] text-xs font-bold hover:underline focus:outline-none ml-1 cursor-pointer"
            >
              Reset Semua
            </button>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                p={p}
                navigate={navigate}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#eff6ea]/55 dark:bg-[#141b12] rounded-3xl p-12 border border-[#bdcaba]/30 dark:border-[#2b3a27]/30 text-center max-w-xl mx-auto animate-slide-up">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#eff6ea] dark:bg-[#1c2818]/40 flex items-center justify-center">
              <Search className="w-7 h-7 text-[#6e7b6c] dark:text-[#9bb098]" />
            </div>
            <h3 className="font-sans text-base font-bold text-[#171d16] dark:text-[#dde5d9] mb-2">
              Tidak ada hasil ditemukan
            </h3>
            <p className="font-sans text-sm text-[#3e4a3d] dark:text-[#9bb098] mb-5">
              Coba ubah kata kunci pencarian, lokasi, atau kategori filter Anda.
            </p>
            <button
              onClick={resetFilters}
              className="bg-[#006b2c] dark:bg-[#00873a] text-white font-sans text-xs font-bold px-6 py-3 rounded-full hover:bg-[#00873a] transition-colors shadow-md shadow-[#006b2c]/10 active:scale-95 cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-10 py-8 max-w-7xl mx-auto">
        <div className="bg-[#00873a] dark:bg-[#0f140e] dark:border dark:border-[#2b3a27] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="font-sans font-bold text-2xl md:text-3xl tracking-tight leading-tight mb-3">
              Punya barang nganggur?
            </h2>
            <p className="font-sans text-sm text-[#f7fff2]/90 dark:text-[#9bb098] leading-relaxed mb-6">
              Dapatkan penghasilan tambahan pasif dengan menyewakan barang-barang berkualitasmu
              yang sedang tidak terpakai secara aman dan bergaransi di SEWARION.
            </p>
            <button
              onClick={handleCtaClick}
              className="bg-white dark:bg-emerald-50 text-[#006b2c] dark:text-[#0f140e] font-sans text-xs font-bold px-8 py-3.5 rounded-full hover:bg-[#f7fff2] dark:hover:bg-emerald-100 transition-colors uppercase tracking-wider active:scale-95 cursor-pointer"
            >
              Mulai Menyewakan
            </button>
          </div>
          <div className="relative z-10 w-full max-w-xs md:max-w-xs aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-[#f7fff2]/15 bg-white/5 backdrop-blur-sm self-center justify-center p-4">
            <div className="text-left space-y-4">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#7ffc97] animate-pulse"></div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#62df7d] dark:text-[#7ffc97]">
                  Sewa Aman Terlindungi
                </span>
              </div>
              <div className="space-y-3 font-sans text-xs text-[#f7fff2]/95 dark:text-[#dde5d9]/90 leading-relaxed">
                <p>✓ Gratis biaya asuransi barang sewa</p>
                <p>✓ Verifikasi KTP & biometric pencocokan digital</p>
                <p>✓ Kontrak hukum digital mengikat sah</p>
              </div>
            </div>
          </div>

          {/* Overlay glow circles */}
          <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-10 -left-10 w-56 h-56 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
