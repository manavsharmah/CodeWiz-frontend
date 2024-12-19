'use client';
import React, { useState } from 'react';
import LanguageSelector from './LanguageSelector';
import CodeEditor from './CodeEditor';
import OutputDisplay from './OutputDisplay';

const CodeEditorContainer: React.FC = () => {
  const [code, setCode] = useState<string>('// Write your code here!');
  const [language, setLanguage] = useState<string>('javascript');
  const [output, setOutput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/execute_code/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute code');
      }

      const data: { output: string } = await response.json();
      setOutput(data.output || 'No output returned');
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full border border-slate-600 rounded-lg p-4 shadow-lg">
      <LanguageSelector language={language} setLanguage={setLanguage} />
      <div className="pt-4">
        <CodeEditor language={language} code={code} setCode={setCode} />
      </div>
      <button
        className="text-white mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-800 rounded-full"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Running...' : 'Run Code'}
      </button>
      <OutputDisplay output={output} />
    </div>
  );
};

export default CodeEditorContainer;
