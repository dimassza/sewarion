import React, { useState, useMemo, useEffect } from 'react';
import { Gavel, CheckCircle2, QrCode, CreditCard, Building } from 'lucide-react';
import type { AppContextType, Order } from '../types';

interface CheckoutViewProps {
  appCtx: AppContextType;
  productId: string;
  totalDays?: number;
  startDate?: string;
  endDate?: string;
}

export default function CheckoutView({
  appCtx,
  productId,
  totalDays = 7,
  startDate = '2026-10-24T00:00:00.000Z',
  endDate = '2026-10-31T00:00:00.000Z'
}: CheckoutViewProps) {
  const { products, addOrder, navigate, user } = appCtx;
  const currentProduct = products.find((p) => p.id === productId) || products[0];

  const [agreementChecked, setAgreementChecked] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<'qris' | 'va' | 'wallet'>('qris');

  const [renterCity, setRenterCity] = useState<string>(currentProduct ? currentProduct.location : 'Jakarta');
  const [shippingProvider, setShippingProvider] = useState<'gojek' | 'expedition' | 'pickup'>('gojek');
  const [shippingService, setShippingService] = useState<string>('gosend_instant'); // gosend_instant, gosend_sameday, jnt, jne, pickup
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<string>(user.homeAddress || '');

  const formatIndonesianDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  // Determine if GoSend is available (only for local same-city or Jabodetabek deliveries)
  const JABODETABEK_CITIES = ['Jakarta', 'Tangerang', 'Depok', 'Bekasi', 'Bogor', 'Binus'];
  const isProductInJabodetabek = JABODETABEK_CITIES.includes(currentProduct.location);
  const isRenterInJabodetabek = JABODETABEK_CITIES.includes(renterCity);

  const isSameCity = currentProduct.location === renterCity;
  const isGoSendAvailable = isSameCity || (isProductInJabodetabek && isRenterInJabodetabek);

  // Mock distance for GoSend Instant based on product name and renter city
  const mockDistance = useMemo(() => {
    const code = (currentProduct.name.length + renterCity.length) % 15 + 3; // between 3km and 18km
    return code;
  }, [currentProduct.name, renterCity]);

  // Pre-calculate J&T and JNE fees for rendering on card options
  const shippingFeeList = useMemo(() => {
    const getCityIsland = (city: string): 'jawa' | 'luar_jawa' => {
      const JAWA_CITIES = ['Jakarta', 'Tangerang', 'Depok', 'Bekasi', 'Bogor', 'Binus', 'Bandung', 'Surabaya', 'Yogyakarta'];
      return JAWA_CITIES.includes(city) ? 'jawa' : 'luar_jawa';
    };
    
    const originIsland = getCityIsland(currentProduct.location);
    const destinationIsland = getCityIsland(renterCity);

    let jntFee = 35000;
    let jneFee = 40000;

    if (isSameCity) {
      jntFee = 12000;
      jneFee = 15000;
    } else if (originIsland === 'jawa' && destinationIsland === 'jawa') {
      jntFee = 22000;
      jneFee = 26000;
    } else if (originIsland === 'luar_jawa' && destinationIsland === 'luar_jawa') {
      jntFee = 45000;
      jneFee = 50000;
    } else {
      // Cross-island (Java to Luar Jawa / Luar Jawa to Java)
      jntFee = 55000;
      jneFee = 60000;
    }

    return { jnt: jntFee, jne: jneFee };
  }, [currentProduct.location, renterCity, isSameCity]);

  // Fallback if GoSend is selected but not available
  useEffect(() => {
    if (shippingProvider === 'gojek' && !isGoSendAvailable) {
      setShippingProvider('expedition');
      setShippingService('jnt');
    }
  }, [renterCity, isGoSendAvailable]);

  // Loading animation when changing address, city, or provider/service
  useEffect(() => {
    setIsLoadingRates(true);
    const timer = setTimeout(() => {
      setIsLoadingRates(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [renterCity, shippingProvider, shippingService]);

  // Shipping fee calculation
  const shippingFee = useMemo(() => {
    if (shippingProvider === 'pickup') return 0;
    
    if (shippingProvider === 'gojek') {
      if (shippingService === 'gosend_instant') {
        return 10000 + mockDistance * 2500; // Rp 10.000 + Rp 2.500/km
      }
      return 15000; // GoSend SameDay flat
    }
    
    // expedition
    if (shippingService === 'jnt') {
      return shippingFeeList.jnt;
    }
    return shippingFeeList.jne;
  }, [shippingProvider, shippingService, mockDistance, shippingFeeList]);

  const handleProviderChange = (provider: 'gojek' | 'expedition' | 'pickup') => {
    setShippingProvider(provider);
    if (provider === 'gojek') {
      setShippingService('gosend_instant');
    } else if (provider === 'expedition') {
      setShippingService('jnt');
    } else {
      setShippingService('pickup');
    }
  };

  const getShippingMethodLabel = () => {
    if (shippingProvider === 'pickup') return 'Ambil Sendiri';
    if (shippingProvider === 'gojek') {
      return shippingService === 'gosend_instant' ? 'Gojek (GoSend Instant)' : 'Gojek (GoSend SameDay)';
    }
    return shippingService === 'jnt' ? 'J&T Express' : 'JNE Reguler';
  };

  // Pricing math
  const originalPrice = currentProduct.pricePerDay;
  const rentCostSubtotal = originalPrice * totalDays;
  const serviceFee = Math.round(rentCostSubtotal * 0.025); // Biaya Admin Platform 2.5%
  const deviceInsuranceFee = 15000; // Asuransi Proteksi Kerusakan Mikro
  const totalPayment = rentCostSubtotal + serviceFee + deviceInsuranceFee + shippingFee;

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreementChecked) {
      alert('Anda harus membaca dan menyetujui Kontrak Digital Sewarion terlebih dahulu!');
      return;
    }

    // Spawn a real Order object
    const newOrder: Order = {
      id: `SW-2026${Math.floor(1000 + Math.random() * 9000)}`,
      product: currentProduct,
      durationDays: totalDays,
      startDate,
      endDate,
      paymentMethod: selectedPayment === 'qris' ? 'QRIS (Gopay/OVO/Dana)' : selectedPayment === 'va' ? 'Virtual Account' : 'E-Wallet',
      totalPayment,
      status: 'pending',
      userEmail: user.email,
      createdAt: new Date().toISOString(),
      shippingMethod: getShippingMethodLabel(),
      shippingAddress: shippingProvider === 'pickup' ? 'Ambil di Hub/Titik Temu' : `${shippingAddress} (${renterCity})`,
      shippingFee
    };

    addOrder(newOrder);
    navigate({ type: 'payment-pending', order: newOrder });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-10 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Summary & Law Contract */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Order Summary Form */}
          <section className="bg-white dark:bg-[#151c14] p-6 md:p-8 rounded-2xl border border-[#bdcaba]/35 dark:border-[#2f3d2d] shadow-xl shadow-[#171d16]/3 dark:shadow-none">
            <h2 className="font-sans font-bold text-xl text-[#171d16] dark:text-[#dde5d9] mb-6">Ringkasan Pesanan</h2>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-[#eff6ea] dark:bg-[#1a2318] flex-shrink-0">
                <img
                  src={currentProduct.image}
                  className="w-full h-full object-cover"
                  alt={currentProduct.name}
                />
              </div>
              <div className="flex-grow w-full">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-sans font-bold text-lg text-[#171d16] dark:text-[#dde5d9]">
                      {currentProduct.name}
                    </h3>
                    <p className="font-sans text-xs text-[#6e7b6c] dark:text-[#829281] mt-1">
                      Kategori: {currentProduct.category}
                    </p>
                  </div>
                  <span className="bg-[#7ffc97] dark:bg-[#006b2c] text-[#005320] dark:text-[#7ffc97] px-3 py-1 rounded-full font-sans text-[10px] font-bold">
                    Tersedia
                  </span>
                </div>
                <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-[#3e4a3d] dark:text-[#b4c3b2]">
                  <div className="flex items-center gap-1.5 p-2 bg-[#f4fcf0] dark:bg-[#151d13] rounded-lg border border-[#bdcaba]/30 dark:border-[#2f3d2d]/30">
                    <span className="text-[#6e7b6c] dark:text-[#829281]">Durasi:</span>
                    <span className="text-[#006b2c] dark:text-[#7ffc97]">{totalDays} Hari</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-[#f4fcf0] dark:bg-[#151d13] rounded-lg border border-[#bdcaba]/30 dark:border-[#2f3d2d]/30">
                    <span className="text-[#6e7b6c] dark:text-[#829281]">Tanggal:</span>
                    <span>{formatIndonesianDate(startDate)} - {formatIndonesianDate(endDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Shipping Address & Delivery Option */}
          <section className="bg-white dark:bg-[#151c14] p-6 md:p-8 rounded-2xl border border-[#bdcaba]/35 dark:border-[#2f3d2d] shadow-xl shadow-[#171d16]/3 dark:shadow-none text-left font-sans">
            <h2 className="font-sans font-bold text-xl text-[#171d16] dark:text-[#dde5d9] mb-6">Metode Pengiriman & Alamat</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">
                    Kota Tujuan Pengiriman
                  </label>
                  <select
                    value={renterCity}
                    onChange={(e) => setRenterCity(e.target.value)}
                    className="w-full bg-[#f4fcf0]/45 dark:bg-[#151d13]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-12 px-4 font-sans text-sm text-[#171d16] dark:text-[#dde5d9] outline-none cursor-pointer focus:border-[#006b2c] dark:focus:border-[#00873a] font-sans"
                  >
                    <option value="Jakarta" className="dark:bg-[#151c14]">Jakarta (Jabodetabek)</option>
                    <option value="Tangerang" className="dark:bg-[#151c14]">Tangerang (Jabodetabek)</option>
                    <option value="Depok" className="dark:bg-[#151c14]">Depok (Jabodetabek)</option>
                    <option value="Bekasi" className="dark:bg-[#151c14]">Bekasi (Jabodetabek)</option>
                    <option value="Bogor" className="dark:bg-[#151c14]">Bogor (Jabodetabek)</option>
                    <option value="Binus" className="dark:bg-[#151c14]">Binus Area (Jabodetabek)</option>
                    <option value="Bandung" className="dark:bg-[#151c14]">Bandung</option>
                    <option value="Surabaya" className="dark:bg-[#151c14]">Surabaya</option>
                    <option value="Yogyakarta" className="dark:bg-[#151c14]">Yogyakarta</option>
                    <option value="Medan" className="dark:bg-[#151c14]">Medan (Luar Jawa)</option>
                    <option value="Makassar" className="dark:bg-[#151c14]">Makassar (Luar Jawa)</option>
                    <option value="Palembang" className="dark:bg-[#151c14]">Palembang (Luar Jawa)</option>
                  </select>
                </div>
                
                <div className="space-y-1.5 text-left">
                  <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">
                    Kota Asal Barang (Pemilik)
                  </label>
                  <div className="w-full bg-gray-100 dark:bg-[#1d271b] border border-gray-200 dark:border-[#2f3d2d]/50 rounded-xl h-12 px-4 font-sans text-sm text-gray-500 dark:text-[#829281] flex items-center">
                    {currentProduct.location} ({currentProduct.locationDetail})
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">
                  Alamat Lengkap Pengiriman
                </label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-[#f4fcf0]/45 dark:bg-[#151d13]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl p-3 h-20 font-sans text-sm text-[#171d16] dark:text-[#dde5d9] outline-none focus:border-[#006b2c] dark:focus:border-[#00873a] resize-none"
                  placeholder="Isi alamat lengkap pengiriman barang Anda"
                />
              </div>

              {/* Courier Provider Tabs */}
              <div className="flex border border-[#bdcaba]/50 dark:border-[#2f3d2d] rounded-xl overflow-hidden font-sans text-xs">
                <button
                  type="button"
                  onClick={() => isGoSendAvailable && handleProviderChange('gojek')}
                  disabled={!isGoSendAvailable}
                  className={`flex-1 py-3 font-bold transition-all text-center ${
                    !isGoSendAvailable
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-[#1c221a] dark:text-zinc-600'
                      : shippingProvider === 'gojek'
                      ? 'bg-[#006b2c] text-white shadow-inner'
                      : 'bg-white dark:bg-[#151c14] text-[#3e4a3d] dark:text-[#b4c3b2] hover:bg-[#eff6ea]/50 dark:hover:bg-[#1a2318]/50'
                  }`}
                >
                  Gojek (GoSend)
                </button>
                <button
                  type="button"
                  onClick={() => handleProviderChange('expedition')}
                  className={`flex-1 py-3 font-bold transition-all text-center border-l border-r border-[#bdcaba]/50 dark:border-[#2f3d2d] ${
                    shippingProvider === 'expedition'
                      ? 'bg-[#006b2c] text-white shadow-inner'
                      : 'bg-white dark:bg-[#151c14] text-[#3e4a3d] dark:text-[#b4c3b2] hover:bg-[#eff6ea]/50 dark:hover:bg-[#1a2318]/50'
                  }`}
                >
                  Ekspedisi (J&T / JNE)
                </button>
                <button
                  type="button"
                  onClick={() => handleProviderChange('pickup')}
                  className={`flex-1 py-3 font-bold transition-all text-center ${
                    shippingProvider === 'pickup'
                      ? 'bg-[#006b2c] text-white shadow-inner'
                      : 'bg-white dark:bg-[#151c14] text-[#3e4a3d] dark:text-[#b4c3b2] hover:bg-[#eff6ea]/50 dark:hover:bg-[#1a2318]/50'
                  }`}
                >
                  Ambil Sendiri
                </button>
              </div>

              {/* Courier Specific Options */}
              <div className="relative min-h-[90px] border border-[#bdcaba]/30 dark:border-[#2f3d2d]/30 rounded-xl p-4 bg-[#f4fcf0]/15 dark:bg-[#151d13]/15">
                {isLoadingRates && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-[#151c14]/80 backdrop-blur-xs flex items-center justify-center rounded-xl z-10">
                    <span className="animate-spin w-4 h-4 border-2 border-[#006b2c] border-t-transparent rounded-full mr-2"></span>
                    <span className="font-sans text-xs font-bold text-[#006b2c] dark:text-[#7ffc97]">Menghubungi API kurir...</span>
                  </div>
                )}

                {shippingProvider === 'gojek' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* GoSend Instant */}
                    <div
                      onClick={() => setShippingService('gosend_instant')}
                      className={`relative flex items-center p-3 rounded-lg border cursor-pointer hover:bg-[#f4fcf0]/40 dark:hover:bg-[#151d13]/40 transition-all ${
                        shippingService === 'gosend_instant' 
                          ? 'border-[#006b2c] dark:border-[#00873a] bg-[#006b2c]/5 dark:bg-[#006b2c]/10 ring-1 ring-[#006b2c] dark:ring-[#00873a]' 
                          : 'border-[#bdcaba] dark:border-[#2f3d2d]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="gosend_service"
                        checked={shippingService === 'gosend_instant'}
                        onChange={() => {}}
                        className="mr-3 text-[#006b2c] dark:text-[#00873a] focus:ring-[#006b2c] cursor-pointer"
                      />
                      <div className="text-left font-sans">
                        <p className="font-sans text-xs font-bold text-[#171d16] dark:text-[#dde5d9]">GoSend Instant</p>
                        <p className="text-[10px] text-[#6e7b6c] dark:text-[#829281] mt-0.5 font-sans">Estimasi 1-2 Jam · Jarak: {mockDistance} km</p>
                      </div>
                      <span className="ml-auto font-sans text-xs font-bold text-[#006b2c] dark:text-[#7ffc97]">
                        Rp {(10000 + mockDistance * 2500).toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* GoSend SameDay */}
                    <div
                      onClick={() => setShippingService('gosend_sameday')}
                      className={`relative flex items-center p-3 rounded-lg border cursor-pointer hover:bg-[#f4fcf0]/40 dark:hover:bg-[#151d13]/40 transition-all ${
                        shippingService === 'gosend_sameday' 
                          ? 'border-[#006b2c] dark:border-[#00873a] bg-[#006b2c]/5 dark:bg-[#006b2c]/10 ring-1 ring-[#006b2c] dark:ring-[#00873a]' 
                          : 'border-[#bdcaba] dark:border-[#2f3d2d]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="gosend_service"
                        checked={shippingService === 'gosend_sameday'}
                        onChange={() => {}}
                        className="mr-3 text-[#006b2c] dark:text-[#00873a] focus:ring-[#006b2c] cursor-pointer"
                      />
                      <div className="text-left font-sans">
                        <p className="font-sans text-xs font-bold text-[#171d16] dark:text-[#dde5d9]">GoSend SameDay</p>
                        <p className="text-[10px] text-[#6e7b6c] dark:text-[#829281] mt-0.5 font-sans">Estimasi 6-8 Jam pengiriman</p>
                      </div>
                      <span className="ml-auto font-sans text-xs font-bold text-[#006b2c] dark:text-[#7ffc97]">
                        Rp 15.000
                      </span>
                    </div>
                  </div>
                )}

                {shippingProvider === 'expedition' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* J&T Express */}
                    <div
                      onClick={() => setShippingService('jnt')}
                      className={`relative flex items-center p-3 rounded-lg border cursor-pointer hover:bg-[#f4fcf0]/40 dark:hover:bg-[#151d13]/40 transition-all ${
                        shippingService === 'jnt' 
                          ? 'border-[#006b2c] dark:border-[#00873a] bg-[#006b2c]/5 dark:bg-[#006b2c]/10 ring-1 ring-[#006b2c] dark:ring-[#00873a]' 
                          : 'border-[#bdcaba] dark:border-[#2f3d2d]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="expedition_service"
                        checked={shippingService === 'jnt'}
                        onChange={() => {}}
                        className="mr-3 text-[#006b2c] dark:text-[#00873a] focus:ring-[#006b2c] cursor-pointer"
                      />
                      <div className="text-left font-sans">
                        <p className="font-sans text-xs font-bold text-[#171d16] dark:text-[#dde5d9]">J&T Express (Reguler)</p>
                        <p className="text-[10px] text-[#6e7b6c] dark:text-[#829281] mt-0.5 font-sans">Estimasi 2-3 hari kerja</p>
                      </div>
                      <span className="ml-auto font-sans text-xs font-bold text-[#006b2c] dark:text-[#7ffc97]">
                        Rp {shippingFeeList.jnt.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* JNE Reguler */}
                    <div
                      onClick={() => setShippingService('jne')}
                      className={`relative flex items-center p-3 rounded-lg border cursor-pointer hover:bg-[#f4fcf0]/40 dark:hover:bg-[#151d13]/40 transition-all ${
                        shippingService === 'jne' 
                          ? 'border-[#006b2c] dark:border-[#00873a] bg-[#006b2c]/5 dark:bg-[#006b2c]/10 ring-1 ring-[#006b2c] dark:ring-[#00873a]' 
                          : 'border-[#bdcaba] dark:border-[#2f3d2d]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="expedition_service"
                        checked={shippingService === 'jne'}
                        onChange={() => {}}
                        className="mr-3 text-[#006b2c] dark:text-[#00873a] focus:ring-[#006b2c] cursor-pointer"
                      />
                      <div className="text-left font-sans">
                        <p className="font-sans text-xs font-bold text-[#171d16] dark:text-[#dde5d9]">JNE Reguler</p>
                        <p className="text-[10px] text-[#6e7b6c] dark:text-[#829281] mt-0.5 font-sans">Estimasi 2-4 hari kerja</p>
                      </div>
                      <span className="ml-auto font-sans text-xs font-bold text-[#006b2c] dark:text-[#7ffc97]">
                        Rp {shippingFeeList.jne.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                )}

                {shippingProvider === 'pickup' && (
                  <div className="text-left p-2 text-xs font-medium text-[#3e4a3d] dark:text-[#b4c3b2] space-y-1.5 leading-relaxed font-sans">
                    <p className="font-bold text-[#006b2c] dark:text-[#7ffc97]">✓ Bebas Biaya Pengiriman (Self-Pickup)</p>
                    <p className="text-[#6e7b6c] dark:text-[#829281] text-[11px] font-sans">
                      Ambil barang langsung di Sewarion Hub terdekat di kota Anda atau diskusikan titik penjemputan/pengembalian mandiri secara aman via chat Sewarion.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Scrolling Contract */}
          <section className="bg-white dark:bg-[#151c14] p-6 md:p-8 rounded-2xl border border-[#bdcaba]/35 dark:border-[#2f3d2d] shadow-xl shadow-[#171d16]/3 dark:shadow-none">
            <div className="flex items-center gap-3 mb-6">
              <Gavel className="text-[#006b2c] dark:text-[#7ffc97] w-6 h-6" />
              <h2 className="font-sans font-bold text-xl text-[#171d16] dark:text-[#dde5d9]">
                Kontrak Digital Sewarion
              </h2>
            </div>

            <div className="contract-box h-64 overflow-y-auto bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 p-6 rounded-xl border border-[#bdcaba]/50 dark:border-[#2f3d2d]/50 text-xs text-[#3e4a3d] dark:text-[#b4c3b2] leading-relaxed space-y-4">
              <div>
                <p className="font-bold text-[#171d16] dark:text-[#dde5d9] mb-1">Pasal 1: Ketentuan Umum</p>
                <p>Pihak Pertama setuju untuk menyewakan aset kepada Pihak Kedua dalam kondisi prima dan layak pakai. Pihak Kedua bertanggung jawab penuh atas pemeliharaan dan pengawasan aset selama periode sewa berlangsung.</p>
              </div>

              <div>
                <p className="font-bold text-[#171d16] dark:text-[#dde5d9] mb-1">Pasal 2: Jaminan Bebas Deposit</p>
                <p>Melalui program Sewarion Trust Guarantee, penyewa dibebaskan dari kewajiban membayar jaminan uang deposit tunai dengan syarat verifikasi identitas (E-KTP) dan penandatanganan kontrak digital ini.</p>
              </div>

              <div>
                <p className="font-bold text-[#171d16] dark:text-[#dde5d9] mb-1">Pasal 3: Tanggung Jawab Kerusakan</p>
                <p>Segala kerusakan teknis maupun fisik yang timbul akibat unsur kelalaian penggunaan akan sepenuhnya dibebankan pada penyewa, dihitung berdasarkan estimasi kustom pusat perbaikan resmi berlisensi.</p>
              </div>

              <div>
                <p className="font-bold text-[#171d16] dark:text-[#dde5d9] mb-1">Pasal 4: Keterlambatan Pengembalian & Denda</p>
                <p>Keterlambatan pengembalian aset di luar masa tenggang 2 (dua) jam dikenakan denda sebesar 10% dari tarif harian standar per jam keterlambatan, terakumulasi harian.</p>
              </div>
            </div>

            <label className="flex items-start gap-3 mt-6 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-[#bdcaba] dark:border-[#2f3d2d] text-[#006b2c] focus:ring-[#006b2c]"
              />
              <span className="font-sans text-xs text-[#171d16] dark:text-[#dde5d9] font-medium leading-relaxed select-none group-hover:text-[#006b2c] dark:group-hover:text-[#7ffc97] transition-colors">
                Saya telah membaca menyeluruh, memahami konsekuensi hukum, menyetujui pasal Kontrak Digital di atas, dan siap bertanggung jawab penuh atas pengembalian aset tepat waktu dalam kondisi semula.
              </span>
            </label>
          </section>
        </div>

        {/* Right Column: Payment & Math totalizer */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          
          {/* Payment Card Options */}
          <section className="bg-white dark:bg-[#151c14] p-6 rounded-2xl border border-[#bdcaba]/35 dark:border-[#2f3d2d] shadow-xl shadow-[#171d16]/3 dark:shadow-none">
            <h2 className="font-sans font-bold text-lg text-[#171d16] dark:text-[#dde5d9] mb-4">Metode Pembayaran</h2>
            <div className="flex flex-col gap-3">
              
              {/* Option QRIS */}
              <label className={`relative flex items-center p-4 rounded-xl border cursor-pointer hover:bg-[#f4fcf0]/40 dark:hover:bg-[#151d13]/40 transition-all ${
                selectedPayment === 'qris' ? 'border-[#006b2c] dark:border-[#00873a] bg-[#006b2c]/5 dark:bg-[#006b2c]/10' : 'border-[#bdcaba] dark:border-[#2f3d2d]'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={selectedPayment === 'qris'}
                  onChange={() => setSelectedPayment('qris')}
                  className="hidden"
                />
                <QrCode className="text-[#006b2c] dark:text-[#7ffc97] w-6 h-6 mr-4 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-sans text-xs font-bold text-[#171d16] dark:text-[#dde5d9]">QRIS (GoPay/OVO/Dana)</p>
                  <p className="text-[10px] text-[#6e7b6c] dark:text-[#829281] mt-0.5">Konfirmasi Instan & Cepat otomatis</p>
                </div>
                {selectedPayment === 'qris' && (
                  <CheckCircle2 className="w-5 h-5 text-[#006b2c] dark:text-[#7ffc97] flex-shrink-0" />
                )}
              </label>

              {/* Option VA */}
              <label className={`relative flex items-center p-4 rounded-xl border cursor-pointer hover:bg-[#f4fcf0]/40 dark:hover:bg-[#151d13]/40 transition-all ${
                selectedPayment === 'va' ? 'border-[#006b2c] dark:border-[#00873a] bg-[#006b2c]/5 dark:bg-[#006b2c]/10' : 'border-[#bdcaba] dark:border-[#2f3d2d]'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={selectedPayment === 'va'}
                  onChange={() => setSelectedPayment('va')}
                  className="hidden"
                />
                <Building className="text-[#006b2c] dark:text-[#7ffc97] w-6 h-6 mr-4 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-sans text-xs font-bold text-[#171d16] dark:text-[#dde5d9]">Virtual Account Bank</p>
                  <p className="text-[10px] text-[#6e7b6c] dark:text-[#829281] mt-0.5">Transfer BCA, Mandiri, BNI, BRI</p>
                </div>
                {selectedPayment === 'va' && (
                  <CheckCircle2 className="w-5 h-5 text-[#006b2c] dark:text-[#7ffc97] flex-shrink-0" />
                )}
              </label>

              {/* Option E-Wallet */}
              <label className={`relative flex items-center p-4 rounded-xl border cursor-pointer hover:bg-[#f4fcf0]/40 dark:hover:bg-[#151d13]/40 transition-all ${
                selectedPayment === 'wallet' ? 'border-[#006b2c] dark:border-[#00873a] bg-[#006b2c]/5 dark:bg-[#006b2c]/10' : 'border-[#bdcaba] dark:border-[#2f3d2d]'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={selectedPayment === 'wallet'}
                  onChange={() => setSelectedPayment('wallet')}
                  className="hidden"
                />
                <CreditCard className="text-[#006b2c] dark:text-[#7ffc97] w-6 h-6 mr-4 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-sans text-xs font-bold text-[#171d16] dark:text-[#dde5d9]">E-Wallet / Kartu</p>
                  <p className="text-[10px] text-[#6e7b6c] dark:text-[#829281] mt-0.5">ShopeePay, LinkAja, Kartu Kredit</p>
                </div>
                {selectedPayment === 'wallet' && (
                  <CheckCircle2 className="w-5 h-5 text-[#006b2c] dark:text-[#7ffc97] flex-shrink-0" />
                )}
              </label>
            </div>
          </section>

          {/* Pricing breakdown */}
          <section className="bg-[#eff6ea] dark:bg-[#1a2318] p-6 rounded-2xl border border-[#bdcaba]/40 dark:border-[#2f3d2d]/40 shadow-md">
            <h2 className="font-sans font-bold text-xs-semibold text-[#006b2c] dark:text-[#7ffc97] uppercase tracking-wider mb-4">Total Rincian Biaya</h2>
            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between text-[#3e4a3d] dark:text-[#b4c3b2]">
                <span>Biaya Sewa ({totalDays} Hari)</span>
                <span className="font-semibold text-[#171d16] dark:text-[#dde5d9]">Rp {rentCostSubtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-[#3e4a3d] dark:text-[#b4c3b2]">
                <span>Biaya Layanan Platform (2.5%)</span>
                <span className="font-semibold text-[#171d16] dark:text-[#dde5d9]">Rp {serviceFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-[#3e4a3d] dark:text-[#b4c3b2]">
                <span>Asuransi Kerusakan Mikro</span>
                <span className="font-semibold text-[#171d16] dark:text-[#dde5d9]">Rp {deviceInsuranceFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-[#3e4a3d] dark:text-[#b4c3b2]">
                <span>Biaya Pengiriman ({getShippingMethodLabel()})</span>
                <span className="font-semibold text-[#171d16] dark:text-[#dde5d9]">
                  {shippingFee > 0 ? `Rp ${shippingFee.toLocaleString('id-ID')}` : 'Gratis'}
                </span>
              </div>

              <div className="border-t border-[#bdcaba]/50 dark:border-[#2f3d2d]/50 my-3"></div>

              <div className="flex justify-between items-end">
                <span className="text-[#171d16] dark:text-[#dde5d9] font-bold">Total Pembayaran</span>
                <span className="text-lg font-extrabold text-[#006b2c] dark:text-[#7ffc97]">
                  Rp {totalPayment.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              onClick={handlePaymentSubmit}
              disabled={!agreementChecked}
              className={`w-full py-4 rounded-full font-sans text-sm font-bold mt-8 shadow-lg transition-all text-center flex items-center justify-center ${
                agreementChecked
                  ? 'bg-[#006b2c] hover:bg-[#00873a] text-white cursor-pointer active:scale-[0.98]'
                  : 'bg-[#6e7b6c]/20 dark:bg-[#6e7b6c]/10 text-[#6e7b6c]/50 dark:text-[#6e7b6c]/30 cursor-not-allowed'
              }`}
            >
              Lanjutkan Pembayaran
            </button>
            <p className="text-center text-[10px] text-[#6e7b6c] dark:text-[#829281] mt-4">
              Transaksi dilindungi penuh oleh Sewarion Trust Shield
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
