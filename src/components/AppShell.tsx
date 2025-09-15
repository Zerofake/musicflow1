"use client";

import React from 'react';
import { MusicPlayer } from '@/components/MusicPlayer';
import { BottomNavBar } from '@/components/BottomNavBar';
import { useMusic } from '@/hooks/useMusic';
import { PixDonation } from './PixDonation';
import { AffiliateAd } from './AffiliateAd';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentSong } = useMusic();

  const paddingBottom = currentSong ? 'pb-44' : 'pb-28';

  return (
    <div className="relative mx-auto flex h-dvh w-full flex-col overflow-hidden bg-background shadow-2xl md:max-w-[450px] md:border-4 md:border-neutral-800 md:rounded-3xl md:max-h-[950px]">
      <div className={`flex-grow overflow-y-auto ${paddingBottom} transition-all duration-300`}>
        {children}
      </div>
      
      {currentSong && <MusicPlayer />}
      
      <div className="absolute bottom-24 left-4 right-4 z-10 flex flex-col gap-2">
        <PixDonation />
        <AffiliateAd />
      </div>
      
      <BottomNavBar />
    </div>
  );
}
