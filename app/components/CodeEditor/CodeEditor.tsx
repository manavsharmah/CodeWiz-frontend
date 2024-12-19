import React from 'react';
import Editor, { OnChange } from '@monaco-editor/react';

interface CodeEditorProps {
  language: string;
  code: string;
  setCode: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, code, setCode }) => {
  const handleEditorChange: OnChange = (value) => {
    setCode(value || '');
  };

  return (
    <Editor
      height="600px"
      theme="vs-dark"
      language={language}
      value={code}
      onChange={handleEditorChange}
      options={{
        minimap: { enabled: false },
        fontSize: 16,
      }}
    />
  );
};

export default CodeEditor;
