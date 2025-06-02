"use client"
import type React from "react"
import { useState, useEffect } from "react"
import LanguageSelector from "./LanguageSelector"
import CodeEditor from "./CodeEditor"
import OutputDisplay from "./OutputDisplay"
import { Button } from "@/components/ui/button"
import { Play, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

interface CodeEditorContainerProps {
  questionId: number
  starterCode: {
    javascript?: string
    python?: string
    cpp?: string
  }
}

interface TestCase {
  input: string
  expected_output: string
  actual_output: string
  passed: boolean
}

interface TestSummary {
  total_cases: number
  passed_cases: number
}

interface TestResults {
  results: TestCase[]
  summary: TestSummary
}

const CodeEditorContainer: React.FC<CodeEditorContainerProps> = ({ questionId, starterCode }) => {
  const [language, setLanguage] = useState<"javascript" | "python" | "cpp">("javascript")
  const [code, setCode] = useState<string>("")
  const [output, setOutput] = useState<string>("")
  const [results, setResults] = useState<TestResults | null>(null)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  const getStarterCode = (lang: "javascript" | "python" | "cpp") =>
    starterCode[lang] || "// No starter code available."

  useEffect(() => {
    setCode(getStarterCode(language))
  }, [starterCode, language])

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    setLoading(true)
    setOutput("")
    setResults(null)
    setError("")

    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Submit code and get test results
      const response = await fetch(
        `http://localhost:8000/api/submit_code/${questionId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ code, language }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to submit code' }))
        throw new Error(errorData.error || 'Failed to submit code')
      }

      const data = await response.json()

      // Set the results from the response
      setResults({
        results: data.results || [],
        summary: {
          total_cases: data.summary?.total_cases || 0,
          passed_cases: data.summary?.passed_cases || 0
        }
      })

      // Save the submission
      const submissionResponse = await fetch(
        `http://localhost:8000/api/submissions/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            code, 
            language, 
            question: questionId,
            passed: data.summary?.passed_cases === data.summary?.total_cases,
            result_details: data
          })
        }
      )

      if (!submissionResponse.ok) {
        const errorData = await submissionResponse.json().catch(() => ({ error: 'Failed to save submission' }))
        throw new Error(errorData.error || 'Failed to save submission')
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setOutput("")
    setResults(null)
    setError("")
  }

  const handleLanguageChange = (newLang: "javascript" | "python" | "cpp") => {
    setLanguage(newLang)
    setCode(getStarterCode(newLang))
  }

  return (
    <div className="bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-lg border border-purple-900/30 rounded-xl p-6 shadow-[0_0_25px_rgba(139,93,255,0.2)]">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#F09319] to-[#ffb766]">
          Code Editor
        </h2>
        <LanguageSelector language={language} setLanguage={handleLanguageChange} />
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
          onClick={handleClear}
          disabled={!output && !results && !error}
          className="bg-transparent border border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600"
        >
          Clear Output
        </Button>
      </div>

      <OutputDisplay
        output={output}
        results={results || undefined}
        error={error || undefined}
      />
    </div>
  )
}

export default CodeEditorContainer
