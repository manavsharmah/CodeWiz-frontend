import React from 'react';

interface OutputDisplayProps {
  output: string;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output }) => {
  return (
    <div className="text-white pt-3">
      <h3>Output:</h3>
      <pre>{output}</pre>
    </div>
  );
};

export default OutputDisplay;
