"use client";

import Image from 'next/image';
import { Play } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import type { Song } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SongItemProps {
  song: Song;
  playlistSongs: Song[];
}

export function SongItem({ song, playlistSongs }: SongItemProps) {
  const { playSong, currentSong, isPlaying } = useMusic();
  const isActive = currentSong?.id === song.id;

  const handlePlay = () => {
    playSong(song, playlistSongs);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-2 rounded-lg hover:bg-card transition-colors",
        isActive && "bg-card"
      )}
    >
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
        <Image src={song.coverArt} alt={song.album} fill className="object-cover" data-ai-hint="music album cover" />
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
          aria-label={`Tocar ${song.title}`}
        >
          <Play className="h-6 w-6 text-white fill-white" />
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <p className={cn("font-semibold truncate", isActive && "text-primary")}>
          {song.title}
        </p>
        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
      </div>
      <p className="text-sm text-muted-foreground">{formatTime(song.duration)}</p>
    </div>
  );
}
