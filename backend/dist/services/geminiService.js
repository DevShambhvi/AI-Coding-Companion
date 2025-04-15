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
// src/services/geminiService.ts
const axios_1 = __importDefault(require("axios"));
const winston_1 = __importDefault(require("winston"));
// Load the Gemini API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
// Set up Winston logger for the service
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: 'error.log', level: 'error' }),
    ],
});
// Helper function to get suggestions from Gemini API
const getCodeSuggestion = (prompt, language, context) => __awaiter(void 0, void 0, void 0, function* () {
    if (!GEMINI_API_KEY) {
        logger.error('GEMINI_API_KEY is not set!');
        throw new Error('GEMINI_API_KEY is not set');
    }
    try {
        const response = yield axios_1.default.post(GEMINI_API_URL, {
            prompt: context ? `${prompt}\n\nContext:\n\`\`\`${language}\n${context}\n\`\`\`` : prompt,
            generationConfig: {
                temperature: 0.5,
                topK: 40,
                topP: 1,
                maxOutputTokens: 2048,
            },
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': GEMINI_API_KEY,
            },
        });
        return response.data; // Return the suggestion response
    }
    catch (error) {
        logger.error('Error calling Gemini API:', error.message);
        throw new Error('Failed to get suggestions from Gemini API');
    }
});
exports.getCodeSuggestion = getCodeSuggestion;
