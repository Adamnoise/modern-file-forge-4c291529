
import React from 'react';
import { useFiles } from '@/context/FileContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FolderRoot, 
  FolderOpen, 
  FolderPlus, 
  File, 
  FileText, 
  Upload, 
  HomeIcon, 
  Folder
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import CreateFileModal from './CreateFileModal';

const Sidebar = () => {
  const { folders, navigateToFolder, currentFolder, getFoldersInFolder } = useFiles();
  
  // Get all top-level folders
  const rootFolders = getFoldersInFolder(null);
  
  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground border-r flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <File className="text-forge-500" />
          File Forge
        </h1>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <div className="p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:text-white hover:bg-sidebar-accent mb-2"
          onClick={() => navigateToFolder(null)}
        >
          <HomeIcon className="mr-2 h-4 w-4" />
          Home
        </Button>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <Dialog>
        <div className="flex items-center justify-between p-4">
          <h2 className="text-sm font-semibold">Quick Actions</h2>
        </div>
        
        <div className="px-3 pb-2">
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full justify-start mb-2 bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground">
              <FileText className="mr-2 h-4 w-4" />
              New Document
            </Button>
          </DialogTrigger>
          
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full justify-start mb-2 bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground">
              <FolderPlus className="mr-2 h-4 w-4" />
              New Folder
            </Button>
          </DialogTrigger>
          
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full justify-start bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground">
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </DialogTrigger>
        </div>
      
        <CreateFileModal />
      </Dialog>
      
      <Separator className="bg-sidebar-border my-2" />
      
      <div className="px-4 py-2">
        <h2 className="text-sm font-semibold">Folders</h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="px-3 py-2">
          {rootFolders.length > 0 ? (
            rootFolders.map((folder) => (
              <Button
                key={folder.id}
                variant="ghost"
                size="sm"
                className="w-full justify-start mb-2 text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
                onClick={() => navigateToFolder(folder.id)}
              >
                <Folder className="mr-2 h-4 w-4" />
                {folder.name}
              </Button>
            ))
          ) : (
            <p className="text-sm text-sidebar-foreground/70 px-2">
              No folders yet
            </p>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 text-xs text-sidebar-foreground/70">
        <p>File Forge v1.0</p>
      </div>
    </div>
  );
};

export default Sidebar;
