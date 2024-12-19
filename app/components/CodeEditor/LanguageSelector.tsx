import React from 'react';

interface LanguageSelectorProps {
  language: string;
  setLanguage: (value: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, setLanguage }) => {
  return (
    <div>
      <label className="text-white" htmlFor="language">Choose Language: </label>
      <select
        id="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-slate-800 text-white rounded"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
