import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
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
  addFile: (name: string, type: string, content: string) => void;
  addFolder: (name: string) => void;
  deleteItem: (id: string, isFolder: boolean) => void;
  navigateToFolder: (folderId: string | null) => void;
  getFilesInFolder: (folderId: string | null) => File[];
  getFoldersInFolder: (folderId: string | null) => Folder[];
  getFile: (id: string) => File | undefined;
  updateFile: (id: string, updates: Partial<File>) => void;
}

const FileContext = createContext<FileContextValue | undefined>(undefined);

const STORAGE_KEY = "file-forge-data";

// Segédfüggvények
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
  const [files, setFiles] = useState<File[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  // Breadcrumbs memoizálása
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

  // Adatok betöltése a localStorage-ból
  useEffect(() => {
    const { files, folders } = loadStoredData();
    setFiles(files);
    setFolders(folders);
  }, []);

  // Adatok mentése a localStorage-ba
  useEffect(() => {
    saveDataToStorage(files, folders);
  }, [files, folders]);

  // Fájl hozzáadása
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

  // Mappa hozzáadása
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

  // Elem törlése
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

  // Mappába navigálás
  const navigateToFolder = useCallback((folderId: string | null) => {
    setCurrentFolder(folderId);
  }, []);

  // Fájlok lekérése egy adott mappában
  const getFilesInFolder = useCallback(
    (folderId: string | null) => files.filter((file) => file.parentId === folderId),
    [files]
  );

  // Mappák lekérése egy adott mappában
  const getFoldersInFolder = useCallback(
    (folderId: string | null) => folders.filter((folder) => folder.parentId === folderId),
    [folders]
  );

  // Fájl lekérése ID alapján
  const getFile = useCallback((id: string) => files.find((file) => file.id === id), [files]);

  // Fájl frissítése
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
  if (!context) {
    throw new Error("useFiles must be used within a FileProvider");
  }
  return context;
};
