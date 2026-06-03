import { Globe, Instagram, Twitter, Mail } from 'lucide-react';
import { LOGO_URLS } from '../data';
import type { AppContextType } from '../types';

interface FooterProps {
  appCtx: AppContextType;
}

export default function Footer({ appCtx }: FooterProps) {
  const { navigate, user } = appCtx;

  const handleMulaiMenyewakan = () => {
    if (user.isLoggedIn && user.isKycVerified) {
      navigate({ type: 'mulai-menyewakan' });
    } else if (user.isLoggedIn) {
      navigate({ type: 'kyc' });
    } else {
      navigate({ type: 'login' });
    }
  };

  const handleUnavailablePage = () => {
    navigate({ type: 'home' });
  };

  const currentYear = new Date().getFullYear();

  const linkClass =
    'font-sans text-sm text-[#3e4a3d] hover:text-[#006b2c] cursor-pointer transition-colors';

  return (
    <footer className="bg-[#eff6ea] border-t border-[#bdcaba] py-12 px-6 md:px-10 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between gap-10 items-start">
          {/* Brand Info */}
          <div className="flex flex-col gap-4 max-w-sm">
            <div className="flex items-center gap-2.5">
              <img
                src={LOGO_URLS.alt}
                className="h-8 w-auto object-contain"
                alt="SEWARION"
              />
              <span className="font-sans font-bold text-2xl text-[#171d16] tracking-tight">
                SEWARION
              </span>
            </div>
            <p className="font-sans text-sm text-[#3e4a3d] leading-relaxed">
              Platform P2P (Peer-to-Peer) Rental terpercaya untuk segala kebutuhan gaya hidup
              modern dan profesional Anda. Sewa aman, mudah, tanpa jaminan uang deposit tunai.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 mt-2">
              <a
                href="https://sewarion.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6e7b6c] hover:text-[#006b2c] transition-colors"
                aria-label="Website"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/sewarion"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6e7b6c] hover:text-[#006b2c] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/sewarion"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6e7b6c] hover:text-[#006b2c] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@sewarion.com"
                className="text-[#6e7b6c] hover:text-[#006b2c] transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Footer Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
            {/* Perusahaan */}
            <div className="flex flex-col gap-3">
              <h5 className="font-sans font-bold text-xs text-[#006b2c] uppercase tracking-wider mb-1">
                Perusahaan
              </h5>
              <a onClick={() => navigate({ type: 'home' })} className={linkClass}>
                Beranda
              </a>

              <a onClick={handleMulaiMenyewakan} className={linkClass}>
                Mulai Menyewakan
              </a>
            </div>

            {/* Bantuan */}
            <div className="flex flex-col gap-3">
              <h5 className="font-sans font-bold text-xs text-[#006b2c] uppercase tracking-wider mb-1">
                Bantuan
              </h5>
              <a onClick={handleUnavailablePage} className={linkClass}>
                Pusat Bantuan
              </a>
              <a onClick={handleUnavailablePage} className={linkClass}>
                Hubungi Kami
              </a>
              <a onClick={handleUnavailablePage} className={linkClass}>
                Keamanan
              </a>
            </div>

            {/* Legalitas */}
            <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
              <h5 className="font-sans font-bold text-xs text-[#006b2c] uppercase tracking-wider mb-1">
                Legalitas
              </h5>
              <a onClick={handleUnavailablePage} className={linkClass}>
                Syarat & Ketentuan
              </a>
              <a onClick={handleUnavailablePage} className={linkClass}>
                Kebijakan Privasi
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-8 border-t border-[#bdcaba]/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#6e7b6c]">
          <p>© {currentYear} SEWARION P2P Rental. All rights reserved.</p>
          <div className="flex gap-6">
            <a onClick={handleUnavailablePage} className="hover:text-[#006b2c] cursor-pointer transition-colors">
              Kebijakan Cookies
            </a>
            <a onClick={handleUnavailablePage} className="hover:text-[#006b2c] cursor-pointer transition-colors">
              Term of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
