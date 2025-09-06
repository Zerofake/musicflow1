"use client";

import React from 'react';
import { MusicPlayer } from '@/components/MusicPlayer';
import { BottomNavBar } from '@/components/BottomNavBar';
import { useMusic } from '@/hooks/useMusic';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentSong } = useMusic();

  const paddingBottom = currentSong ? 'pb-36' : 'pb-20';

  return (
    <div className="relative mx-auto flex h-screen max-h-[950px] w-full max-w-[450px] flex-col overflow-hidden border-4 border-neutral-800 bg-background shadow-2xl rounded-3xl">
      <div className={`flex-grow overflow-y-auto transition-all duration-300 ${paddingBottom}`}>
        {children}
      </div>
      
      {currentSong && <MusicPlayer />}
      <BottomNavBar />
    </div>
  );
}
