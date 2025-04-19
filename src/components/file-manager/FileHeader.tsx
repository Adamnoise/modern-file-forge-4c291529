
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateFileDialog } from "./CreateFileDialog";
import { useState } from "react";
import { CreateFolderDialog } from "./CreateFolderDialog";

interface FileHeaderProps {
  currentFolder: string | null;
  breadcrumbs: Array<{ id: string; name: string; }>;
}

export const FileHeader = ({ currentFolder, breadcrumbs }: FileHeaderProps) => {
  const [createFileOpen, setCreateFileOpen] = useState(false);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">File Manager</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => setCreateFolderOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <Button 
            onClick={() => setCreateFileOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New File
          </Button>
        </div>
      </div>
      
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          {breadcrumbs.map((item, index) => (
            <li key={item.id} className="inline-flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
              <span className="text-sm font-medium text-gray-700 hover:text-gray-900">
                {item.name}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <CreateFileDialog
        open={createFileOpen}
        onOpenChange={setCreateFileOpen}
      />
      <CreateFolderDialog
        open={createFolderOpen}
        onOpenChange={setCreateFolderOpen}
      />
    </div>
  );
};
