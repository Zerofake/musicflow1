export interface Song {
  id: string; // Should be a unique identifier, e.g., `${file.name}-${file.lastModified}`
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverArt?: string; // URL to image
  audioSrc: string; // Data URL of the audio file
}

export interface Playlist {
  id: string; // Auto-generated unique string ID
  name:string;
  description: string;
  coverArt: string; // URL to image
  songs: string[]; // Array of song IDs
}

export interface UserData {
  id: 'main';
  coins: number;
  adFreeUntil: number | null;
  firstOpenDate: number | null;
}
