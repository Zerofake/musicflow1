"use client";

import type { Song, Playlist } from '@/lib/types';
import { initialSongs, initialPlaylists } from '@/lib/data';
import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';

const MAX_TOTAL_PLAYLISTS = 12;

interface MusicContextType {
  // Songs
  songs: Song[];
  deleteSong: (songId: string) => void;
  
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
  
  // Monetization
  canCreatePlaylist: { can: boolean; message: string };
}

export const MusicContext = createContext<MusicContextType | null>(null);

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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  
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

    // Se a música não estiver mais na lista principal de músicas, não faz sentido tocar
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
  }, []);
  
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
  
  const deleteSong = useCallback((songId: string) => {
    // 1. Remove song from all playlists
    setPlaylists(prev => 
      prev.map(p => ({
        ...p,
        songIds: p.songIds.filter(id => id !== songId)
      }))
    );

    // 2. Remove song from the main songs list
    setSongs(prev => prev.filter(s => s.id !== songId));

    // 3. Stop playback if it's the current song
    if (currentSong?.id === songId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setCurrentSong(null);
      setIsPlaying(false);
      
      // Update queue
      const newQueue = queue.filter(s => s.id !== songId);
      setQueue(newQueue);
      
      // Try to play the next song in the old queue's position if possible
      if (newQueue.length > 0) {
        const newIndex = Math.min(currentSongIndex, newQueue.length - 1);
        playSong(newQueue[newIndex], newQueue);
      } else {
        setQueue([]);
        setCurrentSongIndex(-1);
      }
    } else {
      // Just update the queue if the deleted song was in it
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

  const value = {
    songs,
    deleteSong,
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
    canCreatePlaylist
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}
