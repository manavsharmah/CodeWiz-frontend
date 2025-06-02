"use client"

import { useState } from 'react'
import { Project } from '@/hooks/use-file-system'
import { projectApi } from '@/lib/api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react'

interface ProjectSelectorProps {
  projects: Project[]
  currentProject: Project | null
  onProjectSelect: (project: Project) => void
  onProjectDelete?: () => void
}

export function ProjectSelector({
  projects,
  currentProject,
  onProjectSelect,
  onProjectDelete,
}: ProjectSelectorProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectLanguage, setNewProjectLanguage] = useState('python')

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return

    try {
      const response = await projectApi.create({
        name: newProjectName.trim(),
        main_language: newProjectLanguage,
      })
      onProjectSelect(response.data)
      setNewProjectName('')
      setNewProjectLanguage('python')
      setIsCreating(false)
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const project = projects.find((p) => p.id === e.target.value)
    if (project) {
      onProjectSelect(project)
    }
  }

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return

    const projectId = projectToDelete.id // Store the ID before any state changes
    
    try {
      await projectApi.delete(projectId)
      
      // If the deleted project was the current project, select the first available project
      if (currentProject?.id === projectId) {
        const remainingProjects = projects.filter(p => p.id !== projectId)
        if (remainingProjects.length > 0) {
          onProjectSelect(remainingProjects[0])
        }
      }

      // Call onProjectDelete after successful deletion
      if (onProjectDelete) {
        onProjectDelete()
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
      // You might want to show an error message to the user here
    } finally {
      setShowDeleteDialog(false)
      setProjectToDelete(null)
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <select
        value={currentProject?.id || ''}
        onChange={handleProjectChange}
        className="rounded border border-gray-700 bg-[#252526] px-2 py-1 text-white"
      >
        <option key="default" value="">Select a project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      {currentProject && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
          onClick={() => handleDeleteClick(currentProject)}
          title="Delete Project"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}

      {isCreating ? (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Project name"
            className="rounded border border-gray-700 bg-[#252526] px-2 py-1 text-white placeholder-gray-400"
          />
          <select
            value={newProjectLanguage}
            onChange={(e) => setNewProjectLanguage(e.target.value)}
            className="rounded border border-gray-700 bg-[#252526] px-2 py-1 text-white"
          >
            <option key="python" value="python">Python</option>
            <option key="javascript" value="javascript">JavaScript</option>
            <option key="typescript" value="typescript">TypeScript</option>
          </select>
          <Button
            onClick={handleCreateProject}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Create
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsCreating(false)
              setNewProjectName('')
              setNewProjectLanguage('python')
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          New Project
        </Button>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete "{projectToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 