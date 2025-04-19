
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileGrid } from "../FileGrid";
import { FileList } from "../FileList";
import { FileItem, FolderItem } from "@/types/file-system";

interface ExplorerTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  displayItems: (FileItem | FolderItem)[];
  viewMode: "grid" | "list";
}

export const ExplorerTabs = ({ activeTab, setActiveTab, displayItems, viewMode }: ExplorerTabsProps) => {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex-1">
      <div className="px-4 pt-2">
        <TabsList>
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>
      </div>
      
      {["all", "recent", "starred", "shared"].map((tab) => (
        <TabsContent key={tab} value={tab} className="flex-1 p-4">
          {viewMode === "grid" ? (
            <FileGrid items={displayItems} />
          ) : (
            <FileList items={displayItems} />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};
