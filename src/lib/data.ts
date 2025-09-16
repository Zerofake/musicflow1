
import type { Song, Playlist } from './types';

export const initialSongs: Song[] = [
  {
    id: 'ai-song-1',
    title: 'Minha Faixa AI',
    artist: 'Gerado por IA',
    album: 'Singles',
    duration: 180, // Duração em segundos (ajuste se souber)
    coverArt: 'https://picsum.photos/seed/ai-music-1/500/500',
    audioSrc: '/music/musica-ia.mp3', // <-- Coloque seu arquivo com este nome em public/music
  },
  {
    id: '1',
    title: 'Energia Cósmica',
    artist: 'Orion',
    album: 'Galáxias',
    duration: 185,
    coverArt: 'https://picsum.photos/seed/music1/500/500',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
];

export const initialPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'Downloads',
    description: 'Músicas baixadas recentemente.',
    coverArt: 'https://picsum.photos/seed/playlist1/500/500',
    songs: [
      {
        id: '2',
        title: 'Ritmos da Noite',
        artist: 'Luna',
        album: 'Céu Estrelado',
        duration: 210,
        coverArt: 'https://picsum.photos/seed/music2/500/500',
        audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      }
    ],
  },
  {
    id: '2',
    name: 'Vibes de Academia',
    description: 'Para dar aquele gás no treino.',
    coverArt: 'https://picsum.photos/seed/playlist2/500/500',
    songs: [],
  },
];
