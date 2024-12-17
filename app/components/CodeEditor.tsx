'use client'
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = () => {
  const [code, setCode] = useState('// Write your code here!');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');

  // Handle editor change
  const handleEditorChange = (value) => {
    setCode(value);
  };

  // Handle form submission
  const handleSubmit = async () => {
    const response = await fetch('http://localhost:8000/api/execute_code/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language }),
    });
    const data = await response.json();
    setOutput(data.output);
  };

  return (
    <div className="border border-slate-600 rounded-lg p-4 shadow-lg">
      <div>
        <label className='text-white' htmlFor="language">Choose Language: </label>
        <select id="language" onChange={(e) => setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
      </div>
      <div className='pt-4'>
        <Editor
          height="600px"
          theme="vs-dark"
          defaultLanguage={language}
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 16,
          }}
        />
      </div>
      <button className='text-white mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-800 rounded-full text-center' onClick={handleSubmit}>Run Code</button>
      <div className='text-white pt-3'>
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
