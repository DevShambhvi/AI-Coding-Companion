import React from 'react';

interface AISuggestionProps {
  suggestion: string;
}

const AISuggestion: React.FC<AISuggestionProps> = ({ suggestion }) => {
  return (
    <div>
      <h3>AI Suggestion:</h3>
      <pre>{suggestion}</pre>
    </div>
  );
};

export default AISuggestion;