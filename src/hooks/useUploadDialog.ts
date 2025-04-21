import { useState, useCallback } from 'react';
import { useFiles } from "@/context/FileContext";

export const useUploadDialog = (onClose: () => void) => {
  const { uploadFile, isUploading } = useFiles();
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(
    async (files: FileList) => {
      if (!files || files.length === 0) {
        setError("No files selected. Please try again.");
        return;
      }

      setError(null);

      try {
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

  return {
    handleFileSelect,
    error,
    isUploading
  };
};
</lov-write>

2. Now, let's create a separate component for the file drop zone:

