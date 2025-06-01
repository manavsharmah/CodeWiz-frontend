"use client"
import { useRef, useEffect } from "react"
import { Loader2, Terminal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OutputPanelProps {
  output: string
  isExecuting: boolean
}

export default function OutputPanel({ output, isExecuting }: OutputPanelProps) {
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  const clearOutput = () => {
    // Dispatch an event to clear the output
    const event = new CustomEvent("clear-output")
    window.dispatchEvent(event)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <div className="flex items-center">
          <Terminal className="h-4 w-4 mr-2 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-300">OUTPUT</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={clearOutput}
          disabled={isExecuting || !output}
          title="Clear Output"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={outputRef}
        className="flex-1 p-3 overflow-auto font-mono text-sm bg-gray-950 text-gray-300 whitespace-pre-wrap"
      >
        {isExecuting && (
          <div className="flex items-center text-[#8B5DFF] mb-2">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Executing...
          </div>
        )}
        {output}
      </div>
    </div>
  )
}
