"use client";

import React from 'react';
import { MusicPlayer } from '@/components/MusicPlayer';
import { BottomNavBar } from '@/components/BottomNavBar';
import { useMusic } from '@/hooks/useMusic';
import { AffiliateAd } from '@/components/AffiliateAd';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentSong } = useMusic();

  const paddingBottom = currentSong ? 'pb-56' : 'pb-40';

  return (
    <div className="relative mx-auto flex h-dvh w-full flex-col overflow-hidden bg-background shadow-2xl md:max-w-[450px] md:border-4 md:border-neutral-800 md:rounded-3xl md:max-h-[950px]">
      <div className={`flex-grow overflow-y-auto transition-all duration-300 ${paddingBottom}`}>
        {children}
      </div>
      
      {currentSong && <MusicPlayer />}
      
      <div className="absolute bottom-24 left-4 right-4 z-10 space-y-2">
        <AffiliateAd />
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg px-4 py-2 text-center animate-pulse">
            <p className="text-xs font-semibold text-green-300">Para a melhora do aplicativo, doações em Pix: <span className="font-mono">onlupy@gmail.com</span></p>
        </div>
      </div>
      
      <BottomNavBar />
    </div>
  );
}
