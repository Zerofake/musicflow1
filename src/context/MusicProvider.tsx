"use client";

import type { Song, Playlist } from '@/lib/types';
import { initialSongs, initialPlaylists } from '@/lib/data';
import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';

const MAX_FREE_PLAYLISTS = 6;
const MAX_TOTAL_PLAYLISTS = 12;
const PLAYLIST_COST = 25; // Custo em créditos para criar uma playlist
const MAX_STORAGE_MB = 500; 

interface MusicContextType {
  // Songs
  songs: Song[];
  
  // Playlists
  playlists: Playlist[];
  createPlaylist: (name: string, description: string) => boolean;
  deletePlaylist: (playlistId: string) => void;
  updatePlaylist: (playlistId: string, data: Partial<Omit<Playlist, 'id'>>) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
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
  
  // Monetization & Storage
  credits: number;
  addCredits: (amount: number) => void;
  canCreatePlaylist: { can: boolean; needsCredits: boolean; message: string };
  totalStorageUsed: number;
}

export const MusicContext = createContext<MusicContextType | null>(null);

// Simula um tamanho médio em MB para cada música, já que não temos o tamanho real
const getSimulatedSongSize = (duration: number) => (duration / 60) * 4;

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeating, setIsRepeating] = useState(false);
  const [credits, setCredits] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const totalStorageUsed = React.useMemo(() => {
    return songs.reduce((acc, song) => acc + getSimulatedSongSize(song.duration), 0);
  }, [songs]);
  
  const addCredits = useCallback((amount: number) => {
    setCredits(prev => prev + amount);
  }, []);

  const canCreatePlaylist = React.useMemo(() => {
    if (playlists.length >= MAX_TOTAL_PLAYLISTS) {
      return {
        can: false,
        needsCredits: false,
        message: `Você atingiu o limite máximo de ${MAX_TOTAL_PLAYLISTS} playlists.`,
      };
    }

    const isOverStorageLimit = totalStorageUsed >= MAX_STORAGE_MB;
    if (isOverStorageLimit) {
        return {
            can: false,
            needsCredits: false,
            message: `Você atingiu o limite de ${MAX_STORAGE_MB}MB. Considere um plano de nuvem.`
        }
    }
    
    const isOverFreeLimit = playlists.length >= MAX_FREE_PLAYLISTS;
    if (isOverFreeLimit && credits < PLAYLIST_COST) {
        return {
            can: false,
            needsCredits: true,
            message: `Custa ${PLAYLIST_COST} créditos para criar mais playlists.`
        }
    }
    
    return {
        can: true,
        needsCredits: isOverFreeLimit,
        message: isOverFreeLimit ? `Isso custará ${PLAYLIST_COST} créditos.` : `Você pode criar mais ${MAX_FREE_PLAYLISTS - playlists.length} playlists gratuitas.`
    }
  }, [playlists.length, credits, totalStorageUsed]);

  const playSong = useCallback((song: Song, songQueue: Song[] = []) => {
    if (audioRef.current && audioRef.current.src && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    
    setCurrentSong(song);
    
    const newQueue = songQueue.length > 0 ? songQueue : [...songs];
    setQueue(newQueue);
    setCurrentSongIndex(newQueue.findIndex(s => s.id === song.id));

    const audio = audioRef.current ? audioRef.current : new Audio();
    if (!audioRef.current) {
        audioRef.current = audio;
    }
    
    audio.src = song.audioSrc;
    audio.load();
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(e => console.error("Error playing audio:", e));
  }, [songs]);


  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    const nextIndex = (currentSongIndex + 1) % queue.length;
    playSong(queue[nextIndex], queue);
  }, [currentSongIndex, queue, playSong]);


  useEffect(() => {
    const audio = audioRef.current ? audioRef.current : new Audio();
    if (!audioRef.current) {
      audioRef.current = audio;
    }

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
    if (!canCreatePlaylist.can || !name || name.length > 200) {
        return false;
    }

    if (canCreatePlaylist.needsCredits) {
        setCredits(prev => prev - PLAYLIST_COST);
    }
    
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      description,
      songIds: [],
      coverArt: `https://picsum.photos/seed/${Date.now()}/500/500`
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    return true;
  }, [canCreatePlaylist]);

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    if (currentSong && playlists.find(p => p.id === playlistId)?.songIds.includes(currentSong.id)) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentSong(null);
      setIsPlaying(false);
      setQueue([]);
    }
  }, [currentSong, playlists]);
  
  const updatePlaylist = useCallback((playlistId: string, data: Partial<Omit<Playlist, 'id'>>) => {
    setPlaylists(prev => prev.map(p => p.id === playlistId ? { ...p, ...data } : p));
  }, []);

  const addSongToPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId && !p.songIds.includes(songId)) {
        return { ...p, songIds: [...p.songIds, songId] };
      }
      return p;
    }));
  }, []);

  const removeSongFromPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, songIds: p.songIds.filter(id => id !== songId) };
      }
      return p;
    }));
  }, []);

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

  const value = {
    songs,
    playlists,
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    addSongToPlaylist,
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
    credits,
    addCredits,
    canCreatePlaylist,
    totalStorageUsed
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}
