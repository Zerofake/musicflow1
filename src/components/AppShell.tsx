"use client";

import React from 'react';
import { MusicPlayer } from '@/components/MusicPlayer';
import { BottomNavBar } from '@/components/BottomNavBar';
import { useMusic } from '@/hooks/useMusic';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentSong } = useMusic();

  const paddingBottom = currentSong ? 'pb-48' : 'pb-32';

  return (
    <div className="relative mx-auto flex h-dvh w-full flex-col overflow-hidden bg-background shadow-2xl md:max-w-[450px] md:border-4 md:border-neutral-800 md:rounded-3xl md:max-h-[950px]">
      <div className={`flex-grow overflow-y-auto transition-all duration-300 ${paddingBottom}`}>
        {children}
      </div>
      
      {currentSong && <MusicPlayer />}
      
      <div className="absolute bottom-24 left-4 right-4 z-10">
        <div className="animate-pulse bg-green-500/20 border border-green-500/50 rounded-lg px-4 py-2 text-center">
            <p className="text-sm font-semibold text-green-300">Doação por Pix: <span className="font-mono">onlupy@gmail.com</span></p>
        </div>
      </div>
      
      <BottomNavBar />
    </div>
  );
}
