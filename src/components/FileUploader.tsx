
import React, { useState, useRef } from 'react';
import { useFiles } from '@/context/FileContext';
import { FileType } from '@/types/file';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  className?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ className }) => {
  const { addFile } = useFiles();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  
  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      const fileName = file.name;
      const fileType = getFileType(fileName);
      
      addFile(fileName, fileType, undefined, file);
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const getFileType = (fileName: string): FileType => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return 'image';
    } else if (['pdf'].includes(extension)) {
      return 'pdf';
    } else if (['mp3', 'wav', 'ogg'].includes(extension)) {
      return 'audio';
    } else if (['mp4', 'webm', 'mov'].includes(extension)) {
      return 'video';
    } else if (['xlsx', 'xls', 'csv'].includes(extension)) {
      return 'spreadsheet';
    } else if (['doc', 'docx', 'txt', 'md'].includes(extension)) {
      return 'document';
    }
    
    return 'other';
  };
  
  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-border",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Drag & Drop Files</h3>
      <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        multiple
      />
      
      <Button 
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
      >
        Select Files
      </Button>
    </div>
  );
};

export default FileUploader;
