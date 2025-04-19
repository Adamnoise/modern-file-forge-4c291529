import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";

interface File {
  id: string;
  name: string;
  type: string;
  parentId: string | null;
  createdAt: Date;
  modifiedAt: Date;
  content?: string;
  size?: number;
  url?: string;
}

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
}

interface FileContextValue {
  files: File[];
  folders: Folder[];
  currentFolder: string | null;
  breadcrumbs: Array<{ id: string; name: string }>;
  addFile: (name: string, type: string, content: string, file: File | null) => void;
  addFolder: (name: string) => void;
  deleteItem: (id: string, isFolder: boolean) => void;
  navigateToFolder: (folderId: string | null) => void;
  getFilesInFolder: (folderId: string | null) => File[];
  getFoldersInFolder: (folderId: string | null) => Folder[];
  getFile: (id: string) => File | undefined;
  updateFile: (id: string, updates: Partial<File>) => void;
}

const FileContext = createContext<FileContextValue | undefined>(undefined);

const STORAGE_KEY = 'file-forge-data';

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState([
    { id: 'root', name: 'Home' }
  ]);

  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setFiles(parsedData.files.map((file: File) => ({
        ...file,
        createdAt: new Date(file.createdAt),
        modifiedAt: new Date(file.modifiedAt),
      })));
      setFolders(parsedData.folders.map((folder: Folder) => ({
        ...folder,
        createdAt: new Date(folder.createdAt),
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ files, folders }));
  }, [files, folders]);

  const addFile = (name: string, type: string, content: string, file: File | null) => {
    const newFile: File = {
      id: uuidv4(),
      name,
      type,
      parentId: currentFolder,
      createdAt: new Date(),
      modifiedAt: new Date(),
      content,
      size: content.length,
    };
    setFiles([...files, newFile]);
    toast({
      title: "File Created",
      description: `File ${name} created successfully.`,
    });
  };

  const addFolder = (name: string) => {
    const newFolder: Folder = {
      id: uuidv4(),
      name,
      parentId: currentFolder,
      createdAt: new Date(),
    };
    setFolders([...folders, newFolder]);
    toast({
      title: "Folder Created",
      description: `Folder ${name} created successfully.`,
    });
  };

  const deleteItem = (id: string, isFolder: boolean) => {
    if (isFolder) {
      // Delete folder and its contents
      const folderToDelete = folders.find((folder) => folder.id === id);
      if (folderToDelete) {
        const deleteFolderAndContents = (folderId: string) => {
          // Delete files within the folder
          const filesToDelete = files.filter((file) => file.parentId === folderId);
          setFiles(files.filter((file) => !filesToDelete.some((f) => f.id === file.id)));
    
          // Delete subfolders and their contents recursively
          const subfolders = folders.filter((folder) => folder.parentId === folderId);
          subfolders.forEach((subfolder) => {
            deleteFolderAndContents(subfolder.id);
          });
    
          // Finally, delete the folder itself
          setFolders(folders.filter((folder) => folder.id !== folderId));
        };
    
        deleteFolderAndContents(id);
        toast({
          title: "Folder Deleted",
          description: `Folder ${folderToDelete.name} and its contents deleted successfully.`,
        });
      }
    } else {
      // Delete file
      const fileToDelete = files.find((file) => file.id === id);
      if (fileToDelete) {
        setFiles(files.filter((file) => file.id !== id));
        toast({
          title: "File Deleted",
          description: `File ${fileToDelete.name} deleted successfully.`,
        });
      }
    }
  };

  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolder(folderId);
  
    if (folderId === null) {
      // Navigate to Home
      setBreadcrumbs([{ id: 'root', name: 'Home' }]);
    } else {
      // Build breadcrumbs
      let newBreadcrumbs = [{ id: 'root', name: 'Home' }];
      let currentFolderId: string | null = folderId;
  
      while (currentFolderId) {
        const folder = folders.find((f) => f.id === currentFolderId);
        if (folder) {
          newBreadcrumbs.unshift({ id: folder.id, name: folder.name });
          currentFolderId = folder.parentId;
        } else {
          break;
        }
      }
  
      setBreadcrumbs(newBreadcrumbs);
    }
  };

  const getFilesInFolder = (folderId: string | null) => {
    return files.filter((file) => file.parentId === folderId);
  };

  const getFoldersInFolder = (folderId: string | null) => {
    return folders.filter((folder) => folder.parentId === folderId);
  };

  const getFile = (id: string) => {
    return files.find((file) => file.id === id);
  };

  const updateFile = (id: string, updates: Partial<File>) => {
    setFiles(files.map(file => file.id === id ? { ...file, ...updates, modifiedAt: new Date() } : file));
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
        updateFile,
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
