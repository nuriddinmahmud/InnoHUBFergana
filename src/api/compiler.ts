import { api } from '@/lib/api';
import type { CompilerResponse } from '@/types/api';

/**
 * Executes code on the backend.
 * @param language The programming language.
 * @param code The source code to execute.
 * @returns A promise that resolves to the compiler output.
 */
export const runCode = (language: string, code: string): Promise<CompilerResponse> => {
  // Map the language from the frontend to the one expected by the backend.
  const backendLanguage = language.toLowerCase().replace('html/css', 'html');
  return api.post('/compiler/run', { language: backendLanguage, code });
};
