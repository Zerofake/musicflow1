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
  id: string; // Can be a timestamp or other unique string
  name:string;
  description: string;
  coverArt: string; // URL to image
  songs: Song[];
}

export interface UserData {
  id: 'main';
  coins: number;
  adFreeUntil: number | null;
}
