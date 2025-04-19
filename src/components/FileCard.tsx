
import React from 'react';
import { 
  FileText, 
  FolderOpen, 
  Image, 
  FileSpreadsheet,
  FilePlus, 
  File, 
  MoreVertical,
  FilePdf,
  FileAudio,
  FileVideo
} from 'lucide-react';
import { FileItem, Folder } from '@/types/file';
import { formatDistanceToNow } from 'date-fns';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useFiles } from '@/context/FileContext';
import { Button } from '@/components/ui/button';

interface FileCardProps {
  item: FileItem | Folder;
  isFolder: boolean;
  onClick: () => void;
}

const FileCard: React.FC<FileCardProps> = ({ item, isFolder, onClick }) => {
  const { deleteItem } = useFiles();
  
  const getIcon = () => {
    if (isFolder) return <FolderOpen className="file-icon h-12 w-12" />;
    
    const fileItem = item as FileItem;
    switch (fileItem.type) {
      case 'document':
        return <FileText className="file-icon h-12 w-12" />;
      case 'image':
        return <Image className="file-icon h-12 w-12" />;
      case 'pdf':
        return <FilePdf className="file-icon h-12 w-12" />;
      case 'audio':
        return <FileAudio className="file-icon h-12 w-12" />;
      case 'video':
        return <FileVideo className="file-icon h-12 w-12" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="file-icon h-12 w-12" />;
      default:
        return <File className="file-icon h-12 w-12" />;
    }
  };
  
  const getTimeAgo = () => {
    if ('modifiedAt' in item) {
      return formatDistanceToNow(new Date(item.modifiedAt), { addSuffix: true });
    }
    return formatDistanceToNow(new Date(item.createdAt), { addSuffix: true });
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteItem(item.id, isFolder);
  };
  
  return (
    <Card 
      className={`file-card ${isFolder ? 'folder-card' : ''} cursor-pointer`}
      onClick={onClick}
    >
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {getIcon()}
      
      <div className="w-full">
        <h3 className="file-name">{item.name}</h3>
        <p className="file-meta">{getTimeAgo()}</p>
      </div>
    </Card>
  );
};

export default FileCard;
