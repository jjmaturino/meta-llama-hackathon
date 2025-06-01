import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import useClient from '../utils/client';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  accuracy?: number;  // Percentage of correct answers in quizzes
  createdAt: string;
  updatedAt: string;
  cues: string;
  notes: string;
  summary: string;
  docs: string[];
  relationships?: string[];  // List of related note IDs
}

interface NotesHookResult {
  notes: Note[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<Note[]>;
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
    refetch: async () => {
      const { data } = await result.refetch();
      return data ?? [];
    }
  };
}


interface NoteHookResult {
  note: Note;
  isLoading: boolean;
  error: Error | null;
}

function useNote(noteId: string, options: Partial<UseQueryOptions<Note, Error>> = {}): NoteHookResult {
  const queryClient = useQueryClient();
  const client = useClient();


  const result = useQuery<Note, Error>({
    ...options,
    queryKey: ['notes', noteId],
    queryFn: async () => {
      try {
        // First try to get from cache
        const cachedNote = queryClient.getQueryData<Note>(['notes', noteId]);
        if (cachedNote) {
          return cachedNote;
        }

        // If not in cache, get from mock data
        const response = await client('v1/notes/' + noteId);
        if (!response) {
          throw new Error(`Note with id ${noteId} not found`);
        }
        return response;
      } catch (error) {
        console.error(`Failed to fetch note ${noteId}:`, error);
        throw error;
      }
    },
    retry: 1,
  });

  return {
    note: result.data as Note,
    isLoading: result.isLoading,
    error: result.error,
  };
}


export { useNotes, useNote }