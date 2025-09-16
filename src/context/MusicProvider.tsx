
"use client";

import type { Song, Playlist, UserData } from '@/lib/types';
import { initialSongs, initialPlaylists } from '@/lib/data';
import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';

const MAX_TOTAL_PLAYLISTS = 12;

// LocalStorage Keys
const SONGS_STORAGE_KEY = 'musicflow-songs';
const PLAYLISTS_STORAGE_KEY = 'musicflow-playlists';
const USER_DATA_STORAGE_KEY = 'musicflow-user-data';

interface MusicContextType {
  // Songs
  songs: Song[];
  addSongs: (newSongs: Song[]) => void;
  deleteSong: (songId: string, fromPlaylistId?: string) => void;
  
  // Playlists
  playlists: Playlist[];
  createPlaylist: (name: string, description: string) => boolean;
  deletePlaylist: (playlistId: string) => void;
  updatePlaylist: (playlistId: string, data: Partial<Omit<Playlist, 'id'>>) => void;
  moveSongToPlaylist: (playlistId: string, song: Song, source: 'songs' | { playlistId: string }) => void;
  addSongsToPlaylist: (playlistId: string, newSongs: Song[]) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;

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
  spendCoins: (amount: number) => boolean;
  isAdFree: boolean;

  // App State
  isHydrated: boolean;
}

export const MusicContext = createContext<MusicContextType | null>(null);

