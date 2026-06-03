import { useState, useEffect } from 'react';
import { Timer, CheckCircle, ShieldAlert, Loader2, PartyPopper } from 'lucide-react';
import type { AppContextType, Order } from '../types';

interface PaymentPendingProps {
  appCtx: AppContextType;
  order: Order;
}

export default function PaymentPendingView({ appCtx, order }: PaymentPendingProps) {
  const { updateOrder, navigate } = appCtx;
  const [minutes, setMinutes] = useState(14);
  const [seconds, setSeconds] = useState(59);
  const [confirmStatus, setConfirmStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Active countdown timer loop
  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prev) => prev - 1);
      } else if (minutes > 0) {
        setMinutes((prev) => prev - 1);
        setSeconds(59);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, seconds]);

  const handleConfirmPayment = () => {
    setConfirmStatus('loading');
    
    // Simulate payment confirmation verification
    setTimeout(() => {
      setConfirmStatus('success');
      updateOrder(order.id, 'paid');
      
      // Delay to show Success Modal nicely
      setTimeout(() => {
        setShowSuccessModal(true);
      }, 500);
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-10 py-12 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Summary & payment guides */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Status Display Header */}
          <div className="bg-white dark:bg-[#151c14] p-6 md:p-8 rounded-2xl border border-[#bdcaba]/30 dark:border-[#2f3d2d]/30 shadow-md dark:shadow-none text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <p className="text-[10px] text-[#6e7b6c] dark:text-[#829281] font-bold uppercase tracking-wider mb-1">Status Pembayaran</p>
                <h1 className="font-sans font-bold text-xl md:text-2xl text-[#171d16] dark:text-[#dde5d9]">Menunggu Pembayaran</h1>
              </div>
              <div className="bg-[#ffd9de] dark:bg-[#2d120f] text-[#a72d51] dark:text-[#ff7f7f] px-3.5 py-1 rounded-lg font-sans text-xs font-bold self-start border border-[#f9c7c2]/20 dark:border-[#540f0c]/30">
                Order ID: {order.id}
              </div>
            </div>

            <div className="border-t border-dashed border-[#bdcaba]/75 dark:border-[#2f3d2d]/75 my-6"></div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-[#3e4a3d] dark:text-[#b4c3b2] font-semibold">Total Pembayaran</span>
              <span className="text-2xl font-extrabold text-[#006b2c] dark:text-[#7ffc97]">
                Rp {order.totalPayment.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Payment Method Details bar */}
          <div className="bg-white dark:bg-[#151c14] p-5 rounded-2xl border border-[#bdcaba]/30 dark:border-[#2f3d2d]/30 shadow-sm dark:shadow-none flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#7ffc97]/20 dark:bg-[#7ffc97]/10 rounded-xl flex items-center justify-center text-[#006b2c] dark:text-[#7ffc97]">
                <span className="font-sans font-extrabold text-sm uppercase">QRIS</span>
              </div>
              <div className="text-left">
                <p className="font-sans text-xs font-bold text-[#171d16] dark:text-[#dde5d9]">{order.paymentMethod}</p>
                <div className="flex items-center gap-1 mt-0.5 text-[#006b2c] dark:text-[#7ffc97]">
                  <CheckCircle className="w-3.5 h-3.5 fill-[#006b2c]/10 dark:fill-[#7ffc97]/10" />
                  <span className="font-sans text-[10px] font-bold">Confirmed</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate({ type: 'home' })}
              className="text-[#006b2c] dark:text-[#7ffc97] font-sans text-xs font-bold hover:underline cursor-pointer"
            >
              Ubah
            </button>
          </div>

          {/* Payment Step Guides */}
          <div className="p-2 space-y-6 text-left">
            <h3 className="font-sans font-bold text-base text-[#171d16] dark:text-[#dde5d9]">Cara Pembayaran</h3>
            <div className="space-y-4 font-sans text-xs text-[#3e4a3d] dark:text-[#b4c3b2] leading-relaxed">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#00873a] dark:bg-[#006b2c] text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <p className="pt-1.5 font-medium">Buka aplikasi pembayaran digital favorit Anda (GoPay, OVO, Dana, ShopeePay, m-Banking).</p>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#00873a] dark:bg-[#006b2c] text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <p className="pt-1.5 font-medium">Scan kode QR yang tertera di samping menggunakan fitur kamera/scan QRIS di aplikasi Anda.</p>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#00873a] dark:bg-[#006b2c] text-white flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <p className="pt-1.5 font-medium">Periksa rincian jumlah tagihan dan selesaikan seluruh pembayaran dengan memasukkan PIN aplikasi Anda.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: QR Code & Countdown timer */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#151c14] p-8 rounded-2xl border border-[#bdcaba]/30 dark:border-[#2f3d2d]/30 shadow-xl shadow-[#171d16]/3 dark:shadow-none text-center">
            
            <div className="mb-6">
              <p className="text-xs text-[#6e7b6c] dark:text-[#829281] font-semibold">Batas Waktu Pembayaran</p>
              <div className="text-[#a72d51] dark:text-[#ff7f7f] text-2xl font-bold flex items-center justify-center gap-1.5 mt-1.5">
                <Timer className="w-5 h-5" />
                <span>
                  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </span>
              </div>
            </div>

            {/* Custom styled QRIS scanner placeholder */}
            <div className="relative mx-auto w-full aspect-square max-w-[240px] bg-[#eff6ea] dark:bg-[#1a2318] rounded-2xl p-4 mb-6 ring-4 ring-[#006b2c]/10 dark:ring-[#00873a]/10 flex items-center justify-center select-none overflow-hidden group">
              <div className="w-full h-full rounded-xl flex items-center justify-center bg-white dark:bg-[#151c14] border border-[#bdcaba]/30 dark:border-[#2f3d2d]/30 relative shadow-inner">
                {/* Visual scan guidelines corner vectors */}
                <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-[#006b2c] dark:border-[#00873a]"></div>
                <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-[#006b2c] dark:border-[#00873a]"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-[#006b2c] dark:border-[#00873a]"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-[#006b2c] dark:border-[#00873a]"></div>

                {/* Simulated center qr dots */}
                <div className="grid grid-cols-4 gap-2 opacity-80">
                  <div className="w-6 h-6 bg-[#171d16] dark:bg-[#dde5d9] rounded-sm"></div>
                  <div className="w-6 h-6 border-2 border-[#171d16] dark:border-[#dde5d9] rounded-sm"></div>
                  <div className="w-6 h-6 border-2 border-[#171d16] dark:border-[#dde5d9] rounded-sm"></div>
                  <div className="w-6 h-6 bg-[#171d16] dark:bg-[#dde5d9] rounded-sm"></div>
                  <div className="w-6 h-6 border-2 border-[#171d16] dark:border-[#dde5d9] rounded-sm"></div>
                  <div className="w-6 h-6 bg-[#006b2c] dark:bg-[#7ffc97] rounded-sm"></div>
                  <div className="w-6 h-6 border-2 border-[#171d16] dark:border-[#dde5d9] rounded-sm"></div>
                  <div className="w-6 h-6 border-2 border-[#171d16] dark:border-[#dde5d9] rounded-sm"></div>
                </div>
              </div>
            </div>

            <p className="font-sans font-bold text-base text-[#171d16] dark:text-[#dde5d9] mb-6">Scan QRIS Sewarion</p>
            
            <button
              onClick={handleConfirmPayment}
              disabled={confirmStatus !== 'idle'}
              className={`w-full py-4 rounded-full font-sans text-sm font-bold shadow-md uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                confirmStatus === 'idle'
                  ? 'bg-[#006b2c] hover:bg-[#00873a] text-white active:scale-[0.98]'
                  : confirmStatus === 'loading'
                  ? 'bg-[#6e7b6c] dark:bg-zinc-700 text-white dark:text-zinc-400 cursor-not-allowed opacity-80'
                  : 'bg-[#005320] text-white cursor-not-allowed'
              }`}
            >
              {confirmStatus === 'idle' && (
                <span>Konfirmasi Pembayaran</span>
              )}
              {confirmStatus === 'loading' && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sistem Memverifikasi...</span>
                </>
              )}
              {confirmStatus === 'success' && (
                <span>✓ Pembayaran Terkonfirmasi</span>
              )}
            </button>
            <p className="text-[10px] text-[#6e7b6c] dark:text-[#829281] font-medium leading-relaxed mt-4">
              Sistem backend kami akan mendeteksi pengiriman pembayaran secara otomatis dalam 2-5 detik setelah transaksi bank eksternal berhasil.
            </p>
          </div>

          {/* Secure sealed standard banner */}
          <div className="flex items-center gap-3 p-4 bg-[#eff6ea] dark:bg-[#1a2318] rounded-xl border border-[#bdcaba]/30 dark:border-[#2f3d2d]/30 text-left">
            <ShieldAlert className="text-[#006b2c] dark:text-[#7ffc97] w-5 h-5 flex-shrink-0" />
            <p className="font-sans text-[10px] font-bold text-[#3e4a3d] dark:text-[#b4c3b2]">
              Pembayaran aman dan terenkripsi dilindungi oleh standar sertifikasi industri eksternal PCI-DSS.
            </p>
          </div>
        </div>
      </div>

      {/* Confetti Success Dialog popup */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#151c14] rounded-3xl p-8 md:p-10 max-w-md w-full text-center shadow-2xl border border-[#bdcaba]/40 dark:border-[#2f3d2d]/40 flex flex-col items-center">
            <div className="w-16 h-16 bg-[#7ffc97]/20 dark:bg-[#7ffc97]/10 rounded-full flex items-center justify-center text-[#006b2c] dark:text-[#7ffc97] mb-6">
              <PartyPopper className="w-8 h-8" />
            </div>
            <h3 className="font-sans font-bold text-xl text-[#171d16] dark:text-[#dde5d9] mb-2">Pembayaran Sukses!</h3>
            <p className="font-sans text-xs text-[#3e4a3d] dark:text-[#b4c3b2] leading-relaxed mb-8">
              Kontrak sewa hukum digital telah ditandatangani secara sah, dana diamankan di rekening penampung sementara Sewarion, dan pemilik aset telah diberitahu untuk persiapan serah terima barang.
            </p>
            <button
              onClick={() => navigate({ type: 'history' })}
              className="bg-[#006b2c] hover:bg-[#00873a] text-white py-3 px-8 rounded-full font-sans text-xs font-bold w-full active:scale-95 transition-transform cursor-pointer"
            >
              Lihat Riwayat Sewa Saya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
