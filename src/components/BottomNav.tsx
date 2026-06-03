import { Home, Heart, CirclePlus, ClipboardList, UserRound } from 'lucide-react';
import type { AppContextType } from '../types';

interface BottomNavProps {
  appCtx: AppContextType;
}

export default function BottomNav({ appCtx }: BottomNavProps) {
  const { currentView, navigate, user } = appCtx;

  const isActive = (viewType: string) => {
    return currentView.type === viewType;
  };

  const handleSewaClick = () => {
    if (!user.isLoggedIn) {
      navigate({ type: 'login' });
    } else if (!user.isKycVerified) {
      alert('Silakan verifikasi KYC terlebih dahulu untuk menyewakan barang.');
      navigate({ type: 'kyc' });
    } else {
      navigate({ type: 'mulai-menyewakan' });
    }
  };

  const handleProfileClick = () => {
    if (user.isLoggedIn) {
      navigate({ type: 'profile' });
    } else {
      navigate({ type: 'login' });
    }
  };

  const handleHistoryClick = () => {
    if (user.isLoggedIn) {
      navigate({ type: 'history' });
    } else {
      navigate({ type: 'login' });
    }
  };

  const handleFavoritesClick = () => {
    if (user.isLoggedIn) {
      navigate({ type: 'favorites' });
    } else {
      navigate({ type: 'login' });
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#f4fcf0]/95 dark:bg-[#0f140e]/95 backdrop-blur-md border-t border-[#bdcaba] dark:border-[#2b3a27] px-4 py-2 md:hidden transition-colors duration-300">
      <div className="flex justify-around items-center h-14">
        {/* Beranda */}
        <button
          onClick={() => navigate({ type: 'home' })}
          className={`flex flex-col items-center gap-1 ${
            isActive('home') ? 'text-[#006b2c] dark:text-[#7ffc97]' : 'text-[#6e7b6c] dark:text-[#9bb098]'
          } focus:outline-none transition-colors`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-sans font-medium">Beranda</span>
        </button>

        {/* Favorit */}
        <button
          onClick={handleFavoritesClick}
          className={`flex flex-col items-center gap-1 ${
            isActive('favorites') ? 'text-[#006b2c] dark:text-[#7ffc97]' : 'text-[#6e7b6c] dark:text-[#9bb098]'
          } focus:outline-none transition-colors`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] font-sans font-medium">Favorit</span>
        </button>

        {/* Sewa (+) */}
        <button
          onClick={handleSewaClick}
          className="flex flex-col items-center gap-1 -mt-5 bg-[#006b2c] dark:bg-[#00873a] p-3 rounded-full text-white shadow-lg shadow-[#006b2c]/30 hover:scale-105 active:scale-95 transition-transform"
          title="Mulai Menyewakan"
        >
          <CirclePlus className="w-6 h-6" />
        </button>

        {/* History */}
        <button
          onClick={handleHistoryClick}
          className={`flex flex-col items-center gap-1 ${
            isActive('history') ? 'text-[#006b2c] dark:text-[#7ffc97]' : 'text-[#6e7b6c] dark:text-[#9bb098]'
          } focus:outline-none transition-colors`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px] font-sans font-medium">History</span>
        </button>

        {/* Profil */}
        <button
          onClick={handleProfileClick}
          className={`flex flex-col items-center gap-1 ${
            isActive('profile') || isActive('login') || isActive('register') || isActive('kyc')
              ? 'text-[#006b2c] dark:text-[#7ffc97]'
              : 'text-[#6e7b6c] dark:text-[#9bb098]'
          } focus:outline-none transition-colors`}
        >
          <UserRound className="w-5 h-5" />
          <span className="text-[10px] font-sans font-medium">Profil</span>
        </button>
      </div>
    </nav>
  );
}
