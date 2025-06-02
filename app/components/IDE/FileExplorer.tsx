"use client"
import { useState } from "react"
import type React from "react"
import {
  ChevronRight,
  ChevronDown,
  Search,
  Folder,
  FileCode,
  FileJson,
  FileCog,
  Play,
  Trash,
  Edit,
  FolderPlus,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useFileSystem, type Project, type FileSystemFile, type FileSystemFolder } from "@/hooks/use-file-system"
import { projectApi } from "@/lib/api"

interface FileExplorerProps {
  projects: Project[]
  currentProject: Project | null
  setCurrentProject: (project: Project) => void
  openFile: (fileId: string) => void
  activeFileId: string | null
  onExecute: (fileId: string) => void
}

export default function FileExplorer({
  projects,
  currentProject,
  setCurrentProject,
  openFile,
  activeFileId,
  onExecute,
}: FileExplorerProps) {
  const { createFile, deleteItem, renameItem, toggleFolder } = useFileSystem()
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewItemDialog, setShowNewItemDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newItemType, setNewItemType] = useState<"file" | "folder">("file")
  const [newItemName, setNewItemName] = useState("")
  const [currentItemId, setCurrentItemId] = useState<string | null>(null)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [showContextMenu, setShowContextMenu] = useState(false)

  const handleProjectChange = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      setCurrentProject(project)
    }
  }

  const handleNewItem = (type: "file" | "folder", parentId: string | null = null) => {
    setNewItemType(type)
    setCurrentItemId(parentId)
    setNewItemName("")
    setShowNewItemDialog(true)
  }

  const handleCreateItem = () => {
    if (newItemName.trim() === "") return
    if (!currentProject) {
      alert("Please select a project first")
      return
    }
    createFile(currentItemId, newItemName, newItemType)
    setShowNewItemDialog(false)
  }

  const handleRenameItem = (id: string, currentName: string) => {
    setCurrentItemId(id)
    setNewItemName(currentName)
    setShowRenameDialog(true)
  }

  const handleRename = () => {
    if (newItemName.trim() === "" || !currentItemId) return
    renameItem(currentItemId, newItemName)
    setShowRenameDialog(false)
  }

  const handleDeleteItem = (id: string) => {
    setCurrentItemId(id)
    setShowDeleteDialog(true)
  }

  const handleDelete = () => {
    if (!currentItemId) return
    deleteItem(currentItemId)
    setShowDeleteDialog(false)
  }

  const handleContextMenu = (e: React.MouseEvent, id: string, type: "file" | "folder" | "root", name?: string) => {
    e.preventDefault()
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
    setCurrentItemId(id)
    if (name) setNewItemName(name)
    setShowContextMenu(true)
  }

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".py")) return <FileCode className="h-4 w-4 text-[#3572A5]" />
    if (fileName.endsWith(".js")) return <FileCode className="h-4 w-4 text-[#F7DF1E]" />
    if (fileName.endsWith(".cpp") || fileName.endsWith(".h")) return <FileCode className="h-4 w-4 text-[#F34B7D]" />
    if (fileName.endsWith(".json")) return <FileJson className="h-4 w-4 text-[#F09319]" />
    if (fileName.endsWith(".config")) return <FileCog className="h-4 w-4 text-[#8B5DFF]" />
    return <FileText className="h-4 w-4 text-gray-400" />
  }

  const renderFileTree = (items: (FileSystemFile | FileSystemFolder)[], level = 0) => {
    if (!items) return null
    return items
      .filter((item) => {
        if (!searchQuery) return true
        return item.name.toLowerCase().includes(searchQuery.toLowerCase())
      })
      .map((item) => {
        if (item.type === "folder") {
          return (
            <div key={item.id} className="select-none">
              <ContextMenu>
                <ContextMenuTrigger>
                  <div
                    className={`flex items-center py-1 px-2 hover:bg-gray-800 rounded cursor-pointer`}
                    style={{ paddingLeft: `${level * 12 + 8}px` }}
                    onClick={() => toggleFolder(item.id)}
                    onContextMenu={(e) => handleContextMenu(e, item.id, "folder", item.name)}
                  >
                    <div className="mr-1">
                      {item.expanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <Folder className="h-4 w-4 text-[#F09319] mr-2" />
                    <span className="text-gray-300 text-sm truncate">{item.name}</span>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                  <ContextMenuItem onClick={() => handleNewItem("file", item.id)}>
                    <FileText className="h-4 w-4 mr-2" />
                    New File
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleNewItem("folder", item.id)}>
                    <FolderPlus className="h-4 w-4 mr-2" />
                    New Folder
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => handleRenameItem(item.id, item.name)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Rename
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleDeleteItem(item.id)} className="text-red-500">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
              {item.expanded && item.children.length > 0 && renderFileTree(item.children, level + 1)}
            </div>
          )
        } else {
          return (
            <ContextMenu key={item.id}>
              <ContextMenuTrigger>
                <div
                  className={`flex items-center py-1 px-2 hover:bg-gray-800 rounded cursor-pointer ${
                    activeFileId === item.id ? "bg-[#8B5DFF]/20 border-l-2 border-[#8B5DFF]" : ""
                  }`}
                  style={{ paddingLeft: `${level * 12 + 24}px` }}
                  onClick={() => openFile(item.id)}
                  onDoubleClick={() => openFile(item.id)}
                  onContextMenu={(e) => handleContextMenu(e, item.id, "file", item.name)}
                >
                  {getFileIcon(item.name)}
                  <span className="ml-2 text-gray-300 text-sm truncate">{item.name}</span>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-64">
                <ContextMenuItem onClick={() => openFile(item.id)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Open
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onExecute(item.id)}>
                  <Play className="h-4 w-4 mr-2" />
                  Execute
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => handleRenameItem(item.id, item.name)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Rename
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleDeleteItem(item.id)} className="text-red-500">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          )
        }
      })
  }

  const handleCreateProject = () => {
    if (newProjectName.trim() === "") return
    projectApi.create({ name: newProjectName })
      .then((project) => {
        setCurrentProject(project)
        setShowNewProjectDialog(false)
        setNewProjectName("")
      })
      .catch((error) => {
        console.error("Error creating project:", error)
        alert("Failed to create project")
      })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Project Selector */}
      <div className="p-3 border-b border-gray-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between bg-gray-900 border-gray-700 hover:bg-gray-800 hover:border-gray-600"
            >
              <span className="truncate">{currentProject?.name || "Select Project"}</span>
              <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700">
            {projects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => handleProjectChange(project.id)}
                className={currentProject?.id === project.id ? "bg-[#8B5DFF]/20 text-white" : ""}
              >
                {project.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onClick={() => setShowNewProjectDialog(true)} className="text-[#8B5DFF]">
              <FolderPlus className="h-4 w-4 mr-2" />
              Create New Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* File Explorer Header */}
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-300">EXPLORER</h3>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleNewItem("file", null)}
              title="New File"
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleNewItem("folder", null)}
              title="New Folder"
            >
              <FolderPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search files..."
            className="pl-8 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#8B5DFF] focus:ring-[#8B5DFF]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-auto p-1">
        <ContextMenu>
          <ContextMenuTrigger className="min-h-full">
            <div className="min-h-full" onContextMenu={(e) => handleContextMenu(e, "root", "root")}>
              {currentProject?.files && renderFileTree(currentProject.files)}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64">
            <ContextMenuItem onClick={() => handleNewItem("file", null)}>
              <FileText className="h-4 w-4 mr-2" />
              New File
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleNewItem("folder", null)}>
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>

      {/* New Item Dialog */}
      <Dialog open={showNewItemDialog} onOpenChange={setShowNewItemDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Create New {newItemType === "file" ? "File" : "Folder"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter a name for the new {newItemType === "file" ? "file" : "folder"}.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder={newItemType === "file" ? "filename.ext" : "folder name"}
            className="bg-gray-800 border-gray-700 text-white"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewItemDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[#8B5DFF] to-[#F09319]"
              onClick={handleCreateItem}
              disabled={!newItemName.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Rename Item</DialogTitle>
            <DialogDescription className="text-gray-400">Enter a new name for this item.</DialogDescription>
          </DialogHeader>
          <Input
            className="bg-gray-800 border-gray-700 text-white"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[#8B5DFF] to-[#F09319]"
              onClick={handleRename}
              disabled={!newItemName.trim()}
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Project Dialog */}
      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter a name for your new project.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Project name"
            className="bg-gray-800 border-gray-700 text-white"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewProjectDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[#8B5DFF] to-[#F09319]"
              onClick={handleCreateProject}
              disabled={!newProjectName.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
