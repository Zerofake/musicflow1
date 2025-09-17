
"use client";

import type { Song, Playlist, UserData } from '@/lib/types';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';

const MAX_TOTAL_PLAYLISTS = 12;

interface MusicContextType {
  // Songs
  songs: Song[];
  addSongs: (newSongs: Song[]) => Promise<void>;
  deleteSong: (songId: string, fromPlaylistId?: string) => Promise<void>;
  
  // Playlists
  playlists: Playlist[];
  createPlaylist: (name: string, description: string) => Promise<boolean>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  updatePlaylist: (playlistId: string, data: Partial<Omit<Playlist, 'id'>>) => Promise<void>;
  moveSongToPlaylist: (playlistId: string, song: Song, source: 'songs' | { playlistId: string }) => Promise<void>;
  addSongsToPlaylist: (playlistId: string, newSongs: Song[]) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;

  // Music Player
  isPlaying: boolean;
  currentSong: Song | null;
  currentTime: number;
  duration: number;
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  seek: (time: number) => void;
  isRepeating: boolean;
  toggleRepeat: () => void;
  
  // Monetization
  canCreatePlaylist: { can: boolean; message: string };
  coins: number;
  spendCoins: (amount: number) => Promise<boolean>;
  isAdFree: boolean;

  // App State
  isHydrated: boolean;
}

