import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import useClient from '../utils/client';

export interface Note {
  id: string;
  title: string;
  tags: string[];
  cues: string;
  notes: string;
  summary: string;
  docs: string[];
}

interface NotesHookResult {
  notes: Note[];
  isLoading: boolean;
  error: Error | null;
}

function useNotes(options: Partial<UseQueryOptions<Note[], Error>> = {}): NotesHookResult {
  const client = useClient();
  const queryClient = useQueryClient();

  const result = useQuery<Note[], Error>({
    ...options,
    queryKey: ['notes'],
    queryFn: async () => {
      try {
        console.log('Fetching notes...');
        const response = await client('v1/notes');
        console.log('Notes response:', response);
        return response;
      } catch (error) {
        console.error('Failed to fetch notes:', error);
        throw error;
      }
    },
    retry: 1,
  });

  // Cache individual notes after successful fetch
  if (result.data) {
    result.data.forEach((note: Note) => {
      queryClient.setQueryData(['notes', note.id], note);
    });
  }

  return {
    notes: result.data ?? [],
    isLoading: result.isLoading,
    error: result.error,
  };
}

export { useNotes }