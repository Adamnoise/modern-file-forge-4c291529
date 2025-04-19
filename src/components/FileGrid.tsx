
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  FileText, 
  Image, 
  File, 
  Folder, 
  MoreVertical, 
  Star, 
  Edit, 
  Copy, 
  Download, 
  Share, 
  Trash 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FileItem, FolderItem } from "./FileList";

interface FileGridProps {
  items: (FileItem | FolderItem)[];
}

export const FileGrid = ({ items }: FileGridProps) => {
  const getFileIcon = (type: string) => {
    switch (type) {
      case "folder":
        return <Folder className="h-10 w-10 text-blue-500" />;
      case "image":
        return <Image className="h-10 w-10 text-green-500" />;
      case "document":
      case "pdf":
      case "text":
        return <FileText className="h-10 w-10 text-purple-500" />;
      default:
        return <File className="h-10 w-10 text-gray-500" />;
    }
  };

  const getFileExtension = (name: string) => {
    const parts = name.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1].toUpperCase();
    }
    return '';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="group">
          <CardContent className="p-4 flex flex-col items-center">
            <div 
              className={cn(
                "w-full h-32 flex items-center justify-center rounded-md mb-2",
                item.type === "folder" ? "bg-blue-50 dark:bg-blue-900/20" : "bg-gray-50 dark:bg-gray-900/20"
              )}
            >
              {getFileIcon(item.type)}
            </div>
            <div className="w-full flex items-center justify-between mt-2">
              <div className="truncate font-medium text-sm">{item.name}</div>
              <DropdownMenu>
                <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 focus:opacity-100">
                  <MoreVertical size={16} className="text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Star size={14} className="mr-2" /> Star
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit size={14} className="mr-2" /> Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy size={14} className="mr-2" /> Copy
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download size={14} className="mr-2" /> Download
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share size={14} className="mr-2" /> Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash size={14} className="mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
          <CardFooter className="px-4 py-2 border-t text-xs text-muted-foreground flex justify-between">
            {item.type === "folder" ? (
              <span>{(item as FolderItem).children.length} items</span>
            ) : (
              <span>{(item as FileItem).size || getFileExtension(item.name)}</span>
            )}
            <span>{item.modified || "—"}</span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
