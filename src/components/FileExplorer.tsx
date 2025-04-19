import React, { memo } from "react";
import { Separator } from "@/components/ui/separator";
import { FileTree } from "./FileTree";
import { ExplorerHeader } from "./file-explorer/ExplorerHeader";
import { ExplorerTabs } from "./file-explorer/ExplorerTabs";
import { useFileSystem } from "@/hooks/useFileSystem";

// Típusdefiníció
interface FileExplorerProps {
  viewMode: "grid" | "list";
}

// Oldalsáv komponens
const Sidebar = memo(({ fileSystem, selectedFolderId, setSelectedFolderId }: any) => (
  <div className="w-64 border-r p-4 h-full">
    <FileTree 
      fileSystem={fileSystem} 
      selectedFolderId={selectedFolderId}
      onSelectFolder={setSelectedFolderId}
    />
  </div>
));

Sidebar.displayName = "Sidebar";

// Fő tartalom komponens
const MainContent = memo(
  ({ selectedFolder, displayItems, activeTab, setActiveTab, viewMode }: any) => (
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
  )
);

MainContent.displayName = "MainContent";

// Fő FileExplorer komponens
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
      <Sidebar 
        fileSystem={fileSystem}
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={setSelectedFolderId}
      />
      
      <MainContent 
        selectedFolder={selectedFolder}
        displayItems={displayItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
      />
    </div>
  );
};
