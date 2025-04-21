
import React, { useRef, useState, useCallback } from "react";
import { Upload } from "lucide-react";

interface FileDropZoneProps {
  onFileSelect: (files: FileList) => void;
  disabled?: boolean;
}

export const FileDropZone = ({
  onFileSelect,
  disabled,
}: FileDropZoneProps) => {
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
