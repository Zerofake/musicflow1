"use client";

import React from 'react';
import { MusicPlayer } from '@/components/MusicPlayer';
import { BottomNavBar } from '@/components/BottomNavBar';
import { useMusic } from '@/hooks/useMusic';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentSong } = useMusic();

  const paddingBottom = currentSong ? 'pb-40' : 'pb-24';

  return (
    <div className="relative mx-auto flex h-dvh w-full flex-col overflow-hidden bg-background shadow-2xl md:max-w-[450px] md:border-4 md:border-neutral-800 md:rounded-3xl md:max-h-[950px]">
      <div className={`flex-grow overflow-y-auto transition-all duration-300 ${paddingBottom}`}>
        {children}
      </div>
      
      {currentSong && <MusicPlayer />}
      <BottomNavBar />
    </div>
  );
}
