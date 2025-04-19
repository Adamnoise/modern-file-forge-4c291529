
import React, { useState, useEffect } from 'react';
import { FileItem } from '@/types/file';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import TextEditor from './TextEditor';
import { Edit, Download, FileText } from 'lucide-react';

interface FilePreviewProps {
  file: FileItem;
  onEdit?: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const renderPreview = () => {
    switch (file.type) {
      case 'image':
        return (
          <div className="mt-2">
            <AspectRatio ratio={16 / 9} className="bg-muted">
              {file.url && (
                <img 
                  src={file.url} 
                  alt={file.name} 
                  className="rounded-md object-contain w-full h-full"
                />
              )}
            </AspectRatio>
          </div>
        );
        
      case 'document':
        if (isEditing) {
          return (
            <TextEditor 
              content={file.content || ''} 
              file={file}
              onClose={() => setIsEditing(false)}
            />
          );
        }
        return (
          <ScrollArea className="h-[50vh] mt-4 rounded-md border p-4">
            <div className="prose max-w-none dark:prose-invert">
              {file.content?.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </ScrollArea>
        );
        
      case 'pdf':
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-md mt-4">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">PDF preview not supported</p>
            {file.url && (
              <Button className="mt-4" asChild>
                <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </a>
              </Button>
            )}
          </div>
        );
        
      case 'audio':
        return (
          <div className="mt-4">
            {file.url && (
              <audio controls className="w-full">
                <source src={file.url} />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        );
        
      case 'video':
        return (
          <div className="mt-4">
            {file.url && (
              <video 
                controls 
                className="w-full rounded-md"
                style={{ maxHeight: '50vh' }}
              >
                <source src={file.url} />
                Your browser does not support the video element.
              </video>
            )}
          </div>
        );
        
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-md mt-4">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Preview not available for this file type</p>
            {file.url && (
              <Button className="mt-4" asChild>
                <a href={file.url} download={file.name}>
                  <Download className="mr-2 h-4 w-4" />
                  Download File
                </a>
              </Button>
            )}
          </div>
        );
    }
  };
  
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    
    const KB = 1024;
    const MB = KB * 1024;
    
    if (bytes < KB) {
      return `${bytes} bytes`;
    } else if (bytes < MB) {
      return `${(bytes / KB).toFixed(1)} KB`;
    } else {
      return `${(bytes / MB).toFixed(1)} MB`;
    }
  };
  
  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>{file.name}</DialogTitle>
      </DialogHeader>
      
      <div className="mt-2 text-sm text-muted-foreground">
        <p>Type: {file.type.charAt(0).toUpperCase() + file.type.slice(1)}</p>
        {file.size && <p>Size: {formatFileSize(file.size)}</p>}
        <p>Created: {file.createdAt.toLocaleString()}</p>
        <p>Modified: {file.modifiedAt.toLocaleString()}</p>
      </div>
      
      {renderPreview()}
      
      <DialogFooter>
        {file.type === 'document' && !isEditing && (
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Document
          </Button>
        )}
        
        {!isEditing && (
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

export default FilePreview;
