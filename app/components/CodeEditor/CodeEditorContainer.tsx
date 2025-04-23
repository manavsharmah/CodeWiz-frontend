"use client"
import type React from "react"
import { useState } from "react"
import LanguageSelector from "./LanguageSelector"
import CodeEditor from "./CodeEditor"
import OutputDisplay from "./OutputDisplay"
import { Button } from "@/components/ui/button"
import { Play, Loader2 } from "lucide-react"

const CodeEditorContainer: React.FC = () => {
  const [code, setCode] = useState<string>(`// Write your solution here!

function twoSum(nums, target) {
  // Your code here
}
`)
  const [language, setLanguage] = useState<string>("javascript")
  const [output, setOutput] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/execute_code/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      })

      if (!response.ok) {
        throw new Error("Failed to execute code")
      }

      const data: { output: string } = await response.json()
      setOutput(data.output || "No output returned")
    } catch (error: any) {
      setOutput(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-lg border border-purple-900/30 rounded-xl p-6 shadow-[0_0_25px_rgba(139,93,255,0.2)]">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#F09319] to-[#ffb766]">
          Code Editor
        </h2>
        <LanguageSelector language={language} setLanguage={setLanguage} />
      </div>
      <div className="border border-gray-800 rounded-lg overflow-hidden">
        <CodeEditor language={language} code={code} setCode={setCode} />
      </div>
      <div className="mt-4 flex justify-between items-center">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-gradient-to-r from-[#8B5DFF] to-[#F09319] hover:shadow-[0_0_15px_rgba(139,93,255,0.5)] transition-all duration-300 text-white border-0"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run Code
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => setOutput("")}
          disabled={!output}
          className="bg-transparent border border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600"
        >
          Clear Output
        </Button>
      </div>
      <OutputDisplay output={output} />
    </div>
  )
}

export default CodeEditorContainer
