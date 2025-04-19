
import React, { createContext, useContext, useState, useEffect } from 'react';
import { FileItem, Folder, BreadcrumbItem, FileType } from '@/types/file';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

interface FileContextType {
  files: FileItem[];
  folders: Folder[];
  currentFolder: string | null;
  breadcrumbs: BreadcrumbItem[];
  addFile: (name: string, type: FileType, content?: string, file?: File) => void;
  addFolder: (name: string) => void;
  deleteItem: (id: string, isFolder: boolean) => void;
  navigateToFolder: (folderId: string | null) => void;
  getFilesInFolder: (folderId: string | null) => FileItem[];
  getFoldersInFolder: (folderId: string | null) => Folder[];
  getFile: (id: string) => FileItem | undefined;
  updateFile: (id: string, updates: Partial<FileItem>) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

const STORAGE_KEY = 'file-forge-data';

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ id: 'root', name: 'Home' }]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const { files, folders } = JSON.parse(savedData);
        
        // Convert string dates back to Date objects
        const parsedFiles = files.map((file: any) => ({
          ...file,
          createdAt: new Date(file.createdAt),
          modifiedAt: new Date(file.modifiedAt)
        }));
        
        const parsedFolders = folders.map((folder: any) => ({
          ...folder,
          createdAt: new Date(folder.createdAt)
        }));
        
        setFiles(parsedFiles);
        setFolders(parsedFolders);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    } else {
      // Add some demo data if no saved data exists
      const demoFolder: Folder = {
        id: 'demo-folder',
        name: 'Demo Documents',
        parentId: null,
        createdAt: new Date()
      };
      
      const demoFiles: FileItem[] = [
        {
          id: 'demo-doc-1',
          name: 'Getting Started',
          type: 'document',
          parentId: null,
          createdAt: new Date(),
          modifiedAt: new Date(),
          content: '# Welcome to File Forge\n\nThis is your personal document management system. Here are some tips to get started:\n\n- Create folders to organize your files\n- Upload existing files\n- Create new documents and edit them\n- Preview files before opening'
        },
        {
          id: 'demo-doc-2',
          name: 'Project Notes',
          type: 'document',
          parentId: 'demo-folder',
          createdAt: new Date(),
          modifiedAt: new Date(),
          content: '# Project Notes\n\nThis is a sample document in the Demo folder.'
        }
      ];
      
      setFolders([demoFolder]);
      setFiles(demoFiles);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (files.length > 0 || folders.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ files, folders }));
    }
  }, [files, folders]);

  // Update breadcrumbs when current folder changes
  useEffect(() => {
    if (currentFolder === null) {
      setBreadcrumbs([{ id: 'root', name: 'Home' }]);
      return;
    }

    const breadcrumbItems: BreadcrumbItem[] = [{ id: 'root', name: 'Home' }];
    let folderId = currentFolder;
    
    while (folderId) {
      const folder = folders.find(f => f.id === folderId);
      if (folder) {
        breadcrumbItems.unshift({ id: folder.id, name: folder.name });
        folderId = folder.parentId || '';
      } else {
        break;
      }
    }
    
    setBreadcrumbs(breadcrumbItems);
  }, [currentFolder, folders]);

  const addFile = (name: string, type: FileType, content?: string, file?: File) => {
    const newFile: FileItem = {
      id: uuidv4(),
      name,
      type,
      parentId: currentFolder,
      createdAt: new Date(),
      modifiedAt: new Date(),
      content,
      size: file?.size
    };
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setFiles(prevFiles => [
            ...prevFiles,
            {
              ...newFile,
              url: e.target?.result as string
            }
          ]);
          
          toast({
            title: "File uploaded",
            description: `${name} has been added to your files`,
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      setFiles(prevFiles => [...prevFiles, newFile]);
      
      toast({
        title: "File created",
        description: `${name} has been created`,
      });
    }
  };

  const addFolder = (name: string) => {
    const newFolder: Folder = {
      id: uuidv4(),
      name,
      parentId: currentFolder,
      createdAt: new Date()
    };
    
    setFolders(prevFolders => [...prevFolders, newFolder]);
    
    toast({
      title: "Folder created",
      description: `${name} folder has been created`,
    });
  };

  const deleteItem = (id: string, isFolder: boolean) => {
    if (isFolder) {
      // Delete folder and all its contents
      const folderToDelete = folders.find(folder => folder.id === id);
      if (!folderToDelete) return;
      
      // Get all child folders (recursive)
      const getAllChildFolderIds = (folderId: string): string[] => {
        const directChildren = folders.filter(f => f.parentId === folderId).map(f => f.id);
        return [
          ...directChildren,
          ...directChildren.flatMap(childId => getAllChildFolderIds(childId))
        ];
      };
      
      const childFolderIds = getAllChildFolderIds(id);
      const allFolderIdsToDelete = [id, ...childFolderIds];
      
      // Remove all folders
      setFolders(prevFolders => 
        prevFolders.filter(folder => !allFolderIdsToDelete.includes(folder.id))
      );
      
      // Remove all files in those folders
      setFiles(prevFiles => 
        prevFiles.filter(file => 
          file.parentId === null || !allFolderIdsToDelete.includes(file.parentId)
        )
      );
      
      toast({
        title: "Folder deleted",
        description: `${folderToDelete.name} and its contents have been deleted`,
      });
    } else {
      // Delete file
      const fileToDelete = files.find(file => file.id === id);
      setFiles(prevFiles => prevFiles.filter(file => file.id !== id));
      
      if (fileToDelete) {
        toast({
          title: "File deleted",
          description: `${fileToDelete.name} has been deleted`,
        });
      }
    }
  };

  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolder(folderId);
  };

  const getFilesInFolder = (folderId: string | null) => {
    return files.filter(file => file.parentId === folderId);
  };

  const getFoldersInFolder = (folderId: string | null) => {
    return folders.filter(folder => folder.parentId === folderId);
  };

  const getFile = (id: string) => {
    return files.find(file => file.id === id);
  };

  const updateFile = (id: string, updates: Partial<FileItem>) => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === id 
          ? { ...file, ...updates, modifiedAt: new Date() } 
          : file
      )
    );
    
    toast({
      title: "File updated",
      description: "Your changes have been saved",
    });
  };

  return (
    <FileContext.Provider
      value={{
        files,
        folders,
        currentFolder,
        breadcrumbs,
        addFile,
        addFolder,
        deleteItem,
        navigateToFolder,
        getFilesInFolder,
        getFoldersInFolder,
        getFile,
        updateFile
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FileContext);
  
  if (context === undefined) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  
  return context;
};
