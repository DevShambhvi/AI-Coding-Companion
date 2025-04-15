import React from 'react';

interface LanguageSelectorProps {
  language: string;
  onLanguageChange: (lang: string) => void;
}

const languages = ['JavaScript', 'Python', 'Java', 'C++', 'Go', 'TypeScript'];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onLanguageChange }) => {
  return (
    <div className="language-selector">
      <select value={language} onChange={(e) => onLanguageChange(e.target.value)}>
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
