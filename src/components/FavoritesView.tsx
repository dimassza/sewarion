import React from 'react';
import { Heart, Star, MapPin, Trash2, ArrowRight } from 'lucide-react';
import type { AppContextType } from '../types';

interface FavoritesViewProps {
  appCtx: AppContextType;
}

export default function FavoritesView({ appCtx }: FavoritesViewProps) {
  const { favorites, toggleFavorite, products, navigate } = appCtx;

  // Filter products that are in the favorites list
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-10 py-12 flex-grow">
      {/* Title Header */}
      <section className="text-left mb-10 border-b border-[#bdcaba]/30 dark:border-[#2f3d2d]/30 pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-sans font-extrabold text-2xl md:text-3xl text-[#171d16] dark:text-[#dde5d9]">
            Barang Terfavorit
          </h1>
          <p className="font-sans text-xs text-[#6e7b6c] dark:text-[#829281] mt-1.5">
            Daftar barang sewaan pilihan Anda untuk dipertimbangkan nanti
          </p>
        </div>
        <span className="bg-[#eff6ea] dark:bg-[#1a2318] text-[#006b2c] dark:text-[#7ffc97] text-xs font-bold px-3 py-1.5 rounded-full border border-[#bdcaba]/20 dark:border-[#2f3d2d]/20 shadow-xs">
          {favoriteProducts.length} Barang
        </span>
      </section>

      {/* Grid List */}
      {favoriteProducts.length === 0 ? (
        /* Clean and Premium Empty State */
        <div className="bg-white dark:bg-[#151c14] rounded-3xl p-12 md:p-16 border border-[#bdcaba]/35 dark:border-[#2f3d2d]/35 shadow-xl shadow-[#171d16]/3 dark:shadow-none max-w-md mx-auto text-center flex flex-col items-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-[#ffd9de]/30 dark:bg-[#2d120f]/50 text-[#a72d51] dark:text-[#ff7f7f] rounded-full flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 fill-[#a72d51]/20 dark:fill-[#ff7f7f]/20" />
          </div>
          <h3 className="font-sans font-bold text-lg text-[#171d16] dark:text-[#dde5d9] mb-2">Belum Ada Barang Favorit</h3>
          <p className="font-sans text-xs text-[#6e7b6c] dark:text-[#829281] leading-relaxed mb-8">
            Jelajahi katalog lengkap Sewarion, temukan perlengkapan kamera, camping, atau gaming terbaik Anda, dan ketuk tombol hati untuk menambahkannya ke sini.
          </p>
          <button
            onClick={() => navigate({ type: 'home' })}
            className="bg-[#006b2c] hover:bg-[#00873a] text-white py-3.5 px-8 rounded-full font-sans text-xs font-bold w-full active:scale-95 transition-transform flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <span>Mulai Cari Barang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white dark:bg-[#151c14] rounded-2xl border border-[#bdcaba]/30 dark:border-[#2f3d2d]/30 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col relative"
            >
              {/* Product Image Card */}
              <div 
                onClick={() => navigate({ type: 'product-detail', productId: product.id })}
                className="aspect-[4/3] w-full overflow-hidden bg-gray-50 dark:bg-[#1a2318] cursor-pointer relative"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                
                {/* Remove Favorite Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent navigating to details
                    toggleFavorite(product.id);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 dark:bg-[#151c14]/95 backdrop-blur-xs flex items-center justify-center text-red-500 shadow-md active:scale-90 transition-transform hover:bg-red-50 dark:hover:bg-[#1a2318]"
                  title="Hapus dari Favorit"
                >
                  <Heart className="w-4 h-4 fill-red-500" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-grow flex flex-col justify-between items-start text-left">
                <div className="w-full">
                  <span className="text-[9px] text-[#6e7b6c] dark:text-[#829281] font-bold uppercase tracking-wider block">
                    {product.category}
                  </span>
                  <h3
                    onClick={() => navigate({ type: 'product-detail', productId: product.id })}
                    className="font-sans font-bold text-sm text-[#171d16] dark:text-[#dde5d9] mt-1 line-clamp-1 cursor-pointer group-hover:text-[#006b2c] dark:group-hover:text-[#7ffc97] transition-colors"
                  >
                    {product.name}
                  </h3>
                  
                  {/* Rating & City Location */}
                  <div className="flex items-center gap-x-2 mt-2 text-[10px] font-semibold text-[#6e7b6c] dark:text-[#829281]">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="text-[#171d16] dark:text-[#dde5d9]">4.9</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#6e7b6c] dark:text-[#829281]" />
                      <span>{product.location}</span>
                    </div>
                  </div>
                </div>

                {/* Price tag & CTA */}
                <div className="w-full border-t border-[#eff6ea] dark:border-[#1a2318] mt-4 pt-3 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] text-[#829281] block">Harga Sewa</span>
                    <span className="font-sans font-bold text-xs text-[#006b2c] dark:text-[#7ffc97]">
                      Rp {product.pricePerDay.toLocaleString('id-ID')}
                      <span className="text-[9px] text-[#6e7b6c] dark:text-[#829281] font-normal"> / hari</span>
                    </span>
                  </div>
                  <button
                    onClick={() => navigate({ type: 'product-detail', productId: product.id })}
                    className="bg-[#006b2c]/10 dark:bg-[#7ffc97]/10 text-[#006b2c] dark:text-[#7ffc97] hover:bg-[#006b2c] dark:hover:bg-[#006b2c] hover:text-white dark:hover:text-white px-3 py-1.5 rounded-lg font-sans text-[10px] font-bold transition-all cursor-pointer"
                  >
                    Sewa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
