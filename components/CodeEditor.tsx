"use client"

import { useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { getLanguageFromExtension, getFileIcon } from '@/lib/api'

interface OpenFile {
  id: string
  name: string
  content: string
  language: string
  isDirty?: boolean
}

interface CodeEditorProps {
  files: OpenFile[]
  activeFileId: string | null
  onFileSelect: (fileId: string) => void
  onFileClose: (fileId: string) => void
  onContentChange: (fileId: string, content: string) => Promise<void>
  onExecute: () => Promise<void>
  isExecuting: boolean
}

export function CodeEditor({
  files,
  activeFileId,
  onFileSelect,
  onFileClose,
  onContentChange,
  onExecute,
  isExecuting,
}: CodeEditorProps) {
  const activeFile = files.find((f) => f.id === activeFileId)

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (activeFile && value !== undefined) {
        onContentChange(activeFile.id, value)
      }
    },
    [activeFile, onContentChange]
  )

  if (!activeFile) {
    return (
      <div className="flex h-full items-center justify-center bg-[#1e1e1e] text-gray-400">
        No file selected
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-[#1e1e1e]">
      <div className="flex items-center border-b border-gray-700 bg-[#252526] px-4 py-2">
        <div className="flex flex-1 space-x-1">
          {files.map((file) => (
            <div
              key={file.id}
              className={`group flex items-center rounded-t border border-b-0 px-3 py-1.5 text-sm ${
                file.id === activeFileId
                  ? 'border-gray-700 bg-[#1e1e1e] text-white'
                  : 'border-transparent bg-[#2d2d2d] text-gray-400 hover:bg-[#3c3c3c]'
              }`}
            >
              <button
                onClick={() => onFileSelect(file.id)}
                className="flex items-center"
              >
                <span className="mr-2 text-gray-500">{getFileIcon(file.name)}</span>
                <span>{file.name}</span>
                {file.isDirty && <span className="ml-2 text-blue-400">•</span>}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onFileClose(file.id)
                }}
                className="ml-2 hidden text-gray-500 hover:text-gray-300 group-hover:block"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={onExecute}
          disabled={isExecuting}
          className="ml-4 rounded bg-[#0e639c] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#1177bb] focus:outline-none focus:ring-2 focus:ring-[#0e639c] focus:ring-offset-2 focus:ring-offset-[#252526] disabled:bg-gray-700 disabled:hover:bg-gray-700"
        >
          {isExecuting ? 'Running...' : 'Run'}
        </button>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          language={activeFile.language}
          value={activeFile.content}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            tabSize: 2,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 10, bottom: 10 },
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            parameterHints: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
    </div>
  )
} 