
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { FileItem, FolderItem } from "@/types/file-system";
import { useFileUpload } from './useFileUpload';

export const useFileOperations = (
  selectedFolder: FolderItem,
  fileSystem: FolderItem
) => {
  const { toast } = useToast();
  const { uploadFile } = useFileUpload();
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

    console.log("Created folder:", newFolder);
  };

  const handleUploadFiles = async (files: { path: string; publicUrl: string }[]) => {
    files.forEach(file => {
      const newFile: FileItem = {
        id: `file-${Date.now()}`,
        name: file.path.split('/').pop() || 'Uploaded File',
        type: file.path.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' : 'document',
        path: file.path,
        size: 'Unknown',
        modified: new Date().toLocaleDateString(),
        url: file.publicUrl
      };

      toast({
        title: "File uploaded",
        description: `Uploaded: ${newFile.name}`
      });

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
