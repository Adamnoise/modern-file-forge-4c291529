
import React, { useRef, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, AlertTriangle } from "lucide-react";
import { useFiles } from "@/context/FileContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (files: { path: string; publicUrl: string }[]) => Promise<void>;
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

export const UploadDialog = ({ isOpen, onClose, onUpload }: UploadDialogProps) => {
  const { uploadFile, isUploading } = useFiles();
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication status when dialog opens
  useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    setIsAuthenticated(!!data.session);
  }, [isOpen]);

  // Run the auth check when the dialog opens
  React.useEffect(() => {
    if (isOpen) {
      const checkAuth = async () => {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      };
      checkAuth();
    }
  }, [isOpen]);

  const handleFileSelect = useCallback(
    async (files: FileList) => {
      if (!files || files.length === 0) {
        setError("No files selected. Please try again.");
        return;
      }

      setError(null);
      
      try {
        // Upload each file one by one
        for (let i = 0; i < files.length; i++) {
          await uploadFile(files[i]);
        }
        onClose();
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred during upload.");
        }
      }
    },
    [uploadFile, onClose]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Drag and drop files or click to browse. You need to be logged in to upload files.
          </DialogDescription>
        </DialogHeader>

        {isAuthenticated === false && (
          <Alert className="bg-amber-50 border-amber-200 my-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Authentication required. You need to sign in or create an account before uploading files.
            </AlertDescription>
          </Alert>
        )}

        <div className="py-4">
          <FileDropZone 
            onFileSelect={handleFileSelect} 
            disabled={isUploading || isAuthenticated === false}
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
