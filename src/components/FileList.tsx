import React, { useCallback, memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Image,
  File,
  Folder,
  MoreHorizontal,
  Star,
  Edit,
  Copy,
  Download,
  Share,
  Trash,
  Users,
} from "lucide-react";

// Common properties for both file and folder items
interface BaseItem {
  id: string;
  name: string;
  type: string;
  path: string;
  starred?: boolean;
  shared?: boolean;
  modified?: string;
}

// File-specific properties
export interface FileItem extends BaseItem {
  size?: string;
}

// Folder-specific properties
export interface FolderItem extends BaseItem {
  type: "folder";
  children: (FileItem | FolderItem)[];
  size?: never; // Folders don't have a direct size property
}

interface FileListProps {
  items: (FileItem | FolderItem)[];
}

// Icon mapping for file types
const ICONS = {
  folder: <Folder className="h-4 w-4 text-blue-500" />,
  image: <Image className="h-4 w-4 text-green-500" />,
  document: <FileText className="h-4 w-4 text-purple-500" />,
  pdf: <FileText className="h-4 w-4 text-purple-500" />,
  text: <FileText className="h-4 w-4 text-purple-500" />,
  default: <File className="h-4 w-4 text-gray-500" />,
};

// Memoized function to get file icon
const getFileIcon = (type: string) => ICONS[type] || ICONS.default;

// Dropdown menu component
const FileDropdownMenu = memo(() => (
  <DropdownMenu>
    <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 focus:opacity-100">
      <MoreHorizontal size={16} className="text-muted-foreground" />
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
));

FileDropdownMenu.displayName = "FileDropdownMenu";

export const FileList = memo(({ items }: FileListProps) => {
  const renderRow = useCallback(
    (item: FileItem | FolderItem) => {
      const isFolder = item.type === "folder";

      return (
        <TableRow key={item.id} className="group">
          <TableCell className="font-medium">
            <div className="flex items-center">
              {getFileIcon(item.type)}
              <span className="ml-2">{item.name}</span>
              {item.starred && <Star className="h-3 w-3 ml-2 text-yellow-500 fill-yellow-500" />}
              {item.shared && <Users className="h-3 w-3 ml-2 text-blue-500" />}
            </div>
          </TableCell>
          <TableCell>{isFolder ? "Folder" : capitalize(item.type)}</TableCell>
          <TableCell>
            {isFolder ? `${(item as FolderItem).children.length} items` : (item as FileItem).size}
          </TableCell>
          <TableCell>{item.modified || "—"}</TableCell>
          <TableCell>
            <FileDropdownMenu />
          </TableCell>
        </TableRow>
      );
    },
    []
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[500px]">Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Modified</TableHead>
          <TableHead className="w-[70px]" />
        </TableRow>
      </TableHeader>
      <TableBody>{items.map(renderRow)}</TableBody>
    </Table>
  );
});

FileList.displayName = "FileList";

// Utility function to capitalize a string
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
