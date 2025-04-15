import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface CodeEditorProps {
  language: string;
  code: string; // Add the 'code' prop
  onCodeChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, code, onCodeChange }) => {
  return (
    <div className="code-editor">
      <MonacoEditor
        height="400px"
        language={language.toLowerCase()}
        value={code} // Use the 'code' prop here
        onChange={(value) => onCodeChange(value || '')}
        options={{
          selectOnLineNumbers: true,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
