import { useState } from 'react';
import { Calendar, Receipt, Download, ArrowRight, MessageSquare, AlertTriangle, QrCode, Building, Check, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { AppContextType, Order } from '../types';
import ChatDrawer from './ChatDrawer';

interface HistoryViewProps {
  appCtx: AppContextType;
}

export default function HistoryView({ appCtx }: HistoryViewProps) {
  const { orders, navigate, user } = appCtx;
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'paid' | 'completed'>('all');

  // Check if current user is Sewarion Admin
  const isAdmin = user.email && user.email.toLowerCase().startsWith('admin@');

  // Simulation state: allows testing overdue late returns
  const [simulateOverdue, setSimulateOverdue] = useState(false);

  // Chat drawer states
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedOrderForChat, setSelectedOrderForChat] = useState<Order | null>(null);

  // Late fee payment modal states
  const [selectedOrderForLateFee, setSelectedOrderForLateFee] = useState<Order | null>(null);
  const [showLateModal, setShowLateModal] = useState(false);
  const [selectedLatePayment, setSelectedLatePayment] = useState<'qris' | 'va'>('qris');
  const [isPayingLate, setIsPayingLate] = useState(false);

  // Calculator helper for overdue status and fee calculation
  const getOrderOverdueInfo = (order: Order) => {
    if (order.status !== 'paid' && order.status !== 'completed') {
      return { isLate: false, lateDays: 0, lateHours: 0, lateFee: 0, lateFeePaid: false };
    }

    // If order was already completed with late details, load stored values
    if (order.status === 'completed' && order.lateFee) {
      return {
        isLate: true,
        lateDays: order.lateDays || 0,
        lateHours: order.lateHours || 0,
        lateFee: order.lateFee || 0,
        lateFeePaid: order.lateFeePaid || false
      };
    }

    if (order.status === 'paid') {
      const deadline = new Date(order.endDate);
      const now = simulateOverdue
        ? new Date(deadline.getTime() + (2 * 24 + 4) * 60 * 60 * 1000) // Simulated 2 days & 4 hours late
        : new Date();

      if (now > deadline) {
        const diffMs = now.getTime() - deadline.getTime();
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (totalHours > 2) { // 2-hour grace period
          const daysLate = Math.floor(totalHours / 24);
          const hoursLate = totalHours % 24;

          const dailyRate = order.product.pricePerDay;
          const dayFee = daysLate * 1.5 * dailyRate; // 150% daily rate per day
          const hourFee = Math.min(hoursLate * 0.1 * dailyRate, 1.5 * dailyRate); // 10% per hour, capped at 1.5x harian
          const lateFee = Math.round(dayFee + hourFee);

          return {
            isLate: true,
            lateDays: daysLate,
            lateHours: hoursLate,
            lateFee,
            lateFeePaid: order.lateFeePaid || false
          };
        }
      }
    }

    return { isLate: false, lateDays: 0, lateHours: 0, lateFee: 0, lateFeePaid: false };
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'all') return true;
    return o.status === activeTab;
  });

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

  const getStatusBadge = (order: Order) => {
    const overdueInfo = getOrderOverdueInfo(order);

    if (order.status === 'paid' && overdueInfo.isLate && overdueInfo.lateFee > 0) {
      return (
        <span className="bg-red-100 dark:bg-red-950/55 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Terlambat
        </span>
      );
    }

    switch (order.status) {
      case 'pending':
        return (
          <span className="bg-[#ffd9de] dark:bg-red-950/45 text-[#a72d51] dark:text-red-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Menunggu Pembayaran
          </span>
        );
      case 'paid':
        return (
          <span className="bg-[#d2f3db] dark:bg-emerald-950/45 text-[#006b2c] dark:text-[#7ffc97] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Lunas / Berjalan
          </span>
        );
      case 'completed':
        return (
          <span className="bg-[#eff6ea] dark:bg-[#1a2517] text-[#6e7b6c] dark:text-[#9bb098] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Selesai {order.lateFee ? '(Terlambat & Lunas Denda)' : ''}
          </span>
        );
      default:
        return null;
    }
  };

  const handleDownloadContract = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up terblokir oleh browser Anda. Harap aktifkan izin pop-up untuk mencetak kontrak.');
      return;
    }

    const ownerName = order.product.ownerId === 'system' ? 'Fahri Pemilik (Official)' : order.product.ownerId;
    const renterName = order.userEmail || user.email;
    const contractNo = `KONTRAK/SEWARION/${order.id.toUpperCase()}/${new Date(order.createdAt || Date.now()).getFullYear()}`;

    const overdueInfo = getOrderOverdueInfo(order);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Kontrak Sewa Digital - ${order.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
            body { 
              font-family: 'Inter', sans-serif; 
              color: #171d16; 
              line-height: 1.5; 
              margin: 0; 
              padding: 40px; 
              font-size: 11px;
            }
            .paper {
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              border-bottom: 3px double #171d16;
              padding-bottom: 12px;
              margin-bottom: 25px;
            }
            .logo {
              font-weight: 800;
              font-size: 20px;
              color: #006b2c;
              letter-spacing: -0.5px;
            }
            .doc-title {
              font-size: 14px;
              font-weight: 700;
              margin-top: 10px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .doc-no {
              font-family: monospace;
              color: #555;
              font-size: 10px;
              margin-top: 4px;
            }
            .section-title {
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              background: #eff6ea;
              border-left: 4px solid #006b2c;
              padding: 6px 10px;
              margin: 20px 0 10px 0;
            }
            .grid-2 {
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 20px;
            }
            table.info-table {
              width: 100%;
              border-collapse: collapse;
            }
            table.info-table td {
              padding: 4px 0;
              vertical-align: top;
            }
            table.info-table td.label {
              font-weight: 600;
              color: #546253;
              width: 35%;
            }
            table.item-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            table.item-table th, table.item-table td {
              border: 1px solid #bdcaba;
              padding: 8px 10px;
              text-align: left;
            }
            table.item-table th {
              background: #f4fcf0;
              font-weight: 700;
            }
            .legal-text {
              text-align: justify;
              margin-top: 15px;
              font-size: 10px;
              color: #3e4a3d;
              line-height: 1.6;
            }
            .signatures {
              margin-top: 40px;
              display: grid;
              grid-template-cols: 1fr 1fr;
              text-align: center;
            }
            .sig-box {
              height: 110px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              position: relative;
            }
            .sig-title {
              font-weight: 600;
            }
            .sig-name {
              font-weight: 700;
              text-decoration: underline;
            }
            .emeterai-box {
              position: absolute;
              top: 20px;
              width: 80px;
              height: 60px;
              border: 2px dashed #483d8b;
              background: rgba(230, 230, 250, 0.85);
              border-radius: 4px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: #483d8b;
              font-size: 7px;
              font-weight: bold;
              transform: rotate(-8deg);
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
              z-index: 10;
            }
            .emeterai-box .title {
              font-size: 8px;
              letter-spacing: 0.5px;
            }
            .emeterai-box .price {
              font-size: 9px;
              font-weight: 800;
              margin: 2px 0;
            }
            .stamp-date {
              font-size: 6px;
              font-family: monospace;
            }
            .verification-qr {
              margin-top: 35px;
              display: flex;
              flex-direction: column;
              align-items: center;
              font-size: 9px;
              color: #6e7b6c;
            }
            .qr-placeholder {
              width: 70px;
              height: 70px;
              border: 1px solid #bdcaba;
              background: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 8px;
              color: #333;
              margin-bottom: 5px;
            }
            @media print {
              body { padding: 0; }
              .print-btn-bar { display: none !important; }
            }
            .print-btn-bar {
              background: #f4fcf0;
              border: 1px solid #bdcaba;
              padding: 12px 20px;
              border-radius: 12px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            }
            .btn {
              background: #006b2c;
              color: #fff;
              border: none;
              padding: 8px 16px;
              font-size: 11px;
              font-weight: bold;
              border-radius: 20px;
              cursor: pointer;
            }
            .btn-secondary {
              background: transparent;
              border: 1px solid #006b2c;
              color: #006b2c;
            }
          </style>
        </head>
        <body>
          <div class="print-btn-bar">
            <span style="font-weight: bold; font-size: 12px; color: #006b2c;">Dokumen Kontrak Resmi Sewarion</span>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary" onclick="window.close()">Tutup Halaman</button>
              <button class="btn" onclick="window.print()">Cetak / Simpan PDF</button>
            </div>
          </div>
          
          <div class="paper">
            <div class="header">
              <div class="logo">SEWARION</div>
              <div style="font-size: 9px; color: #546253; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; margin-top: 2px;">Peer-to-Peer Rental Network & Escrow Guarantee</div>
              <div class="doc-title">SURAT PERJANJIAN SEWA MENYEWAKAN ASET</div>
              <div class="doc-no">No: ${contractNo}</div>
            </div>

            <p class="legal-text" style="margin-bottom: 15px;">
              Pada hari ini, dibuat dan disepakati perjanjian sewa menyewa digital melalui platform Sewarion, yang mengikat secara hukum antara pihak-pihak di bawah ini:
            </p>

            <div class="section-title">PIHAK I (PEMILIK ASET / VENDOR)</div>
            <table class="info-table">
              <tr>
                <td class="label">Nama Lengkap</td>
                <td class="value">${ownerName}</td>
              </tr>
              <tr>
                <td class="label">Alamat Terdaftar</td>
                <td class="value">${order.product.locationDetail}, ${order.product.location}</td>
              </tr>
              <tr>
                <td class="label">Kontak / Email</td>
                <td class="value">${order.product.ownerId || 'admin@sewarion.com'}</td>
              </tr>
            </table>

            <div class="section-title">PIHAK II (PENYEWA ASET / USER)</div>
            <table class="info-table">
              <tr>
                <td class="label">Nama Lengkap</td>
                <td class="value">${user.fullName}</td>
              </tr>
              <tr>
                <td class="label">Nomor KTP (NIK)</td>
                <td class="value">${user.nikNumber || '3174xxxxxxxx4002'}</td>
              </tr>
              <tr>
                <td class="label">Alamat Pengiriman</td>
                <td class="value">${order.shippingAddress || 'Sesuai KYC Terdaftar'}</td>
              </tr>
              <tr>
                <td class="label">Kontak / Email</td>
                <td class="value">${renterName}</td>
              </tr>
            </table>

            <div class="section-title">OBYEK SEWA & METRIK BIAYA</div>
            <table class="item-table">
              <thead>
                <tr>
                  <th>Nama Barang</th>
                  <th>Kategori</th>
                  <th>Tarif Harian</th>
                  <th>Durasi Sewa</th>
                  <th>Metode Kurir</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>${order.product.name}</b></td>
                  <td>${order.product.category}</td>
                  <td>Rp ${order.product.pricePerDay.toLocaleString('id-ID')}</td>
                  <td>${order.durationDays} Hari</td>
                  <td>${order.shippingMethod || 'Ambil Sendiri'}</td>
                </tr>
              </tbody>
            </table>

            <table class="item-table" style="margin-top: 10px; font-weight: bold; width: 45%; margin-left: auto;">
              <tr>
                <td style="width: 60%; background: #f4fcf0;">Subtotal Sewa</td>
                <td>Rp ${(order.product.pricePerDay * order.durationDays).toLocaleString('id-ID')}</td>
              </tr>
              <tr>
                <td style="background: #f4fcf0;">Biaya Pengiriman</td>
                <td>Rp ${(order.shippingFee || 0).toLocaleString('id-ID')}</td>
              </tr>
              <tr>
                <td style="background: #f4fcf0;">Asuransi & Layanan (2.5%)</td>
                <td>Rp ${(25000 + (order.product.pricePerDay * order.durationDays * 0.025)).toLocaleString('id-ID')}</td>
              </tr>
              <tr style="font-size: 12px; color: #006b2c; border-top: 2px solid #006b2c;">
                <td style="background: #eff6ea;">TOTAL TRANSAKSI</td>
                <td style="background: #eff6ea;">Rp ${order.totalPayment.toLocaleString('id-ID')}</td>
              </tr>
            </table>

            <div class="section-title">KETENTUAN HUKUM & PASAL PERJANJIAN</div>
            <p class="legal-text">
              1. <b>Penyerahan Barang:</b> Pihak I menjamin barang diserahkan dalam kondisi layak pakai dan sesuai spesifikasi. Pihak II berkewajiban merawat barang dengan baik selama masa sewa berjalan. <br/>
              2. <b>Kerusakan & Kehilangan:</b> Apabila terjadi kerusakan yang disebabkan kelalaian Pihak II, maka Pihak II bertanggung jawab penuh atas biaya perbaikan atau penggantian senilai harga pasar barang. Segala sengketa dijamin oleh garansi asuransi bersama Sewarion.<br/>
              3. <b>Keterlambatan:</b> Keterlambatan pengembalian aset di luar masa tenggang 2 (dua) jam dikenakan denda keterlambatan sebesar 10% dari tarif harian standar per jam keterlambatan, terakumulasi harian.<br/>
              4. <b>Keabsahan Hukum:</b> Perjanjian ini sah secara hukum dan mengikat kedua belah pihak di bawah payung UU ITE dan regulasi hukum perdata Republik Indonesia, digenerate otomatis menggunakan E-Meterai digital resmi platform Sewarion.
            </p>

            ${overdueInfo.isLate && overdueInfo.lateFee > 0 ? `
              <div class="section-title" style="background: #fff0f0; border-left-color: #d32f2f;">LAMPIRAN: TANDA TERIMA DENDA KETERLAMBATAN</div>
              <table class="info-table" style="background: #fffdfd; border: 1px solid #ffcdd2; padding: 10px; border-radius: 8px; margin-top: 10px;">
                <tr>
                  <td class="label" style="color: #c62828;">Status Denda</td>
                  <td class="value"><span style="color: #2e7d32; font-weight: bold; background: #e8f5e9; padding: 2px 8px; rounded: 4px;">LUNAS / TERBAYAR</span></td>
                </tr>
                <tr>
                  <td class="label">Durasi Keterlambatan</td>
                  <td class="value"><b>${overdueInfo.lateDays} Hari ${overdueInfo.lateHours} Jam</b> (Masa tenggang 2 jam terlampaui)</td>
                </tr>
                <tr>
                  <td class="label">Total Pembayaran Denda</td>
                  <td class="value" style="font-size: 12px; color: #d32f2f;"><b>Rp ${overdueInfo.lateFee.toLocaleString('id-ID')}</b></td>
                </tr>
                <tr>
                  <td class="label">Metode Pembayaran</td>
                  <td class="value">Transfer Digital Terverifikasi (QRIS/VA)</td>
                </tr>
              </table>
              <p class="legal-text" style="color: #2e7d32; font-weight: bold; text-align: center; margin-top: 10px;">
                ✓ Denda Keterlambatan telah dibayar lunas. Objek sewa telah dikembalikan dalam kondisi semula.
              </p>
            ` : ''}

            <div class="signatures">
              <div class="sig-box">
                <div class="sig-title">PIHAK I (Pemilik)</div>
                <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 16px; color: #006b2c; opacity: 0.8; margin-top: 20px;">
                  Ttd. Digital (${ownerName.split(' ')[0]})
                </div>
                <div class="sig-name">${ownerName}</div>
              </div>
              
              <div class="sig-box">
                <div class="sig-title">PIHAK II (Penyewa)</div>
                
                <div class="emeterai-box">
                  <span class="title">E-METERAI</span>
                  <span style="font-size: 5px;">REPUBLIK INDONESIA</span>
                  <span class="price">10000</span>
                  <span style="font-size: 4px;">SEPULUH RIBU RUPIAH</span>
                  <span class="stamp-date">${new Date().toISOString().slice(0,10)}</span>
                </div>

                <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 16px; color: #4b0082; opacity: 0.7; margin-top: 20px; z-index: 5;">
                  Ttd. Digital (${user.fullName.split(' ')[0]})
                </div>
                <div class="sig-name">${user.fullName}</div>
              </div>
            </div>

            <div class="verification-qr">
              <div class="qr-placeholder">
                <svg width="60" height="60" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0h7v7H0V0zm2 2v3h3V2H2zm8-2h1v1h-1V0zm2 0h2v1h-1v1h-1V0zm3 0h4v1h-4V0zm5 0h1v2h-1V0zm2 0h1v1h-1V0zM8 2h1v2H8V2zm3 0h1v1h-1V2zm3 0h1v1h-1V2zm-3 2h3v1h-3V4zm5 0h1v1h-1V4zm2 0h1v2h-1V4zm2 0h1v1h-1V4zm-7 2h1v1h-1V6zm3 0h1v1h-1V6zm-9 2h7v7H0V8zm2 2v3h3v-3H2zm8-2h1v1h-1V8zm2 0h1v2h-1V8zm2 0h1v1h-1V8zm4 0h1v1h-1V8zm2 0h1v1h-1V8zm2 0h1v2h-1V8zm-9 2h1v1h-1v-1zm2 0h1v2h-1v-2zm3 0h1v1h-1v-1zm4 0h1v2h-1v-2zm2 0h1v1h-1v-1zm-9 2h2v1h-2v-1zm4 0h1v1h-1v-1zm4 0h1v1h-1v-1zm-6 2h1v1h-1v-1zm2 0h2v1h-2v-1zm3 0h3v1h-3v-1zm-10 2h1v1H8v-1zm3 0h3v1h-3v-1zm4 0h1v1h-1v-1zm5 0h2v1h-2v-1zm2 0h2v1h-2v-1zm-13 2h1v1H9v-1zm2 0h1v1h-1v-1zm3 0h1v1h-1v-1zm3 0h1v1h-1v-1zm2 0h1v1h-1v-1zm3 0h2v2h-1v-1h-1v-1zm-8 2h1v1H9v-1zm3 0h1v1h-1v-1zm2 0h3v1h-3v-1z" fill="#006b2c"/>
                </svg>
              </div>
              <span>Dokumen ini diverifikasi secara digital oleh sistem keamanan enkripsi P2P Sewarion.</span>
            </div>
            
            <div class="footer" style="text-align: center; margin-top: 30px; font-size: 9px; color: #546253; border-top: 1px solid #bdcaba; padding-top: 10px;">
              Perjanjian ini berlaku sejak diselesaikannya pembayaran sewa secara digital dan bersifat sah secara perdata.
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleOpenChat = (order: Order) => {
    setSelectedOrderForChat(order);
    setChatOpen(true);
  };

  const handleCompleteOrderClick = (order: Order) => {
    const overdueInfo = getOrderOverdueInfo(order);

    if (overdueInfo.isLate && overdueInfo.lateFee > 0 && !order.lateFeePaid) {
      setSelectedOrderForLateFee(order);
      setShowLateModal(true);
    } else {
      if (window.confirm('Tandai sewa sebagai selesai? Barang sudah harus dikembalikan dalam kondisi baik.')) {
        appCtx.updateOrder(order.id, 'completed');
      }
    }
  };

  const handlePayLateFee = () => {
    if (!selectedOrderForLateFee) return;

    setIsPayingLate(true);

    const overdueInfo = getOrderOverdueInfo(selectedOrderForLateFee);

    // Simulate network delay for premium visual feedback
    setTimeout(() => {
      appCtx.updateOrder(selectedOrderForLateFee.id, 'completed', {
        lateDays: overdueInfo.lateDays,
        lateHours: overdueInfo.lateHours,
        lateFee: overdueInfo.lateFee,
        lateFeePaid: true,
        actualReturnDate: new Date().toISOString()
      });

      setIsPayingLate(false);
      setShowLateModal(false);
      setSelectedOrderForLateFee(null);

      alert('Pembayaran denda keterlambatan berhasil! Sewa telah diselesaikan.');
    }, 1500);
  };

  // ─── RENDER ADMIN VIEW (Pusat Mediasi Sewarion) ───
  if (isAdmin) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 md:px-10 py-12 min-h-[70vh] font-sans">
        
        {/* Admin Header */}
        <div className="mb-10 text-left">
          <div className="flex items-center gap-2 text-[#006b2c] dark:text-[#7ffc97] mb-2 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Dasbor Penengah Resmi</span>
          </div>
          <h1 className="font-sans font-black text-2xl lg:text-3xl text-[#171d16] dark:text-[#dde5d9] tracking-tight">
            Pusat Mediasi Sewarion (Admin)
          </h1>
          <p className="font-sans text-xs text-[#6e7b6c] dark:text-[#9bb098] mt-1.5 leading-relaxed">
            Sebagai penengah P2P rental, Anda memantau seluruh kontrak aktif, memverifikasi tanda terima denda, dan berkoordinasi langsung dengan Penyewa & Pemilik.
          </p>
        </div>

        {/* Admin Tab Filters */}
        <div className="border-b border-[#bdcaba]/40 dark:border-[#2b3a27]/40 flex gap-6 md:gap-10 overflow-x-auto pb-1 mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider focus:outline-none transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'text-[#006b2c] dark:text-[#7ffc97] border-b-2 border-[#006b2c] dark:border-[#7ffc97]'
                : 'text-[#6e7b6c] dark:text-[#9bb098] hover:text-[#006b2c] dark:hover:text-white'
            }`}
          >
            Semua Kontrak Aset
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider focus:outline-none transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'paid'
                ? 'text-[#006b2c] dark:text-[#7ffc97] border-b-2 border-[#006b2c] dark:border-[#7ffc97]'
                : 'text-[#6e7b6c] dark:text-[#9bb098] hover:text-[#006b2c] dark:hover:text-white'
            }`}
          >
            Sewa Berjalan (Lunas)
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider focus:outline-none transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'completed'
                ? 'text-[#006b2c] dark:text-[#7ffc97] border-b-2 border-[#006b2c] dark:border-[#7ffc97]'
                : 'text-[#6e7b6c] dark:text-[#9bb098] hover:text-[#006b2c] dark:hover:text-white'
            }`}
          >
            Selesai / Terarsip
          </button>
        </div>

        {/* Admin Stack Grid */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const overdueInfo = getOrderOverdueInfo(order);

              return (
                <div
                  key={order.id}
                  className={`bg-white dark:bg-[#151f14] p-6 rounded-2xl border shadow-md flex flex-col md:flex-row justify-between gap-6 hover:shadow-lg transition-all duration-300 border-[#bdcaba]/35 dark:border-[#2b3a27]`}
                >
                  <div className="flex flex-col sm:flex-row gap-5 text-left">
                    <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-[#eff6ea] dark:bg-[#0f140e] flex-shrink-0 border border-[#bdcaba]/20 dark:border-[#2b3a27]/30">
                      <img src={order.product.image} className="w-full h-full object-cover" alt={order.product.name} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[#171d16] dark:text-[#dde5d9] bg-[#f4fcf0] dark:bg-[#0f140e] px-2 py-0.5 rounded border border-[#bdcaba]/40 dark:border-[#2b3a27]">
                          KONTRAK ID: {order.id}
                        </span>
                        {getStatusBadge(order)}
                      </div>

                      <h3 className="font-sans font-extrabold text-base text-[#171d16] dark:text-[#dde5d9] pt-1">
                        {order.product.name}
                      </h3>

                      {/* Renter & Owner Contacts */}
                      <div className="pt-2 text-[11px] text-[#3e4a3d] dark:text-[#b4c3b2] space-y-0.5">
                        <p>👤 <strong>Penyewa</strong>: {order.userEmail || 'Budi Penyewa'}</p>
                        <p>💼 <strong>Pemilik</strong>: {order.product.ownerId === 'system' ? 'Jakarta Lens Hub (Official)' : order.product.ownerId}</p>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2 text-[10px] text-[#6e7b6c] dark:text-[#9bb098] font-semibold uppercase tracking-wider">
                        <p className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#006b2c] dark:text-[#7ffc97]" />
                          <span>{formatIndonesianDate(order.startDate)} - {formatIndonesianDate(order.endDate)} ({order.durationDays} hari)</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-row md:flex-col justify-between md:justify-center items-end border-t md:border-t-0 border-[#eff6ea] dark:border-[#2b3a27]/20 pt-4 md:pt-0 gap-4">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] text-[#6e7b6c] dark:text-[#9bb098] font-semibold uppercase tracking-wider">Nilai Transaksi</p>
                      <p className="font-sans font-black text-lg text-[#006b2c] dark:text-[#7ffc97] mt-0.5">
                        Rp {order.totalPayment.toLocaleString('id-ID')}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <button
                        onClick={() => handleOpenChat(order)}
                        className="bg-[#006b2c] hover:bg-[#00873a] text-white px-4 py-2 rounded-full font-sans text-xs font-bold flex items-center gap-1.5 transition-all focus:outline-none cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Masuk Mediasi</span>
                      </button>

                      <button
                        onClick={() => handleDownloadContract(order)}
                        className="p-2 rounded-full border border-[#bdcaba] dark:border-[#2b3a27] text-[#6e7b6c] dark:text-[#dde5d9] hover:text-[#006b2c] dark:hover:text-white hover:bg-[#f4fcf0] dark:hover:bg-[#1c2818]/60 transition-colors cursor-pointer"
                        title="Tinjau Kontrak Hukum Digital"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#eff6ea]/55 dark:bg-[#141b12] rounded-3xl p-16 border border-[#bdcaba]/30 dark:border-[#2b3a27]/30 text-center max-w-lg mx-auto">
            <p className="font-sans text-sm text-[#3e4a3d] dark:text-[#9bb098] font-semibold">Belum ada kontrak aktif di sistem.</p>
          </div>
        )}

        {/* Real-time Message Chat Drawer Overlay for Admin */}
        {selectedOrderForChat && (
          <ChatDrawer
            isOpen={chatOpen}
            onClose={() => {
              setChatOpen(false);
              setSelectedOrderForChat(null);
            }}
            currentUserEmail={user.email}
            order={selectedOrderForChat}
          />
        )}
      </div>
    );
  }

  // ─── RENDER STANDARD USER VIEW ───
  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-10 py-12 min-h-[70vh] font-sans">
      
      {/* Header with Late return simulation toggle */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
        <div>
          <h1 className="font-sans font-extrabold text-2xl lg:text-3xl text-[#171d16] dark:text-[#dde5d9] tracking-tight">
            Riwayat Sewa Saya
          </h1>
          <p className="font-sans text-xs text-[#6e7b6c] dark:text-[#9bb098] mt-1">
            Pantau status kontrak digital, durasi waktu sewa aktif, dan tagihan pesanan Anda di satu dasbor terpadu.
          </p>
        </div>

        {/* Premium Simulation Mode Toggle */}
        <div className="flex items-center gap-3 p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/35 rounded-2xl">
          <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
          <div className="text-left font-sans text-xs">
            <p className="font-bold text-[#171d16] dark:text-[#dde5d9]">Mode Simulasi Keterlambatan</p>
            <p className="text-[9px] text-[#6e7b6c] dark:text-[#9bb098]">Offset waktu kembali (+2 hari 4 jam)</p>
          </div>
          <button
            onClick={() => setSimulateOverdue(!simulateOverdue)}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 focus:outline-none ${
              simulateOverdue ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                simulateOverdue ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="border-b border-[#bdcaba]/40 dark:border-[#2b3a27]/40 flex gap-6 md:gap-10 overflow-x-auto pb-1 mb-8">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider focus:outline-none transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'all'
              ? 'text-[#006b2c] dark:text-[#7ffc97] border-b-2 border-[#006b2c] dark:border-[#7ffc97]'
              : 'text-[#6e7b6c] dark:text-[#9bb098] hover:text-[#006b2c] dark:hover:text-white'
          }`}
        >
          Semua Transaksi
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider focus:outline-none transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'pending'
              ? 'text-[#006b2c] dark:text-[#7ffc97] border-b-2 border-[#006b2c] dark:border-[#7ffc97]'
              : 'text-[#6e7b6c] dark:text-[#9bb098] hover:text-[#006b2c] dark:hover:text-white'
          }`}
        >
          Menunggu Pembayaran
        </button>
        <button
          onClick={() => setActiveTab('paid')}
          className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider focus:outline-none transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'paid'
              ? 'text-[#006b2c] dark:text-[#7ffc97] border-b-2 border-[#006b2c] dark:border-[#7ffc97]'
              : 'text-[#6e7b6c] dark:text-[#9bb098] hover:text-[#006b2c] dark:hover:text-white'
          }`}
        >
          Sewa Berjalan (Lunas)
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider focus:outline-none transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'completed'
              ? 'text-[#006b2c] dark:text-[#7ffc97] border-b-2 border-[#006b2c] dark:border-[#7ffc97]'
              : 'text-[#6e7b6c] dark:text-[#9bb098] hover:text-[#006b2c] dark:hover:text-white'
          }`}
        >
          Selesai
        </button>
      </div>

      {/* Transactions Stack Grid */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const overdueInfo = getOrderOverdueInfo(order);

            return (
              <div
                key={order.id}
                className={`bg-white dark:bg-[#151f14] p-6 rounded-2xl border shadow-md flex flex-col md:flex-row justify-between gap-6 hover:shadow-lg transition-all duration-300 ${
                  order.status === 'paid' && overdueInfo.isLate && overdueInfo.lateFee > 0
                    ? 'border-red-300 dark:border-red-900/50 bg-red-50/10 dark:bg-red-950/5'
                    : 'border-[#bdcaba]/35 dark:border-[#2b3a27]'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-5 text-left">
                  {/* Media frame */}
                  <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-[#eff6ea] dark:bg-[#0f140e] flex-shrink-0 border border-[#bdcaba]/20 dark:border-[#2b3a27]/30">
                    <img src={order.product.image} className="w-full h-full object-cover" alt={order.product.name} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#171d16] dark:text-[#dde5d9] bg-[#f4fcf0] dark:bg-[#0f140e] px-2 py-0.5 rounded border border-[#bdcaba]/40 dark:border-[#2b3a27]">
                        ID: {order.id}
                      </span>
                      {getStatusBadge(order)}
                    </div>

                    <h3 className="font-sans font-extrabold text-base text-[#171d16] dark:text-[#dde5d9] pt-1">
                      {order.product.name}
                    </h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2 text-[11px] text-[#6e7b6c] dark:text-[#9bb098] font-medium">
                      <p className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#006b2c] dark:text-[#7ffc97]" />
                        <span>{formatIndonesianDate(order.startDate)} - {formatIndonesianDate(order.endDate)} ({order.durationDays} hari)</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <Receipt className="w-3.5 h-3.5 text-[#006b2c] dark:text-[#7ffc97]" />
                        <span>Metode: {order.paymentMethod}</span>
                      </p>
                    </div>

                    {/* Display late fee warnings right on the card */}
                    {order.status === 'paid' && overdueInfo.isLate && overdueInfo.lateFee > 0 && (
                      <div className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-100/40 dark:bg-red-950/20 px-3 py-1.5 rounded-xl border border-red-200/50 dark:border-red-900/35 inline-block text-left">
                        Terlambat: {overdueInfo.lateDays} Hari {overdueInfo.lateHours} Jam · <span className="font-bold underline text-red-700 dark:text-red-300">Denda: Rp {overdueInfo.lateFee.toLocaleString('id-ID')}</span>
                      </div>
                    )}

                    {order.status === 'completed' && order.lateFee && (
                      <div className="mt-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl inline-block text-left">
                        Riwayat keterlambatan: {order.lateDays} Hari {order.lateHours} Jam (Denda Rp {order.lateFee.toLocaleString('id-ID')} - LUNAS)
                      </div>
                    )}
                  </div>
                </div>

                {/* Action column bar right */}
                <div className="flex flex-row md:flex-col justify-between md:justify-center items-end border-t md:border-t-0 border-[#eff6ea] dark:border-[#2b3a27]/20 pt-4 md:pt-0 gap-4">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] text-[#6e7b6c] dark:text-[#9bb098] font-semibold uppercase tracking-wider">Total Transaksi</p>
                    <p className="font-sans font-black text-lg text-[#006b2c] dark:text-[#7ffc97] mt-0.5">
                      Rp {order.totalPayment.toLocaleString('id-ID')}
                    </p>
                  </div>

                  <div className="flex gap-2 items-center">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => navigate({ type: 'payment-pending', order })}
                        className="bg-[#006b2c] hover:bg-[#00873a] text-white px-5 py-2.5 rounded-full font-sans text-xs font-bold shadow-md active:scale-95 transition-transform cursor-pointer"
                      >
                        Bayar Sekarang
                      </button>
                    )}

                    {order.status === 'paid' && (
                      <>
                        <button
                          onClick={() => handleCompleteOrderClick(order)}
                          className={`px-5 py-2.5 rounded-full font-sans text-xs font-bold transition-transform active:scale-95 shadow-sm cursor-pointer ${
                            overdueInfo.isLate && overdueInfo.lateFee > 0
                              ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-200'
                              : 'bg-[#006b2c] hover:bg-[#00873a] text-white'
                          }`}
                        >
                          {overdueInfo.isLate && overdueInfo.lateFee > 0 ? 'Bayar Denda & Selesai' : 'Tandai Selesai'}
                        </button>
                        <button
                          onClick={() => handleDownloadContract(order)}
                          className="p-2.5 rounded-full border border-[#bdcaba] dark:border-[#2b3a27] text-[#6e7b6c] dark:text-[#dde5d9] hover:text-[#006b2c] dark:hover:text-white hover:bg-[#f4fcf0] dark:hover:bg-[#1c2818]/60 transition-colors cursor-pointer"
                          title="Cetak Kontrak Hukum Digital"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenChat(order)}
                          className="bg-[#006b2c]/10 text-[#006b2c] dark:text-[#7ffc97] hover:bg-[#006b2c] dark:hover:bg-[#00873a] hover:text-white px-4 py-2.5 rounded-full font-sans text-xs font-bold flex items-center gap-1.5 transition-all focus:outline-none cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat Mediasi</span>
                        </button>
                      </>
                    )}

                    {order.status === 'completed' && (
                      <>
                        <button
                          onClick={() => navigate({ type: 'product-detail', productId: order.product.id })}
                          className="bg-[#eff6ea] dark:bg-[#1a2517] hover:bg-[#bdcaba]/30 text-[#006b2c] dark:text-[#7ffc97] border border-[#006b2c]/30 dark:border-[#00873a]/30 px-5 py-2.5 rounded-full font-sans text-xs font-bold transition-transform active:scale-95 cursor-pointer"
                        >
                          Sewa Lagi
                        </button>
                        <button
                          onClick={() => handleDownloadContract(order)}
                          className="p-2.5 rounded-full border border-[#bdcaba] dark:border-[#2b3a27] text-[#6e7b6c] dark:text-[#dde5d9] hover:text-[#006b2c] dark:hover:text-white hover:bg-[#f4fcf0] dark:hover:bg-[#1c2818]/60 transition-colors cursor-pointer"
                          title="Cetak Kontrak Hukum Digital"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenChat(order)}
                          className="bg-[#006b2c]/10 text-[#006b2c] dark:text-[#7ffc97] hover:bg-[#006b2c] dark:hover:bg-[#00873a] hover:text-white px-4 py-2.5 rounded-full font-sans text-xs font-bold flex items-center gap-1.5 transition-all focus:outline-none cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat Mediasi</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#eff6ea]/55 dark:bg-[#141b12] rounded-3xl p-16 border border-[#bdcaba]/30 dark:border-[#2b3a27]/30 text-center max-w-lg mx-auto">
          <p className="font-sans text-sm text-[#3e4a3d] dark:text-[#9bb098] font-semibold">Belum ada riwayat transaksi sewa terdaftar dengan status ini.</p>
          <button
            onClick={() => navigate({ type: 'home' })}
            className="mt-6 bg-[#006b2c] hover:bg-[#00873a] text-white font-sans text-xs font-semibold py-3 px-8 rounded-full shadow-sm active:scale-95 transition-transform inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Mulai Explore Rental</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Real-time Message Chat Drawer Overlay */}
      {user.isLoggedIn && selectedOrderForChat && (
        <ChatDrawer
          isOpen={chatOpen}
          onClose={() => {
            setChatOpen(false);
            setSelectedOrderForChat(null);
          }}
          currentUserEmail={user.email}
          order={selectedOrderForChat}
        />
      )}

      {/* Premium Late Return Fee Payment Overlay Modal */}
      {showLateModal && selectedOrderForLateFee && (() => {
        const overdueInfo = getOrderOverdueInfo(selectedOrderForLateFee);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-[#151f14] border border-[#bdcaba]/40 dark:border-[#2b3a27] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-left font-sans animate-in zoom-in-95 duration-200">
              
              {/* Modal Title */}
              <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-400">
                <AlertTriangle className="w-6 h-6 flex-shrink-0 animate-bounce" />
                <h3 className="font-sans font-extrabold text-lg text-[#171d16] dark:text-[#dde5d9]">
                  Denda Keterlambatan Sewa
                </h3>
              </div>

              <p className="text-xs text-[#546253] dark:text-[#9bb198] leading-relaxed mb-4">
                Barang sewaan Anda telah melewati batas waktu pengembalian yang disetujui dalam kontrak. Silakan selesaikan denda sebelum menyelesaikan transaksi.
              </p>

              {/* OVERDUE DETAILS */}
              <div className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 text-xs space-y-2 mb-6">
                <div className="flex justify-between text-[#3e4a3d] dark:text-[#b4c3b2]">
                  <span>Batas Pengembalian</span>
                  <span className="font-semibold">{formatIndonesianDate(selectedOrderForLateFee.endDate)}</span>
                </div>
                <div className="flex justify-between text-[#3e4a3d] dark:text-[#b4c3b2]">
                  <span>Durasi Terlambat</span>
                  <span className="font-bold text-red-600 dark:text-red-400">{overdueInfo.lateDays} Hari {overdueInfo.lateHours} Jam</span>
                </div>
                <div className="flex justify-between text-[#3e4a3d] dark:text-[#b4c3b2]">
                  <span>Tarif Denda</span>
                  <span>10% Harian / Jam</span>
                </div>
                <div className="pt-2 border-t border-red-200/50 dark:border-red-900/30 flex justify-between items-center font-bold text-sm">
                  <span className="text-[#171d16] dark:text-[#dde5d9]">Total Tagihan Denda</span>
                  <span className="text-red-600 dark:text-red-400 font-extrabold text-base">Rp {overdueInfo.lateFee.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* METHOD CHOOSER */}
              <div className="space-y-3 mb-6">
                <p className="text-[10px] text-[#6e7b6c] dark:text-[#8ea08c] font-bold uppercase tracking-wider">Pilih Metode Pembayaran</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedLatePayment('qris')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-sans text-xs font-bold transition-all cursor-pointer ${
                      selectedLatePayment === 'qris'
                        ? 'border-[#006b2c] dark:border-[#00873a] bg-[#006b2c]/5 dark:bg-[#006b2c]/10 text-[#006b2c] dark:text-[#7ffc97]'
                        : 'border-[#bdcaba] dark:border-[#2b3a27] text-[#6e7b6c] dark:text-[#9bb098] hover:bg-[#eff6ea]/45'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>QRIS Instan</span>
                  </button>
                  <button
                    onClick={() => setSelectedLatePayment('va')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-sans text-xs font-bold transition-all cursor-pointer ${
                      selectedLatePayment === 'va'
                        ? 'border-[#006b2c] dark:border-[#00873a] bg-[#006b2c]/5 dark:bg-[#006b2c]/10 text-[#006b2c] dark:text-[#7ffc97]'
                        : 'border-[#bdcaba] dark:border-[#2b3a27] text-[#6e7b6c] dark:text-[#9bb098] hover:bg-[#eff6ea]/45'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>Virtual Account</span>
                  </button>
                </div>
              </div>

              {/* DYNAMIC METRIC INSTRUCTIONS */}
              <div className="p-4 bg-[#eff6ea]/55 dark:bg-[#1a2318]/45 border border-[#bdcaba]/35 dark:border-[#2f3d2d] rounded-2xl flex flex-col items-center justify-center text-center mb-6">
                {selectedLatePayment === 'qris' ? (
                  <>
                    {/* Mock QR Code */}
                    <div className="w-36 h-36 bg-white border border-[#bdcaba]/70 p-2 rounded-xl flex items-center justify-center mb-2 shadow-sm">
                      <svg width="120" height="120" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h7v7H0V0zm2 2v3h3V2H2zm8-2h1v1h-1V0zm2 0h2v1h-1v-1H8v-1zm1 0h1v1h-1V0zm3 0h4v1h-4V0zm5 0h1v2h-1V0zm2 0h1v1h-1V0zM8 2h1v2H8V2zm3 0h1v1h-1V2zm3 0h1v1h-1V2zm-3 2h3v1h-3V4zm5 0h1v1h-1V4zm2 0h1v2h-1V4zm2 0h1v1h-1V4zm-7 2h1v1h-1V6zm3 0h1v1h-1V6zm-9 2h7v7H0V8zm2 2v3h3v-3H2zm8-2h1v1h-1V8zm2 0h1v2h-1V8zm2 0h1v1h-1V8zm4 0h1v1h-1V8zm2 0h1v1h-1V8zm2 0h1v2h-1V8zm-9 2h1v1h-1v-1zm2 0h1v2h-1v-2zm3 0h1v1h-1v-1zm4 0h1v2h-1v-2zm2 0h1v1h-1v-1zm-9 2h2v1h-2v-1zm4 0h1v1h-1v-1zm4 0h1v1h-1v-1zm-6 2h1v1h-1v-1zm2 0h2v1h-2v-1zm3 0h3v1h-3v-1zm-10 2h1v1H8v-1zm3 0h3v1h-3v-1zm4 0h1v1h-1v-1zm5 0h2v1h-2v-1zm2 0h2v1h-2v-1zm-13 2h1v1H9v-1zm2 0h1v1h-1v-1zm3 0h1v1h-1v-1zm3 0h1v1h-1v-1zm2 0h1v1h-1v-1zm3 0h2v2h-1v-1h-1v-1zm-8 2h1v1H9v-1zm3 0h1v1h-1v-1zm2 0h3v1h-3v-1z" fill="#b91c1c"/>
                      </svg>
                    </div>
                    <p className="text-[10px] text-[#6e7b6c] dark:text-[#9bb098] font-bold">SCAN QRIS UNTUK MEMBAYAR DENDA</p>
                  </>
                ) : (
                  <div className="w-full space-y-2 font-mono text-[11px] text-[#171d16] dark:text-[#dde5d9] py-2 text-left">
                    <p className="font-sans font-bold text-center text-[#6e7b6c] dark:text-[#9bb098] text-[9px] uppercase tracking-wide mb-2">BANK MANDIRI VIRTUAL ACCOUNT</p>
                    <div className="flex justify-between bg-white dark:bg-[#0f140e] p-2.5 rounded-lg border border-[#bdcaba]/35 dark:border-[#2b3a27]">
                      <span>No. Rekening VA:</span>
                      <span className="font-bold text-[#006b2c] dark:text-[#7ffc97]">8801 0812 3456 7890</span>
                    </div>
                    <div className="flex justify-between bg-white dark:bg-[#0f140e] p-2.5 rounded-lg border border-[#bdcaba]/35 dark:border-[#2b3a27]">
                      <span>Nama Penerima:</span>
                      <span>Denda Sewarion - {user.fullName.split(' ')[0]}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowLateModal(false);
                    setSelectedOrderForLateFee(null);
                  }}
                  disabled={isPayingLate}
                  className="flex-1 py-3 border border-[#bdcaba] dark:border-[#2b3a27] text-[#6e7b6c] dark:text-[#9bb098] hover:bg-[#eff6ea]/45 rounded-full font-sans text-xs font-bold focus:outline-none transition-colors cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  onClick={handlePayLateFee}
                  disabled={isPayingLate}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-full font-sans text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  {isPayingLate ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Memverifikasi...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Bayar Denda</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}
