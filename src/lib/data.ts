
import type { Song } from './types';

// This file is now primarily for seeding the database for the first time.
// The data structures are kept simple and will be converted to the
// normalized structure by the database logic.

export const initialSongs: Song[] = [
  {
    id: 'SoundHelix-Song-1',
    title: 'Energia Cósmica',
    artist: 'Orion',
    album: 'Galáxias',
    duration: 185,
    coverArt: 'https://placehold.co/500x500/000000/FFFFFF/png?text=E',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'SoundHelix-Song-2',
    title: 'Ritmos da Noite',
    artist: 'Luna',
    album: 'Céu Estrelado',
    duration: 210,
    coverArt: 'https://placehold.co/500x500/000000/FFFFFF/png?text=R',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  }
];
