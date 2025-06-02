"use client"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import CodeEditorIDE from "./CodeEditorIDE"

interface OpenFile {
  id: string
  name: string
  content: string
  language: string
}

interface CodeEditorPanelProps {
  openFiles: OpenFile[]
  onCloseFile: (fileId: string) => void
  onSaveFile: (fileId: string, content: string) => void
  onExecuteFile: (fileId: string) => Promise<string>
}

export default function CodeEditorPanel({
  openFiles,
  onCloseFile,
  onSaveFile,
  onExecuteFile,
}: CodeEditorPanelProps) {
  const [activeFileId, setActiveFileId] = useState<string>(openFiles[0]?.id || "")
  const [fileContents, setFileContents] = useState<Record<string, string>>(
    openFiles.reduce((acc, file) => ({ ...acc, [file.id]: file.content }), {})
  )

  const handleFileChange = (fileId: string, content: string) => {
    setFileContents((prev) => ({ ...prev, [fileId]: content }))
    onSaveFile(fileId, content)
  }

  const handleExecute = async (fileId: string) => {
    const content = fileContents[fileId]
    const file = openFiles.find((f) => f.id === fileId)
    if (!file) return ""

    try {
      return await onExecuteFile(fileId)
    } catch (error) {
      return `Error executing file: ${error}`
    }
  }

  if (openFiles.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-950 text-gray-400">
        No files open
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-950">
      <Tabs
        value={activeFileId}
        onValueChange={setActiveFileId}
        className="h-full flex flex-col"
      >
        <div className="border-b border-gray-800">
          <TabsList className="bg-transparent h-12 px-2">
            {openFiles.map((file) => (
              <TabsTrigger
                key={file.id}
                value={file.id}
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>{file.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-gray-700"
                    onClick={(e) => {
                      e.stopPropagation()
                      onCloseFile(file.id)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {openFiles.map((file) => (
          <TabsContent
            key={file.id}
            value={file.id}
            className="flex-1 m-0"
          >
            <CodeEditorIDE
              language={file.language}
              code={fileContents[file.id] || ""}
              setCode={(content) => handleFileChange(file.id, content)}
              onExecute={(code, language) => handleExecute(file.id)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
