"use client"
import { useState, useEffect } from "react"
import { projectApi, fileSystemApi, codeExecutionApi } from "@/lib/api"

export interface FileSystemFile {
  id: string
  name: string
  type: "file"
  content: string
  language: string
  lastModified: Date
}

export interface FileSystemFolder {
  id: string
  name: string
  type: "folder"
  children: (FileSystemFile | FileSystemFolder)[]
  expanded?: boolean
}

export interface Project {
  id: string
  name: string
  files: (FileSystemFile | FileSystemFolder)[]
}

export interface OpenFile {
  id: string
  name: string
  content: string
  language: string
  isDirty: boolean
}

export function useFileSystem() {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([])
  const [activeFileId, setActiveFileId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load projects from API
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true)
        const response = await projectApi.getAll()
        const projects = response.data.map((project: any) => ({
          id: project.id,
          name: project.name,
          files: project.items || []
        }))
        setProjects(projects)
        if (projects.length > 0) {
          setCurrentProject(projects[0])
        }
        setError(null)
      } catch (err) {
        setError("Failed to load projects")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  // Find a file by ID in the project structure
  const findFileById = (files: (FileSystemFile | FileSystemFolder)[], id: string): FileSystemFile | null => {
    for (const item of files) {
      if (item.id === id && item.type === "file") {
        return item
      }
      if (item.type === "folder") {
        const found = findFileById(item.children, id)
        if (found) return found
      }
    }
    return null
  }

  // Open a file
  const openFile = async (fileId: string) => {
    if (!currentProject) return

    // Check if file is already open
    if (openFiles.some((f) => f.id === fileId)) {
      setActiveFileId(fileId)
      return
    }

    try {
      const response = await fileSystemApi.getById(fileId)
      const file = response.data
      
      const newOpenFile: OpenFile = {
        id: file.id,
        name: file.name,
        content: file.content || "",
        language: file.file_extension || "plaintext",
        isDirty: false,
      }
      setOpenFiles([...openFiles, newOpenFile])
      setActiveFileId(file.id)
    } catch (err) {
      console.error("Failed to open file:", err)
      setError("Failed to open file")
    }
  }

  // Close a file
  const closeFile = (fileId: string) => {
    const fileIndex = openFiles.findIndex((f) => f.id === fileId)
    if (fileIndex === -1) return

    const newOpenFiles = [...openFiles]
    newOpenFiles.splice(fileIndex, 1)
    setOpenFiles(newOpenFiles)

    // Set new active file if needed
    if (activeFileId === fileId) {
      if (newOpenFiles.length > 0) {
        // Prefer the file to the right, otherwise take the last file
        const newIndex = Math.min(fileIndex, newOpenFiles.length - 1)
        setActiveFileId(newOpenFiles[newIndex].id)
      } else {
        setActiveFileId(null)
      }
    }
  }

  // Save file content
  const saveFile = async (fileId: string, content: string) => {
    try {
      // Update open file
      setOpenFiles((prev) =>
        prev.map((file) =>
          file.id === fileId
            ? {
                ...file,
                content,
                isDirty: false,
              }
            : file,
        ),
      )

      // Update file in backend
      await fileSystemApi.update(fileId, { content })

      // Update file in project structure
      if (currentProject) {
        const updateFileInTree = (
          items: (FileSystemFile | FileSystemFolder)[],
        ): (FileSystemFile | FileSystemFolder)[] => {
          return items.map((item) => {
            if (item.id === fileId && item.type === "file") {
              return {
                ...item,
                content,
                lastModified: new Date(),
              }
            }
            if (item.type === "folder") {
              return {
                ...item,
                children: updateFileInTree(item.children),
              }
            }
            return item
          })
        }

        const updatedFiles = updateFileInTree(currentProject.files)
        setCurrentProject({
          ...currentProject,
          files: updatedFiles,
        })

        setProjects((prev) =>
          prev.map((project) =>
            project.id === currentProject.id
              ? {
                  ...project,
                  files: updatedFiles,
                }
              : project,
          ),
        )
      }
    } catch (err) {
      console.error("Failed to save file:", err)
      setError("Failed to save file")
    }
  }

  // Execute a file
  const executeFile = async (fileId: string): Promise<string> => {
    try {
      const file = openFiles.find((f) => f.id === fileId) || findFileById(currentProject?.files || [], fileId)
      if (!file) {
        throw new Error("File not found")
      }

      const response = await codeExecutionApi.execute({
        code: file.content,
        language: file.language,
        file_id: fileId,
        project_id: currentProject?.id,
      })

      return response.data.output
    } catch (err) {
      console.error("Failed to execute file:", err)
      throw new Error("Failed to execute file")
    }
  }

  // Create a new file or folder
  const createFile = async (parentId: string | null, name: string, type: "file" | "folder") => {
    if (!currentProject) return

    try {
      const response = await fileSystemApi.create({
        name,
        item_type: type,
        content: type === "file" ? "" : null,
        parent_id: parentId,
        project_id: currentProject.id
      })

      const newItem = response.data

      // Update project structure
      if (!parentId) {
        setCurrentProject({
          ...currentProject,
          files: [...currentProject.files, newItem],
        })
      } else {
        const updateFilesTree = (items: (FileSystemFile | FileSystemFolder)[]): (FileSystemFile | FileSystemFolder)[] => {
          return items.map((item) => {
            if (item.id === parentId && item.type === "folder") {
              return {
                ...item,
                children: [...item.children, newItem],
              }
            }
            if (item.type === "folder") {
              return {
                ...item,
                children: updateFilesTree(item.children),
              }
            }
            return item
          })
        }

        const updatedFiles = updateFilesTree(currentProject.files)
        setCurrentProject({
          ...currentProject,
          files: updatedFiles,
        })
      }

      // If it's a file, open it
      if (type === "file") {
        openFile(newItem.id)
      }
    } catch (err) {
      console.error("Failed to create item:", err)
      setError("Failed to create item")
    }
  }

  // Delete a file or folder
  const deleteItem = async (id: string) => {
    if (!currentProject) return

    try {
      await fileSystemApi.delete(id)

      // Close file if open
      if (openFiles.some((f) => f.id === id)) {
        closeFile(id)
      }

      // Remove from project structure
      const removeFromTree = (items: (FileSystemFile | FileSystemFolder)[]): (FileSystemFile | FileSystemFolder)[] => {
        return items.filter((item) => {
          if (item.id === id) return false
          if (item.type === "folder") {
            item.children = removeFromTree(item.children)
          }
          return true
        })
      }

      const updatedFiles = removeFromTree(currentProject.files)
      setCurrentProject({
        ...currentProject,
        files: updatedFiles,
      })
    } catch (err) {
      console.error("Failed to delete item:", err)
      setError("Failed to delete item")
    }
  }

  // Rename a file or folder
  const renameItem = (id: string, newName: string) => {
    if (!currentProject) return

    // Update in project structure
    const updateInTree = (items: (FileSystemFile | FileSystemFolder)[]): (FileSystemFile | FileSystemFolder)[] => {
      return items.map((item) => {
        if (item.id === id) {
          // If it's a file, update language based on new extension
          if (item.type === "file") {
            const language = newName.endsWith(".py")
              ? "python"
              : newName.endsWith(".js")
                ? "javascript"
                : newName.endsWith(".cpp") || newName.endsWith(".h")
                  ? "cpp"
                  : newName.endsWith(".json")
                    ? "json"
                    : "plaintext"

            return {
              ...item,
              name: newName,
              language,
            }
          }

          return {
            ...item,
            name: newName,
          }
        }
        if (item.type === "folder") {
          return {
            ...item,
            children: updateInTree(item.children),
          }
        }
        return item
      })
    }

    const updatedFiles = updateInTree(currentProject.files)
    setCurrentProject({
      ...currentProject,
      files: updatedFiles,
    })

    setProjects((prev) =>
      prev.map((project) =>
        project.id === currentProject.id
          ? {
              ...project,
              files: updatedFiles,
            }
          : project,
      ),
    )

    // Update in open files if needed
    setOpenFiles((prev) =>
      prev.map((file) =>
        file.id === id
          ? {
              ...file,
              name: newName,
            }
          : file,
      ),
    )
  }

  // Toggle folder expansion
  const toggleFolder = (id: string) => {
    if (!currentProject) return

    const toggleInTree = (items: (FileSystemFile | FileSystemFolder)[]): (FileSystemFile | FileSystemFolder)[] => {
      return items.map((item) => {
        if (item.id === id && item.type === "folder") {
          return {
            ...item,
            expanded: !item.expanded,
          }
        }
        if (item.type === "folder") {
          return {
            ...item,
            children: toggleInTree(item.children),
          }
        }
        return item
      })
    }

    const updatedFiles = toggleInTree(currentProject.files)
    setCurrentProject({
      ...currentProject,
      files: updatedFiles,
    })
  }

  return {
    projects,
    currentProject,
    setCurrentProject,
    openFiles,
    activeFileId,
    setActiveFileId,
    isLoading,
    error,
    openFile,
    closeFile,
    saveFile,
    executeFile,
    createFile,
    deleteItem,
    renameItem,
    toggleFolder,
  }
}
