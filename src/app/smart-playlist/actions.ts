"use server";

import { suggestSongs, type SuggestSongsInput, type SuggestSongsOutput } from '@/ai/flows/smart-playlist-suggestions';

interface ActionResult {
  success: boolean;
  data?: SuggestSongsOutput;
  error?: string;
}

export async function getSuggestions(input: SuggestSongsInput): Promise<ActionResult> {
  try {
    const result = await suggestSongs(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error getting AI suggestions:", error);
    return { success: false, error: 'Falha ao obter sugestões. Tente novamente.' };
  }
}
