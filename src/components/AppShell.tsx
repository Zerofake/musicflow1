"use client";

import React from 'react';
import { MusicPlayer } from '@/components/MusicPlayer';
import { BottomNavBar } from '@/components/BottomNavBar';
import { useMusic } from '@/hooks/useMusic';
import { PixDonation } from './PixDonation';
import { AffiliateAd } from './AffiliateAd';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentSong, isAdFree } = useMusic();

  // pb-28 (112px) for nav bar
  // pb-28 + 24 (96px) for ads = pb-52 (208px)
  // pb-44 (176px) for music player
  // pb-44 + 24 (96px) for ads = pb-68 (272px)
  
  let paddingBottom = 'pb-28'; // Default for nav bar
  if (currentSong && !isAdFree) {
    paddingBottom = 'pb-[272px]'; // Player + Ads
  } else if (currentSong && isAdFree) {
    paddingBottom = 'pb-44'; // Player only
  } else if (!currentSong && !isAdFree) {
    paddingBottom = 'pb-52'; // Ads only
  }


  return (
    <div className="relative mx-auto flex h-dvh w-full flex-col overflow-hidden bg-background shadow-2xl md:max-w-[450px] md:border-4 md:border-neutral-800 md:rounded-3xl md:max-h-[950px]">
      <div className={`flex-grow overflow-y-auto ${paddingBottom} transition-all duration-300`}>
        {children}
      </div>
      
      {currentSong && <MusicPlayer />}
      
      {!isAdFree && (
        <div className="absolute bottom-24 left-4 right-4 z-10 flex flex-col gap-2">
          <PixDonation />
          <AffiliateAd />
        </div>
      )}
      
      <BottomNavBar />
    </div>
  );
}
