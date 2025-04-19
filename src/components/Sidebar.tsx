import React, { useMemo } from "react";
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

const SidebarItem = React.memo(({ icon, label, active, onClick }: SidebarItemProps) => {
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
});

SidebarItem.displayName = "SidebarItem";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Sidebar = ({ activePage, onNavigate }: SidebarProps) => {
  const menuItems = useMemo(
    () => [
      { icon: <Home size={20} />, label: "Home", page: "home" },
      { icon: <FolderOpen size={20} />, label: "Files", page: "files" },
      { icon: <Star size={20} />, label: "Starred", page: "starred" },
      { icon: <FileText size={20} />, label: "Documents", page: "documents" },
      { icon: <Users size={20} />, label: "Shared", page: "shared" },
      { icon: <Search size={20} />, label: "Search", page: "search" },
    ],
    []
  );

  const actionItems = useMemo(
    () => [
      { icon: <Plus size={20} />, label: "Create", page: "create" },
      { icon: <Upload size={20} />, label: "Upload", page: "upload" },
      { icon: <Settings size={20} />, label: "Settings", page: "settings" },
    ],
    []
  );

  return (
    <div className="w-16 h-screen flex flex-col items-center py-4 bg-card border-r">
      <div className="mb-6 text-primary text-2xl font-bold">P</div>
      <nav className="flex flex-col space-y-2">
        {menuItems.map(({ icon, label, page }) => (
          <SidebarItem
            key={page}
            icon={icon}
            label={label}
            active={activePage === page}
            onClick={() => onNavigate(page)}
          />
        ))}
      </nav>
      <div className="mt-auto flex flex-col space-y-2">
        {actionItems.map(({ icon, label, page }) => (
          <SidebarItem
            key={page}
            icon={icon}
            label={label}
            active={activePage === page}
            onClick={() => onNavigate(page)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
