import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { useFileUpload } from "@/hooks/useFileUpload";
import { supabase } from "@/integrations/supabase/client";

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
  addFile: (name: string, type: string, content: string) => void;
  addFolder: (name: string) => void;
  deleteItem: (id: string, isFolder: boolean) => void;
  navigateToFolder: (folderId: string | null) => void;
  getFilesInFolder: (folderId: string | null) => File[];
  getFoldersInFolder: (folderId: string | null) => Folder[];
  getFile: (id: string) => File | undefined;
  updateFile: (id: string, updates: Partial<File>) => void;
  uploadFile: (file: globalThis.File) => Promise<void>;
  isUploading: boolean;
}

const FileContext = createContext<FileContextValue | undefined>(undefined);

const STORAGE_KEY = "file-forge-data";

// Helper functions
const loadStoredData = () => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) return { files: [], folders: [] };
  const parsedData = JSON.parse(storedData);
  return {
    files: parsedData.files.map((file: File) => ({
      ...file,
      createdAt: new Date(file.createdAt),
      modifiedAt: new Date(file.modifiedAt),
    })),
    folders: parsedData.folders.map((folder: Folder) => ({
      ...folder,
      createdAt: new Date(folder.createdAt),
    })),
  };
};

const saveDataToStorage = (files: File[], folders: Folder[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ files, folders }));
};

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { uploadFile: uploadFileToStorage, isUploading } = useFileUpload();
  const [files, setFiles] = useState<File[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  // Memoized breadcrumbs
  const breadcrumbs = useMemo(() => {
    let path = [{ id: "root", name: "Home" }];
    let folderId = currentFolder;

    while (folderId) {
      const folder = folders.find((f) => f.id === folderId);
      if (!folder) break;
      path.unshift({ id: folder.id, name: folder.name });
      folderId = folder.parentId;
    }

    return path;
  }, [currentFolder, folders]);

  // Load data from localStorage
  useEffect(() => {
    const { files, folders } = loadStoredData();
    setFiles(files);
    setFolders(folders);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    saveDataToStorage(files, folders);
  }, [files, folders]);

  // Add file
  const addFile = useCallback((name: string, type: string, content: string) => {
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
    setFiles((prevFiles) => [...prevFiles, newFile]);
    toast({
      title: "File Created",
      description: `File "${name}" created successfully.`,
    });
  }, [currentFolder, toast]);

  // Add folder
  const addFolder = useCallback((name: string) => {
    const newFolder: Folder = {
      id: uuidv4(),
      name,
      parentId: currentFolder,
      createdAt: new Date(),
    };
    setFolders((prevFolders) => [...prevFolders, newFolder]);
    toast({
      title: "Folder Created",
      description: `Folder "${name}" created successfully.`,
    });
  }, [currentFolder, toast]);

  // Delete item
  const deleteItem = useCallback((id: string, isFolder: boolean) => {
    if (isFolder) {
      const deleteFolderRecursively = (folderId: string) => {
        setFiles((prevFiles) =>
          prevFiles.filter((file) => file.parentId !== folderId)
        );
        const subfolders = folders.filter((folder) => folder.parentId === folderId);
        subfolders.forEach((subfolder) => deleteFolderRecursively(subfolder.id));
        setFolders((prevFolders) =>
          prevFolders.filter((folder) => folder.id !== folderId)
        );
      };

      deleteFolderRecursively(id);
      toast({ title: "Folder Deleted", description: "Folder deleted successfully." });
    } else {
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
      toast({ title: "File Deleted", description: "File deleted successfully." });
    }
  }, [folders, toast]);

  // Navigate to folder
  const navigateToFolder = useCallback((folderId: string | null) => {
    setCurrentFolder(folderId);
  }, []);

  // Get files in folder
  const getFilesInFolder = useCallback(
    (folderId: string | null) => files.filter((file) => file.parentId === folderId),
    [files]
  );

  // Get folders in folder
  const getFoldersInFolder = useCallback(
    (folderId: string | null) => folders.filter((folder) => folder.parentId === folderId),
    [folders]
  );

  // Get file by ID
  const getFile = useCallback((id: string) => files.find((file) => file.id === id), [files]);

  // Update file
  const updateFile = useCallback(
    (id: string, updates: Partial<File>) => {
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === id ? { ...file, ...updates, modifiedAt: new Date() } : file
        )
      );
    },
    []
  );

  // Upload file to Supabase and add to local state
  const uploadFile = useCallback(async (file: globalThis.File) => {
    // Check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload files",
        variant: "destructive",
      });
      return;
    }
    
    const result = await uploadFileToStorage(file);
    
    if (result) {
      const newFile: File = {
        id: uuidv4(),
        name: file.name,
        type: file.type.includes('image') ? 'image' : 'document',
        parentId: currentFolder,
        createdAt: new Date(),
        modifiedAt: new Date(),
        size: file.size,
        url: result.publicUrl,
      };
      
      setFiles((prevFiles) => [...prevFiles, newFile]);
      
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  }, [uploadFileToStorage, currentFolder, toast]);

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
        uploadFile,
        isUploading,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFiles must be used within a FileProvider");
  }
  return context;
};
