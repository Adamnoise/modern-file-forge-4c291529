
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { FileItem, FolderItem } from "@/types/file-system";
import { useFileUpload } from './useFileUpload';
import { v4 as uuidv4 } from 'uuid';

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
      id: `folder-${uuidv4()}`,
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
      const fileType = file.path.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' : 'document';
      const newFile: FileItem = {
        id: `file-${uuidv4()}`,
        name: file.path.split('/').pop() || 'Uploaded File',
        type: fileType,
        path: file.path,
        size: 'Unknown',
        modified: new Date().toLocaleDateString()
      };

      // If the file has a public URL, store it in a valid property
      if (file.publicUrl) {
        // Using type assertion to add url to the FileItem
        (newFile as FileItem & { url: string }).url = file.publicUrl;
      }

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
