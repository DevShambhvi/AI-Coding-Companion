import React, { useState } from 'react';
import './App.css';
import LanguageSwitcher from './components/languageswitcher';
import CodeEditor from './components/codeEditor';
import axios from 'axios';
import Button from './components/button';
import AISuggestion from './components/AISuggestion';

const App: React.FC = () => {
  const [language, setLanguage] = useState<string>('javascript');
  const [code, setCode] = useState<string>('console.log("Hello, world!");');
  const [suggestion, setSuggestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCodeSuggestion = async (prompt: string, language: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:3001/api/code-suggestions', {
        prompt,
        language,
      });
      if (response.data) {
        setSuggestion(response.data.suggestion); // Update the suggestion state
      }
    } catch (error) {
      setError('Failed to fetch AI suggestion. Please try again.');
      console.error('Error fetching suggestion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    fetchCodeSuggestion(newCode, language);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold mb-6">AI Coding Companion</h1>

      <div className="flex items-center gap-4 mb-4">
        <LanguageSwitcher onLanguageChange={handleLanguageChange} language={language} />

        <Button
          onClick={() => fetchCodeSuggestion(code, language)}
          variant="default"
        >
          Generate Suggestion
        </Button>

        <Button
          onClick={() => {
            setCode('');
            setSuggestion('');
          }}
          variant="outline"
        >
          Clear
        </Button>
      </div>

      <div className="border rounded p-4 bg-gray-100">
        <CodeEditor language={language} code={code} onCodeChange={handleCodeChange} />
      </div>

      <div className="mt-4">
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && <AISuggestion suggestion={suggestion} />}
      </div>
    </div>
  );
};

export default App;
