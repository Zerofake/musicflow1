import type { Song, Playlist } from './types';

export const initialSongs: Song[] = [
  {
    id: '1',
    title: 'Energia Cósmica',
    artist: 'Orion',
    album: 'Galáxias',
    duration: 185,
    coverArt: 'https://picsum.photos/seed/music1/500/500',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Ritmos da Noite',
    artist: 'Luna',
    album: 'Céu Estrelado',
    duration: 210,
    coverArt: 'https://picsum.photos/seed/music2/500/500',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Ondas de Verão',
    artist: 'Sol',
    album: 'Praia e Brisa',
    duration: 195,
    coverArt: 'https://picsum.photos/seed/music3/500/500',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: '4',
    title: 'Floresta Encantada',
    artist: 'Gaia',
    album: 'Natureza Viva',
    duration: 240,
    coverArt: 'https://picsum.photos/seed/music4/500/500',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  }
];

export const initialPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'Downloads',
    description: 'Músicas baixadas recentemente.',
    coverArt: 'https://picsum.photos/seed/playlist1/500/500',
    songIds: ['1', '3'],
  },
  {
    id: '2',
    name: 'Vibes de Academia',
    description: 'Para dar aquele gás no treino.',
    coverArt: 'https://picsum.photos/seed/playlist2/500/500',
    songIds: ['2', '4'],
  },
];
