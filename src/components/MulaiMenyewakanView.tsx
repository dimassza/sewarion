import React, { useState, useRef } from 'react';
import { Sparkles, ArchiveRestore, CheckCircle2, CloudUpload, X, Image as ImageIcon, Wallet, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import type { AppContextType, Product } from '../types';
import { INDONESIAN_PROVINCES } from '../data/regions';

interface MulaiMenyewakanProps {
  appCtx: AppContextType;
}

export default function MulaiMenyewakanView({ appCtx }: MulaiMenyewakanProps) {
  const { products, setProducts, navigate, user } = appCtx;
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Fotografi');
  const [pricePerDay, setPricePerDay] = useState('');
  
  // Province & City Selection States
  const [selectedProvinceId, setSelectedProvinceId] = useState('dki'); // Default to DKI Jakarta
  const [location, setLocation] = useState('Jakarta Barat'); // Default to Jakarta Barat
  
  const [locationDetail, setLocationDetail] = useState('');
  const [description, setDescription] = useState('');
  const [specInput, setSpecInput] = useState('');
  const [specs, setSpecs] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isPromoted, setIsPromoted] = useState(false);
  const [sponsorPackage, setSponsorPackage] = useState<'kilat' | 'harian' | 'mingguan'>('harian');
  const [sponsorPaymentMethod, setSponsorPaymentMethod] = useState<'wallet' | 'qris'>('qris');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const categories = ['Fotografi', 'Elektronik', 'Peralatan Camping', 'Gaming', 'Audio', 'Fashion', 'Kendaraan', 'Peralatan Lainnya'];

  const isDemoOwner = user.email === 'pemilik123@gmail.com';
  const withdrawableBalance = isDemoOwner ? 850000 : 0;

  const getPackagePrice = (pkg: 'kilat' | 'harian' | 'mingguan') => {
    if (pkg === 'kilat') return 1500;
    if (pkg === 'mingguan') return 15000;
    return 3000;
  };

  const selectedProvince = INDONESIAN_PROVINCES.find(p => p.id === selectedProvinceId) || INDONESIAN_PROVINCES[10];
  const citiesOfProvince = selectedProvince.cities;

  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvinceId(provinceId);
    const prov = INDONESIAN_PROVINCES.find(p => p.id === provinceId);
    if (prov && prov.cities.length > 0) {
      setLocation(prov.cities[0]);
    }
  };

  // Auth Guard
  if (!user.isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-[#151c14] border border-[#bdcaba] dark:border-[#2f3d2d] rounded-3xl text-center shadow-lg font-sans">
        <div className="w-16 h-16 bg-[#fdf0ee] dark:bg-[#2d120f] border border-[#f9c7c2] dark:border-[#540f0c] rounded-full flex items-center justify-center text-[#d6453d] dark:text-[#ff7f7f] mx-auto mb-4">
          <X className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-[#171d16] dark:text-[#dde5d9] mb-3">Akses Ditolak</h2>
        <p className="text-xs text-[#546253] dark:text-[#829281] mb-6 leading-relaxed">
          Anda perlu masuk (login) ke akun Sewarion Anda terlebih dahulu untuk dapat mendaftarkan barang sewaan.
        </p>
        <button
          onClick={() => navigate({ type: 'login' })}
          className="bg-[#006b2c] hover:bg-[#00873a] text-white px-8 py-3 rounded-full text-xs font-bold transition-transform active:scale-95 shadow-md cursor-pointer"
        >
          Masuk Sekarang
        </button>
      </div>
    );
  }

  // KYC Guard
  if (!user.isKycVerified) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-[#151c14] border border-[#bdcaba] dark:border-[#2f3d2d] rounded-3xl text-center shadow-lg font-sans">
        <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400 mx-auto mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-[#171d16] dark:text-[#dde5d9] mb-3">Verifikasi KYC Diperlukan</h2>
        <p className="text-xs text-[#546253] dark:text-[#829281] mb-6 leading-relaxed">
          Anda harus menyelesaikan verifikasi identitas (KYC) terlebih dahulu sebelum mendaftarkan barang sewaan. Hal ini penting untuk menjaga rasa percaya antarpengguna Sewarion.
        </p>
        <button
          onClick={() => navigate({ type: 'kyc' })}
          className="bg-[#006b2c] hover:bg-[#00873a] text-white px-8 py-3 rounded-full text-xs font-bold transition-transform active:scale-95 shadow-md cursor-pointer"
        >
          Verifikasi Sekarang
        </button>
      </div>
    );
  }

  const handleAddSpec = () => {
    if (specInput.trim()) {
      setSpecs([...specs, specInput.trim()]);
      setSpecInput('');
    }
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const processFiles = (files: File[]) => {
    const remainingSlots = 4 - uploadedImages.length;
    if (files.length === 0) return;

    if (files.length > remainingSlots) {
      alert(`Batas maksimal adalah 4 foto. Anda hanya dapat menambahkan ${remainingSlots} foto lagi.`);
    }

    const filesToProcess = files.slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert(`File "${file.name}" bukan gambar yang valid!`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" melebihi batas ukuran 5MB!`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    processFiles(files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragover" || e.type === "dragenter") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files) as File[]);
    }
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !pricePerDay || !locationDetail.trim() || !description.trim()) {
      alert('Semua kolom wajib diisi!');
      return;
    }

    if (uploadedImages.length === 0) {
      alert('Mohon unggah minimal 1 foto barang sewaan!');
      return;
    }

    const price = parseInt(pricePerDay);
    if (isNaN(price) || price <= 0) {
      alert('Harga sewa harus berupa angka positif!');
      return;
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: name.trim(),
      category,
      pricePerDay: price,
      location,
      locationDetail: locationDetail.trim(),
      isAvailable: true,
      ownerId: user.email,
      image: uploadedImages[0],
      images: uploadedImages,
      description: description.trim(),
      specs: specs.length > 0 ? specs : ['Model Terbaru', 'Kondisi Prima', 'Kelengkapan Standar'],
      isPromoted
    };

    if (isPromoted) {
      setIsSubmitting(true);
      setTimeout(() => {
        setProducts([newProduct, ...products]);
        setIsSubmitting(false);
        alert(`Sukses! Barang sewa "${name}" berhasil didaftarkan dan dipromosikan (Sponsor Ads) dengan paket ${
          sponsorPackage === 'kilat' ? '6 Jam' : sponsorPackage === 'harian' ? '1 Hari' : '7 Hari'
        }!`);
        navigate({ type: 'home' });
      }, 2000);
    } else {
      setProducts([newProduct, ...products]);
      alert(`Sukses! Barang sewa "${name}" berhasil didaftarkan ke Sewarion.`);
      navigate({ type: 'home' });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-10 py-12 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left column explanation & stats */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="bg-[#eff6ea] dark:bg-[#1a2318] p-8 rounded-3xl border border-[#bdcaba]/40 dark:border-[#2f3d2d]/45">
            <span className="bg-[#006b2c]/10 dark:bg-[#7ffc97]/10 text-[#006b2c] dark:text-[#7ffc97] py-1 px-3.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 inline-block">
              Mitra Sewarion
            </span>
            <h1 className="font-sans font-black text-2xl lg:text-3xl text-[#171d16] dark:text-[#dde5d9] leading-tight mb-4">
              Ubah Aset Kamumu Menjadi Penghasilan
            </h1>
            <p className="font-sans text-xs text-[#3e4a3d] dark:text-[#b4c3b2] leading-relaxed mb-6">
              Mulai sewakan barang Anda kepada mahasiswa dan warga sekitar area terdekat dengan jaminan sistem asuransi kehilangan Sewarion.
            </p>

            <div className="space-y-4 font-sans text-xs text-[#3e4a3d] dark:text-[#b4c3b2]">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#006b2c] dark:text-[#7ffc97] flex-shrink-0" />
                <div>
                  <p className="font-bold text-[#171d16] dark:text-[#dde5d9]">Bebas Khawatir Kehilangan</p>
                  <p className="mt-0.5 text-[#6e7b6c] dark:text-[#829281]">Asuransi ganti rugi barang sewa gratis mencakup kerusakan & kehilangan akibat tindakan kriminal.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#006b2c] dark:text-[#7ffc97] flex-shrink-0" />
                <div>
                  <p className="font-bold text-[#171d16] dark:text-[#dde5d9]">Penyewa Terpercaya</p>
                  <p className="mt-0.5 text-[#6e7b6c] dark:text-[#829281]">Hanya pengguna terverifikasi KYC E-KTP biometrik yang diizinkan melakukan transaksi sewa.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-[#bdcaba]/30 dark:border-[#2f3d2d]/30 bg-white dark:bg-[#151c14]">
            <div className="flex gap-3 items-center">
              <ArchiveRestore className="text-[#006b2c] dark:text-[#7ffc97] w-6 h-6" />
              <h4 className="font-sans font-bold text-sm text-[#171d16] dark:text-[#dde5d9]">Statistik Pendapatan</h4>
            </div>
            <p className="text-xs text-[#6e7b6c] dark:text-[#829281] mt-1">Estimasi penghasilan rata-rata menyewakan kamera di area Binus mencapai Rp 2.500.000 / bulan.</p>
          </div>
        </div>

        {/* Right column Form */}
        <div className="lg:col-span-7 bg-white dark:bg-[#151c14] p-6 md:p-8 rounded-3xl border border-[#bdcaba]/35 dark:border-[#2f3d2d] shadow-xl shadow-[#171d16]/3 dark:shadow-none">
          <h2 className="font-sans font-bold text-xl text-[#171d16] dark:text-[#dde5d9] mb-6 text-left">Pendaftaran Barang Sewa</h2>
          
          <form onSubmit={handleListingSubmit} className="space-y-5 text-left">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">Nama Barang / Aset</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-11 px-4 font-sans text-sm text-[#171d16] dark:text-[#dde5d9] outline-none focus:border-[#006b2c] dark:focus:border-[#00873a]"
                placeholder="Contoh: Kamera Mirrorless Sony a6400 + Lens Kit"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">Kategori Barang</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-11 px-3 font-sans text-sm text-[#171d16] dark:text-[#dde5d9] outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="dark:bg-[#151c14]">{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price per Day */}
              <div className="space-y-1.5">
                <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">Harga Sewa / Hari (IDR)</label>
                <input
                  type="number"
                  value={pricePerDay}
                  onChange={(e) => setPricePerDay(e.target.value)}
                  className="w-full bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-11 px-4 font-sans text-sm text-[#171d16] dark:text-[#dde5d9] outline-none focus:border-[#006b2c] dark:focus:border-[#00873a]"
                  placeholder="Contoh: 150000"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">Provinsi</label>
                <select
                  value={selectedProvinceId}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-11 px-3 font-sans text-sm text-[#171d16] dark:text-[#dde5d9] outline-none"
                >
                  {INDONESIAN_PROVINCES.map((prov) => (
                    <option key={prov.id} value={prov.id} className="dark:bg-[#151c14]">{prov.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">Kota / Kabupaten</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-11 px-3 font-sans text-sm text-[#171d16] dark:text-[#dde5d9] outline-none"
                >
                  {citiesOfProvince.map((city) => (
                    <option key={city} value={city} className="dark:bg-[#151c14]">{city}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">Detail Alamat / Area</label>
                <input
                  type="text"
                  value={locationDetail}
                  onChange={(e) => setLocationDetail(e.target.value)}
                  className="w-full bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-11 px-4 font-sans text-sm text-[#171d16] dark:text-[#dde5d9] outline-none focus:border-[#006b2c] dark:focus:border-[#00873a]"
                  placeholder="Contoh: Depan Kampus Binus Anggrek"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">Deskripsi Kondisi & Ketentuan</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl p-4 font-sans text-sm text-[#171d16] dark:text-[#dde5d9] outline-none resize-none focus:border-[#006b2c] dark:focus:border-[#00873a]"
                placeholder="Tuliskan secara lengkap kondisi fisik barang Anda, kelengkapan item pendukung (charger, case), dan aturan khusus bagi penyewa."
                required
              />
            </div>

            {/* Technical Specifications */}
            <div className="space-y-1.5">
              <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">
                Spesifikasi Teknis (Opsional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={specInput}
                  onChange={(e) => setSpecInput(e.target.value)}
                  className="w-full bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-11 px-4 font-sans text-sm text-[#171d16] dark:text-[#dde5d9] outline-none focus:border-[#006b2c] dark:focus:border-[#00873a]"
                  placeholder="Contoh: Sensor CMOS 24.2 MP, Baterai cadangan 2 unit"
                />
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="bg-[#006b2c] hover:bg-[#00873a] text-white px-5 rounded-xl font-sans text-xs font-bold cursor-pointer"
                >
                  Tambah
                </button>
              </div>

              {specs.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {specs.map((sp, idx) => (
                    <li
                      key={idx}
                      className="bg-[#eff6ea] dark:bg-[#1a2318] text-[#006b2c] dark:text-[#7ffc97] text-xs font-semibold py-1 px-3 rounded-full border border-[#bdcaba] dark:border-[#2f3d2d] flex items-center gap-1.5 animate-in zoom-in duration-200"
                    >
                      <span>{sp}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(idx)}
                        className="text-red-500 font-bold hover:scale-110 focus:outline-none cursor-pointer"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Real multi-image upload grid */}
            <div className="space-y-2">
              <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">
                Unggah Foto Barang (Maks. 4 foto)
              </label>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
              />

              <div
                onDragOver={handleDrag}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => {
                  if (uploadedImages.length < 4) {
                    fileInputRef.current?.click();
                  }
                }}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 ${
                  uploadedImages.length >= 4
                    ? 'border-[#bdcaba] dark:border-[#2f3d2d] bg-gray-50/50 dark:bg-zinc-800/20 cursor-not-allowed'
                    : dragActive
                    ? 'border-[#006b2c] dark:border-[#00873a] bg-[#e4f3e6]/25 dark:bg-[#122818]/25'
                    : 'border-[#bdcaba] dark:border-[#2f3d2d] hover:border-[#006b2c] dark:hover:border-[#00873a] hover:bg-[#e4f3e6]/10 dark:hover:bg-[#122818]/10 cursor-pointer'
                }`}
              >
                <CloudUpload className="mx-auto w-8 h-8 text-[#6e7b6c] dark:text-[#829281] mb-2" />
                <p className="font-sans text-xs text-[#6e7b6c] dark:text-[#829281] font-semibold">
                  {uploadedImages.length >= 4 ? (
                    <span className="text-[#d6453d]">Kapasitas foto sudah penuh (4/4)</span>
                  ) : (
                    <>
                      Tarik berkas foto di sini atau <span className="text-[#006b2c] dark:text-[#7ffc97] font-bold">klik untuk mengunggah</span>
                    </>
                  )}
                </p>
                <p className="font-sans text-[10px] text-[#829281] mt-1">Format file: JPG, JPEG, PNG, WEBP (Maks 5MB per file)</p>
              </div>

              {/* Uploaded images preview grid */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  {uploadedImages.map((imgSrc, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-[#bdcaba] dark:border-[#2f3d2d] group animate-in zoom-in duration-200"
                    >
                      <img src={imgSrc} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <div className="absolute bottom-1.5 left-1.5 bg-[#006b2c] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                          Cover
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeUploadedImage(idx);
                        }}
                        className="absolute top-1.5 right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-transform active:scale-90"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Promosi / Sponsor Ads Section */}
            <div className="bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/35 rounded-3xl p-5 md:p-6 mt-6 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isPromoted}
                  onChange={(e) => setIsPromoted(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-amber-300 dark:border-amber-900 text-amber-500 focus:ring-amber-500 cursor-pointer"
                />
                <div className="text-left select-none flex-grow">
                  <span className="font-sans text-sm font-bold text-amber-900 dark:text-amber-200 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                    Sponsori Barang Ini (Sponsor Ads) ⭐
                  </span>
                  <p className="font-sans text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 leading-relaxed">
                    Sponsori barang sewa ini agar ditempatkan di bagian teratas hasil pencarian katalog dan beranda utama calon penyewa!
                  </p>
                </div>
              </label>

              {isPromoted && (
                <div className="space-y-4 pt-3 border-t border-amber-200/50 dark:border-amber-900/35 animate-in fade-in duration-300 text-left">
                  {/* Package Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase pl-0.5">Pilih Paket Promosi</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'kilat', label: '6 Jam', price: 1500, est: '+20 Klik' },
                        { id: 'harian', label: '1 Hari', price: 3000, est: '+50 Klik' },
                        { id: 'mingguan', label: '7 Hari', price: 15000, est: '+300 Klik' }
                      ].map((pkg) => (
                        <div
                          key={pkg.id}
                          onClick={() => {
                            setSponsorPackage(pkg.id as any);
                            const price = pkg.price;
                            if (sponsorPaymentMethod === 'wallet' && withdrawableBalance < price) {
                              setSponsorPaymentMethod('qris');
                            }
                          }}
                          className={`border rounded-2xl p-2.5 text-center cursor-pointer transition-all ${
                            sponsorPackage === pkg.id
                              ? 'border-amber-500 bg-amber-100/40 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 shadow-xs font-bold'
                              : 'border-amber-200/60 dark:border-amber-900/40 bg-white/50 dark:bg-[#151c14] hover:bg-white dark:hover:bg-[#1a2318] text-[#3e4a3d] dark:text-[#b4c3b2]'
                          }`}
                        >
                          <div className="text-[10.5px]">{pkg.label}</div>
                          <div className="text-xs font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">Rp {pkg.price.toLocaleString('id-ID')}</div>
                          <div className="text-[9px] text-[#6e7b6c] dark:text-[#829281] mt-0.5">{pkg.est}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Impact Estimate */}
                  <div className="bg-white/70 dark:bg-[#151c14]/70 border border-amber-200/60 dark:border-[#2f3d2d]/60 rounded-xl p-3 text-[11px] text-[#3e4a3d] dark:text-[#b4c3b2]">
                    <div className="flex items-center gap-1.5 font-bold text-[#006b2c] dark:text-[#7ffc97] mb-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Estimasi Dampak Algoritma</span>
                    </div>
                    <p className="text-[#6e7b6c] dark:text-[#829281] leading-relaxed">
                      Barang Anda akan diprioritaskan di pencarian dekat penyewa. Estimasi tayangan: {
                        sponsorPackage === 'kilat' ? '~150 tayangan' : sponsorPackage === 'harian' ? '~400 tayangan bertarget' : '~2,500 tayangan inter-regional'
                      }.
                    </p>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase pl-0.5">Metode Pembayaran Iklan</label>
                    <div className="space-y-2">
                      {/* Saldo Wallet */}
                      <div
                        onClick={() => {
                          if (withdrawableBalance >= getPackagePrice(sponsorPackage)) {
                            setSponsorPaymentMethod('wallet');
                          }
                        }}
                        className={`flex items-center justify-between border rounded-xl p-2.5 cursor-pointer transition-all ${
                          withdrawableBalance < getPackagePrice(sponsorPackage)
                            ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-zinc-800/40 border-amber-200/20 dark:border-amber-900/10'
                            : sponsorPaymentMethod === 'wallet'
                            ? 'border-[#006b2c] dark:border-[#00873a] bg-white dark:bg-[#1a2318]'
                            : 'border-amber-200/60 dark:border-[#2f3d2d] bg-white/50 dark:bg-[#151c14] hover:bg-white dark:hover:bg-[#1a2318]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Wallet className="w-3.5 h-3.5 text-[#006b2c] dark:text-[#7ffc97]" />
                          <div className="text-[11px] dark:text-[#b4c3b2]">
                            <span className="font-bold text-[#171d16] dark:text-[#dde5d9]">Saldo Sewarion </span>
                            <span className="text-[#6e7b6c] dark:text-[#829281]">(Sisa: Rp {withdrawableBalance.toLocaleString('id-ID')})</span>
                          </div>
                        </div>
                        <input
                          type="radio"
                          checked={sponsorPaymentMethod === 'wallet'}
                          disabled={withdrawableBalance < getPackagePrice(sponsorPackage)}
                          onChange={() => {}}
                          className="text-[#006b2c] dark:text-[#00873a] focus:ring-[#006b2c] h-3 w-3 cursor-pointer"
                        />
                      </div>

                      {/* QRIS */}
                      <div
                        onClick={() => setSponsorPaymentMethod('qris')}
                        className={`flex items-center justify-between border rounded-xl p-2.5 cursor-pointer transition-all ${
                          sponsorPaymentMethod === 'qris'
                            ? 'border-[#006b2c] dark:border-[#00873a] bg-white dark:bg-[#1a2318]'
                            : 'border-amber-200/60 dark:border-[#2f3d2d] bg-white/50 dark:bg-[#151c14] hover:bg-white dark:hover:bg-[#1a2318]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-3.5 h-3.5 text-[#006b2c] dark:text-[#7ffc97]" />
                          <div className="text-[11px] font-bold text-[#171d16] dark:text-[#dde5d9]">QRIS / Transfer Bank</div>
                        </div>
                        <input
                          type="radio"
                          checked={sponsorPaymentMethod === 'qris'}
                          onChange={() => {}}
                          className="text-[#006b2c] dark:text-[#00873a] focus:ring-[#006b2c] h-3 w-3 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* QRIS Code if selected */}
                  {sponsorPaymentMethod === 'qris' && (
                    <div className="bg-white dark:bg-[#151c14] p-3 rounded-2xl border border-amber-200/50 dark:border-[#2f3d2d]/50 text-center flex flex-col items-center">
                      <span className="text-[9px] text-[#6e7b6c] dark:text-[#829281] mb-1.5 font-bold uppercase tracking-wider">PINDAI QRIS UNTUK SPONSOR</span>
                      <div className="w-24 h-24 bg-[#f4fcf0] dark:bg-[#1a2318] border border-[#bdcaba] dark:border-[#2f3d2d] rounded-lg flex items-center justify-center p-1.5">
                        <svg className="w-full h-full text-[#171d16] dark:text-[#dde5d9]" viewBox="0 0 100 100">
                          <path d="M10,10 h20 v20 h-20 z M15,15 h10 v10 h-10 z" fill="currentColor"/>
                          <path d="M70,10 h20 v20 h-20 z M75,15 h10 v10 h-10 z" fill="currentColor"/>
                          <path d="M10,70 h20 v20 h-20 z M15,75 h10 v10 h-10 z" fill="currentColor"/>
                          <path d="M40,10 h10 v10 h-10 z M55,10 h10 v20 h-10 z M40,25 h15 v5 h-15 z" fill="currentColor"/>
                          <path d="M40,40 h10 v10 h-10 z M60,40 h10 v10 h-10 z M80,40 h10 v10 h-10 z" fill="currentColor"/>
                          <path d="M10,40 h10 v20 h-10 z M25,50 h10 v15 h-10 z M40,60 h20 v10 h-20 z" fill="currentColor"/>
                          <path d="M70,60 h20 v10 h-20 z M70,75 h10 v15 h-10 z M85,75 h5 v5 h-5 z" fill="currentColor"/>
                          <path d="M40,80 h20 v10 h-20 z M50,75 h5 v5 h-5 z" fill="currentColor"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#006b2c] hover:bg-[#00873a] text-white font-sans text-sm font-bold uppercase tracking-wider rounded-full shadow-lg transition-transform active:scale-[0.98] mt-6 flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses Pendaftaran...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" />
                  <span>Daftarkan Barang Sewa Sekarang</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
