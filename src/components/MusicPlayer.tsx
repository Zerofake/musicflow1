"use client";

import Image from 'next/image';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

export function MusicPlayer() {
  const {
    isPlaying,
    currentSong,
    currentTime,
    duration,
    togglePlay,
    playNext,
    playPrev,
    seek,
  } = useMusic();

  if (!currentSong) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  return (
    <div className="absolute bottom-20 left-0 right-0 h-20 px-2 animate-in slide-in-from-bottom-5 duration-500">
        <div className="flex h-full items-center gap-3 rounded-xl bg-card/80 backdrop-blur-xl p-2 border border-border shadow-lg">
            <div className="relative h-16 w-16 overflow-hidden rounded-md">
                <Image
                src={currentSong.coverArt}
                alt={currentSong.album}
                fill
                className="object-cover"
                data-ai-hint="music album cover"
                />
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="font-bold truncate">{currentSong.title}</p>
                <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
            </div>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={playPrev} aria-label="Faixa anterior">
                    <SkipBack className="h-5 w-5 fill-foreground" />
                </Button>
                <Button variant="ghost" size="icon" onClick={togglePlay} className="bg-primary/20 hover:bg-primary/30" aria-label={isPlaying ? "Pausar" : "Tocar"}>
                    {isPlaying ? <Pause className="h-6 w-6 fill-primary text-primary" /> : <Play className="h-6 w-6 fill-primary text-primary" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={playNext} aria-label="Próxima faixa">
                    <SkipForward className="h-5 w-5 fill-foreground" />
                </Button>
            </div>
        </div>
    </div>
  );
}
