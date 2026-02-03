'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderIcon,
  FolderOpenIcon,
  DocumentIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  EyeIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import { Button } from './ui/Button';
import toast from 'react-hot-toast';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  children?: FileNode[];
  isOpen?: boolean;
}

interface ProjectManagerProps {
  onFileSelect: (file: FileNode) => void;
  onFilesChange?: (files: FileNode[]) => void;
}

export default function ProjectManager({ onFileSelect, onFilesChange }: ProjectManagerProps) {
  const [projects, setProjects] = useState<FileNode[]>([
    {
      id: '1',
      name: 'My Project',
      type: 'folder',
      isOpen: true,
      children: [
        {
          id: '1-1',
          name: 'index.html',
          type: 'file',
          language: 'html',
          content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>'
        },
        {
          id: '1-2',
          name: 'style.css',
          type: 'file',
          language: 'css',
          content: 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}'
        },
        {
          id: '1-3',
          name: 'app.js',
          type: 'file',
          language: 'javascript',
          content: 'console.log("Hello from CodeRipper!");'
        }
      ]
    }
  ]);

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const toggleFolder = (nodeId: string, nodes: FileNode[]): FileNode[] => {
    return nodes.map(node => {
      if (node.id === nodeId && node.type === 'folder') {
        return { ...node, isOpen: !node.isOpen };
      }
      if (node.children) {
        return { ...node, children: toggleFolder(nodeId, node.children) };
      }
      return node;
    });
  };

  const handleNodeClick = (node: FileNode) => {
    if (node.type === 'folder') {
      setProjects(toggleFolder(node.id, projects));
    } else {
      setSelectedFile(node.id);
      onFileSelect(node);
      toast.success(`Opened ${node.name}`);
    }
  };

  const addNode = (parentId: string | null, type: 'file' | 'folder') => {
    const name = type === 'folder' ? 'New Folder' : 'newfile.js';
    const newNode: FileNode = {
      id: Date.now().toString(),
      name,
      type,
      ...(type === 'folder' ? { children: [], isOpen: true } : { content: '', language: 'javascript' })
    };

    if (parentId === null) {
      setProjects([...projects, newNode]);
    } else {
      const addToParent = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.id === parentId && node.type === 'folder') {
            return {
              ...node,
              isOpen: true,
              children: [...(node.children || []), newNode]
            };
          }
          if (node.children) {
            return { ...node, children: addToParent(node.children) };
          }
          return node;
        });
      };
      setProjects(addToParent(projects));
    }

    toast.success(`Created ${name}`);
    setEditingNode(newNode.id);
    setEditingName(name);
  };

  const deleteNode = (nodeId: string) => {
    const removeNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.filter(node => {
        if (node.id === nodeId) return false;
        if (node.children) {
          node.children = removeNode(node.children);
        }
        return true;
      });
    };

    setProjects(removeNode(projects));
    toast.success('Deleted successfully');
  };

  const renameNode = (nodeId: string, newName: string) => {
    const rename = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, name: newName };
        }
        if (node.children) {
          return { ...node, children: rename(node.children) };
        }
        return node;
      });
    };

    setProjects(rename(projects));
    setEditingNode(null);
    toast.success('Renamed successfully');
  };

  const renderNode = (node: FileNode, level: number = 0) => {
    const isEditing = editingNode === node.id;
    const isSelected = selectedFile === node.id;

    return (
      <div key={node.id}>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
            isSelected ? 'bg-primary/20' : 'hover:bg-muted/50'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {node.type === 'folder' && (
            <button
              onClick={() => handleNodeClick(node)}
              className="p-0.5"
            >
              {node.isOpen ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </button>
          )}

          {node.type === 'folder' ? (
            node.isOpen ? (
              <FolderOpenIcon className="w-4 h-4 text-yellow-500" />
            ) : (
              <FolderIcon className="w-4 h-4 text-yellow-500" />
            )
          ) : (
            <DocumentIcon className="w-4 h-4 text-blue-500" />
          )}

          {isEditing ? (
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={() => renameNode(node.id, editingName)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') renameNode(node.id, editingName);
                if (e.key === 'Escape') setEditingNode(null);
              }}
              autoFocus
              className="flex-1 px-2 py-0.5 text-sm bg-background border border-border rounded"
            />
          ) : (
            <span
              onClick={() => node.type === 'file' && handleNodeClick(node)}
              className="flex-1 text-sm truncate"
            >
              {node.name}
            </span>
          )}

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {node.type === 'folder' && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addNode(node.id, 'file');
                  }}
                  className="p-1 hover:bg-muted rounded"
                  title="New File"
                >
                  <DocumentIcon className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addNode(node.id, 'folder');
                  }}
                  className="p-1 hover:bg-muted rounded"
                  title="New Folder"
                >
                  <FolderIcon className="w-3 h-3" />
                </button>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingNode(node.id);
                setEditingName(node.name);
              }}
              className="p-1 hover:bg-muted rounded"
              title="Rename"
            >
              <PencilIcon className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete "${node.name}"?`)) {
                  deleteNode(node.id);
                }
              }}
              className="p-1 hover:bg-red-500/20 rounded"
              title="Delete"
            >
              <TrashIcon className="w-3 h-3 text-red-500" />
            </button>
          </div>
        </motion.div>

        {node.type === 'folder' && node.isOpen && node.children && (
          <AnimatePresence>
            {node.children.map(child => renderNode(child, level + 1))}
          </AnimatePresence>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background border-r border-border">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <CodeBracketIcon className="w-5 h-5" />
            Project Files
          </h3>
          <div className="flex gap-1">
            <button
              onClick={() => addNode(null, 'file')}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              title="New File"
            >
              <DocumentIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => addNode(null, 'folder')}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              title="New Folder"
            >
              <FolderIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Organize your project files
        </p>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1 group">
          {projects.map(node => renderNode(node))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FolderIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No files yet</p>
            <Button
              onClick={() => addNode(null, 'folder')}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground">
        {projects.reduce((acc, p) => acc + (p.children?.length || 0), 0)} files
      </div>
    </div>
  );
}
