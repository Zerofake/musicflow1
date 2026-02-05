"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MusicPlayer } from '@/components/MusicPlayer';
import { BottomNavBar } from '@/components/BottomNavBar';
import { useMusic } from '@/hooks/useMusic';
import { PixDonation } from './PixDonation';
import { AffiliateAd } from './AffiliateAd';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentSong, isAdFree } = useMusic();
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  const showAds = !isAdFree && pathname !== '/store';

  // pb-28 (112px) for nav bar
  // pb-44 (176px) for music player
  let paddingBottom = currentSong ? 'pb-44' : 'pb-28';

  return (
    <div className="relative mx-auto flex h-dvh w-full flex-col overflow-hidden bg-background shadow-2xl md:max-w-[450px] md:border-4 md:border-neutral-800 md:rounded-3xl md:max-h-[950px]">
      {!isOnline && (
        <div className="bg-yellow-500 text-center text-sm text-black p-1 font-semibold">
          App requer conexão com a internet.
        </div>
      )}
      <div className={`flex-grow overflow-y-auto ${paddingBottom} transition-all duration-300`}>
        {children}
      </div>
      
      {currentSong && <MusicPlayer />}
      
      {showAds && (
        <div className="absolute bottom-24 left-4 right-4 z-10 flex flex-col gap-2">
          <PixDonation />
          <AffiliateAd />
        </div>
      )}
      
      <BottomNavBar />
    </div>
  );
}
