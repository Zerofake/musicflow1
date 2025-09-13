"use client";

import Image from 'next/image';
import { Play, Pause, SkipBack, SkipForward, Repeat, Music } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    isRepeating,
    toggleRepeat,
  } = useMusic();

  if (!currentSong) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return isNaN(minutes) || isNaN(secs) ? '0:00' : `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  return (
    <div className="absolute bottom-40 left-0 right-0 px-4 animate-in slide-in-from-bottom-5 duration-500">
        <div className="flex flex-col h-full items-center gap-2 rounded-xl bg-card/80 backdrop-blur-xl p-3 border border-border shadow-lg">
            <div className="w-full flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-md flex-shrink-0 bg-muted flex items-center justify-center">
                  {currentSong.coverArt ? (
                    <Image
                      src={currentSong.coverArt}
                      alt={currentSong.album}
                      fill
                      className="object-cover"
                      data-ai-hint="music album cover"
                    />
                  ) : (
                    <Music className="h-8 w-8 text-muted-foreground" />
                  )}
              </div>
              <div className="flex-1 overflow-hidden">
                  <p className="font-bold truncate">{currentSong.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
              </div>
              <div className="flex items-center gap-0">
                  <Button variant="ghost" size="icon" onClick={playPrev} aria-label="Faixa anterior">
                      <SkipBack className="h-5 w-5 fill-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={togglePlay} className="bg-primary/20 hover:bg-primary/30 h-12 w-12" aria-label={isPlaying ? "Pausar" : "Tocar"}>
                      {isPlaying ? <Pause className="h-7 w-7 fill-primary text-primary" /> : <Play className="h-7 w-7 fill-primary text-primary ml-1" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={playNext} aria-label="Próxima faixa">
                      <SkipForward className="h-5 w-5 fill-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={toggleRepeat} aria-label="Repetir">
                    <Repeat className={cn("h-5 w-5", isRepeating ? "text-primary" : "text-foreground")} />
                  </Button>
              </div>
            </div>
            <div className="w-full flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-10 text-center">{formatTime(currentTime)}</span>
              <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full"
              />
              <span className="text-xs text-muted-foreground w-10 text-center">{formatTime(duration)}</span>
            </div>
        </div>
    </div>
  );
}
