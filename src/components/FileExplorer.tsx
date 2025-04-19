
import { Separator } from "@/components/ui/separator";
import { FileTree } from "./FileTree";
import { ExplorerHeader } from "./file-explorer/ExplorerHeader";
import { ExplorerTabs } from "./file-explorer/ExplorerTabs";
import { useFileSystem } from "@/hooks/useFileSystem";

interface FileExplorerProps {
  viewMode: "grid" | "list";
}

export const FileExplorer = ({ viewMode }: FileExplorerProps) => {
  const {
    activeTab,
    setActiveTab,
    selectedFolderId,
    setSelectedFolderId,
    selectedFolder,
    displayItems,
    fileSystem
  } = useFileSystem();

  return (
    <div className="flex h-full">
      <div className="w-64 border-r p-4 h-full">
        <FileTree 
          fileSystem={fileSystem} 
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
        />
      </div>
      
      <div className="flex-1 flex flex-col">
        <ExplorerHeader 
          selectedFolder={selectedFolder}
          displayItems={displayItems}
        />
        
        <Separator />
        
        <ExplorerTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          displayItems={displayItems}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
};
