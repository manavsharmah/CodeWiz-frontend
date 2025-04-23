import type React from "react"

interface Example {
  input: string
  output: string
  explanation?: string
}

interface QuestionProps {
  title: string
  description: string
  examples: Example[]
  constraints: string[]
}

const QuestionHolder: React.FC<QuestionProps> = ({ title, description, examples, constraints }) => {
  return (
    <div className="bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-lg border border-purple-900/30 rounded-xl p-6 shadow-[0_0_25px_rgba(139,93,255,0.2)]">
      <h1 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#8B5DFF] to-[#F09319]">
        {title}
      </h1>
      <p className="text-gray-300 mb-6">{description}</p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-white">Examples:</h2>
        {examples.map((example, index) => (
          <div
            key={index}
            className="bg-gray-900/50 p-4 rounded-lg mb-4 border-l-4 border-[#8B5DFF] shadow-[0_0_10px_rgba(139,93,255,0.1)]"
          >
            <div className="mb-2">
              <span className="text-gray-400 font-medium">Input:</span>{" "}
              <code className="bg-black/50 px-2 py-1 rounded text-[#F09319] font-mono">{example.input}</code>
            </div>
            <div className="mb-2">
              <span className="text-gray-400 font-medium">Output:</span>{" "}
              <code className="bg-black/50 px-2 py-1 rounded text-[#8B5DFF] font-mono">{example.output}</code>
            </div>
            {example.explanation && (
              <div className="text-sm text-gray-400 mt-2 border-t border-gray-800 pt-2">
                <span className="font-medium">Explanation:</span> {example.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-3 text-white">Constraints:</h2>
        <ul className="space-y-2">
          {constraints.map((constraint, index) => (
            <li key={index} className="flex items-start">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-gradient-to-r from-[#8B5DFF] to-[#F09319] mr-2"></div>
              <span className="text-gray-300 font-mono text-sm">{constraint}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default QuestionHolder
