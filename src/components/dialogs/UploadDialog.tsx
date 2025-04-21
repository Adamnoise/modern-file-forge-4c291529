
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
import { Upload } from "lucide-react";
import { useFiles } from "@/context/FileContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (files: { path: string; publicUrl: string }[]) => Promise<void>;
}

const FileDropZone = ({
  onFileSelect,
  disabled,
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
        disabled
          ? "opacity-50 cursor-not-allowed"
          : isDragging
          ? "border-primary bg-primary/10"
          : "hover:border-primary"
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
  const [authError, setAuthError] = useState<boolean>(false);

  // Check authentication status when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      checkAuthStatus();
    }
  }, [isOpen]);

  const checkAuthStatus = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setAuthError(false);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      setAuthError(true);
    }
  };

  const handleFileSelect = useCallback(
    async (files: FileList) => {
      if (!files || files.length === 0) {
        setError("No files selected. Please try again.");
        return;
      }

      // Double-check authentication before upload
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setIsAuthenticated(false);
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
            Drag and drop files or click to browse.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isAuthenticated === false && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle className="flex items-center">
                Authentication Required
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto h-6 w-6 p-0" 
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertTitle>
              <AlertDescription>
                You need to be logged in to upload files.
              </AlertDescription>
            </Alert>
          )}
          
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                There was a problem checking your authentication status. Please try again.
              </AlertDescription>
            </Alert>
          )}
          
          {isAuthenticated !== false && (
            <FileDropZone
              onFileSelect={handleFileSelect}
              disabled={isUploading || isAuthenticated === false}
            />
          )}
          
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
