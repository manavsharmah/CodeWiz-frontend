import React from 'react';

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface QuestionProps {
  title: string;
  description: string;
  examples: Example[];
  constraints: string[];
}

const QuestionHolder: React.FC<QuestionProps> = ({
  title,
  description,
  examples,
  constraints,
}) => {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-gray-300 mb-6">{description}</p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Examples:</h2>
        {examples.map((example, index) => (
          <div
            key={index}
            className="bg-gray-700 p-4 rounded-lg mb-3 border-l-4 border-purple-500"
          >
            <p>
              <strong>Input:</strong> <code>{example.input}</code>
            </p>
            <p>
              <strong>Output:</strong> <code>{example.output}</code>
            </p>
            {example.explanation && (
              <p className="text-sm text-gray-400 mt-2">
                <strong>Explanation:</strong> {example.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Constraints:</h2>
        <ul className="list-disc list-inside text-gray-300">
          {constraints.map((constraint, index) => (
            <li key={index} className="mb-1">
              {constraint}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuestionHolder;
