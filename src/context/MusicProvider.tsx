"use client";

import type { Song, Playlist } from '@/lib/types';
import { initialSongs, initialPlaylists } from '@/lib/data';
import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';

interface MusicContextType {
  // Songs
  songs: Song[];
  
  // Playlists
  playlists: Playlist[];
  createPlaylist: (name: string, description: string) => void;
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

  const playSong = useCallback((song: Song, songQueue: Song[] = []) => {
    setCurrentSong(song);
    if (audioRef.current) {
      audioRef.current.src = song.audioSrc;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Error playing audio:", e));
    }
    if (songQueue.length > 0) {
      setQueue(songQueue);
      const songIndex = songQueue.findIndex(s => s.id === song.id);
      setCurrentSongIndex(songIndex !== -1 ? songIndex : 0);
    } else {
      setQueue([song]);
      setCurrentSongIndex(0);
    }
  }, []);
  
  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    const nextIndex = (currentSongIndex + 1) % queue.length;
    playSong(queue[nextIndex], queue);
  }, [currentSongIndex, queue, playSong]);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

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
  

  const createPlaylist = useCallback((name: string, description: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      description,
      songIds: [],
      coverArt: `https://picsum.photos/seed/${Date.now()}/500/500`
    };
    setPlaylists(prev => [...prev, newPlaylist]);
  }, []);

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    // Optional: if the currently playing song is from this playlist, stop it.
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

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Error playing audio:", e));
    }
  }, [isPlaying, currentSong]);

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
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}
