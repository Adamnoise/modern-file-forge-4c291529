
import { Button } from "@/components/ui/button";
import { FolderPlus, Upload } from "lucide-react";
import { FileItem, FolderItem } from "@/types/file-system";
import { NewFolderDialog } from "@/components/dialogs/NewFolderDialog";
import { UploadDialog } from "@/components/dialogs/UploadDialog";
import { useFileOperations } from "@/hooks/useFileOperations";

interface ExplorerHeaderProps {
  selectedFolder: FolderItem;
  displayItems: (FileItem | FolderItem)[];
}

export const ExplorerHeader = ({ selectedFolder, displayItems }: ExplorerHeaderProps) => {
  const {
    isNewFolderDialogOpen,
    setIsNewFolderDialogOpen,
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    handleCreateFolder,
    handleUploadFiles
  } = useFileOperations(selectedFolder, selectedFolder);

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold">{selectedFolder.name}</h1>
          <span className="text-sm text-muted-foreground">
            {displayItems.length} items
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsNewFolderDialogOpen(true)}
          >
            <FolderPlus size={16} className="mr-2" />
            New Folder
          </Button>
          <Button 
            size="sm"
            onClick={() => setIsUploadDialogOpen(true)}
          >
            <Upload size={16} className="mr-2" />
            Upload
          </Button>
        </div>
      </div>

      <NewFolderDialog
        isOpen={isNewFolderDialogOpen}
        onClose={() => setIsNewFolderDialogOpen(false)}
        onCreateFolder={handleCreateFolder}
      />

      <UploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUpload={handleUploadFiles}
      />
    </>
  );
};
