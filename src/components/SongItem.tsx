"use client";

import Image from 'next/image';
import { Play, GripVertical, PlusCircle, MinusCircle, Music, Pause, Trash2, ChevronsRight } from 'lucide-react';
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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import React, { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SongItemProps {
  song: Song;
  playlistSongs: Song[];
  playlistId?: string; // Se presente, a música está em uma playlist
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, songId: string) => void;
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>, songId: string) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function SongItem({ song, playlistSongs, playlistId, draggable = false, ...dragProps }: SongItemProps) {
  const { playSong, currentSong, isPlaying, togglePlay, playlists, moveSongToPlaylist, removeSongFromPlaylist, deleteSong } = useMusic();
  const isActive = currentSong?.id === song.id;
  
  const [duration, setDuration] = useState(song.duration);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    setDuration(song.duration);
  }, [song.duration]);

  const handlePlay = () => {
    if (isActive) {
        togglePlay();
    } else {
        playSong(song, playlistSongs);
    }
  };

  const handleMoveSongToPlaylist = (targetPlaylistId: string) => {
    const source = playlistId ? { playlistId } : 'songs';
    moveSongToPlaylist(targetPlaylistId, song, source);
  };
  
  const handleRemoveSongFromPlaylist = () => {
    if (playlistId) {
      removeSongFromPlaylist(playlistId, song.id);
    }
  };

  const handleDeleteSong = () => {
    deleteSong(song.id, playlistId);
    setIsDeleteDialogOpen(false);
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
    <div
      draggable={draggable}
      onDragStart={(e) => dragProps.onDragStart?.(e, song.id)}
      onDragEnter={(e) => dragProps.onDragEnter?.(e, song.id)}
      onDragEnd={dragProps.onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={dragProps.onDrop}
      className={cn(
        "flex items-center gap-4 p-2 rounded-lg hover:bg-card transition-colors group",
        isActive && "bg-card shadow-sm"
      )}
    >
      {draggable && (
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
      )}
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted flex items-center justify-center">
        {song.coverArt ? (
          <Image src={song.coverArt} alt={song.album} fill className="object-cover" data-ai-hint="music album cover" />
        ) : (
          <Music className="h-6 w-6 text-muted-foreground" />
        )}
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Tocar ${song.title}`}
        >
          {isActive && isPlaying ? (
            <Pause className="h-6 w-6 text-white fill-white" />
          ) : (
            <Play className="h-6 w-6 text-white fill-white" />
          )}
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <p className={cn("font-semibold truncate", isActive && "text-primary")}>
          {song.title}
        </p>
        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
      </div>
      <p className="text-sm text-muted-foreground mr-2">{formatTime(duration)}</p>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 text-muted-foreground hover:text-foreground">
             <GripVertical className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ChevronsRight className="mr-2 h-4 w-4" />
              <span>Mover para playlist</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {playlists.filter(p => p.id.toString() !== playlistId).map((p) => (
                  <DropdownMenuItem key={p.id} onClick={() => handleMoveSongToPlaylist(p.id.toString())}>
                    {p.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          {playlistId && (
            <DropdownMenuItem onClick={handleRemoveSongFromPlaylist}>
              <MinusCircle className="mr-2 h-4 w-4" />
              <span>Remover da playlist</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir música
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Música?</AlertDialogTitle>
            <AlertDialogDescription>
              A música "{song.title}" será removida permanentemente. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSong} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
