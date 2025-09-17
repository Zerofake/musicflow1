
"use client";

import type { Song, Playlist, UserData } from '@/lib/types';
import { initialSongs, initialPlaylists } from '@/lib/data';
import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';

const MAX_TOTAL_PLAYLISTS = 12;

// IndexedDB Config
const DB_NAME = 'MusicFlowDB';
const DB_VERSION = 1;
const SONGS_STORE_NAME = 'songs';
const PLAYLISTS_STORE_NAME = 'playlists';
const USER_DATA_STORE_NAME = 'userData';

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

// --- IndexedDB Helper Functions ---
const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(SONGS_STORE_NAME)) {
                db.createObjectStore(SONGS_STORE_NAME, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(PLAYLISTS_STORE_NAME)) {
                db.createObjectStore(PLAYLISTS_STORE_NAME, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(USER_DATA_STORE_NAME)) {
                db.createObjectStore(USER_DATA_STORE_NAME, { keyPath: 'id' });
            }
        };
        request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);
        request.onerror = (event) => reject((event.target as IDBOpenDBRequest).error);
    });
};

const dbRequest = <T>(storeName: string, type: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest): Promise<T> => {
    return openDB().then(db => {
        return new Promise<T>((resolve, reject) => {
            const transaction = db.transaction(storeName, type);
            const store = transaction.objectStore(storeName);
            const request = action(store);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    });
};


export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [userData, setUserData] = useState<UserData>({ id: 'main', coins: 0, adFreeUntil: null });
  
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isAdFree, setIsAdFree] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Effect to hydrate from IndexedDB
  useEffect(() => {
    const hydrate = async () => {
        if (typeof window === 'undefined') return;

        try {
            const db = await openDB();
            const tx = db.transaction([SONGS_STORE_NAME, PLAYLISTS_STORE_NAME, USER_DATA_STORE_NAME], 'readonly');
            
            const songsStore = tx.objectStore(SONGS_STORE_NAME);
            const playlistsStore = tx.objectStore(PLAYLISTS_STORE_NAME);
            const userDataStore = tx.objectStore(USER_DATA_STORE_NAME);

            const songsReq = songsStore.getAll();
            const playlistsReq = playlistsStore.getAll();
            const userDataReq = userDataStore.get('main');
            
            const [dbSongs, dbPlaylists, dbUserData] = await Promise.all([
                new Promise<Song[]>(res => { songsReq.onsuccess = () => res(songsReq.result); }),
                new Promise<Playlist[]>(res => { playlistsReq.onsuccess = () => res(playlistsReq.result); }),
                new Promise<UserData | undefined>(res => { userDataReq.onsuccess = () => res(userDataReq.result); }),
            ]);

            // First time initialization
            if (dbSongs.length === 0 && dbPlaylists.length === 0) {
                const writeTx = db.transaction([SONGS_STORE_NAME, PLAYLISTS_STORE_NAME], 'readwrite');
                const initSongsTx = writeTx.objectStore(SONGS_STORE_NAME);
                initialSongs.forEach(song => initSongsTx.add(song));

                const initPlaylistsTx = writeTx.objectStore(PLAYLISTS_STORE_NAME);
                initialPlaylists.forEach(pl => initPlaylistsTx.add(pl));
                
                await new Promise<void>(resolve => { writeTx.oncomplete = () => resolve(); });

                setSongs(initialSongs);
                setPlaylists(initialPlaylists);
            } else {
                setSongs(dbSongs);
                setPlaylists(dbPlaylists);
            }

            if(dbUserData) {
                setUserData(dbUserData);
            } else {
                const initUserTx = db.transaction(USER_DATA_STORE_NAME, 'readwrite');
                const userStore = initUserTx.objectStore(USER_DATA_STORE_NAME);
                const initialUserData = { id: 'main', coins: 0, adFreeUntil: null };
                userStore.add(initialUserData);
                await new Promise<void>(resolve => { initUserTx.oncomplete = () => resolve(); });
                setUserData(initialUserData);
            }
            
            setIsHydrated(true);

        } catch (error) {
            console.error("Failed to hydrate from IndexedDB:", error);
        }
    };
    hydrate();
  }, []);

  // Ad status check
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

  const canCreatePlaylist = React.useMemo(() => ({
    can: playlists.length < MAX_TOTAL_PLAYLISTS,
    message: playlists.length < MAX_TOTAL_PLAYLISTS 
      ? `Você pode criar até ${MAX_TOTAL_PLAYLISTS} playlists.` 
      : `Você atingiu o limite máximo de ${MAX_TOTAL_PLAYLISTS} playlists.`
  }), [playlists.length]);


  const playSong = useCallback((song: Song, songQueue: Song[] = []) => {
    if (audioRef.current && audioRef.current.src && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    setCurrentSong(song);
    const newQueue = songQueue.length > 0 ? songQueue : [...songs];
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
    const db = await openDB();
    const tx = db.transaction(SONGS_STORE_NAME, 'readwrite');
    const store = tx.objectStore(SONGS_STORE_NAME);

    const currentSongList = await dbRequest<Song[]>(SONGS_STORE_NAME, 'readonly', store => store.getAll());

    const uniqueNewSongs = newSongs.filter(
        newSong => !currentSongList.some(existingSong => existingSong.id === newSong.id)
    );

    if (uniqueNewSongs.length > 0) {
        uniqueNewSongs.forEach(song => store.put(song)); // Use put to add or update
        setSongs(prev => [...prev, ...uniqueNewSongs]);
    }

    return new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
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
    await dbRequest('playlists', 'readwrite', store => store.add(newPlaylist));
    setPlaylists(prev => [...prev, newPlaylist]);
    return true;
  }, [canCreatePlaylist]);

  const deletePlaylist = useCallback(async (playlistId: string) => {
    await dbRequest('playlists', 'readwrite', store => store.delete(playlistId));
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
  }, []);

  const updatePlaylist = useCallback(async (playlistId: string, data: Partial<Omit<Playlist, 'id'>>) => {
    const db = await openDB();
    const tx = db.transaction(PLAYLISTS_STORE_NAME, 'readwrite');
    const store = tx.objectStore(PLAYLISTS_STORE_NAME);
    const req = store.get(playlistId);

    return new Promise<void>((resolve, reject) => {
        req.onsuccess = () => {
            const playlist = req.result;
            if (playlist) {
                const updatedPlaylist = { ...playlist, ...data };
                store.put(updatedPlaylist);
                setPlaylists(prev => prev.map(p => p.id === playlistId ? updatedPlaylist : p));
                tx.oncomplete = () => resolve();
            } else {
                reject('Playlist not found');
            }
        };
        req.onerror = () => reject(req.error);
    });
  }, []);

  const addSongsToPlaylist = useCallback(async (playlistId: string, newSongs: Song[]) => {
    if (newSongs.length === 0) return;
    await addSongs(newSongs); // Ensure songs exist in the main library
    
    const db = await openDB();
    const tx = db.transaction(PLAYLISTS_STORE_NAME, 'readwrite');
    const store = tx.objectStore(PLAYLISTS_STORE_NAME);
    const req = store.get(playlistId);

    return new Promise<void>((resolve, reject) => {
      req.onsuccess = () => {
          const playlist = req.result;
          if(playlist) {
              const currentPlaylistSongs = playlist.songs || [];
              const uniqueNewSongsForPlaylist = newSongs.filter(
                  newSong => !currentPlaylistSongs.some(existingSong => existingSong.id === newSong.id)
              );
              if (uniqueNewSongsForPlaylist.length > 0) {
                  const updatedPlaylist = { ...playlist, songs: [...currentPlaylistSongs, ...uniqueNewSongsForPlaylist] };
                  store.put(updatedPlaylist);
                  setPlaylists(prev => prev.map(p => p.id === playlistId ? updatedPlaylist : p));
              }
              tx.oncomplete = () => resolve();
          } else {
            reject('Playlist not found');
          }
      };
      req.onerror = () => reject(req.error);
    });
  }, [addSongs]);

  const removeSongFromPlaylist = useCallback(async (playlistId: string, songId: string) => {
    const db = await openDB();
    const tx = db.transaction(PLAYLISTS_STORE_NAME, 'readwrite');
    const store = tx.objectStore(PLAYLISTS_STORE_NAME);
    const req = store.get(playlistId);
    
    return new Promise<void>((resolve, reject) => {
        req.onsuccess = () => {
            const playlist = req.result;
            if(playlist) {
                const updatedSongs = playlist.songs?.filter(s => s.id !== songId) || [];
                const updatedPlaylist = { ...playlist, songs: updatedSongs };
                store.put(updatedPlaylist);
                setPlaylists(prev => prev.map(p => p.id === playlistId ? updatedPlaylist : p));
                tx.oncomplete = () => resolve();
            } else {
                reject('Playlist not found');
            }
        };
        req.onerror = () => reject(req.error);
    });
  }, []);

  const moveSongToPlaylist = useCallback(async (targetPlaylistId: string, song: Song, source: 'songs' | { playlistId: string }) => {
    // 1. Add song to the target playlist. It will only add if not already present.
    await addSongsToPlaylist(targetPlaylistId, [song]);

    // 2. If the song came from another playlist, remove it from the source.
    if (source !== 'songs' && source.playlistId !== targetPlaylistId) {
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

    // Remove from DB
    const db = await openDB();
    const songTx = db.transaction(SONGS_STORE_NAME, 'readwrite');
    songTx.objectStore(SONGS_STORE_NAME).delete(songId);
    await new Promise<void>(resolve => { songTx.oncomplete = () => resolve(); });


    const playlistTx = db.transaction(PLAYLISTS_STORE_NAME, 'readwrite');
    const playlistStore = playlistTx.objectStore(PLAYLISTS_STORE_NAME);
    const allPlaylistsReq = playlistStore.getAll();

    allPlaylistsReq.onsuccess = async () => {
        const allPls: Playlist[] = allPlaylistsReq.result;
        const updatedPlaylists: Playlist[] = [];
        let didUpdate = false;

        for (const p of allPls) {
            const initialSongCount = p.songs.length;
            const newSongs = p.songs.filter(s => s.id !== songId);
            if(newSongs.length !== initialSongCount) {
                didUpdate = true;
                const updatedPlaylist = { ...p, songs: newSongs };
                playlistStore.put(updatedPlaylist);
                updatedPlaylists.push(updatedPlaylist);
            } else {
                updatedPlaylists.push(p);
            }
        }
        
        if (didUpdate) {
             setPlaylists(updatedPlaylists);
        }
    };
    
    await new Promise<void>(resolve => { playlistTx.oncomplete = () => resolve(); });
    
    setSongs(prev => prev.filter(s => s.id !== songId));
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
    const db = await openDB();
    const tx = db.transaction(USER_DATA_STORE_NAME, 'readwrite');
    const store = tx.objectStore(USER_DATA_STORE_NAME);
    const req = store.get('main');

    return new Promise((resolve) => {
        req.onsuccess = () => {
            let currentData: UserData = req.result || {id: 'main', coins: 0, adFreeUntil: null};
            if (currentData.coins < amount) {
                resolve(false);
                return;
            }
            
            const now = new Date().getTime();
            const currentAdFreeTime = currentData.adFreeUntil && currentData.adFreeUntil > now ? currentData.adFreeUntil : now;
            const minutesToAdd = (amount / 1) * 10;
            const newAdFreeUntil = currentAdFreeTime + minutesToAdd * 60 * 1000;
            
            const updatedUserData: UserData = {
                ...currentData,
                coins: currentData.coins - amount,
                adFreeUntil: newAdFreeUntil,
            };

            store.put(updatedUserData);
            setUserData(updatedUserData);
            resolve(true);
        };
        req.onerror = () => resolve(false);
    });
  }, []);

  const value = {
    songs, addSongs, deleteSong,
    playlists, createPlaylist, deletePlaylist, updatePlaylist, moveSongToPlaylist, addSongsToPlaylist, removeSongFromPlaylist,
    isPlaying, currentSong, currentTime, duration, playSong, togglePlay, playNext, playPrev, seek, isRepeating, toggleRepeat,
    canCreatePlaylist, coins: userData.coins, spendCoins, isAdFree,
    isHydrated
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}
