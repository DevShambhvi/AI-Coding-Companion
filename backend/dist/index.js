"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCodeSuggestion = void 0;
// src/index.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const winston_1 = __importDefault(require("winston"));
const cors_1 = __importDefault(require("cors")); // Import the CORS middleware
const axios_1 = __importDefault(require("axios"));
// Load environment variables
dotenv_1.default.config();
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in the environment variables.');
}
console.log('GEMINI_API_KEY:', API_KEY);
// Create an instance of Express
const app = (0, express_1.default)();
// Use CORS middleware
app.use((0, cors_1.default)()); // This will allow all domains, or you can configure it to allow specific domains
// Middleware for parsing JSON bodies
app.use(express_1.default.json());
// Set up Winston logger
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: 'error.log', level: 'error' }),
    ],
});
// Define route to get code suggestions
app.post('/api/code-suggestions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt, language, context } = req.body;
    // Validate input
    if (!prompt || !language) {
        logger.warn('Missing required fields: prompt or language');
        res.status(400).json({ error: 'Prompt and language are required' });
        return;
    }
    try {
        logger.info(`Received request for prompt: ${prompt} and language: ${language}`);
        const suggestion = yield (0, exports.getCodeSuggestion)(prompt, language, context);
        // Log the success response
        logger.info('Gemini API response received successfully');
        res.json({ suggestion }); // Send the Gemini API response back to the client
    }
    catch (error) {
        // Handle any errors that occur
        if (error instanceof Error) {
            logger.error(`Error generating suggestion: ${error.message}`);
        }
        else {
            logger.error('Error generating suggestion:', error);
        }
        res.status(500).json({ error: 'Failed to generate suggestion' });
    }
}));
// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
const fetchLocalCodeSuggestion = (prompt, language) => __awaiter(void 0, void 0, void 0, function* () {
    setIsLoading(true);
    setError(null);
    try {
        const response = yield axios_1.default.post('http://localhost:3001/api/code-suggestions', {
            prompt,
            language,
        });
        if (response.data) {
            suggestion = response.data; // Update the suggestion variable
        }
    }
    catch (error) {
        setError('Failed to fetch AI suggestion. Please try again.');
        console.error('Error fetching suggestion:', error);
    }
    finally {
        setIsLoading(false);
    }
});
function setError(arg0) {
    console.error(arg0); // Log the error
}
function setIsLoading(isLoading) {
    console.log(`Loading state: ${isLoading}`); // Log the loading state
}
let suggestion = '';
const getCodeSuggestion = (prompt, language, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post('https://api.example.com/generate', {
            prompt,
            language,
            context,
        });
        return response.data.suggestion; // Adjust based on the API response structure
    }
    catch (error) {
        throw new Error('Failed to fetch suggestion from the AI service.');
    }
});
exports.getCodeSuggestion = getCodeSuggestion;
// Rename the locally declared function to avoid conflict
const fetchCodeSuggestion = (prompt, language) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post('http://localhost:3001/api/code-suggestions', {
            prompt,
            language,
        });
        if (response.data) {
            suggestion = response.data; // Update the suggestion variable
        }
    }
    catch (error) {
        console.error('Error fetching suggestion:', error);
    }
});
