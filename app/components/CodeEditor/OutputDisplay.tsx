import type React from "react"

interface OutputDisplayProps {
  output: string
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output }) => {
  if (!output) return null

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-white mb-2">Output:</h3>
      <div className="bg-black/70 border border-gray-800 rounded-lg p-4 font-mono text-sm overflow-auto max-h-[200px]">
        <pre className="text-gray-300 whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  )
}

export default OutputDisplay
