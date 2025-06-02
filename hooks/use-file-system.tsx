"use client"
import { useState, useEffect } from "react"
import { fileSystemApi, Project as ApiProject, FileSystemItem as ApiFileSystemItem, getLanguageFromExtension, projectApi } from "@/lib/api"

export interface FileSystemFile {
  id: string
  name: string
  type: "file"
  content: string
  language: string
  parent: string | null
  project: string
}

export interface FileSystemFolder {
  id: string
  name: string
  type: "folder"
  expanded: boolean
  children: (FileSystemFile | FileSystemFolder)[]
  parent: string | null
  project: string
}

export interface Project extends ApiProject {
  files: (FileSystemFile | FileSystemFolder)[]
}

export interface OpenFile {
  id: string
  name: string
  content: string
  language: string
  isDirty?: boolean
}

export function useFileSystem() {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([])
  const [activeFileId, setActiveFileId] = useState<string | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      // First get all projects
      const projectsResponse = await projectApi.getAll()
      const projects = projectsResponse.data.map(project => ({
        ...project,
        files: []
      }))
      setProjects(projects)

      // If there are projects, set the first one as current
      if (projects.length > 0) {
        const currentProject = projects[0]
        setCurrentProject(currentProject)

        // Then load files for the current project
        const filesResponse = await fileSystemApi.getByProject(currentProject.id)
        const projectData = filesResponse.data
        const updatedProject = {
          ...currentProject,
          files: projectData.map(item => {
            if (item.item_type === 'file') {
              return {
                id: item.id,
                name: item.name,
                type: 'file' as const,
                content: item.content || '',
                language: getLanguageFromExtension(item.name),
                parent: item.parent || null,
                project: item.project
              } as FileSystemFile
            } else {
              return {
                id: item.id,
                name: item.name,
                type: 'folder' as const,
                expanded: false,
                children: [],
                parent: item.parent || null,
                project: item.project
              } as FileSystemFolder
            }
          })
        }
        setCurrentProject(updatedProject)
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p))
      }
    } catch (error) {
      console.error("Failed to load projects:", error)
    }
  }

  const openFile = (fileId: string) => {
    const file = findFile(currentProject?.files || [], fileId)
    if (!file || file.type !== "file") return

    if (!openFiles.find((f) => f.id === fileId)) {
      setOpenFiles((prev) => [
        ...prev,
        {
          id: file.id,
          name: file.name,
          content: file.content,
          language: file.language,
        },
      ])
    }
    setActiveFileId(fileId)
  }

  const closeFile = (fileId: string) => {
    setOpenFiles((prev) => prev.filter((f) => f.id !== fileId))
    if (activeFileId === fileId) {
      const remainingFiles = openFiles.filter((f) => f.id !== fileId)
      setActiveFileId(remainingFiles.length > 0 ? remainingFiles[0].id : null)
    }
  }

  const saveFile = async (fileId: string, content: string) => {
    try {
      if (!fileId || typeof fileId !== 'string' || fileId.trim() === '') {
        throw new Error('Invalid file ID');
      }

      if (!currentProject) {
        throw new Error('No project selected');
      }

      // Check if the file exists in the current project
      const file = findFile(currentProject.files, fileId);
      if (!file || file.type !== 'file') {
        throw new Error('File not found in the current project');
      }

      const response = await fileSystemApi.update(fileId, { content });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      setOpenFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, content, isDirty: false } : f))
      );

      // Update the file in the project tree
      const updatedFiles = currentProject.files.map(item => {
        if (item.id === fileId && item.type === 'file') {
          return { ...item, content };
        }
        return item;
      });

      setCurrentProject({ ...currentProject, files: updatedFiles });
      setProjects(prev => prev.map(p => p.id === currentProject.id ? { ...p, files: updatedFiles } : p));

    } catch (error: any) {
      console.error("Failed to save file:", {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        fileId
      });

      // Handle specific error cases
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage = errorData?.detail || errorData?.non_field_errors?.[0] || errorData?.message || error.message;
        
        switch (error.response.status) {
          case 400:
            throw new Error(`Invalid request: ${errorMessage || 'Please check your input'}`);
          case 401:
            throw new Error('You are not authorized. Please log in again.');
          case 403:
            throw new Error('You do not have permission to save this file.');
          case 404:
            throw new Error('File not found. Please try opening the file again.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(`Failed to save file: ${errorMessage}`);
        }
      }

      // Handle network errors
      if (error.message === 'Network Error') {
        throw new Error('Network error. Please check your internet connection.');
      }

      // Handle other errors
      throw new Error(`Failed to save file: ${error.message}`);
    }
  };

  const executeFile = async (fileId: string): Promise<string> => {
    try {
      const response = await fileSystemApi.execute(fileId)
      return response.data.output || ""
    } catch (error) {
      throw new Error("Failed to execute file")
    }
  }

  const createFile = async (parentId: string | null, name: string, type: "file" | "folder") => {
    try {
      if (!currentProject) {
        throw new Error('No project selected. Please select a project first.');
      }

      // Check if an item with the same name already exists in the same directory
      const parentFolder = parentId ? findFile(currentProject.files, parentId) : null;
      if (parentId && !parentFolder) {
        throw new Error('Parent folder not found');
      }
      
      const siblings = parentFolder?.type === 'folder' ? parentFolder.children : currentProject.files;
      
      if (siblings) {
        const existingItem = siblings.find((item) => item.name === name.trim());
        if (existingItem) {
          throw new Error(`A ${existingItem.type} with the name "${name}" already exists in this location`);
        }
      }

      const requestData = {
        name: name.trim(),
        item_type: type,
        content: type === "file" ? "" : undefined,
        parent_id: parentId,
        project_id: currentProject.id
      };

      console.log('Creating file/folder with data:', requestData);

      // Make API request
      const response = await fileSystemApi.create(requestData);

      if (!response.data) {
        throw new Error('No data received from server');
      }

      // Update state with new item
      const newItem = response.data;
      console.log('Received new item from server:', newItem);

      const transformedItem = newItem.item_type === 'file' 
        ? {
            id: newItem.id,
            name: newItem.name,
            type: 'file' as const,
            content: newItem.content || '',
            language: getLanguageFromExtension(newItem.name),
            parent: newItem.parent || null,
            project: newItem.project
          } as FileSystemFile
        : {
            id: newItem.id,
            name: newItem.name,
            type: 'folder' as const,
            expanded: false,
            children: [],
            parent: newItem.parent || null,
            project: newItem.project
          } as FileSystemFolder;

      // If we have a parent folder, make sure it's expanded
      if (parentId && parentFolder?.type === 'folder') {
        const updatedFiles = toggleFolderInTree(currentProject.files, parentId);
        const filesWithNewItem = addItemToTree(updatedFiles, transformedItem, parentId);
        setCurrentProject({ ...currentProject, files: filesWithNewItem });
        setProjects((prev) =>
          prev.map((p) => (p.id === currentProject.id ? { ...p, files: filesWithNewItem } : p))
        );
      } else {
        const updatedFiles = addItemToTree(currentProject.files, transformedItem, parentId);
        setCurrentProject({ ...currentProject, files: updatedFiles });
        setProjects((prev) =>
          prev.map((p) => (p.id === currentProject.id ? { ...p, files: updatedFiles } : p))
        );
      }

      return response.data;
    } catch (error: any) {
      // Detailed error logging
      console.error('Failed to create item:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        requestData: {
          name,
          type,
          parentId,
          projectId: currentProject?.id
        }
      });

      // Handle specific error cases
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage = errorData?.detail || errorData?.non_field_errors?.[0] || errorData?.message || error.message;
        
        switch (error.response.status) {
          case 400:
            if (errorMessage?.includes('already exists')) {
              throw new Error(`A file or folder with the name "${name}" already exists in this location`);
            }
            throw new Error(`Invalid request: ${errorMessage || 'Please check your input'}`);
          case 401:
            throw new Error('You are not authorized. Please log in again.');
          case 403:
            throw new Error('You do not have permission to create files in this project.');
          case 404:
            throw new Error('Project not found. Please try selecting the project again.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(`Failed to create item: ${errorMessage}`);
        }
      }

      // Handle network errors
      if (error.message === 'Network Error') {
        throw new Error('Network error. Please check your internet connection.');
      }

      // Handle other errors
      throw new Error(`Failed to create item: ${error.message}`);
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      if (!itemId || typeof itemId !== 'string' || itemId.trim() === '') {
        throw new Error('Invalid item ID');
      }

      if (!currentProject) {
        throw new Error('No project selected');
      }

      // Check if the item exists in the current project
      const item = findFile(currentProject.files, itemId);
      if (!item) {
        throw new Error('Item not found in the current project');
      }

      await fileSystemApi.delete(itemId);
      
      const updatedFiles = removeItemFromTree(currentProject.files, itemId);
      setCurrentProject({ ...currentProject, files: updatedFiles });
      setProjects((prev) =>
        prev.map((p) => (p.id === currentProject.id ? { ...p, files: updatedFiles } : p))
      );
      closeFile(itemId);
    } catch (error: any) {
      console.error("Failed to delete item:", error);
      
      // Handle specific error cases
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage = errorData?.detail || errorData?.non_field_errors?.[0] || errorData?.message || error.message;
        
        switch (error.response.status) {
          case 400:
            throw new Error(`Invalid request: ${errorMessage || 'Please check your input'}`);
          case 401:
            throw new Error('You are not authorized. Please log in again.');
          case 403:
            throw new Error('You do not have permission to delete this item.');
          case 404:
            throw new Error('Item not found. It may have been deleted already.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(`Failed to delete item: ${errorMessage}`);
        }
      }

      // Handle network errors
      if (error.message === 'Network Error') {
        throw new Error('Network error. Please check your internet connection.');
      }

      // Handle other errors
      throw new Error(error.message || 'Failed to delete item');
    }
  };

  const renameItem = async (itemId: string, newName: string) => {
    try {
      await fileSystemApi.update(itemId, { name: newName })
      if (currentProject) {
        const updatedFiles = renameItemInTree(currentProject.files, itemId, newName)
        setCurrentProject({ ...currentProject, files: updatedFiles })
        setProjects((prev) =>
          prev.map((p) => (p.id === currentProject.id ? { ...p, files: updatedFiles } : p))
        )
        setOpenFiles((prev) =>
          prev.map((f) => (f.id === itemId ? { ...f, name: newName } : f))
        )
      }
    } catch (error) {
      console.error("Failed to rename item:", error)
    }
  }

  const toggleFolder = (folderId: string) => {
    if (currentProject) {
      const updatedFiles = toggleFolderInTree(currentProject.files, folderId)
      setCurrentProject({ ...currentProject, files: updatedFiles })
      setProjects((prev) =>
        prev.map((p) => (p.id === currentProject.id ? { ...p, files: updatedFiles } : p))
      )
    }
  }

  // Helper functions for tree operations
  const findFile = (items: (FileSystemFile | FileSystemFolder)[], fileId: string): FileSystemFile | FileSystemFolder | null => {
    for (const item of items) {
      if (item.id === fileId) return item
      if (item.type === "folder") {
        const found = findFile(item.children, fileId)
        if (found) return found
      }
    }
    return null
  }

  const addItemToTree = (
    items: (FileSystemFile | FileSystemFolder)[],
    newItem: FileSystemFile | FileSystemFolder,
    parentId: string | null
  ): (FileSystemFile | FileSystemFolder)[] => {
    if (!parentId) return [...items, newItem];

    return items.map((item) => {
      if (item.id === parentId && item.type === "folder") {
        return {
          ...item,
          children: [...item.children, newItem],
        };
      }
      if (item.type === "folder") {
        return {
          ...item,
          children: addItemToTree(item.children, newItem, parentId),
        };
      }
      return item;
    });
  };

  const removeItemFromTree = (
    items: (FileSystemFile | FileSystemFolder)[],
    itemId: string
  ): (FileSystemFile | FileSystemFolder)[] => {
    return items
      .filter((item) => item.id !== itemId)
      .map((item) => {
        if (item.type === "folder") {
          return {
            ...item,
            children: removeItemFromTree(item.children, itemId),
          }
        }
        return item
      })
  }

  const renameItemInTree = (
    items: (FileSystemFile | FileSystemFolder)[],
    itemId: string,
    newName: string
  ): (FileSystemFile | FileSystemFolder)[] => {
    return items.map((item) => {
      if (item.id === itemId) {
        return { ...item, name: newName }
      }
      if (item.type === "folder") {
        return {
          ...item,
          children: renameItemInTree(item.children, itemId, newName),
        }
      }
      return item
    })
  }

  const toggleFolderInTree = (
    items: (FileSystemFile | FileSystemFolder)[],
    folderId: string
  ): (FileSystemFile | FileSystemFolder)[] => {
    return items.map((item) => {
      if (item.id === folderId && item.type === "folder") {
        return { ...item, expanded: !item.expanded }
      }
      if (item.type === "folder") {
        return {
          ...item,
          children: toggleFolderInTree(item.children, folderId),
        }
      }
      return item
    })
  }

  return {
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
  }
}
