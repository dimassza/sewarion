import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { SOCIAL_LOGOS, LOGO_URLS } from '../data';
import type { AppContextType } from '../types';
import { findUserByEmail, hashPassword, getUsers, saveUsers } from '../storage';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

interface LoginViewProps {
  appCtx: AppContextType;
}

export default function LoginView({ appCtx }: LoginViewProps) {
  const { setUser, navigate } = appCtx;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setForgotPasswordMsg('');

    if (!email || !password) {
      setErrorMessage('Semua bidang wajib diisi!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Format email tidak valid!');
      return;
    }

    setIsLoading(true);

    try {
      // ─── Supabase Signin Flow ───
      if (isSupabaseConfigured()) {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        });

        if (loginError) {
          let msg = loginError.message;
          if (msg.includes('Invalid login credentials')) {
            msg = 'Email atau kata sandi yang Anda masukkan salah!';
          }
          setErrorMessage(msg);
          setIsLoading(false);
          return;
        }

        if (data.user) {
          return;
        }
        setIsLoading(false);
        return;
      }

      // ─── Local fallback registration checking ───
      await new Promise((resolve) => setTimeout(resolve, 500));

      let registeredUser = findUserByEmail(email);

      // Jika akun tidak ditemukan di penyimpanan offline, buat secara otomatis (free-to-login)
      if (!registeredUser) {
        console.log(`[DEMO] Email ${email} belum terdaftar. Mendaftarkan otomatis untuk kelancaran demo...`);
        const isPemilik = email.toLowerCase().includes('pemilik');
        const defaultName = isPemilik 
          ? 'Demo Pemilik (' + email.split('@')[0] + ')' 
          : 'Demo Penyewa (' + email.split('@')[0] + ')';
        
        const hash = await hashPassword(password);
        const newUser = {
          fullName: defaultName,
          email: email.trim(),
          passwordHash: hash,
          trustScore: isPemilik ? 95 : 98,
          totalRentals: isPemilik ? '8' : '2',
          isKycVerified: true,
          registeredAt: new Date().toISOString(),
          avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(email)}`,
          phoneNumber: '08123456789'
        };

        const users = getUsers();
        users.push(newUser);
        saveUsers(users);
        
        registeredUser = newUser;
      } else {
        // Jika akun terdaftar, loloskan sandi apa saja untuk kelancaran demo offline
        const inputHash = await hashPassword(password);
        if (inputHash !== registeredUser.passwordHash) {
          console.log('[DEMO] Password salah, namun diloloskan untuk kemudahan demo luring.');
        }
      }

      setUser({
        fullName: registeredUser.fullName,
        email: registeredUser.email,
        isLoggedIn: true,
        trustScore: registeredUser.trustScore,
        totalRentals: registeredUser.totalRentals,
        isKycVerified: registeredUser.isKycVerified,
        avatarUrl: registeredUser.avatarUrl,
        nikNumber: registeredUser.nikNumber,
        ktpImage: registeredUser.ktpImage,
        selfieImage: registeredUser.selfieImage,
        phoneNumber: registeredUser.phoneNumber
      });

      navigate({ type: 'home' });
    } catch (err) {
      setErrorMessage('Terjadi kesalahan sistem, silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setForgotPasswordMsg('Tautan pemulihan kata sandi segera dikirimkan ke email Anda.');
  };

  const handleQuickLogin = async (role: 'pemilik' | 'penyewa') => {
    const targetEmail = role === 'pemilik' ? 'pemilik123@gmail.com' : 'penyewa123@gmail.com';
    const targetPassword = role === 'pemilik' ? 'pemilik123*' : 'penyewa123*';
    
    setEmail(targetEmail);
    setPassword(targetPassword);
    
    setIsLoading(true);
    setErrorMessage('');
    setForgotPasswordMsg('');

    try {
      if (isSupabaseConfigured()) {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email: targetEmail,
          password: targetPassword
        });

        if (loginError) {
          let msg = loginError.message;
          if (msg.includes('Invalid login credentials')) {
            msg = 'Email atau kata sandi yang Anda masukkan salah!';
          }
          setErrorMessage(msg);
          setIsLoading(false);
          return;
        }

        if (data.user) return;
        setIsLoading(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 600));

      let registeredUser = findUserByEmail(targetEmail);
      
      // Jika akun quick login belum dibuat di local storage, buat otomatis secara luring
      if (!registeredUser) {
        console.log(`[DEMO] Akun pintasan ${targetEmail} belum dibuat. Membuat otomatis...`);
        const hash = await hashPassword(targetPassword);
        const newUser = {
          fullName: role === 'pemilik' ? 'Fahri Pemilik' : 'Budi Penyewa',
          email: targetEmail,
          passwordHash: hash,
          trustScore: role === 'pemilik' ? 95 : 98,
          totalRentals: role === 'pemilik' ? '12' : '3',
          isKycVerified: true,
          registeredAt: new Date().toISOString(),
          avatarUrl: role === 'pemilik' 
            ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFhO6XxswJRyg70DHau79pW54rsK8g7aLZC7TkyUfc9EPmHvXUXQm07OQ6Gb5ubSBHb2qpraIIjgwH2VP0rLOqYByD5MWlW4Ig0UJDr0KijMImnFgMgCZ2pYaENNrNBYGvR2Dgzw-hjC9kcoFKUK2DVCVXFa5-IrjBSiOniSjiE7DyNrN7DzrMUwcUndNjHVQ3K4uWaM_OQep2EitOVvYFksYt_2003r0Xd7Xf0BAsO5RmdUB8dgI1T8S0DS9mmZm9sxq2_aCL_ss'
            : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjfkcTYzg6Th3t6VHO77W12O7JL0Hem_CFXY2RlrpADfmvyRsJ-UVyxkbPKZMU2JhHVi9PfiT5iVA4-trvzJaMwT2K5v1eziUehxHczscYDLtsS-DE1KIK3K9GZ_BYdQAXvXCQuAMQl8nrv72u3h93Heh1491GXmiH7p6BcFxHS7J4cWcjET6LE_TVuEQwO-8kyqT4GcSk2SDEpGl33ooe62XHFbNlyR1CRzCNZgjaj6ELOk64VdYVr8bJ2HW193Gp8Q3MAioaslE',
          phoneNumber: role === 'pemilik' ? '08123456789' : '08987654321'
        };

        const users = getUsers();
        users.push(newUser);
        saveUsers(users);

        registeredUser = newUser;
      }

      setUser({
        fullName: registeredUser.fullName,
        email: registeredUser.email,
        isLoggedIn: true,
        trustScore: registeredUser.trustScore,
        totalRentals: registeredUser.totalRentals,
        isKycVerified: registeredUser.isKycVerified,
        avatarUrl: registeredUser.avatarUrl,
        nikNumber: registeredUser.nikNumber,
        ktpImage: registeredUser.ktpImage,
        selfieImage: registeredUser.selfieImage,
        phoneNumber: registeredUser.phoneNumber
      });

      navigate({ type: 'home' });
    } catch (err) {
      setErrorMessage('Terjadi kesalahan sistem, silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 font-sans bg-[#f7fcf5] dark:bg-[#0f140e] transition-colors duration-300">
      <div className="w-full max-w-[450px] bg-white dark:bg-[#151c14] rounded-3xl p-8 md:p-10 border border-[#bdcaba]/35 dark:border-[#2f3d2d] shadow-2xl shadow-[#171d16]/3 dark:shadow-none animate-in zoom-in-95 duration-300">
        
        {/* Toggle Mode Banner */}
        <div className="mb-6 p-3.5 rounded-2xl bg-[#eff6ea] dark:bg-[#1a2318] border border-[#bdcaba]/40 dark:border-[#2f3d2d]/40 flex items-center justify-between shadow-xs">
          <div className="text-left">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#6e7b6c] dark:text-[#829281] block">Mode Koneksi</span>
            <span className="text-xs font-extrabold text-[#171d16] dark:text-[#dde5d9]">
              {localStorage.getItem('sewarion_force_offline') === 'true' ? '🔌 Demo Luring (Offline)' : '⚡ Database Cloud'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const current = localStorage.getItem('sewarion_force_offline') === 'true';
              localStorage.setItem('sewarion_force_offline', current ? 'false' : 'true');
              window.location.reload();
            }}
            className={`px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white shadow-sm transition-all active:scale-95 ${
              localStorage.getItem('sewarion_force_offline') === 'true'
                ? 'bg-[#e65100] hover:bg-[#c94400]'
                : 'bg-[#006b2c] hover:bg-[#005221]'
            }`}
          >
            {localStorage.getItem('sewarion_force_offline') === 'true' ? 'Beralih Cloud' : 'Beralih Offline'}
          </button>
        </div>
        
        <div className="text-center mb-8 flex flex-col items-center">
          <img src={LOGO_URLS.square} className="h-16 w-16 mb-4 object-contain shadow-xs rounded-2xl" alt="Sewarion Logo" />
          <h1 className="font-sans font-black text-2xl text-[#171d16] dark:text-[#dde5d9] tracking-tight">Selamat Datang Kembali</h1>
          <p className="font-sans text-xs text-[#6e7b6c] dark:text-[#829281] mt-1.5 leading-relaxed">
            Masuk ke akun Sewarion Anda untuk melanjutkan transaksi penyewaan tanpa uang deposit.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-[#fdf0ee] dark:bg-[#2d120f] border border-[#f9c7c2] dark:border-[#540f0c] rounded-xl p-3 mb-5 text-left text-xs font-bold text-[#d6453d] dark:text-[#ff7f7f] animate-in fade-in duration-300">
            {errorMessage}
          </div>
        )}

        {forgotPasswordMsg && (
          <div className="bg-[#e4f3e6] dark:bg-[#122818] border border-[#a3d9b2] dark:border-[#0f5424] rounded-xl p-3 mb-5 text-left text-xs font-bold text-[#006b2c] dark:text-[#7ffc97] animate-in fade-in duration-300">
            {forgotPasswordMsg}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          {/* Email Field */}
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

          {/* Password Field */}
          <div className="space-y-1.5 text-left">
            <div className="flex justify-between items-center pl-1">
              <label className="font-sans font-bold text-xs text-[#3e4a3d] dark:text-[#b4c3b2] uppercase tracking-wide block">Kata Sandi</label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="font-sans text-[11px] text-[#006b2c] dark:text-[#7ffc97] font-bold hover:underline cursor-pointer"
              >
                Lupa Sandi?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#eff6ea]/45 dark:bg-[#1a2318]/45 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-xl h-12 px-4 font-sans text-sm text-[#171d16] dark:text-[#dde5d9] focus:border-[#006b2c] dark:focus:border-[#00873a] focus:ring-1 focus:ring-[#006b2c] dark:focus:ring-[#00873a] transition-all outline-none pr-12"
                placeholder="••••••••"
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
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 py-0.5 justify-start">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-5 h-5 rounded border-[#bdcaba] dark:border-[#2f3d2d] text-[#006b2c] dark:text-[#7ffc97] focus:ring-[#006b2c] dark:focus:ring-[#00873a] cursor-pointer"
              disabled={isLoading}
            />
            <label htmlFor="remember" className="font-sans text-xs text-[#3e4a3d] dark:text-[#b4c3b2] select-none cursor-pointer">
              Ingat saya di perangkat ini
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
              <span>Masuk Sekarang</span>
            )}
          </button>

          {/* Divider */}
          <div className="relative py-3 flex items-center">
            <div className="flex-grow border-t border-[#bdcaba]/35 dark:border-[#2f3d2d]/35"></div>
            <span className="flex-shrink mx-4 text-[#6e7b6c] dark:text-[#829281] font-sans text-[10px] uppercase font-bold tracking-wide">
              Atau masuk dengan
            </span>
            <div className="flex-grow border-t border-[#bdcaba]/35 dark:border-[#2f3d2d]/35"></div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => alert('Fitur masuk dengan Google segera hadir!')}
              className="flex items-center justify-center gap-2 h-12 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-full bg-white dark:bg-[#1a2318] hover:bg-[#eff6ea]/20 dark:hover:bg-[#1a2318]/50 transition-all text-xs font-semibold text-[#171d16] dark:text-[#dde5d9] active:scale-[0.97] cursor-pointer"
            >
              <img src={SOCIAL_LOGOS.google} alt="Google" className="w-5 h-5" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Fitur masuk dengan Apple segera hadir!')}
              className="flex items-center justify-center gap-2 h-12 border border-[#bdcaba] dark:border-[#2f3d2d] rounded-full bg-white dark:bg-[#1a2318] hover:bg-[#eff6ea]/20 dark:hover:bg-[#1a2318]/50 transition-all text-xs font-semibold text-[#171d16] dark:text-[#dde5d9] active:scale-[0.97] cursor-pointer"
            >
              <span className="font-bold text-sm tracking-tight"> Apple</span>
            </button>
          </div>
        </form>

        {/* Quick Demo Accounts */}
        <div className="mt-6 pt-5 border-t border-[#bdcaba]/35 dark:border-[#2f3d2d]/35 space-y-3">
          <span className="text-[10px] text-[#6e7b6c] dark:text-[#829281] font-sans uppercase font-extrabold tracking-wider block text-center">
            Pintasan Demo Luring (Quick Fill)
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleQuickLogin('pemilik')}
              disabled={isLoading}
              className="flex flex-col items-center justify-center p-2.5 border border-[#006b2c]/30 dark:border-[#006b2c]/50 rounded-2xl bg-[#f4fcf0] dark:bg-[#151d13] hover:bg-[#eff6ea] dark:hover:bg-[#1a2318] hover:border-[#006b2c] dark:hover:border-[#00873a] transition-all text-[11px] font-bold text-[#006b2c] dark:text-[#7ffc97] active:scale-[0.97] group cursor-pointer"
            >
              <span className="text-sm mb-0.5">💼</span>
              <span>Akun Pemilik</span>
              <span className="text-[9px] text-[#6e7b6c] dark:text-[#829281] font-normal group-hover:text-[#006b2c] dark:group-hover:text-[#7ffc97]">Fahri Pemilik</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('penyewa')}
              disabled={isLoading}
              className="flex flex-col items-center justify-center p-2.5 border border-[#006b2c]/30 dark:border-[#006b2c]/50 rounded-2xl bg-[#f4fcf0] dark:bg-[#151d13] hover:bg-[#eff6ea] dark:hover:bg-[#1a2318] hover:border-[#006b2c] dark:hover:border-[#00873a] transition-all text-[11px] font-bold text-[#006b2c] dark:text-[#7ffc97] active:scale-[0.97] group cursor-pointer"
            >
              <span className="text-sm mb-0.5">👤</span>
              <span>Akun Penyewa</span>
              <span className="text-[9px] text-[#6e7b6c] dark:text-[#829281] font-normal group-hover:text-[#006b2c] dark:group-hover:text-[#7ffc97]">Budi Penyewa</span>
            </button>
          </div>
        </div>

        {/* Link to Register */}
        <div className="mt-8 text-center pt-4 border-t border-[#bdcaba]/30 dark:border-[#2f3d2d]/30">
          <p className="font-sans text-xs text-[#6e7b6c] dark:text-[#829281]">
            Belum punya akun?{' '}
            <button
              onClick={() => navigate({ type: 'register' })}
              className="text-[#006b2c] dark:text-[#7ffc97] font-extrabold hover:underline cursor-pointer focus:outline-none"
            >
              Daftar Sekarang
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
