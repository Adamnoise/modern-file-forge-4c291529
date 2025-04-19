
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FileItem, FolderItem } from "./FileList";

interface FolderItemProps {
  folder: FolderItem;
  depth: number;
  selectedFolderId: string;
  onSelectFolder: (id: string) => void;
}

const FolderItemComponent = ({ folder, depth, selectedFolderId, onSelectFolder }: FolderItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isSelected = folder.id === selectedFolderId;
  const hasChildren = folder.children.some(child => child.type === "folder");
  
  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    onSelectFolder(folder.id);
  };

  return (
    <div>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start font-normal h-8 px-2",
          isSelected && "bg-muted",
          depth > 0 && `pl-${depth * 4 + 2}`
        )}
        onClick={toggleOpen}
      >
        <div className="flex items-center w-full">
          {hasChildren ? (
            <div className="mr-1 text-muted-foreground">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          ) : (
            <div className="w-4 mr-1" />
          )}
          <div className="mr-2 text-muted-foreground">
            {isOpen ? <FolderOpen size={16} /> : <Folder size={16} />}
          </div>
          <span className="truncate">{folder.name}</span>
        </div>
      </Button>
      
      {isOpen && folder.children.map(child => (
        child.type === "folder" && (
          <FolderItemComponent
            key={child.id}
            folder={child as FolderItem}
            depth={depth + 1}
            selectedFolderId={selectedFolderId}
            onSelectFolder={onSelectFolder}
          />
        )
      ))}
    </div>
  );
};

interface FileTreeProps {
  fileSystem: FolderItem;
  selectedFolderId: string;
  onSelectFolder: (id: string) => void;
}

export const FileTree = ({ fileSystem, selectedFolderId, onSelectFolder }: FileTreeProps) => {
  return (
    <div className="space-y-1">
      <FolderItemComponent
        folder={fileSystem}
        depth={0}
        selectedFolderId={selectedFolderId}
        onSelectFolder={onSelectFolder}
      />
    </div>
  );
};
