import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, Phone } from 'lucide-react';
import type { AppContextType } from '../types';
import { registerUser, findUserByEmail, hashPassword } from '../storage';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

interface RegisterViewProps {
  appCtx: AppContextType;
}

export default function RegisterView({ appCtx }: RegisterViewProps) {
  const { setUser, navigate } = appCtx;
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password strength checker helper
  const passwordStrength = useMemo(() => {
    if (!password) return { text: '', color: 'bg-transparent', width: 'w-0' };
    if (password.length < 6) {
      return { text: 'Terlalu Pendek (Min. 6 Karakter)', color: 'bg-red-500', width: 'w-1/4' };
    }
    
    let score = 0;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) {
      return { text: 'Lemah', color: 'bg-orange-500', width: 'w-2/4' };
    } else if (score === 3) {
      return { text: 'Sedang', color: 'bg-yellow-500', width: 'w-3/4' };
    } else {
      return { text: 'Sangat Kuat', color: 'bg-[#006b2c] dark:bg-[#00873a]', width: 'w-full' };
    }
  }, [password]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !phoneNumber.trim() || !password || !confirmPassword) {
      setErrorMessage('Semua bidang wajib diisi!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Format email tidak valid!');
      return;
    }

    // Phone number validation: numbers, min 9 digits
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length < 9) {
      setErrorMessage('Nomor telepon tidak valid (minimal 9 digit angka)!');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Kata sandi harus terdiri dari minimal 6 karakter!');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Anda harus menyetujui Syarat & Ketentuan Sewarion!');
      return;
    }

    setIsLoading(true);

    try {
      // ─── Supabase Signup Flow ───
      if (isSupabaseConfigured()) {
        const { data, error: signupError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: fullName.trim(),
              phone_number: phoneNumber.trim()
            }
          }
        });

        if (signupError) {
          setErrorMessage(signupError.message);
          setIsLoading(false);
          return;
        }

        if (data.user) {
          // Write profile schema into profiles table
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            full_name: fullName.trim(),
            email: email.trim(),
            phone_number: phoneNumber.trim(),
            trust_score: 80,
            total_rentals: '0',
            is_kyc_verified: false,
            avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjfkcTYzg6Th3t6VHO77W12O7JL0Hem_CFXY2RlrpADfmvyRsJ-UVyxkbPKZMU2JhHVi9PfiT5iVA4-trvzJaMwT2K5v1eziUehxHczscYDLtsS-DE1KIK3K9GZ_BYdQAXvXCQuAMQl8nrv72u3h93Heh1491GXmiH7p6BcFxHS7J4cWcjET6LE_TVuEQwO-8kyqT4GcSk2SDEpGl33ooe62XHFbNlyR1CRzCNZgjaj6ELOk64VdYVr8bJ2HW193Gp8Q3MAioaslE'
          });

          if (profileError) {
            setErrorMessage(`Profil gagal dibuat: ${profileError.message}`);
            setIsLoading(false);
            return;
          }

          // User will be auto-logged in or asked to check email based on Supabase config
          setUser({
            fullName: fullName.trim(),
            email: email.trim(),
            isLoggedIn: true,
            trustScore: 80,
            totalRentals: '0',
            isKycVerified: false,
            avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjfkcTYzg6Th3t6VHO77W12O7JL0Hem_CFXY2RlrpADfmvyRsJ-UVyxkbPKZMU2JhHVi9PfiT5iVA4-trvzJaMwT2K5v1eziUehxHczscYDLtsS-DE1KIK3K9GZ_BYdQAXvXCQuAMQl8nrv72u3h93Heh1491GXmiH7p6BcFxHS7J4cWcjET6LE_TVuEQwO-8kyqT4GcSk2SDEpGl33ooe62XHFbNlyR1CRzCNZgjaj6ELOk64VdYVr8bJ2HW193Gp8Q3MAioaslE',
            phoneNumber: phoneNumber.trim()
          });

          alert('Pendaftaran berhasil! Mengalihkan Anda ke halaman verifikasi identitas...');
          navigate({ type: 'kyc' });
        }
        setIsLoading(false);
        return;
      }

      // ─── Local fallback registration ───
      const existingUser = findUserByEmail(email);
      if (existingUser) {
        setErrorMessage('Email sudah terdaftar. Silakan masuk (login).');
        setIsLoading(false);
        return;
      }

      const passwordHash = await hashPassword(password);
      const registeredUser = {
        fullName: fullName.trim(),
        email: email.trim(),
        passwordHash,
        trustScore: 80,
        totalRentals: '0',
        isKycVerified: false,
        registeredAt: new Date().toISOString(),
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjfkcTYzg6Th3t6VHO77W12O7JL0Hem_CFXY2RlrpADfmvyRsJ-UVyxkbPKZMU2JhHVi9PfiT5iVA4-trvzJaMwT2K5v1eziUehxHczscYDLtsS-DE1KIK3K9GZ_BYdQAXvXCQuAMQl8nrv72u3h93Heh1491GXmiH7p6BcFxHS7J4cWcjET6LE_TVuEQwO-8kyqT4GcSk2SDEpGl33ooe62XHFbNlyR1CRzCNZgjaj6ELOk64VdYVr8bJ2HW193Gp8Q3MAioaslE',
        phoneNumber: phoneNumber.trim()
      };

      const result = registerUser(registeredUser);
      if (!result.success) {
        setErrorMessage(result.error || 'Terjadi kesalahan saat pendaftaran.');
        setIsLoading(false);
        return;
      }

      setUser({
        fullName: registeredUser.fullName,
        email: registeredUser.email,
        isLoggedIn: true,
        trustScore: registeredUser.trustScore,
        totalRentals: registeredUser.totalRentals,
        isKycVerified: registeredUser.isKycVerified,
        avatarUrl: registeredUser.avatarUrl,
        phoneNumber: registeredUser.phoneNumber
      });

      navigate({ type: 'kyc' });
    } catch (err) {
      setErrorMessage('Terjadi kesalahan sistem, silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 font-sans bg-[#f7fcf5] dark:bg-[#0f140e] transition-colors duration-300">
      <div className="w-full max-w-[450px] bg-white dark:bg-[#151c14] rounded-3xl p-8 md:p-10 border border-[#bdcaba]/35 dark:border-[#2f3d2d] shadow-2xl shadow-[#171d16]/3 dark:shadow-none animate-in zoom-in-95 duration-300">
        
        <div className="text-center mb-8">
          <h1 className="font-sans font-black text-2xl text-[#171d16] dark:text-[#dde5d9] tracking-tight">Daftar Akun Sewarion</h1>
          <p className="font-sans text-xs text-[#6e7b6c] dark:text-[#829281] mt-1.5 leading-relaxed">
            Mulai pengalaman sewa-menyewa tanpa jaminan uang deposit sekarang.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-[#fdf0ee] dark:bg-[#2d120f] border border-[#f9c7c2] dark:border-[#540f0c] rounded-xl p-3 mb-5 text-left text-xs font-bold text-[#d6453d] dark:text-[#ff7f7f] animate-in fade-in duration-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5 text-left">
            <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">Nama Lengkap</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-12 px-4 font-sans text-sm text-[#171d16] dark:text-[#dde5d9] focus:border-[#006b2c] dark:focus:border-[#00873a] focus:ring-1 focus:ring-[#006b2c] dark:focus:ring-[#00873a] transition-all outline-none"
              placeholder="Contoh: Andi Pratama"
              required
              disabled={isLoading}
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5 text-left">
            <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-12 px-4 font-sans text-sm text-[#171d16] dark:text-[#dde5d9] focus:border-[#006b2c] dark:focus:border-[#00873a] focus:ring-1 focus:ring-[#006b2c] dark:focus:ring-[#00873a] transition-all outline-none"
              placeholder="nama@email.com"
              required
              disabled={isLoading}
            />
          </div>

          {/* Phone Number / WhatsApp */}
          <div className="space-y-1.5 text-left">
            <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">Nomor WhatsApp / Telepon</label>
            <div className="relative">
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d+]/g, ''))}
                className="w-full bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-12 pl-11 pr-4 font-sans text-sm text-[#171d16] dark:text-[#dde5d9] focus:border-[#006b2c] dark:focus:border-[#00873a] focus:ring-1 focus:ring-[#006b2c] dark:focus:ring-[#00873a] transition-all outline-none"
                placeholder="Contoh: 081234567890"
                required
                disabled={isLoading}
              />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#6e7b6c] dark:text-[#829281]" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5 text-left">
            <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">Kata Sandi</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-12 px-4 font-sans text-sm text-[#171d16] dark:text-[#dde5d9] focus:border-[#006b2c] dark:focus:border-[#00873a] focus:ring-1 focus:ring-[#006b2c] dark:focus:ring-[#00873a] transition-all outline-none pr-12"
                placeholder="Minimal 6 karakter"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6e7b6c] dark:text-[#829281] focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-1 pt-1 animate-in fade-in duration-200">
                <div className="h-1.5 w-full bg-[#eff6ea] dark:bg-[#1a2318] rounded-full overflow-hidden">
                  <div className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all duration-300`} />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#6e7b6c] dark:text-[#829281]">
                  <span>Kekuatan sandi:</span>
                  <span className="font-bold">{passwordStrength.text}</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5 text-left">
            <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block pl-1">Konfirmasi Kata Sandi</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-12 px-4 font-sans text-sm text-[#171d16] dark:text-[#dde5d9] focus:border-[#006b2c] dark:focus:border-[#00873a] focus:ring-1 focus:ring-[#006b2c] dark:focus:ring-[#00873a] transition-all outline-none pr-12"
                placeholder="Ulangi kata sandi"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6e7b6c] dark:text-[#829281] focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Terms & Conditions Check */}
          <div className="flex items-start gap-3 py-2 justify-start">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-[#bdcaba] dark:border-[#2f3d2d] text-[#006b2c] dark:text-[#7ffc97] focus:ring-[#006b2c] dark:focus:ring-[#00873a] cursor-pointer"
              disabled={isLoading}
            />
            <label htmlFor="terms" className="font-sans text-xs text-[#3e4a3d] dark:text-[#b4c3b2] leading-tight select-none cursor-pointer text-left">
              Saya menyetujui <a className="text-[#006b2c] dark:text-[#7ffc97] font-bold hover:underline cursor-pointer">Syarat & Ketentuan</a> serta <a className="text-[#006b2c] dark:text-[#7ffc97] font-bold hover:underline cursor-pointer">Kebijakan Privasi</a> Sewarion.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#006b2c] hover:bg-[#00873a] text-white rounded-full font-sans text-sm font-bold uppercase tracking-wider hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
          >
            {isLoading ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <span>Daftar Sekarang</span>
            )}
          </button>
        </form>

        {/* Link back to Login */}
        <div className="mt-8 text-center pt-4 border-t border-[#bdcaba]/30 dark:border-[#2f3d2d]/30">
          <p className="font-sans text-xs text-[#6e7b6c] dark:text-[#829281]">
            Sudah punya akun?{' '}
            <button
              onClick={() => navigate({ type: 'login' })}
              className="text-[#006b2c] dark:text-[#7ffc97] font-extrabold hover:underline cursor-pointer focus:outline-none"
            >
              Masuk di sini
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
