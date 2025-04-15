// src/index.ts
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { getCodeSuggestion as fetchGeminiCodeSuggestion } from './services/geminiService'; // Import the function from geminiService.ts
import winston from 'winston';
import cors from 'cors';  // Import the CORS middleware
import axios from 'axios';

// Load environment variables
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in the environment variables.');
}

console.log('GEMINI_API_KEY:', API_KEY);

// Create an instance of Express
const app = express();

// Use CORS middleware
app.use(cors());  // This will allow all domains, or you can configure it to allow specific domains

// Middleware for parsing JSON bodies
app.use(express.json());

// Set up Winston logger
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

// Define route to get code suggestions
app.post('/api/code-suggestions', async (req: Request, res: Response): Promise<void> => {
  const { prompt, language, context } = req.body;

  // Validate input
  if (!prompt || !language) {
    logger.warn('Missing required fields: prompt or language');
    res.status(400).json({ error: 'Prompt and language are required' });
    return;
  }

  try {
    logger.info(`Received request for prompt: ${prompt} and language: ${language}`);
    
    const suggestion = await getCodeSuggestion(prompt, language, context);
    
    // Log the success response
    logger.info('Gemini API response received successfully');
    
    res.json({ suggestion }); // Send the Gemini API response back to the client
  } catch (error) {
    // Handle any errors that occur
    if (error instanceof Error) {
      logger.error(`Error generating suggestion: ${error.message}`);
    } else {
      logger.error('Error generating suggestion:', error);
    }
    res.status(500).json({ error: 'Failed to generate suggestion' });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

const fetchLocalCodeSuggestion = async (prompt: string, language: string) => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await axios.post('http://localhost:3001/api/code-suggestions', {
      prompt,
      language,
    });
    if (response.data) {
      suggestion = response.data; // Update the suggestion variable
    }
  } catch (error) {
    setError('Failed to fetch AI suggestion. Please try again.');
    console.error('Error fetching suggestion:', error);
  } finally {
    setIsLoading(false);
  }
};

function setError(arg0: string | null) {
  console.error(arg0); // Log the error
}

function setIsLoading(isLoading: boolean) {
  console.log(`Loading state: ${isLoading}`); // Log the loading state
}

let suggestion: string = '';

export const getCodeSuggestion = async (prompt: string, language: string, context?: string) => {
  try {
    const response = await axios.post('https://api.example.com/generate', {
      prompt,
      language,
      context,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.data || !response.data.suggestion) {
      throw new Error('Invalid response from AI service');
    }

    return response.data.suggestion;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch suggestion from the AI service: ${error.message}`);
    } else {
      throw new Error('Failed to fetch suggestion from the AI service: An unknown error occurred');
    }
  }
};

// Rename the locally declared function to avoid conflict
const fetchCodeSuggestion = async (prompt: string, language: string) => {
  try {
    const response = await axios.post('http://localhost:3001/api/code-suggestions', {
      prompt,
      language,
    });
    if (response.data) {
      suggestion = response.data; // Update the suggestion variable
    }
  } catch (error) {
    console.error('Error fetching suggestion:', error);
  }
};

