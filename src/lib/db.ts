import Dexie, { type Table } from 'dexie';
import type { Song, Playlist, UserData } from './types';
import { initialSongs } from './data';

export class MusicFlowDB extends Dexie {
  songs!: Table<Song, string>; // Primary key is string (id)
  playlists!: Table<Playlist, string>; // Primary key is string (id)
  userData!: Table<UserData, string>; // Primary key is string ('main')

  constructor() {
    super('MusicFlowDB');
    this.version(4).stores({
      songs: 'id, title, artist, album',
      playlists: 'id, name',
      userData: 'id',
    });
  }
}

export const db = new MusicFlowDB();

const placeholderCover = (char: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500"><rect width="500" height="500" fill="#000000"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="250" fill="#FFFFFF">${encodeURIComponent(char)}</text></svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

db.on('populate', async () => {
    await db.songs.bulkAdd(initialSongs);
    
    const initialPlaylists: Omit<Playlist, 'id'>[] = [
      {
        name: 'Downloads',
        description: 'Músicas baixadas recentemente.',
        coverArt: placeholderCover('D'),
        songs: ['SoundHelix-Song-2'],
      },
      {
        name: 'Vibes de Academia',
        description: 'Para dar aquele gás no treino.',
        coverArt: placeholderCover('V'),
        songs: [],
      },
    ];

    const playlistsWithIds = initialPlaylists.map(p => ({
      ...p,
      id: `playlist_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    }));

    await db.playlists.bulkAdd(playlistsWithIds as any);
    await db.userData.add({ id: 'main', coins: 0, adFreeUntil: null });
});
