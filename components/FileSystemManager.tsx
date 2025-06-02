import React, { useState, useEffect, useRef } from 'react';
import { projectApi, fileSystemApi, getLanguageFromExtension, getFileIcon } from '@/lib/api';
import type { Project, FileSystemItem } from '@/lib/api';

interface OpenFile extends FileSystemItem {
  isDirty?: boolean;
  language: string;
}

const FileSystemManager: React.FC = () => {
  // State management
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [fileTree, setFileTree] = useState<FileSystemItem[]>([]);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFile, setActiveFile] = useState<OpenFile | null>(null);
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalData, setModalData] = useState<any>({});
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: FileSystemItem } | null>(null);
  
  // Panel widths
  const [leftWidth, setLeftWidth] = useState(25);
  const [rightWidth, setRightWidth] = useState(25);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Load file tree when project changes
  useEffect(() => {
    if (currentProject) {
      loadProjectTree(currentProject.id);
    }
  }, [currentProject]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectApi.getAll();
      const projectsData = response.data;
      setProjects(projectsData);
      if (projectsData.length > 0 && !currentProject) {
        setCurrentProject(projectsData[0]);
      }
    } catch (error: any) {
      setError('Failed to load projects: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectTree = async (projectId: string) => {
    try {
      setLoading(true);
      const response = await projectApi.getTree(projectId);
      setFileTree(response.data.tree);
    } catch (error: any) {
      setError('Failed to load project tree: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createNewProject = async (projectData: { name: string; description?: string; main_language: string }) => {
    try {
      const response = await projectApi.create(projectData);
      const newProject = response.data;
      setProjects([...projects, newProject]);
      setCurrentProject(newProject);
    } catch (error: any) {
      setError('Failed to create project: ' + error.message);
    }
  };

  const openFile = async (file: FileSystemItem) => {
    if (file.item_type === 'folder') return;

    // Check if file is already open
    const existingFile = openFiles.find(f => f.id === file.id);
    if (existingFile) {
      setActiveFile(existingFile);
      return;
    }

    // Load file content if not already loaded
    let fileContent = file.content;
    if (!fileContent && file.id) {
      try {
        const response = await fileSystemApi.get(file.id);
        fileContent = response.data.content;
      } catch (error: any) {
        setError('Failed to load file: ' + error.message);
        return;
      }
    }

    const fileToOpen: OpenFile = {
      ...file,
      content: fileContent || '',
      isDirty: false,
      language: getLanguageFromExtension(file.name)
    };

    setOpenFiles([...openFiles, fileToOpen]);
    setActiveFile(fileToOpen);
  };

  const closeFile = (fileId: string) => {
    const updatedFiles = openFiles.filter(f => f.id !== fileId);
    setOpenFiles(updatedFiles);
    
    if (activeFile && activeFile.id === fileId) {
      setActiveFile(updatedFiles.length > 0 ? updatedFiles[updatedFiles.length - 1] : null);
    }
  };

  const saveFile = async (file: OpenFile) => {
    try {
      await fileSystemApi.update(file.id, {
        content: file.content,
        name: file.name
      });

      // Update file in openFiles
      const updatedFiles = openFiles.map(f => 
        f.id === file.id ? { ...f, isDirty: false } : f
      );
      setOpenFiles(updatedFiles);
      
      if (activeFile && activeFile.id === file.id) {
        setActiveFile({ ...activeFile, isDirty: false });
      }

      // Refresh file tree
      if (currentProject) {
        loadProjectTree(currentProject.id);
      }
    } catch (error: any) {
      setError('Failed to save file: ' + error.message);
    }
  };

  const executeFile = async (file: OpenFile) => {
    if (!file || file.item_type === 'folder') return;

    setIsExecuting(true);
    setOutput('Executing...\n');

    try {
      const response = await fileSystemApi.execute(file.id);
      setOutput(response.data.output || 'Execution completed with no output.');
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message;
      setOutput(`Error: ${errorMsg}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleEditorChange = (content: string) => {
    if (!activeFile) return;

    const updatedFile = { ...activeFile, content, isDirty: true };
    setActiveFile(updatedFile);

    const updatedFiles = openFiles.map(f => 
      f.id === activeFile.id ? updatedFile : f
    );
    setOpenFiles(updatedFiles);
  };

  const createItem = async (itemData: {
    name: string;
    type: 'file' | 'folder';
    parent_id?: string | null;
    content?: string;
  }) => {
    try {
      if (!currentProject) {
        throw new Error('No project selected');
      }

      const response = await fileSystemApi.create({
        ...itemData,
        project_id: currentProject.id
      });
      
      // Refresh file tree
      await loadProjectTree(currentProject.id);
      setShowCreateModal(false);
    } catch (error: any) {
      setError('Failed to create item: ' + error.message);
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await fileSystemApi.delete(itemId);
      
      // Close file if it's open
      const fileToClose = openFiles.find(f => f.id === itemId);
      if (fileToClose) {
        closeFile(itemId);
      }
      
      // Refresh file tree
      if (currentProject) {
        await loadProjectTree(currentProject.id);
      }
      setShowDeleteModal(false);
    } catch (error: any) {
      setError('Failed to delete item: ' + error.message);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, item: FileSystemItem) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleContextAction = (action: string, item: FileSystemItem) => {
    switch (action) {
      case 'create':
        setModalData({ parent: item, type: 'create' });
        setShowCreateModal(true);
        break;
      case 'rename':
        setModalData({ item, type: 'rename' });
        setShowRenameModal(true);
        break;
      case 'delete':
        setModalData({ item });
        setShowDeleteModal(true);
        break;
      default:
        break;
    }
    handleCloseContextMenu();
  };

  // Recursive file tree renderer
  const renderFileTree = (items: FileSystemItem[], level = 0) => {
    return items
      .filter(item => 
        searchTerm === '' || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(item => (
        <FileTreeItem
          key={item.id}
          item={item}
          level={level}
          onOpen={openFile}
          onContextMenu={handleContextMenu}
          isActive={activeFile && activeFile.id === item.id}
        />
      ));
  };

  interface FileTreeItemProps {
    item: FileSystemItem;
    level: number;
    onOpen: (file: FileSystemItem) => void;
    onContextMenu: (e: React.MouseEvent, item: FileSystemItem) => void;
    isActive: boolean;
  }

  const FileTreeItem: React.FC<FileTreeItemProps> = ({ item, level, onOpen, onContextMenu, isActive }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
      <div>
        <div
          className={`flex items-center p-2 hover:bg-gray-800 cursor-pointer ${
            isActive ? 'bg-purple-600/20 text-purple-300' : 'text-gray-300'
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => item.item_type === 'folder' ? setIsExpanded(!isExpanded) : onOpen(item)}
          onContextMenu={(e) => onContextMenu(e, item)}
        >
          {item.item_type === 'folder' && (
            <span className="mr-2 text-xs">
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          <span className="mr-2">{getFileIcon(item.name, item.item_type === 'folder')}</span>
          <span className="truncate">{item.name}</span>
          {item.item_type === 'file' && openFiles.find(f => f.id === item.id)?.isDirty && (
            <span className="ml-auto text-orange-400">●</span>
          )}
        </div>
        {item.item_type === 'folder' && isExpanded && item.children && (
          <div>
            {renderFileTree(item.children, level + 1)}
          </div>
        )}
      </div>
    );
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Error Display */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-4 text-white hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Left Sidebar - File Explorer */}
      <div 
        className="border-r border-gray-700 overflow-hidden"
        style={{ width: `${leftWidth}%` }}
      >
        <div className="p-4 border-b border-gray-700">
          <select
            value={currentProject?.id || ''}
            onChange={(e) => {
              const project = projects.find(p => p.id === e.target.value);
              setCurrentProject(project || null);
            }}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
          >
            <option value="">Select Project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          
          <div className="mt-3">
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {currentProject ? (
            renderFileTree(fileTree)
          ) : (
            <div className="p-4 text-gray-400 text-center">
              Select a project to view files
            </div>
          )}
        </div>
      </div>

      {/* Center Panel - Code Editor */}
      <div 
        className="flex flex-col overflow-hidden"
        style={{ width: `${100 - leftWidth - rightWidth}%` }}
      >
        {/* Tabs */}
        <div className="flex bg-gray-800 border-b border-gray-700 overflow-x-auto">
          {openFiles.map(file => (
            <div
              key={file.id}
              className={`flex items-center px-4 py-2 border-r border-gray-700 cursor-pointer min-w-0 ${
                activeFile && activeFile.id === file.id
                  ? 'bg-purple-600/20 text-purple-300'
                  : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveFile(file)}
            >
              <span className="mr-2">{getFileIcon(file.name)}</span>
              <span className="truncate">{file.name}</span>
              {file.isDirty && <span className="ml-2 text-orange-400">●</span>}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeFile(file.id);
                }}
                className="ml-2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Editor Toolbar */}
        {activeFile && (
          <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">
                {activeFile.language}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => saveFile(activeFile)}
                disabled={!activeFile.isDirty}
                className={`px-3 py-1 rounded text-sm ${
                  activeFile.isDirty
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Save
              </button>
              <button
                onClick={() => executeFile(activeFile)}
                disabled={isExecuting}
                className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm disabled:opacity-50"
              >
                {isExecuting ? 'Running...' : 'Run'}
              </button>
            </div>
          </div>
        )}

        {/* Editor Content */}
        <div className="flex-1 overflow-hidden">
          {activeFile ? (
            <textarea
              ref={editorRef}
              value={activeFile.content}
              onChange={(e) => handleEditorChange(e.target.value)}
              className="w-full h-full p-4 bg-gray-900 text-white font-mono text-sm resize-none focus:outline-none"
              placeholder="Start coding..."
              spellCheck={false}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">📝</div>
                <div className="text-xl mb-2">No file selected</div>
                <div className="text-sm">Select a file from the explorer to start coding</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Output */}
      <div 
        className="border-l border-gray-700 flex flex-col overflow-hidden"
        style={{ width: `${rightWidth}%` }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold">Output</h3>
          <button
            onClick={() => setOutput('')}
            className="text-gray-400 hover:text-white"
          >
            Clear
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
            {output || 'No output yet. Run some code to see results here.'}
          </pre>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-gray-800 border border-gray-600 rounded shadow-lg py-2 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => handleContextAction('create', contextMenu.item)}
            className="block w-full text-left px-4 py-2 hover:bg-gray-700"
          >
            New File/Folder
          </button>
          <button
            onClick={() => handleContextAction('rename', contextMenu.item)}
            className="block w-full text-left px-4 py-2 hover:bg-gray-700"
          >
            Rename
          </button>
          <button
            onClick={() => handleContextAction('delete', contextMenu.item)}
            className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400"
          >
            Delete
          </button>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateItemModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createItem}
          parent={modalData.parent}
        />
      )}

      {showDeleteModal && (
        <DeleteItemModal
          onClose={() => setShowDeleteModal(false)}
          onDelete={() => deleteItem(modalData.item.id)}
          item={modalData.item}
        />
      )}

      {/* Click outside handler for context menu */}
      {contextMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleCloseContextMenu}
        />
      )}
    </div>
  );
};

interface CreateItemModalProps {
  onClose: () => void;
  onCreate: (data: { name: string; type: 'file' | 'folder'; parent_id?: string | null; content?: string }) => void;
  parent?: FileSystemItem;
}

const CreateItemModal: React.FC<CreateItemModalProps> = ({ onClose, onCreate, parent }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'file' | 'folder'>('file');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreate({
      name: name.trim(),
      type,
      parent_id: parent?.id || null,
      content: type === 'file' ? '' : undefined
    });
    
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h3 className="text-lg font-semibold mb-4">
          Create New {type === 'file' ? 'File' : 'Folder'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-2">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'file' | 'folder')}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
            >
              <option value="file">File</option>
              <option value="folder">Folder</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === 'file' ? 'main.py' : 'src'}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface DeleteItemModalProps {
  onClose: () => void;
  onDelete: () => void;
  item: FileSystemItem;
}

const DeleteItemModal: React.FC<DeleteItemModalProps> = ({ onClose, onDelete, item }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h3 className="text-lg font-semibold mb-4 text-red-400">
          Delete {item.item_type === 'file' ? 'File' : 'Folder'}
        </h3>
        
        <p className="mb-6">
          Are you sure you want to delete "{item.name}"? This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileSystemManager; 