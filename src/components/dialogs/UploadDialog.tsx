
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileDropZone } from "@/components/upload/FileDropZone";
import { useUploadDialog } from "@/hooks/useUploadDialog";

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (files: { path: string; publicUrl: string }[]) => Promise<void>;
}

export const UploadDialog = ({ isOpen, onClose, onUpload }: UploadDialogProps) => {
  const { handleFileSelect, error, isUploading } = useUploadDialog(onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Drag and drop files or click to browse.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <FileDropZone
            onFileSelect={handleFileSelect}
            disabled={isUploading}
          />
          
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
