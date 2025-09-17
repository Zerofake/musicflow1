
"use client";

import type { Song, Playlist, UserData } from '@/lib/types';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { initialSongs } from '@/lib/data';

const MAX_TOTAL_PLAYLISTS = 12;

interface MusicContextType {
  // Songs
  songs: Song[];
  addSongs: (newSongs: Song[]) => Promise<void>;
  deleteSong: (songId: string) => Promise<void>;
  getSongById: (songId: string) => Song | undefined;
  
  // Playlists
  playlists: Playlist[];
  createPlaylist: (name: string, description: string) => Promise<boolean>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  updatePlaylist: (playlistId: string, data: Partial<Omit<Playlist, 'id'>>) => Promise<void>;
  moveSongToPlaylist: (targetPlaylistId: string, songId: string, sourcePlaylistId?: string) => Promise<void>;
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

const placeholderCover = (char: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500"><rect width="500" height="500" fill="#000000"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="250" fill="#FFFFFF">${encodeURIComponent(char.charAt(0).toUpperCase())}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isDbOpen, setIsDbOpen] = useState(false);

  useEffect(() => {
    db.open()
      .then(() => {
        setIsDbOpen(true);
        console.log("Database opened successfully");
      })
      .catch((err) => {
        console.error(`Failed to open db: ${err.stack || err}`);
      });
  }, []);

  const allSongs = useLiveQuery(() => isDbOpen ? db.songs.toArray() : [], [isDbOpen], []);
  const playlists = useLiveQuery(() => isDbOpen ? db.playlists.toArray() : [], [isDbOpen], []);
  const userData = useLiveQuery(() => isDbOpen ? db.userData.get('main') : undefined, [isDbOpen]);

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isAdFree, setIsAdFree] = useState(false);
  
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isHydrated = allSongs !== undefined && playlists !== undefined && userData !== undefined;
  const coins = userData?.coins ?? 0;

  // Seed initial data if the database is empty
  useEffect(() => {
    if (!isHydrated) return;

    const seedDatabase = async () => {
      // User data
      const userCount = await db.userData.count();
      if (userCount === 0) {
        await db.userData.add({ id: 'main', coins: 0, adFreeUntil: null });
      }

      // Songs
      const songCount = await db.songs.count();
      if (songCount === 0) {
        await db.songs.bulkAdd(initialSongs);
      }

      // Playlists
      const playlistCount = await db.playlists.count();
      if (playlistCount === 0) {
        const initialPlaylists: Playlist[] = [
          {
            id: `playlist_${Date.now()}_downloads`,
            name: 'Downloads',
            description: 'Músicas baixadas recentemente.',
            coverArt: placeholderCover('D'),
            songs: ['SoundHelix-Song-2'],
          },
          {
            id: `playlist_${Date.now()}_gym`,
            name: 'Vibes de Academia',
            description: 'Para dar aquele gás no treino.',
            coverArt: placeholderCover('V'),
            songs: [],
          },
        ];
        await db.playlists.bulkAdd(initialPlaylists);
      }
    };

    seedDatabase();
  }, [isHydrated]);

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
  
  const getSongById = useCallback((songId: string) => {
    return allSongs?.find(s => s.id === songId);
  }, [allSongs]);

  const playSong = useCallback((song: Song, songQueue: Song[] = []) => {
    if (audioRef.current && audioRef.current.src && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    setCurrentSong(song);
    const newQueue = songQueue.length > 0 ? songQueue : (allSongs || []);
    setQueue(newQueue);
    const songIndex = newQueue.findIndex(s => s.id === song.id);
    setCurrentSongIndex(songIndex);

    if (songIndex === -1 && song) {
        setQueue([song]);
        setCurrentSongIndex(0);
    } else if (songIndex === -1 && !song) {
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
  }, [allSongs]);

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
    try {
        const existingSongIds = new Set((await db.songs.toArray()).map(s => s.id));
        const songsToAdd = newSongs.filter(s => !existingSongIds.has(s.id));
        if (songsToAdd.length > 0) {
          await db.songs.bulkAdd(songsToAdd);
        }
    } catch (error) {
        console.error("Failed to add songs:", error);
        toast({
            variant: "destructive",
            title: "Erro ao Adicionar Músicas",
            description: "Algumas músicas podem não ter sido salvas. Tente novamente.",
        });
    }
  }, [toast]);

  const createPlaylist = useCallback(async (name: string, description: string): Promise<boolean> => {
    if (!canCreatePlaylist.can || !name || name.length > 200) return false;
    
    const newPlaylist: Playlist = {
      id: `playlist_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name,
      description,
      songs: [],
      coverArt: placeholderCover(name)
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
    
    await addSongs(newSongs);

    await db.transaction('rw', db.playlists, async () => {
      const playlist = await db.playlists.get(playlistId);
      if (playlist) {
        const currentSongIds = new Set(playlist.songs);
        const newSongIds = newSongs.map(s => s.id).filter(id => !currentSongIds.has(id));
        if (newSongIds.length > 0) {
          playlist.songs.push(...newSongIds);
          await db.playlists.put(playlist);
        }
      }
    });
  }, [addSongs]);

  const removeSongFromPlaylist = useCallback(async (playlistId: string, songId: string) => {
    await db.transaction('rw', db.playlists, async () => {
      const playlist = await db.playlists.get(playlistId);
      if (playlist) {
        const initialCount = playlist.songs.length;
        const updatedSongIds = playlist.songs.filter(id => id !== songId);
        if (updatedSongIds.length < initialCount) {
          await db.playlists.update(playlistId, { songs: updatedSongIds });
        }
      }
    });
  }, []);
  
  const moveSongToPlaylist = useCallback(async (targetPlaylistId: string, songId: string, sourcePlaylistId?: string) => {
    await db.transaction('rw', db.playlists, async () => {
        const targetPlaylist = await db.playlists.get(targetPlaylistId);
        if (targetPlaylist) {
            const songIds = new Set(targetPlaylist.songs);
            if (!songIds.has(songId)) {
                await db.playlists.update(targetPlaylistId, { songs: [...targetPlaylist.songs, songId]});
            }
        }

        if (sourcePlaylistId && sourcePlaylistId !== targetPlaylistId) {
            await removeSongFromPlaylist(sourcePlaylistId, songId);
        }
    });
    toast({
        title: "Música Movida",
        description: "A música foi movida para a nova playlist.",
    });
  }, [toast, removeSongFromPlaylist]);

  const deleteSong = useCallback(async (songId: string) => {
    if (currentSong?.id === songId) {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
        setCurrentSong(null);
        setIsPlaying(false);
    }

    await db.songs.delete(songId);

    await db.transaction('rw', db.playlists, async () => {
        const allPlaylists = await db.playlists.toArray();
        for (const playlist of allPlaylists) {
            const initialCount = playlist.songs.length;
            const updatedSongs = playlist.songs.filter(sId => sId !== songId);
            if (updatedSongs.length < initialCount && playlist.id) {
                await db.playlists.update(playlist.id, { songs: updatedSongs });
            }
        }
    });
    
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
    songs: allSongs ?? [],
    addSongs,
    deleteSong,
    getSongById,
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