export const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  // Use Dexie's live query hook to keep state in sync with the database
  const songs = useLiveQuery(() => db.songs.toArray(), []);
  const playlists = useLiveQuery(() => db.playlists.toArray(), []);
  const userData = useLiveQuery(() => db.userData.get('main'), []);

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isAdFree, setIsAdFree] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isHydrated = songs !== undefined && playlists !== undefined && userData !== undefined;
  const coins = userData?.coins ?? 0;

  // Effect to handle ad-free status based on userData
  useEffect(() => {
    if (!userData) return;
    const checkAdStatus = () => {
      const now = new Date().getTime();
      const adFree = userData.adFreeUntil ? now < userData.adFreeUntil : false;
      if (adFree !== isAdFree) {
        setIsAdFree(adFree);
      }
    };
    checkAdStatus();
    const interval = setInterval(checkAdStatus, 10000);
    return () => clearInterval(interval);
  }, [userData, isAdFree]);

  const canCreatePlaylist = React.useMemo(() => ({
    can: (playlists?.length ?? 0) < MAX_TOTAL_PLAYLISTS,
    message: (playlists?.length ?? 0) < MAX_TOTAL_PLAYLISTS
      ? `Você pode criar até ${MAX_TOTAL_PLAYLISTS} playlists.`
      : `Você atingiu o limite máximo de ${MAX_TOTAL_PLAYLISTS} playlists.`
  }), [playlists?.length]);


  const playSong = useCallback((song: Song, songQueue: Song[] = []) => {
    if (audioRef.current && audioRef.current.src && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    setCurrentSong(song);
    const newQueue = songQueue.length > 0 ? songQueue : (songs || []);
    setQueue(newQueue);
    const songIndex = newQueue.findIndex(s => s.id === song.id);
    setCurrentSongIndex(songIndex);

    if (songIndex === -1) {
        setCurrentSong(null);
        setIsPlaying(false);
        return;
    }

    const audio = audioRef.current || new Audio();
    if (!audioRef.current) audioRef.current = audio;

    audio.src = song.audioSrc;
    audio.load();
    audio.play().then(() => setIsPlaying(true)).catch(e => {
        console.error("Error playing audio:", e);
        setIsPlaying(false);
    });
  }, [songs]);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    const nextIndex = (currentSongIndex + 1) % queue.length;
    playSong(queue[nextIndex], queue);
  }, [currentSongIndex, queue, playSong]);

  useEffect(() => {
    const audio = audioRef.current || new Audio();
    if (!audioRef.current) audioRef.current = audio;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => isRepeating ? (audio.currentTime = 0, audio.play()) : playNext();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeating, playNext]);
  
  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
    }
    setIsPlaying(prev => !prev);
  }, [isPlaying, currentSong]);

  const addSongs = useCallback(async (newSongs: Song[]) => {
    if (newSongs.length === 0) return;
    // bulkAdd with allKeys will add only new songs and ignore existing ones.
    await db.songs.bulkAdd(newSongs, { allKeys: true });
  }, []);

  const createPlaylist = useCallback(async (name: string, description: string): Promise<boolean> => {
    if (!canCreatePlaylist.can || !name || name.length > 200) return false;
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      description,
      songs: [],
      coverArt: `https://picsum.photos/seed/${Date.now()}/500/500`
    };
    await db.playlists.add(newPlaylist);
    return true;
  }, [canCreatePlaylist.can]);

  const deletePlaylist = useCallback(async (playlistId: string) => {
    await db.playlists.delete(playlistId);
  }, []);

  const updatePlaylist = useCallback(async (playlistId: string, data: Partial<Omit<Playlist, 'id'>>) => {
    await db.playlists.update(playlistId, data);
  }, []);

  const addSongsToPlaylist = useCallback(async (playlistId: string, newSongs: Song[]) => {
    if (newSongs.length === 0) return;
    
    // First, ensure all songs exist in the main library
    await addSongs(newSongs);

    // Then, add them to the playlist
    await db.transaction('rw', db.playlists, async () => {
      const playlist = await db.playlists.get(playlistId);
      if (playlist) {
        const currentSongIds = new Set(playlist.songs.map(s => s.id));
        const uniqueNewSongs = newSongs.filter(s => !currentSongIds.has(s.id));
        if (uniqueNewSongs.length > 0) {
          playlist.songs.push(...uniqueNewSongs);
          await db.playlists.put(playlist);
        }
      }
    });
  }, [addSongs]);

  const removeSongFromPlaylist = useCallback(async (playlistId: string, songId: string) => {
    await db.transaction('rw', db.playlists, async () => {
      const playlist = await db.playlists.get(playlistId);
      if (playlist) {
        const updatedSongs = playlist.songs.filter(s => s.id !== songId);
        await db.playlists.update(playlistId, { songs: updatedSongs });
      }
    });
  }, []);
  
  const moveSongToPlaylist = useCallback(async (targetPlaylistId: string, song: Song, source: 'songs' | { playlistId: string }) => {
    // Add song to the target playlist.
    await addSongsToPlaylist(targetPlaylistId, [song]);

    // If the song came from another playlist, remove it from the source.
    if (typeof source !== 'string' && source.playlistId !== targetPlaylistId) {
        await removeSongFromPlaylist(source.playlistId, song.id);
    }
  }, [addSongsToPlaylist, removeSongFromPlaylist]);

  const deleteSong = useCallback(async (songId: string) => {
    // Stop playback if it's the current song
    if (currentSong?.id === songId) {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
        setCurrentSong(null);
        setIsPlaying(false);
    }

    // Remove from main songs table
    await db.songs.delete(songId);

    // Remove from all playlists
    await db.transaction('rw', db.playlists, async () => {
        const allPlaylists = await db.playlists.toArray();
        for (const playlist of allPlaylists) {
            const initialCount = playlist.songs.length;
            const updatedSongs = playlist.songs.filter(s => s.id !== songId);
            if (updatedSongs.length < initialCount) {
                await db.playlists.update(playlist.id, { songs: updatedSongs });
            }
        }
    });
    
    // Update queue if necessary
    setQueue(prev => prev.filter(s => s.id !== songId));

  }, [currentSong]);
  
  const playPrev = useCallback(() => {
    if (queue.length === 0) return;
    if(audioRef.current && audioRef.current.currentTime > 3) {
        audioRef.current.currentTime = 0;
        return;
    }
    const prevIndex = (currentSongIndex - 1 + queue.length) % queue.length;
    playSong(queue[prevIndex], queue);
  }, [currentSongIndex, queue, playSong]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const toggleRepeat = useCallback(() => setIsRepeating(prev => !prev), []);

  const spendCoins = useCallback(async (amount: number): Promise<boolean> => {
    const success = await db.transaction('rw', db.userData, async () => {
        const currentData = await db.userData.get('main');
        if (!currentData || currentData.coins < amount) {
            return false;
        }

        const now = new Date().getTime();
        const currentAdFreeTime = currentData.adFreeUntil && currentData.adFreeUntil > now ? currentData.adFreeUntil : now;
        const minutesToAdd = amount * 10;
        const newAdFreeUntil = currentAdFreeTime + minutesToAdd * 60 * 1000;

        await db.userData.update('main', {
            coins: currentData.coins - amount,
            adFreeUntil: newAdFreeUntil,
        });
        return true;
    });
    return success;
  }, []);

  const value = {
    songs: songs ?? [],
    addSongs,
    deleteSong,
    playlists: playlists ?? [],
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    moveSongToPlaylist,
    addSongsToPlaylist,
    removeSongFromPlaylist,
    isPlaying,
    currentSong,
    currentTime,
    duration,
    playSong,
    togglePlay,
    playNext,
    playPrev,
    seek,
    isRepeating,
    toggleRepeat,
    canCreatePlaylist,
    coins,
    spendCoins,
    isAdFree,
    isHydrated
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}
