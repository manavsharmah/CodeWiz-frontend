"use client"

import { useState } from 'react'
import { Project } from '@/hooks/use-file-system'
import { projectApi } from '@/lib/api'

interface ProjectSelectorProps {
  projects: Project[]
  currentProject: Project | null
  onProjectSelect: (project: Project) => void
}

export function ProjectSelector({
  projects,
  currentProject,
  onProjectSelect,
}: ProjectSelectorProps) {
  const [isCreating, setIsCreating] = useState(false)
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
          <button
            onClick={handleCreateProject}
            className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
          >
            Create
          </button>
          <button
            onClick={() => {
              setIsCreating(false)
              setNewProjectName('')
              setNewProjectLanguage('python')
            }}
            className="rounded bg-gray-700 px-2 py-1 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
        >
          New Project
        </button>
      )}
    </div>
  )
} 