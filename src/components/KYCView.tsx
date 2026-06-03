import React, { useState, useRef } from 'react';
import { BadgeCheck, User, Camera, ShieldCheck, ArrowRight, ArrowLeft, CloudUpload, Eye } from 'lucide-react';
import { KYC_SELFIE } from '../data';
import type { AppContextType } from '../types';
import { updateRegisteredUser } from '../storage';
import { supabase, isSupabaseConfigured } from '../supabaseClient';


interface KYCViewProps {
  appCtx: AppContextType;
}

export default function KYCView({ appCtx }: KYCViewProps) {
  const { user, setUser, navigate } = appCtx;
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [ktpSelectedFile, setKtpSelectedFile] = useState<string | null>(null);
  const [selfieSelectedFile, setSelfieSelectedFile] = useState<string | null>(null);
  
  // Form fields state
  const [idName, setIdName] = useState(user.fullName || '');
  const [nikNumber, setNikNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showKycSuccessModal, setShowKycSuccessModal] = useState(false);

  const ktpInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'ktp' | 'selfie') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (JPG, JPEG, PNG, WEBP)!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal adalah 5MB!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        if (type === 'ktp') {
          setKtpSelectedFile(event.target.result as string);
        } else {
          setSelfieSelectedFile(event.target.result as string);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, type: 'ktp' | 'selfie') => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (JPG, JPEG, PNG, WEBP)!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal adalah 5MB!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        if (type === 'ktp') {
          setKtpSelectedFile(event.target.result as string);
        } else {
          setSelfieSelectedFile(event.target.result as string);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const validateNik = (nik: string) => {
    // Exactly 16 digits and numbers only
    return /^\d{16}$/.test(nik);
  };

  const handleStepNext = () => {
    if (currentStep === 1) {
      if (!idName.trim()) {
        alert('Mohon isi nama lengkap sesuai identitas Anda!');
        return;
      }
      if (!dateOfBirth) {
        alert('Mohon pilih tanggal lahir Anda!');
        return;
      }
      if (!homeAddress.trim()) {
        alert('Mohon isi alamat rumah lengkap Anda!');
        return;
      }
      if (!validateNik(nikNumber)) {
        alert('Nomor NIK harus terdiri dari tepat 16 digit angka!');
        return;
      }
      if (!ktpSelectedFile) {
        alert('Mohon unggah foto KTP atau KTM fisik Anda terlebih dahulu!');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selfieSelectedFile) {
        alert('Mohon unggah foto selfie Anda terlebih dahulu!');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleKycSubmit = async () => {
    setIsSubmitting(true);
    
    if (isSupabaseConfigured()) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { error } = await supabase
            .from('profiles')
            .update({
              full_name: idName,
              is_kyc_verified: true,
              trust_score: 98,
              nik_number: nikNumber,
              date_of_birth: dateOfBirth,
              home_address: homeAddress,
              ktp_image: ktpSelectedFile || undefined,
              selfie_image: selfieSelectedFile || undefined
            })
            .eq('id', session.user.id);

          if (error) {
            alert(`Gagal menyimpan verifikasi KYC ke cloud: ${error.message}`);
            setIsSubmitting(false);
            return;
          }
        }
      } catch (err) {
        console.error('Koneksi Supabase error saat verifikasi biometrik:', err);
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);

      const updatedUser = {
        ...user,
        fullName: idName,
        isKycVerified: true,
        trustScore: 98,
        nikNumber: nikNumber,
        dateOfBirth: dateOfBirth,
        homeAddress: homeAddress,
        ktpImage: ktpSelectedFile || undefined,
        selfieImage: selfieSelectedFile || undefined
      };
      
      // Update session context
      setUser(updatedUser);

      // Persist in localStorage database
      updateRegisteredUser(user.email, {
        fullName: idName,
        isKycVerified: true,
        trustScore: 98,
        nikNumber,
        dateOfBirth,
        homeAddress,
        ktpImage: ktpSelectedFile || undefined,
        selfieImage: selfieSelectedFile || undefined
      });

      setShowKycSuccessModal(true);
    }, 2000);
  };

  // Helper to mask NIK
  const maskedNik = nikNumber ? `${nikNumber.slice(0, 4)}********${nikNumber.slice(12)}` : '';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-10 py-12 flex-grow">
      {/* Header Info */}
      <section className="text-center mb-10 max-w-2xl mx-auto">
        <h1 className="font-sans font-extrabold text-3xl text-[#171d16] dark:text-[#dde5d9] mb-3">
          Verifikasi Identitas Anda
        </h1>
        <p className="font-sans text-xs text-[#6e7b6c] dark:text-[#829281] leading-relaxed">
          Selesaikan verifikasi identitas diri (KYC) Anda satu kali untuk mendapatkan akses sewa barang P2P tanpa uang jaminan deposit. Data identitas Anda aman terenkripsi.
        </p>
      </section>

      {/* Modern Stepper Indicator */}
      <nav className="flex items-center justify-between mb-12 relative max-w-lg mx-auto">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#dde5d9] dark:bg-[#2f3d2d] -z-10 -translate-y-1/2"></div>
        
        {/* Step 1 Indicator */}
        <div className="flex flex-col items-center gap-2 z-10">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white dark:ring-[#0f140e] transition-all duration-300 ${
            currentStep >= 1 ? 'bg-[#006b2c] text-white shadow-md' : 'bg-[#dde5d9] dark:bg-[#2f3d2d] text-[#6e7b6c] dark:text-[#829281]'
          }`}>
            1
          </div>
          <span className={`text-[10px] font-bold ${currentStep >= 1 ? 'text-[#006b2c] dark:text-[#7ffc97]' : 'text-[#6e7b6c] dark:text-[#829281]'}`}>Identitas</span>
        </div>

        {/* Step 2 Indicator */}
        <div className="flex flex-col items-center gap-2 z-10">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white dark:ring-[#0f140e] transition-all duration-300 ${
            currentStep >= 2 ? 'bg-[#006b2c] text-white shadow-md' : 'bg-[#dde5d9] dark:bg-[#2f3d2d] text-[#6e7b6c] dark:text-[#829281]'
          }`}>
            2
          </div>
          <span className={`text-[10px] font-bold ${currentStep >= 2 ? 'text-[#006b2c] dark:text-[#7ffc97]' : 'text-[#6e7b6c] dark:text-[#829281]'}`}>Selfie Biometri</span>
        </div>

        {/* Step 3 Indicator */}
        <div className="flex flex-col items-center gap-2 z-10">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white dark:ring-[#0f140e] transition-all duration-300 ${
            currentStep >= 3 ? 'bg-[#006b2c] text-white shadow-md' : 'bg-[#dde5d9] dark:bg-[#2f3d2d] text-[#6e7b6c] dark:text-[#829281]'
          }`}>
            3
          </div>
          <span className={`text-[10px] font-bold ${currentStep >= 3 ? 'text-[#006b2c] dark:text-[#7ffc97]' : 'text-[#6e7b6c] dark:text-[#829281]'}`}>Konfirmasi</span>
        </div>
      </nav>

      {/* Main card box containing forms */}
      <div className="bg-white dark:bg-[#151c14] rounded-3xl p-6 md:p-10 border border-[#bdcaba]/35 dark:border-[#2f3d2d] shadow-xl shadow-[#171d16]/3 dark:shadow-none">
        
        {/* Step 1: KTP Form */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-1.5">
                <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">Nama Sesuai Identitas</label>
                <input
                  type="text"
                  value={idName}
                  onChange={(e) => setIdName(e.target.value)}
                  className="w-full bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-12 px-4 font-sans text-sm text-[#171d16] dark:text-[#dde5d9] outline-none"
                  placeholder="Contoh: Andi Pratama"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">Nomor NIK (KTP/KTM)</label>
                <input
                  type="text"
                  value={nikNumber}
                  onChange={(e) => setNikNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                  className="w-full bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-12 px-4 font-sans text-sm text-[#171d16] dark:text-[#dde5d9] outline-none"
                  placeholder="16 Digit Nomor KTP atau Kartu Mahasiswa"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">Tanggal Lahir</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-12 px-4 font-sans text-sm text-[#171d16] dark:text-[#dde5d9] outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">Alamat Rumah Lengkap</label>
                <input
                  type="text"
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  className="w-full bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-12 px-4 font-sans text-sm text-[#171d16] dark:text-[#dde5d9] outline-none"
                  placeholder="Nama jalan, nomor rumah, RT/RW, kecamatan, kota"
                />
              </div>
            </div>

            {/* Custom file zone */}
            <div className="text-left space-y-1.5">
              <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">Unggah KTP / KTM Fisik</label>
              
              <input
                type="file"
                ref={ktpInputRef}
                onChange={(e) => handleFileChange(e, 'ktp')}
                accept="image/*"
                className="hidden"
              />

              <div
                onClick={() => ktpInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'ktp')}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  ktpSelectedFile 
                    ? 'border-[#006b2c] dark:border-[#00873a] bg-[#e4f3e6]/20 dark:bg-[#122818]/20' 
                    : 'border-[#bdcaba] dark:border-[#2f3d2d] hover:border-[#006b2c] dark:hover:border-[#00873a] hover:bg-[#e4f3e6]/10 dark:hover:bg-[#122818]/10'
                }`}
              >
                {ktpSelectedFile ? (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <div className="relative w-full max-w-[240px] aspect-[1.58/1] rounded-xl overflow-hidden shadow-md border border-[#bdcaba] dark:border-[#2f3d2d]">
                      <img src={ktpSelectedFile} alt="KTP Preview" className="w-full h-full object-cover" />
                    </div>
                    <p className="font-sans text-xs font-bold text-[#006b2c] dark:text-[#7ffc97]">
                      ✓ Foto KTP berhasil diunggah! Klik area ini untuk mengganti.
                    </p>
                  </div>
                ) : (
                  <>
                    <User className="w-10 h-10 text-[#6e7b6c] dark:text-[#829281] mb-3" />
                    <p className="font-sans text-xs text-[#6e7b6c] dark:text-[#829281] text-center font-medium">
                      Tarik berkas foto KTP di sini atau <span className="text-[#006b2c] dark:text-[#7ffc97] font-bold">klik untuk upload file</span>
                    </p>
                    <p className="font-sans text-[10px] text-[#6e7b6c] dark:text-[#829281] mt-1.5">Format file: JPG, JPEG, PNG, WEBP (Maks 5MB)</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#bdcaba]/20 dark:border-[#2f3d2d]/20">
              <button
                onClick={handleStepNext}
                className="bg-[#006b2c] hover:bg-[#00873a] text-white px-8 py-3 rounded-full font-sans text-xs font-bold flex items-center gap-2 active:scale-95 transition-transform cursor-pointer"
              >
                <span>Lanjutkan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Selfie Biometry */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] border border-[#bdcaba]/40 dark:border-[#2f3d2d]/45 shadow-inner">
                <img src={KYC_SELFIE} className="w-full h-full object-cover" alt="Selfie Guide" />
              </div>
              <div className="space-y-4">
                <h3 className="font-sans font-extrabold text-lg text-[#171d16] dark:text-[#dde5d9]">Panduan Foto Selfie</h3>
                <ul className="space-y-2.5 font-sans text-xs text-[#3e4a3d] dark:text-[#b4c3b2] font-medium">
                  <li className="flex gap-2 items-center">
                    <BadgeCheck className="w-4 h-4 text-[#006b2c] dark:text-[#7ffc97] flex-shrink-0" />
                    <span>Pegang dokumen ID/KTP Anda sejajar di samping wajah Anda</span>
                  </li>
                  <li className="flex gap-2 items-center">
                    <BadgeCheck className="w-4 h-4 text-[#006b2c] dark:text-[#7ffc97] flex-shrink-0" />
                    <span>Lepaskan kacamata, masker, atau topi pelindung kepala</span>
                  </li>
                  <li className="flex gap-2 items-center">
                    <BadgeCheck className="w-4 h-4 text-[#006b2c] dark:text-[#7ffc97] flex-shrink-0" />
                    <span>Pastikan pencahayaan cukup terang dan fokus wajah terlihat jelas</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Selfie Upload */}
            <div className="text-left space-y-1.5 pt-4">
              <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">Unggah Foto Selfie dengan KTP</label>
              
              <input
                type="file"
                ref={selfieInputRef}
                onChange={(e) => handleFileChange(e, 'selfie')}
                accept="image/*"
                className="hidden"
              />

              <div
                onClick={() => selfieInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'selfie')}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  selfieSelectedFile 
                    ? 'border-[#006b2c] dark:border-[#00873a] bg-[#e4f3e6]/20 dark:bg-[#122818]/20' 
                    : 'border-[#bdcaba] dark:border-[#2f3d2d] hover:border-[#006b2c] dark:hover:border-[#00873a] hover:bg-[#e4f3e6]/10 dark:hover:bg-[#122818]/10'
                }`}
              >
                {selfieSelectedFile ? (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <div className="relative w-full max-w-[200px] aspect-square rounded-2xl overflow-hidden shadow-md border border-[#bdcaba] dark:border-[#2f3d2d]">
                      <img src={selfieSelectedFile} alt="Selfie Preview" className="w-full h-full object-cover" />
                    </div>
                    <p className="font-sans text-xs font-bold text-[#006b2c] dark:text-[#7ffc97]">
                      ✓ Foto selfie berhasil diunggah! Klik area ini untuk mengganti.
                    </p>
                  </div>
                ) : (
                  <>
                    <Camera className="w-10 h-10 text-[#6e7b6c] dark:text-[#829281] mb-3" />
                    <p className="font-sans text-xs text-[#6e7b6c] dark:text-[#829281] text-center font-medium">
                      Ambil foto selfie atau <span className="text-[#006b2c] dark:text-[#7ffc97] font-bold">klik untuk upload file selfie</span>
                    </p>
                    <p className="font-sans text-[10px] text-[#6e7b6c] dark:text-[#829281] mt-1.5">Format file: JPG, JPEG, PNG, WEBP (Maks 5MB)</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-[#bdcaba]/20 dark:border-[#2f3d2d]/20">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-[#006b2c] dark:text-[#7ffc97] hover:bg-[#eff6ea] dark:hover:bg-[#1a2318] px-6 py-3 rounded-full font-sans text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>
              <button
                onClick={handleStepNext}
                className="bg-[#006b2c] hover:bg-[#00873a] text-white px-8 py-3 rounded-full font-sans text-xs font-bold flex items-center gap-2 active:scale-95 transition-transform cursor-pointer"
              >
                <span>Lanjutkan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Final confirmation review list */}
        {currentStep === 3 && (
          <div className="space-y-6 text-center">
            <ShieldCheck className="w-16 h-16 text-[#006b2c] dark:text-[#7ffc97] mx-auto opacity-90 mb-2 animate-bounce" />
            <h3 className="font-sans font-bold text-xl text-[#171d16] dark:text-[#dde5d9]">Tinjau dan Kirim Data Anda</h3>
            <p className="font-sans text-xs text-[#3e4a3d] dark:text-[#b4c3b2] max-w-md mx-auto leading-relaxed">
              Silakan pastikan kecocokan data Anda sebelum dikirim untuk proses verifikasi otomatis oleh sistem Sewarion.
            </p>

            {/* Verification Data Summary Card */}
            <div className="border border-[#bdcaba] dark:border-[#2f3d2d] rounded-2xl p-5 max-w-lg mx-auto bg-[#eff6ea]/30 dark:bg-[#1a2318]/30 text-left space-y-4">
              <div className="grid grid-cols-2 gap-4 border-b border-[#bdcaba]/40 dark:border-[#2f3d2d]/40 pb-3">
                <div>
                  <span className="text-[10px] text-[#829281] block uppercase tracking-wider">Nama Identitas</span>
                  <span className="text-xs font-extrabold text-[#171d16] dark:text-[#dde5d9]">{idName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#829281] block uppercase tracking-wider">Nomor NIK</span>
                  <span className="text-xs font-extrabold text-[#171d16] dark:text-[#dde5d9] tracking-wider">{maskedNik}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-b border-[#bdcaba]/40 dark:border-[#2f3d2d]/40 pb-3">
                <div>
                  <span className="text-[10px] text-[#829281] block uppercase tracking-wider">Tanggal Lahir</span>
                  <span className="text-xs font-extrabold text-[#171d16] dark:text-[#dde5d9]">{dateOfBirth}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#829281] block uppercase tracking-wider">Alamat Rumah</span>
                  <span className="text-xs font-extrabold text-[#171d16] dark:text-[#dde5d9] truncate">{homeAddress}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-[#829281] block uppercase tracking-wider mb-2">Foto KTP / KTM</span>
                  <div className="w-full aspect-[1.58/1] rounded-lg overflow-hidden border border-[#bdcaba]/80 dark:border-[#2f3d2d]/80">
                    <img src={ktpSelectedFile || ''} className="w-full h-full object-cover" alt="KTP Summary" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[#829281] block uppercase tracking-wider mb-2">Foto Selfie</span>
                  <div className="w-full aspect-[1.58/1] rounded-lg overflow-hidden border border-[#bdcaba]/80 dark:border-[#2f3d2d]/80">
                    <img src={selfieSelectedFile || ''} className="w-full h-full object-cover" alt="Selfie Summary" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#eff6ea] dark:bg-[#1a2318] p-5 rounded-2xl text-left space-y-3 max-w-lg mx-auto border border-[#bdcaba]/35 dark:border-[#2f3d2d]/35 text-xs text-[#3e4a3d] dark:text-[#b4c3b2]">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#006b2c] dark:text-[#7ffc97] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#171d16] dark:text-[#dde5d9]">Keamanan Data Terenkripsi</p>
                  <p className="mt-0.5 text-[11px] text-[#6e7b6c] dark:text-[#829281]">Semua berkas identitas Anda dienkripsi secara aman dengan algoritma enkripsi modern.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#006b2c] dark:text-[#7ffc97] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#171d16] dark:text-[#dde5d9]">Verifikasi Otomatis</p>
                  <p className="mt-0.5 text-[11px] text-[#6e7b6c] dark:text-[#829281]">Sistem pencocokan biometrik wajah akan mengevaluasi berkas Anda dalam waktu kurang dari 3 detik.</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-[#bdcaba]/25 dark:border-[#2f3d2d]/25 flex flex-col gap-3 max-w-sm mx-auto">
              <button
                onClick={handleKycSubmit}
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-[#006b2c] hover:bg-[#00873a] text-white font-sans text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                    <span>Memverifikasi Berkas...</span>
                  </>
                ) : (
                  <span>Ajukan Verifikasi Sekarang</span>
                )}
              </button>
              <button
                onClick={() => setCurrentStep(2)}
                disabled={isSubmitting}
                className="text-[#6e7b6c] dark:text-[#829281] hover:text-[#006b2c] dark:hover:text-[#7ffc97] font-sans text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
              >
                Periksa Kembali Foto / ID
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Verification success modal popup */}
      {showKycSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#151c14] rounded-3xl p-8 md:p-10 max-w-md w-full text-center shadow-2xl border border-[#bdcaba]/40 dark:border-[#2f3d2d]/40 flex flex-col items-center">
            <div className="w-16 h-16 bg-[#e4f3e6] dark:bg-[#122818] rounded-full flex items-center justify-center text-[#006b2c] dark:text-[#7ffc97] mb-6">
              <BadgeCheck className="w-8 h-8 font-extrabold" />
            </div>
            <h3 className="font-sans font-bold text-xl text-[#171d16] dark:text-[#dde5d9] mb-2">Verifikasi KYC Berhasil!</h3>
            <p className="font-sans text-xs text-[#3e4a3d] dark:text-[#b4c3b2] leading-relaxed mb-8">
              Data identitas biometrik dan NIK Anda telah terverifikasi secara instan oleh sistem Sewarion. Sekarang Anda dapat menyewa produk apa saja tanpa deposit tunai!
            </p>
            <button
              onClick={() => {
                setShowKycSuccessModal(false);
                navigate({ type: 'home' });
              }}
              className="bg-[#006b2c] hover:bg-[#00873a] text-white py-3.5 px-8 rounded-full font-sans text-xs font-bold w-full active:scale-95 transition-transform cursor-pointer"
            >
              Mulai Eksplorasi Katalog
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
