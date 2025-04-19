
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  FileText,
  FolderOpen,
  Home,
  Plus,
  Search,
  Settings,
  Star,
  Upload,
  Users
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, label, active, onClick }: SidebarItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={active ? "default" : "ghost"}
            size="icon"
            className="w-12 h-12 rounded-md"
            onClick={onClick}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Sidebar = ({ activePage, onNavigate }: SidebarProps) => {
  return (
    <div className="w-16 h-screen flex flex-col items-center py-4 bg-card border-r">
      <div className="mb-6 text-primary text-2xl font-bold">P</div>
      <nav className="flex flex-col space-y-2">
        <SidebarItem 
          icon={<Home size={20} />} 
          label="Home" 
          active={activePage === "home"} 
          onClick={() => onNavigate("home")} 
        />
        <SidebarItem 
          icon={<FolderOpen size={20} />} 
          label="Files" 
          active={activePage === "files"} 
          onClick={() => onNavigate("files")} 
        />
        <SidebarItem 
          icon={<Star size={20} />} 
          label="Starred" 
          active={activePage === "starred"} 
          onClick={() => onNavigate("starred")} 
        />
        <SidebarItem 
          icon={<FileText size={20} />} 
          label="Documents" 
          active={activePage === "documents"} 
          onClick={() => onNavigate("documents")} 
        />
        <SidebarItem 
          icon={<Users size={20} />} 
          label="Shared" 
          active={activePage === "shared"} 
          onClick={() => onNavigate("shared")} 
        />
        <SidebarItem 
          icon={<Search size={20} />} 
          label="Search" 
          active={activePage === "search"} 
          onClick={() => onNavigate("search")} 
        />
      </nav>
      <div className="mt-auto flex flex-col space-y-2">
        <SidebarItem 
          icon={<Plus size={20} />} 
          label="Create" 
          onClick={() => onNavigate("create")} 
        />
        <SidebarItem 
          icon={<Upload size={20} />} 
          label="Upload" 
          onClick={() => onNavigate("upload")} 
        />
        <SidebarItem 
          icon={<Settings size={20} />} 
          label="Settings" 
          active={activePage === "settings"} 
          onClick={() => onNavigate("settings")} 
        />
      </div>
    </div>
  );
};

export default Sidebar;
