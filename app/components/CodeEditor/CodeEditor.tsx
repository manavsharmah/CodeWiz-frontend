"use client"

import type React from "react"
import Editor, { type OnChange } from "@monaco-editor/react"

interface CodeEditorProps {
  language: string
  code: string
  setCode: (value: string) => void
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, code, setCode }) => {
  const handleEditorChange: OnChange = (value) => {
    setCode(value || "")
  }

  const getLanguageId = (lang: string) => {
    switch (lang) {
      case "cpp":
        return "cpp"
      case "python":
        return "python"
      case "java":
        return "java"
      default:
        return "javascript"
    }
  }

  return (
    <Editor
      height="400px"
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
  )
}

export default CodeEditor
