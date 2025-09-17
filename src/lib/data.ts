
import type { Song } from './types';

// This file is now primarily for seeding the database for the first time.
// The data structures are kept simple and will be converted to the
// normalized structure by the database logic.

const placeholderCover = (char: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500"><rect width="500" height="500" fill="#000000"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="250" fill="#FFFFFF">${encodeURIComponent(char)}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export const initialSongs: Song[] = [
  {
    id: 'SoundHelix-Song-1',
    title: 'Energia Cósmica',
    artist: 'Orion',
    album: 'Galáxias',
    duration: 185,
    coverArt: placeholderCover('E'),
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'SoundHelix-Song-2',
    title: 'Ritmos da Noite',
    artist: 'Luna',
    album: 'Céu Estrelado',
    duration: 210,
    coverArt: placeholderCover('R'),
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  }
];
