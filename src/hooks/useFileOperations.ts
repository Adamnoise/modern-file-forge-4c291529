
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { FileItem, FolderItem } from "@/types/file-system";

export const useFileOperations = (
  selectedFolder: FolderItem,
  fileSystem: FolderItem
) => {
  const { toast } = useToast();
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleCreateFolder = (name: string) => {
    const newFolder: FolderItem = {
      id: `folder-${Date.now()}`,
      name,
      type: "folder",
      path: `${selectedFolder.path}/${name}`,
      children: []
    };

    toast({
      title: "Folder created",
      description: `Created new folder: ${name}`
    });

    // In a real app, this would update the backend
    console.log("Created folder:", newFolder);
  };

  const handleUploadFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      const newFile: FileItem = {
        id: `file-${Date.now()}`,
        name: file.name,
        type: file.type.includes('image') ? 'image' : 'document',
        path: `${selectedFolder.path}/${file.name}`,
        size: `${Math.round(file.size / 1024)} KB`,
        modified: new Date().toLocaleDateString()
      };

      toast({
        title: "File uploaded",
        description: `Uploaded: ${file.name}`
      });

      // In a real app, this would upload to the backend
      console.log("Uploaded file:", newFile);
    });
  };

  return {
    isNewFolderDialogOpen,
    setIsNewFolderDialogOpen,
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    handleCreateFolder,
    handleUploadFiles
  };
};
