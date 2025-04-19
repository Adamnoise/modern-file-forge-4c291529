
import React, { useRef, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (files: { path: string; publicUrl: string }[]) => void;
}

const FileDropZone = ({
  onFileSelect,
  disabled
}: {
  onFileSelect: (files: FileList) => void;
  disabled?: boolean;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFileSelect(e.target.files);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFileSelect(e.dataTransfer.files);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : 
        isDragging ? "border-primary bg-primary/10" : "hover:border-primary"
      }`}
      onClick={disabled ? undefined : () => fileInputRef.current?.click()}
      onDragOver={disabled ? undefined : handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={disabled ? undefined : handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        disabled={disabled}
      />
      <Upload className="mx-auto mb-4" />
      <p>
        {disabled 
          ? "Uploading..." 
          : isDragging 
            ? "Drop files here to upload" 
            : "Click to select files or drag and drop"}
      </p>
    </div>
  );
};

export const UploadDialog = ({ 
  isOpen, 
  onClose, 
  onUpload 
}: UploadDialogProps) => {
  const { uploadFile, isUploading } = useFileUpload();
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(
    async (files: FileList) => {
      if (!files || files.length === 0) {
        setError("No files selected. Please try again.");
        return;
      }

      setError(null);
      
      const uploadPromises = Array.from(files).map(file => 
        uploadFile(file)
      );

      const uploadedFiles = await Promise.all(uploadPromises);
      const validFiles = uploadedFiles.filter(file => file !== null);

      if (validFiles.length > 0 && onUpload) {
        onUpload(validFiles as { path: string; publicUrl: string }[]);
      }

      onClose();
    },
    [uploadFile, onUpload, onClose]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <FileDropZone 
            onFileSelect={handleFileSelect} 
            disabled={isUploading}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isUploading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
