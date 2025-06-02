"use client"

import { useState } from 'react'
import { useFileSystem } from '@/hooks/use-file-system'
import { FileExplorer } from './FileExplorer'
import { CodeEditor } from './CodeEditor'
import { OutputPanel } from './OutputPanel'
import { ProjectSelector } from './ProjectSelector'

export default function IDEContainer() {
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
    createFile,
    deleteItem,
    renameItem,
    toggleFolder,
  } = useFileSystem()

  const [output, setOutput] = useState<string>('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [leftWidth, setLeftWidth] = useState(25)
  const [rightWidth, setRightWidth] = useState(25)

  const handleExecute = async () => {
    if (!activeFileId) return

    setIsExecuting(true)
    try {
      const result = await executeFile(activeFileId)
      setOutput(result)
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Failed to execute file'}`)
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-[#1e1e1e]">
      <div className="flex h-12 items-center border-b border-gray-700 bg-[#252526] px-4">
        <ProjectSelector
          projects={projects}
          currentProject={currentProject}
          onProjectSelect={setCurrentProject}
        />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div 
          className="border-r border-gray-700 bg-[#252526]"
          style={{ width: `${leftWidth}%` }}
        >
          <FileExplorer
            files={currentProject?.files || []}
            onFileSelect={openFile}
            onCreateItem={createFile}
            onDeleteItem={deleteItem}
            onRenameItem={renameItem}
            onToggleFolder={toggleFolder}
          />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1">
              <CodeEditor
                files={openFiles}
                activeFileId={activeFileId}
                onFileSelect={setActiveFileId}
                onFileClose={closeFile}
                onContentChange={saveFile}
                onExecute={handleExecute}
                isExecuting={isExecuting}
              />
            </div>
            <div 
              className="border-l border-gray-700 bg-[#252526]"
              style={{ width: `${rightWidth}%` }}
            >
              <OutputPanel output={output} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 