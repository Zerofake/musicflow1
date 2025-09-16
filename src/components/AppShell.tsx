"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { MusicPlayer } from '@/components/MusicPlayer';
import { BottomNavBar } from '@/components/BottomNavBar';
import { useMusic } from '@/hooks/useMusic';
import { PixDonation } from './PixDonation';
import { AffiliateAd } from './AffiliateAd';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentSong, isAdFree } = useMusic();
  const pathname = usePathname();

  const showAds = !isAdFree && pathname !== '/store';

  // pb-28 (112px) for nav bar
  // pb-44 (176px) for music player
  // Ads add 96px (24 * 4) of height (gap-2 = 8px + donation ad height + affiliate ad height)
  
  let paddingBottom = 'pb-28'; // Default for nav bar
  if (currentSong && showAds) {
    paddingBottom = 'pb-[272px]'; // Player (176) + Ads (96)
  } else if (currentSong && !showAds) {
    paddingBottom = 'pb-44'; // Player only
  } else if (!currentSong && showAds) {
    paddingBottom = 'pb-52'; // Ads (96) + Nav Bar (112) = 208px -> pb-52
  } else {
    paddingBottom = 'pb-28'; // Just the nav bar
  }


  return (
    <div className="relative mx-auto flex h-dvh w-full flex-col overflow-hidden bg-background shadow-2xl md:max-w-[450px] md:border-4 md:border-neutral-800 md:rounded-3xl md:max-h-[950px]">
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
