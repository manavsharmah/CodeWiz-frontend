"use client"
import { useState, useEffect } from "react"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { Play, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

interface CodeEditorIDEProps {
  language: string
  code: string
  setCode: (code: string) => void
  onExecute?: (code: string, language: string) => Promise<string>
}

export default function CodeEditorIDE({ language, code, setCode, onExecute }: CodeEditorIDEProps) {
  const [output, setOutput] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
    }
  }

  const handleExecute = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    setLoading(true)
    setOutput("")
    setError("")

    try {
      if (onExecute) {
        const result = await onExecute(code, language)
        setOutput(result)
      } else {
        const token = localStorage.getItem('accessToken')
        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/execute_code/`,
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
          const errorData = await response.json().catch(() => ({ error: 'Failed to execute code' }))
          throw new Error(errorData.error || 'Failed to execute code')
        }

        const data = await response.json()
        setOutput(data.output || '')
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setOutput("")
    setError("")
  }

  const getLanguageId = (lang: string) => {
    switch (lang) {
      case "cpp":
        return "cpp"
      case "python":
        return "python"
      default:
        return "javascript"
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-950">
      <div className="border border-gray-800 rounded-lg overflow-hidden flex-1">
        <Editor
          height="100%"
          theme="vs-dark"
          language={getLanguageId(language)}
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 16,
            fontFamily: "'Geist Mono', monospace",
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            renderLineHighlight: "all",
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            automaticLayout: true,
          }}
          beforeMount={(monaco) => {
            monaco.editor.defineTheme("codewiz-dark", {
              base: "vs-dark",
              inherit: true,
              rules: [
                { token: "comment", foreground: "6A9955", fontStyle: "italic" },
                { token: "keyword", foreground: "8B5DFF" },
                { token: "string", foreground: "F09319" },
                { token: "number", foreground: "76E0F0" },
              ],
              colors: {
                "editor.background": "#111111",
                "editor.foreground": "#D4D4D4",
                "editor.lineHighlightBackground": "#1F1F1F",
                "editorCursor.foreground": "#8B5DFF",
                "editor.selectionBackground": "#8B5DFF33",
              },
            })
          }}
          onMount={(editor, monaco) => {
            monaco.editor.setTheme("codewiz-dark")
          }}
        />
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Button
          onClick={handleExecute}
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
          disabled={!output && !error}
          className="bg-transparent border border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600"
        >
          Clear Output
        </Button>
      </div>

      {(output || error) && (
        <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Output</h3>
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
            {error || output}
          </pre>
        </div>
      )}
    </div>
  )
} 