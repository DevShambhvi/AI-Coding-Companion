// src/services/geminiService.ts
import axios from 'axios';
import winston from 'winston';

// Load the Gemini API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Set up Winston logger for the service
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

// Helper function to get suggestions from Gemini API
export const getCodeSuggestion = async (prompt: string, language: string, context?: string) => {
  if (!GEMINI_API_KEY) {
    logger.error('GEMINI_API_KEY is not set!');
    throw new Error('GEMINI_API_KEY is not set');
  }

  try {
    const response = await axios.post(
      GEMINI_API_URL,
      {
        prompt: context ? `${prompt}\n\nContext:\n\`\`\`${language}\n${context}\n\`\`\`` : prompt,
        generationConfig: {
          temperature: 0.5,
          topK: 40,
          topP: 1,
          maxOutputTokens: 2048,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
      }
    );

    return response.data;  // Return the suggestion response
  } catch (error) {
    logger.error('Error calling Gemini API:', (error as any).message);
    throw new Error('Failed to get suggestions from Gemini API');
  }
};
