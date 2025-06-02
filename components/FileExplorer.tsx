"use client"

import { useState } from 'react'
import { FileSystemFile, FileSystemFolder } from '@/hooks/use-file-system'
import { getFileIcon } from '@/lib/api'

interface FileExplorerProps {
  files: (FileSystemFile | FileSystemFolder)[]
  onFileSelect: (fileId: string) => void
  onCreateItem: (parentId: string | null, name: string, type: 'file' | 'folder') => Promise<void>
  onDeleteItem: (itemId: string) => Promise<void>
  onRenameItem: (itemId: string, newName: string) => Promise<void>
  onToggleFolder: (folderId: string) => void
}

export function FileExplorer({
  files,
  onFileSelect,
  onCreateItem,
  onDeleteItem,
  onRenameItem,
  onToggleFolder,
}: FileExplorerProps) {
  const [newItemName, setNewItemName] = useState('')
  const [newItemType, setNewItemType] = useState<'file' | 'folder'>('file')
  const [newItemParent, setNewItemParent] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const handleCreateItem = async () => {
    if (!newItemName.trim()) return

    try {
      await onCreateItem(newItemParent, newItemName.trim(), newItemType)
      setNewItemName('')
      setNewItemType('file')
      setNewItemParent(null)
      setIsCreating(false)
    } catch (error: any) {
      console.error('Failed to create item:', error)
      // Show error message to user
      alert(error.message || 'Failed to create item. Please try again.')
    }
  }

  const handleRenameItem = async (itemId: string) => {
    if (!editName.trim()) return

    try {
      await onRenameItem(itemId, editName.trim())
      setEditingItem(null)
      setEditName('')
    } catch (error) {
      console.error('Failed to rename item:', error)
    }
  }

  const renderFileTree = (items: (FileSystemFile | FileSystemFolder)[], level = 0) => {
    return items
      .filter(item => item.id)
      .map((item, index) => (
        <div key={`${level}-${item.id}`} className="pl-4">
          <div className="group flex items-center py-1 hover:bg-[#2a2d2e]">
            {item.type === 'folder' ? (
              <button
                onClick={() => onToggleFolder(item.id)}
                className="mr-1 text-gray-400 hover:text-gray-200"
              >
                {item.expanded ? '▼' : '▶'}
              </button>
            ) : null}
            <span className="mr-2 text-gray-400">{getFileIcon(item.name, item.type === 'folder')}</span>
            {editingItem === item.id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => handleRenameItem(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRenameItem(item.id)
                  }
                }}
                className="flex-1 border border-blue-500 bg-[#3c3c3c] p-1 text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <button
                onClick={() => item.type === 'file' && onFileSelect(item.id)}
                className="flex-1 text-left text-gray-300 hover:text-white"
              >
                {item.name}
              </button>
            )}
            <div className="invisible flex space-x-2 group-hover:visible">
              <button
                onClick={() => {
                  setNewItemParent(item.id)
                  setIsCreating(true)
                }}
                className="text-gray-400 hover:text-blue-400"
                title="Create new item"
              >
                +
              </button>
              <button
                onClick={() => item.id && onDeleteItem(item.id)}
                className="text-gray-400 hover:text-red-400"
                title="Delete item"
              >
                ×
              </button>
              <button
                onClick={() => {
                  setEditingItem(item.id)
                  setEditName(item.name)
                }}
                className="text-gray-400 hover:text-blue-400"
                title="Rename item"
              >
                ✎
              </button>
            </div>
          </div>
          {item.type === 'folder' && item.expanded && renderFileTree(item.children, level + 1)}
        </div>
      ))
  }

  return (
    <div className="h-full overflow-auto p-2">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => {
            setNewItemParent(null)
            setIsCreating(true)
          }}
          className="rounded bg-[#0e639c] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#1177bb] focus:outline-none focus:ring-2 focus:ring-[#0e639c] focus:ring-offset-2 focus:ring-offset-[#252526]"
        >
          New
        </button>
      </div>

      {isCreating && (
        <div className="mb-4 rounded border border-gray-700 bg-[#3c3c3c] p-3">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Enter name"
            className="mb-2 w-full rounded border border-gray-600 bg-[#2d2d2d] p-2 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="mb-2 flex space-x-2">
            <button
              onClick={() => setNewItemType('file')}
              className={`flex-1 rounded px-3 py-1.5 text-sm font-medium ${
                newItemType === 'file'
                  ? 'bg-[#0e639c] text-white hover:bg-[#1177bb]'
                  : 'bg-[#2d2d2d] text-gray-300 hover:bg-[#3c3c3c]'
              }`}
            >
              File
            </button>
            <button
              onClick={() => setNewItemType('folder')}
              className={`flex-1 rounded px-3 py-1.5 text-sm font-medium ${
                newItemType === 'folder'
                  ? 'bg-[#0e639c] text-white hover:bg-[#1177bb]'
                  : 'bg-[#2d2d2d] text-gray-300 hover:bg-[#3c3c3c]'
              }`}
            >
              Folder
            </button>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setIsCreating(false)
                setNewItemName('')
                setNewItemType('file')
                setNewItemParent(null)
              }}
              className="rounded bg-[#2d2d2d] px-3 py-1.5 text-sm font-medium text-gray-300 hover:bg-[#3c3c3c] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-[#252526]"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateItem}
              className="rounded bg-[#0e639c] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#1177bb] focus:outline-none focus:ring-2 focus:ring-[#0e639c] focus:ring-offset-2 focus:ring-offset-[#252526]"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {renderFileTree(files)}
    </div>
  )
} 