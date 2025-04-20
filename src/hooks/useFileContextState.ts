import { useState, useCallback, useMemo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { File, Folder, Breadcrumb } from "@/types/file-types";
import { loadStoredData, saveDataToStorage } from "@/utils/storage-utils";
import { useFileUpload } from "./useFileUpload";

export const useFileContextState = () => {
  const { toast } = useToast();
  const { uploadFile: uploadFileToStorage, isUploading } = useFileUpload();
  const [files, setFiles] = useState<File[]>(() => loadStoredData().files);
  const [folders, setFolders] = useState<Folder[]>(() => loadStoredData().folders);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  // Save to localStorage whenever files or folders change
  useEffect(() => {
    saveDataToStorage(files, folders);
  }, [files, folders]);

  const breadcrumbs = useMemo(() => {
    let path: Breadcrumb[] = [{ id: "root", name: "Home" }];
    let folderId = currentFolder;

    while (folderId) {
      const folder = folders.find((f) => f.id === folderId);
      if (!folder) break;
      path.unshift({ id: folder.id, name: folder.name });
      folderId = folder.parentId;
    }

    return path;
  }, [currentFolder, folders]);

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
    setFiles((prev) => [...prev, newFile]);
    toast({
      title: "File Created",
      description: `File "${name}" created successfully.`,
    });
  }, [currentFolder, toast]);

  const addFolder = useCallback((name: string) => {
    const newFolder: Folder = {
      id: uuidv4(),
      name,
      parentId: currentFolder,
      createdAt: new Date(),
    };
    setFolders((prev) => [...prev, newFolder]);
    toast({
      title: "Folder Created",
      description: `Folder "${name}" created successfully.`,
    });
  }, [currentFolder, toast]);

  const deleteItem = useCallback((id: string, isFolder: boolean) => {
    if (isFolder) {
      const deleteFolderRecursively = (folderId: string) => {
        setFiles((prev) => prev.filter((file) => file.parentId !== folderId));
        const subfolders = folders.filter((folder) => folder.parentId === folderId);
        subfolders.forEach((subfolder) => deleteFolderRecursively(subfolder.id));
        setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
      };

      deleteFolderRecursively(id);
      toast({ 
        title: "Folder Deleted", 
        description: "Folder deleted successfully." 
      });
    } else {
      setFiles((prev) => prev.filter((file) => file.id !== id));
      toast({ 
        title: "File Deleted", 
        description: "File deleted successfully." 
      });
    }
  }, [folders, toast]);

  const navigateToFolder = useCallback((folderId: string | null) => {
    setCurrentFolder(folderId);
  }, []);

  const getFilesInFolder = useCallback(
    (folderId: string | null) => files.filter((file) => file.parentId === folderId),
    [files]
  );

  const getFoldersInFolder = useCallback(
    (folderId: string | null) => folders.filter((folder) => folder.parentId === folderId),
    [folders]
  );

  const getFile = useCallback(
    (id: string) => files.find((file) => file.id === id),
    [files]
  );

  const updateFile = useCallback((id: string, updates: Partial<File>) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === id ? { ...file, ...updates, modifiedAt: new Date() } : file
      )
    );
  }, []);

  const uploadFile = useCallback(async (file: globalThis.File) => {
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

  return {
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
  };
};
