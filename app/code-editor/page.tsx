"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "../components/Navbar"
import FileExplorer from "../components/IDE/FileExplorer"
import CodeEditorPanel from "../components/IDE/CodeEditorPanel"
import OutputPanel from "../components/IDE/OutputPanel"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { FadeIn } from "../components/scroll-animations"
import { useFileSystem } from "@/hooks/use-file-system"
import { useAuth } from "@/contexts/AuthContext"

export default function CodeEditorPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const {
    projects,
    currentProject,
    setCurrentProject,
    openFiles,
    activeFileId,
    setActiveFileId,
    openFile,
    closeFile,
    saveFile,
    executeFile,
  } = useFileSystem()

  const [output, setOutput] = useState<string>("")
  const [isExecuting, setIsExecuting] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  const handleExecute = async (fileId: string) => {
    setIsExecuting(true)
    setOutput("Executing code...\n")

    try {
      const result = await executeFile(fileId)
      setOutput((prev) => prev + result)
    } catch (error) {
      setOutput((prev) => prev + `\nError: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsExecuting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <Navbar />

      <main className="flex-1 pt-16 overflow-hidden">
        <FadeIn className="h-full">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* File Explorer Panel */}
            <ResizablePanel defaultSize={25} minSize={15} maxSize={40} className="bg-gray-950 border-r border-gray-800">
              <FileExplorer
                projects={projects}
                currentProject={currentProject}
                setCurrentProject={setCurrentProject}
                openFile={openFile}
                activeFileId={activeFileId}
                onExecute={handleExecute}
              />
            </ResizablePanel>

            {/* Code Editor Panel */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <CodeEditorPanel
                openFiles={openFiles}
                activeFileId={activeFileId}
                setActiveFileId={setActiveFileId}
                closeFile={closeFile}
                saveFile={saveFile}
                onExecute={handleExecute}
              />
            </ResizablePanel>

            {/* Output Panel */}
            <ResizablePanel defaultSize={25} minSize={15} maxSize={40} className="bg-gray-950 border-l border-gray-800">
              <OutputPanel output={output} isExecuting={isExecuting} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </FadeIn>
      </main>
    </div>
  )
}
