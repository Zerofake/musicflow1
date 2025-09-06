import type { Song, Playlist } from './types';

// Note: Using placeholder audio. In a real app, these would be local file URIs.
// For web demo purposes, using silent audio files to avoid copyright issues.
const silentAudio = 'data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gUmVjb3JkZWQgb24gMjAwOS0wNy0wMANRVUFVVEFYWFgLAAAAgWa9dxAADUFBQULQDgLAAAAgWa9dxAADURVVFVRLYh9gAAAAB/B4gAAAAAABqgVf/7VgAAAAgWa9dxAADURVVFVRLYh9gAAAAB/B4gAAAAAABqgVf/7VgAAAAgWa9dxAADURVVFVRLYh9gAAAAB/B4gAAAAAABqgVf/7VgAAAAgWa9dxAADURVVFVRLYh9gAAAAB/B4gAAAAAABqgVf/7Vg';

export const songs: Song[] = [
  {
    id: '1',
    title: 'Energia Cósmica',
    artist: 'Orion',
    album: 'Galáxias',
    duration: 185,
    coverArt: 'https://picsum.photos/seed/music1/500/500',
    audioSrc: silentAudio,
  },
  {
    id: '2',
    title: 'Ritmos da Noite',
    artist: 'Luna',
    album: 'Céu Estrelado',
    duration: 210,
    coverArt: 'https://picsum.photos/seed/music2/500/500',
    audioSrc: silentAudio,
  },
  {
    id: '3',
    title: 'Ondas de Verão',
    artist: 'Sol',
    album: 'Praia e Brisa',
    duration: 195,
    coverArt: 'https://picsum.photos/seed/music3/500/500',
    audioSrc: silentAudio,
  },
  {
    id: '4',
    title: 'Floresta Encantada',
    artist: 'Gaia',
    album: 'Natureza Viva',
    duration: 240,
    coverArt: 'https://picsum.photos/seed/music4/500/500',
    audioSrc: silentAudio,
  },
  {
    id: '5',
    title: 'Nebulosa Púrpura',
    artist: 'Orion',
    album: 'Galáxias',
    duration: 220,
    coverArt: 'https://picsum.photos/seed/music5/500/500',
    audioSrc: silentAudio,
  },
  {
    id: '6',
    title: 'Aurora Boreal',
    artist: 'Luna',
    album: 'Céu Estrelado',
    duration: 180,
    coverArt: 'https://picsum.photos/seed/music6/500/500',
    audioSrc: silentAudio,
  },
  {
    id: '7',
    title: 'Maré Alta',
    artist: 'Sol',
    album: 'Praia e Brisa',
    duration: 200,
    coverArt: 'https://picsum.photos/seed/music7/500/500',
    audioSrc: silentAudio,
  },
  {
    id: '8',
    title: 'Ecos da Montanha',
    artist: 'Gaia',
    album: 'Natureza Viva',
    duration: 190,
    coverArt: 'https://picsum.photos/seed/music8/500/500',
    audioSrc: silentAudio,
  },
  {
    id: '9',
    title: 'Estrela Cadente',
    artist: 'Orion',
    album: 'Galáxias',
    duration: 205,
    coverArt: 'https://picsum.photos/seed/music9/500/500',
    audioSrc: silentAudio,
  },
  {
    id: '10',
    title: 'Luar',
    artist: 'Luna',
    album: 'Céu Estrelado',
    duration: 170,
    coverArt: 'https://picsum.photos/seed/music10/500/500',
    audioSrc: silentAudio,
  },
];

export const playlists: Playlist[] = [
  {
    id: '1',
    name: 'Downloads',
    description: 'Músicas baixadas recentemente.',
    coverArt: 'https://picsum.photos/seed/playlist1/500/500',
    songIds: ['1', '3', '5'],
  },
  {
    id: '2',
    name: 'Vibes de Academia',
    description: 'Para dar aquele gás no treino.',
    coverArt: 'https://picsum.photos/seed/playlist2/500/500',
    songIds: ['2', '4', '9', '7'],
  },
  {
    id: '3',
    name: 'Relax',
    description: 'Músicas calmas para relaxar.',
    coverArt: 'https://picsum.photos/seed/playlist3/500/500',
    songIds: ['6', '8', '10'],
  },
  {
    id: '4',
    name: 'Favoritas',
    description: 'Minhas músicas preferidas.',
    coverArt: 'https://picsum.photos/seed/playlist4/500/500',
    songIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  },
];
