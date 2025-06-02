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

      // Get the last selected project ID from localStorage
      const lastSelectedProjectId = localStorage.getItem('selectedProjectId')

      // If there are projects, set the current project
      if (projects.length > 0) {
        let selectedProject: Project | null = null

        // If there's a last selected project ID, try to find that project
        if (lastSelectedProjectId) {
          selectedProject = projects.find(p => p.id === lastSelectedProjectId) || null
        }

        // If no last selected project or it wasn't found, use the first project
        if (!selectedProject) {
          selectedProject = projects[0]
        }

        setCurrentProject(selectedProject)

        // Then load files for the current project
        const filesResponse = await fileSystemApi.getByProject(selectedProject.id)
        const projectData = filesResponse.data
        const updatedProject = {
          ...selectedProject,
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

  // Update setCurrentProject to also save to localStorage and load project files
  const handleSetCurrentProject = async (project: Project | null) => {
    if (project) {
      try {
        // Load files for the selected project
        const filesResponse = await fileSystemApi.getByProject(project.id);
        const projectData = filesResponse.data;

        // First, create a map of all items by their ID
        const itemsMap = new Map();
        projectData.forEach(item => {
          if (item.item_type === 'file') {
            itemsMap.set(item.id, {
              id: item.id,
              name: item.name,
              type: 'file' as const,
              content: item.content || '',
              language: getLanguageFromExtension(item.name),
              parent: item.parent || null,
              project: item.project
            } as FileSystemFile);
          } else {
            itemsMap.set(item.id, {
              id: item.id,
              name: item.name,
              type: 'folder' as const,
              expanded: false,
              children: [],
              parent: item.parent || null,
              project: item.project
            } as FileSystemFolder);
          }
        });

        // Build the tree structure
        const rootItems: (FileSystemFile | FileSystemFolder)[] = [];
        projectData.forEach(item => {
          const currentItem = itemsMap.get(item.id);
          if (!currentItem) return;

          if (item.parent) {
            // Add to parent's children
            const parent = itemsMap.get(item.parent);
            if (parent && parent.type === 'folder') {
              parent.children.push(currentItem);
            }
          } else {
            // Add to root level
            rootItems.push(currentItem);
          }
        });

        // Sort items at each level
        const sortItems = (items: (FileSystemFile | FileSystemFolder)[]) => {
          items.sort((a, b) => {
            // Folders first, then files
            if (a.type !== b.type) {
              return a.type === 'folder' ? -1 : 1;
            }
            // Then alphabetically by name
            return a.name.localeCompare(b.name);
          });

          // Recursively sort children
          items.forEach(item => {
            if (item.type === 'folder') {
              sortItems(item.children);
            }
          });
        };

        // Sort the root items and their children
        sortItems(rootItems);

        const updatedProject = {
          ...project,
          files: rootItems
        };

        setCurrentProject(updatedProject);
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        localStorage.setItem('selectedProjectId', project.id);
      } catch (error) {
        console.error("Failed to load project files:", error);
        // Still set the project even if file loading fails
        setCurrentProject(project);
        localStorage.setItem('selectedProjectId', project.id);
      }
    } else {
      setCurrentProject(null);
      localStorage.removeItem('selectedProjectId');
    }
  };

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

  const refreshCurrentProject = async () => {
    if (!currentProject) return;
    
    try {
      const filesResponse = await fileSystemApi.getByProject(currentProject.id);
      const projectData = filesResponse.data;

      // First, create a map of all items by their ID
      const itemsMap = new Map();
      projectData.forEach(item => {
        if (item.item_type === 'file') {
          itemsMap.set(item.id, {
            id: item.id,
            name: item.name,
            type: 'file' as const,
            content: item.content || '',
            language: getLanguageFromExtension(item.name),
            parent: item.parent || null,
            project: item.project
          } as FileSystemFile);
        } else {
          itemsMap.set(item.id, {
            id: item.id,
            name: item.name,
            type: 'folder' as const,
            expanded: false,
            children: [],
            parent: item.parent || null,
            project: item.project
          } as FileSystemFolder);
        }
      });

      // Build the tree structure
      const rootItems: (FileSystemFile | FileSystemFolder)[] = [];
      projectData.forEach(item => {
        const currentItem = itemsMap.get(item.id);
        if (!currentItem) return;

        if (item.parent) {
          // Add to parent's children
          const parent = itemsMap.get(item.parent);
          if (parent && parent.type === 'folder') {
            parent.children.push(currentItem);
          }
        } else {
          // Add to root level
          rootItems.push(currentItem);
        }
      });

      // Sort items at each level
      const sortItems = (items: (FileSystemFile | FileSystemFolder)[]) => {
        items.sort((a, b) => {
          // Folders first, then files
          if (a.type !== b.type) {
            return a.type === 'folder' ? -1 : 1;
          }
          // Then alphabetically by name
          return a.name.localeCompare(b.name);
        });

        // Recursively sort children
        items.forEach(item => {
          if (item.type === 'folder') {
            sortItems(item.children);
          }
        });
      };

      // Sort the root items and their children
      sortItems(rootItems);

      const updatedProject = {
        ...currentProject,
        files: rootItems
      };

      setCurrentProject(updatedProject);
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    } catch (error) {
      console.error("Failed to refresh project:", error);
    }
  };

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
      
      if (parentId && parentFolder?.type !== 'folder') {
        throw new Error('Parent must be a folder');
      }
      
      const siblings = parentFolder?.type === 'folder' ? parentFolder.children : currentProject.files;
      
      if (siblings) {
        const existingItem = siblings.find((item) => item.name === name.trim());
        if (existingItem) {
          throw new Error(`A ${existingItem.type} with the name "${name}" already exists in this location`);
        }
      }

      // Validate file extension based on project's main language
      if (type === 'file') {
        const fileExtension = name.includes('.') ? '.' + name.split('.').pop()?.toLowerCase() : '';
        const allowedExtensions: Record<string, string[]> = {
          'python': ['.py'],
          'javascript': ['.js'],
          'cpp': ['.cpp', '.hpp', '.h']
        };

        const projectLanguage = currentProject.main_language.toLowerCase();
        if (projectLanguage in allowedExtensions) {
          if (!fileExtension) {
            // If no extension is provided, add the default extension for the project's language
            name = name + allowedExtensions[projectLanguage][0];
          } else if (!allowedExtensions[projectLanguage].includes(fileExtension)) {
            throw new Error(`Only ${projectLanguage} files (${allowedExtensions[projectLanguage].join(', ')}) are allowed in this project`);
          }
        }
      }

      const requestData = {
        name: name.trim(),
        item_type: type,
        content: type === 'file' ? '' : undefined,
        parent_id: parentId,
        project_id: currentProject.id
      };

      // Make API request
      const response = await fileSystemApi.create(requestData);

      if (!response.data) {
        throw new Error('No data received from server');
      }

      // Refresh the current project to get the updated file structure
      await refreshCurrentProject();

    } catch (error: any) {
      console.error("Failed to create file/folder:", error);
      throw new Error(error.response?.data?.detail || error.message || "Failed to create file/folder");
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      if (!currentProject) {
        throw new Error('No project selected');
      }

      await fileSystemApi.delete(itemId);
      await refreshCurrentProject();
    } catch (error: any) {
      console.error("Failed to delete item:", error);
      throw new Error(error.message || "Failed to delete item");
    }
  };

  const renameItem = async (itemId: string, newName: string) => {
    try {
      if (!currentProject) {
        throw new Error('No project selected');
      }

      await fileSystemApi.update(itemId, { name: newName });
      await refreshCurrentProject();
    } catch (error: any) {
      console.error("Failed to rename item:", error);
      throw new Error(error.message || "Failed to rename item");
    }
  };

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
    setCurrentProject: handleSetCurrentProject,
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
    loadProjects,
  }
}