const getInitialState = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') {
      return fallback;
    }
    try {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue) {
        return JSON.parse(storedValue);
      }
    } catch (error) {
      console.error(`Error reading from localStorage key “${key}”:`, error);
    }
    return fallback;
  };

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [userData, setUserData] = useState<UserData>({ coins: 0, adFreeUntil: null });
  
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isAdFree, setIsAdFree] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setSongs(getInitialState(SONGS_STORAGE_KEY, initialSongs));
    setPlaylists(getInitialState(PLAYLISTS_STORAGE_KEY, initialPlaylists));
    setUserData(getInitialState(USER_DATA_STORAGE_KEY, { coins: 0, adFreeUntil: null }));
    setIsHydrated(true);
  }, []);
  
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(SONGS_STORAGE_KEY, JSON.stringify(songs));
    } catch (error) {
      console.error('Failed to save songs to localStorage:', error);
    }
  }, [songs, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
    } catch (error) {
      console.error('Failed to save playlists to localStorage:', error);
    }
  }, [playlists, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
        console.error('Failed to save user data to localStorage:', error);
    }
  }, [userData, isHydrated]);

  useEffect(() => {
    const checkAdStatus = () => {
        const now = new Date().getTime();
        if (userData.adFreeUntil && now < userData.adFreeUntil) {
            setIsAdFree(true);
        } else if (isAdFree) {
            setIsAdFree(false);
            setUserData(prev => ({...prev, adFreeUntil: null}));
        }
    };
    checkAdStatus();
    const interval = setInterval(checkAdStatus, 10000);
    return () => clearInterval(interval);
  }, [userData.adFreeUntil, isAdFree]);

  const canCreatePlaylist = React.useMemo(() => {
    if (playlists.length >= MAX_TOTAL_PLAYLISTS) {
      return {
        can: false,
        message: `Você atingiu o limite máximo de ${MAX_TOTAL_PLAYLISTS} playlists.`,
      };
    }
    return {
        can: true,
        message: `Você pode criar até ${MAX_TOTAL_PLAYLISTS} playlists.`
    }
  }, [playlists.length]);

  const playSong = useCallback((song: Song, songQueue: Song[] = []) => {
    if (audioRef.current && audioRef.current.src && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    setCurrentSong(song);
    const newQueue = songQueue.length > 0 ? songQueue : [...songs];
    setQueue(newQueue);
    const songIndex = newQueue.findIndex(s => s.id === song.id);
    setCurrentSongIndex(songIndex);
    if (songIndex === -1 && songs.findIndex(s => s.id === song.id) === -1) {
        setCurrentSong(null);
        setIsPlaying(false);
        return;
    }
    const audio = audioRef.current ? audioRef.current : new Audio();
    if (!audioRef.current) {
        audioRef.current = audio;
    }
    audio.src = song.audioSrc;
    audio.load();
    audio.play().then(() => setIsPlaying(true)).catch(e => console.error("Error playing audio:", e));
  }, [songs]);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    const nextIndex = (currentSongIndex + 1) % queue.length;
    playSong(queue[nextIndex], queue);
  }, [currentSongIndex, queue, playSong]);

  useEffect(() => {
    const audio = audioRef.current ? audioRef.current : new Audio();
    if (!audioRef.current) audioRef.current = audio;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeating) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

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
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));;
    }
    setIsPlaying(prev => !prev);
  }, [isPlaying, currentSong]);

  const createPlaylist = useCallback((name: string, description: string): boolean => {
    if (!canCreatePlaylist.can || !name || name.length > 200) return false;
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      description,
      songs: [],
      coverArt: `https://picsum.photos/seed/${Date.now()}/500/500`
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    return true;
  }, [canCreatePlaylist]);

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
  }, []);
  
  const updatePlaylist = useCallback((playlistId: string, data: Partial<Omit<Playlist, 'id'>>) => {
    setPlaylists(prev => prev.map(p => p.id === playlistId ? { ...p, ...data } : p));
  }, []);

  const moveSongToPlaylist = useCallback((playlistId: string, song: Song, source: 'songs' | { playlistId: string }) => {
    // Adiciona a música na nova playlist
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        const currentSongs = p.songs || [];
        if (currentSongs.find(s => s.id === song.id)) return p; // Já existe
        return { ...p, songs: [...currentSongs, song] };
      }
      return p;
    }));
  
    // Remove a música da origem
    if (source === 'songs') {
      setSongs(prev => prev.filter(s => s.id !== song.id));
    } else {
      setPlaylists(prev => prev.map(p => {
        if (p.id === source.playlistId) {
          const currentSongs = p.songs || [];
          return { ...p, songs: currentSongs.filter(s => s.id !== song.id) };
        }
        return p;
      }));
    }
  }, []);

  const addSongsToPlaylist = useCallback((playlistId: string, newSongs: Song[]) => {
    setPlaylists(prevPls => prevPls.map(p => {
        if (p.id === playlistId) {
            const currentSongs = p.songs || [];
            const uniqueNewSongs = newSongs.filter(
                newSong => !currentSongs.some(existingSong => existingSong.id === newSong.id)
            );
            return { ...p, songs: [...currentSongs, ...uniqueNewSongs] };
        }
        return p;
    }));
  }, []);

  const removeSongFromPlaylist = useCallback((playlistId: string, songId: string) => {
    let songToMove: Song | undefined;
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        const currentSongs = p.songs || [];
        songToMove = currentSongs.find(s => s.id === songId);
        return { ...p, songs: currentSongs.filter(id => id.id !== songId) };
      }
      return p;
    }));

    if (songToMove) {
      setSongs(prev => [...prev, songToMove!]);
    }
  }, []);
  
  const addSongs = useCallback((newSongs: Song[]) => {
    setSongs(prevSongs => {
      const uniqueNewSongs = newSongs.filter(
        newSong => !prevSongs.some(existingSong => existingSong.id === newSong.id)
      );
      return [...prevSongs, ...uniqueNewSongs];
    });
  }, []);
  
  const deleteSong = useCallback((songId: string, fromPlaylistId?: string) => {
    if (fromPlaylistId) {
      setPlaylists(prev => prev.map(p => {
        if (p.id === fromPlaylistId) {
          const currentSongs = p.songs || [];
          return { ...p, songs: currentSongs.filter(s => s.id !== songId) };
        }
        return p;
      }));
    } else {
      setSongs(prev => prev.filter(s => s.id !== songId));
    }

    if (currentSong?.id === songId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setCurrentSong(null);
      setIsPlaying(false);
      
      const newQueue = queue.filter(s => s.id !== songId);
      setQueue(newQueue);
      
      if (newQueue.length > 0) {
        const newIndex = Math.min(currentSongIndex, newQueue.length - 1);
        playSong(newQueue[newIndex], newQueue);
      } else {
        setQueue([]);
        setCurrentSongIndex(-1);
      }
    } else {
      setQueue(prev => prev.filter(s => s.id !== songId));
    }
  }, [currentSong, queue, currentSongIndex, playSong]);

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

  const toggleRepeat = useCallback(() => {
    setIsRepeating(prev => !prev);
  }, []);

  const spendCoins = useCallback((amount: number) => {
    if (userData.coins < amount) return false;
    const now = new Date().getTime();
    const currentAdFreeTime = userData.adFreeUntil && userData.adFreeUntil > now ? userData.adFreeUntil : now;
    const minutesToAdd = (amount / 1) * 10;
    const newAdFreeUntil = currentAdFreeTime + minutesToAdd * 60 * 1000;
    
    setUserData(prev => ({
        ...prev,
        coins: prev.coins - amount,
        adFreeUntil: newAdFreeUntil,
    }));
    return true;
  }, [userData]);

  const value = {
    songs,
    addSongs,
    deleteSong,
    playlists,
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
    coins: userData.coins,
    spendCoins,
    isAdFree,
    isHydrated
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}
