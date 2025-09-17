
import type { Song, Playlist } from './types';

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
    coverArt: 'https://picsum.photos/seed/music1/500/500',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'SoundHelix-Song-2',
    title: 'Ritmos da Noite',
    artist: 'Luna',
    album: 'Céu Estrelado',
    duration: 210,
    coverArt: 'https://picsum.photos/seed/music2/500/500',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  }
];

export const initialPlaylists: Omit<Playlist, 'id'>[] = [
    {
      name: 'Downloads',
      description: 'Músicas baixadas recentemente.',
      coverArt: 'https://picsum.photos/seed/playlist1/500/500',
      songs: ['SoundHelix-Song-2'],
    },
    {
      name: 'Vibes de Academia',
      description: 'Para dar aquele gás no treino.',
      coverArt: 'https://picsum.photos/seed/playlist2/500/500',
      songs: [],
    },
  ];
