"use client"

interface OutputPanelProps {
  output: string
}

export function OutputPanel({ output }: OutputPanelProps) {
  return (
    <div className="flex h-full flex-col bg-[#1e1e1e]">
      <div className="border-b border-gray-700 bg-[#252526] px-4 py-2">
        <h2 className="text-sm font-medium text-gray-300">Output</h2>
      </div>
      <div className="flex-1 overflow-auto bg-[#1e1e1e] p-4 font-mono text-sm text-gray-300">
        <pre className="whitespace-pre-wrap">{output || 'No output'}</pre>
      </div>
    </div>
  )
} 