import Dexie, { type Table } from 'dexie';
import type { Song, Playlist, UserData } from './types';

// Mock initial data, but now songs in playlists are just IDs
const initialSongs: Song[] = [
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


const initialPlaylists: Omit<Playlist, 'id'>[] = [
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


export class MusicFlowDB extends Dexie {
  songs!: Table<Song, string>; // Primary key is string (id)
  playlists!: Table<Playlist, number>; // Primary key is number (auto-incremented id)
  userData!: Table<UserData, string>; // Primary key is string ('main')

  constructor() {
    super('MusicFlowDB');
    this.version(3).stores({
      songs: 'id, title, artist, album',
      playlists: '++id, name',
      userData: 'id',
    }).upgrade(async tx => {
      // Migration logic for when we switched playlist.songs to be string[]
      const playlistsToMigrate = await tx.table('playlists').toArray();
      for (const p of playlistsToMigrate) {
        if (p.songs.length > 0 && typeof p.songs[0] === 'object') {
          // This is the old format, we need to migrate it
          const songIds = p.songs.map((s: any) => s.id);
          await tx.table('playlists').update(p.id, { songs: songIds });
        }
      }
    });

     this.version(2).stores({
      songs: 'id, title, artist, album',
      playlists: '++id, name',
      userData: 'id',
    });
  }
}

export const db = new MusicFlowDB();

db.on('populate', async () => {
    await db.songs.bulkAdd(initialSongs);
    await db.playlists.bulkAdd(initialPlaylists as any);
    await db.userData.add({ id: 'main', coins: 0, adFreeUntil: null });
});
