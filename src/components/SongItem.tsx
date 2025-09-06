"use client";

import Image from 'next/image';
import { Play, GripVertical, PlusCircle, MinusCircle } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import type { Song } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SongItemProps {
  song: Song;
  playlistSongs: Song[];
  playlistId?: string;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, songId: string) => void;
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>, songId: string) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function SongItem({ song, playlistSongs, playlistId, draggable = false, ...dragProps }: SongItemProps) {
  const { playSong, currentSong, playlists, addSongToPlaylist, removeSongFromPlaylist } = useMusic();
  const isActive = currentSong?.id === song.id;

  const handlePlay = () => {
    playSong(song, playlistSongs);
  };

  const handleAddSongToPlaylist = (playlistId: string) => {
    addSongToPlaylist(playlistId, song.id);
  };
  
  const handleRemoveSongFromPlaylist = () => {
    if (playlistId) {
      removeSongFromPlaylist(playlistId, song.id);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      draggable={draggable}
      onDragStart={(e) => dragProps.onDragStart?.(e, song.id)}
      onDragEnter={(e) => dragProps.onDragEnter?.(e, song.id)}
      onDragEnd={dragProps.onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={dragProps.onDrop}
      className={cn(
        "flex items-center gap-4 p-2 rounded-lg hover:bg-card transition-colors group",
        isActive && "bg-card"
      )}
    >
      {draggable && (
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
      )}
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
        <Image src={song.coverArt} alt={song.album} fill className="object-cover" data-ai-hint="music album cover" />
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
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
      <p className="text-sm text-muted-foreground mr-2">{formatTime(song.duration)}</p>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 text-muted-foreground hover:text-foreground">
             <GripVertical className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Adicionar à playlist</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {playlists.map((p) => (
                  <DropdownMenuItem key={p.id} onClick={() => handleAddSongToPlaylist(p.id)}>
                    {p.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          {playlistId && (
            <DropdownMenuItem onClick={handleRemoveSongFromPlaylist} className="text-destructive">
              <MinusCircle className="mr-2 h-4 w-4" />
              <span>Remover da playlist</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
