"use client"
import { useState, useEffect } from "react"
import Editor from "@monaco-editor/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { X, Save, Play } from "lucide-react"
import type { OpenFile } from "@/hooks/use-file-system"

interface CodeEditorPanelProps {
  openFiles: OpenFile[]
  activeFileId: string | null
  setActiveFileId: (id: string | null) => void
  closeFile: (id: string) => void
  saveFile: (id: string, content: string) => void
  onExecute: (id: string) => void
}

export default function CodeEditorPanel({
  openFiles,
  activeFileId,
  setActiveFileId,
  closeFile,
  saveFile,
  onExecute,
}: CodeEditorPanelProps) {
  const [editorContent, setEditorContent] = useState<string>("")
  const activeFile = openFiles.find((file) => file.id === activeFileId)

  useEffect(() => {
    if (activeFile) {
      setEditorContent(activeFile.content)
    } else {
      setEditorContent("")
    }
  }, [activeFile])

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeFileId) {
      setEditorContent(value)
      // Mark file as dirty (unsaved changes)
      const file = openFiles.find((f) => f.id === activeFileId)
      if (file && file.content !== value) {
        file.isDirty = true
      }
    }
  }

  const handleSave = () => {
    if (activeFileId) {
      saveFile(activeFileId, editorContent)
    }
  }

  const handleExecute = () => {
    if (activeFileId) {
      onExecute(activeFileId)
    }
  }

  const getLanguageId = (language: string) => {
    switch (language) {
      case "python":
        return "python"
      case "javascript":
        return "javascript"
      case "cpp":
        return "cpp"
      case "json":
        return "json"
      default:
        return "plaintext"
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {openFiles.length > 0 ? (
        <Tabs
          value={activeFileId || ""}
          onValueChange={(value) => setActiveFileId(value)}
          className="flex flex-col h-full"
        >
          <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900">
            <TabsList className="h-10 bg-transparent">
              {openFiles.map((file) => (
                <TabsTrigger
                  key={file.id}
                  value={file.id}
                  className={`px-4 py-2 relative data-[state=active]:bg-gray-950 data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-t-2 data-[state=active]:border-t-[#8B5DFF] rounded-none ${
                    file.isDirty ? "after:content-['•'] after:ml-1 after:text-[#F09319]" : ""
                  }`}
                >
                  <span className="max-w-[100px] truncate">{file.name}</span>
                  <button
                    className="ml-2 rounded-full hover:bg-gray-800 p-0.5"
                    onClick={(e) => {
                      e.stopPropagation()
                      closeFile(file.id)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex items-center mr-2 space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleSave}
                disabled={!activeFileId}
                title="Save File"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleExecute}
                disabled={!activeFileId}
                title="Run File"
              >
                <Play className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {openFiles.map((file) => (
            <TabsContent key={file.id} value={file.id} className="flex-1 p-0 m-0">
              <Editor
                height="100%"
                theme="vs-dark"
                language={getLanguageId(file.language)}
                value={file.id === activeFileId ? editorContent : file.content}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
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
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <div className="text-center p-8">
            <h3 className="text-xl font-medium mb-2 text-gray-400">No files open</h3>
            <p className="text-sm text-gray-500 mb-4">Select a file from the explorer to start editing</p>
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="bg-transparent border border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600"
                onClick={() => {
                  // Create a new file in the root
                  const event = new CustomEvent("create-new-file")
                  window.dispatchEvent(event)
                }}
              >
                Create New File
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
