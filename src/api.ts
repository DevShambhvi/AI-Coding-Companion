// src/api.ts
import axios from 'axios';

// Function to get code suggestions from the backend
export const getCodeSuggestions = async (prompt: string, language: string, context?: string) => {
  try {
    const response = await axios.post('http://localhost:3001/api/code-suggestions', {
      prompt,
      language,
      context
    });
    return response.data;  // Returning the suggestion data from the API response
  } catch (error) {
    console.error('Error fetching code suggestions:', error);
    return { error: 'Failed to get code suggestions' };
  }
};
