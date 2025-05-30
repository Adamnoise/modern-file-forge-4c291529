import React, { useCallback, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Grid2X2, List, Search, Bell, Moon, Sun } from "lucide-react";

interface HeaderProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onSearch: (query: string) => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

const HeaderSearch = React.memo(({ onSearch }: { onSearch: (query: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(searchQuery);
    },
    [onSearch, searchQuery]
  );

  return (
    <form onSubmit={handleSearch} className="relative w-96">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search files and folders..."
        className="pl-8 w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </form>
  );
});

HeaderSearch.displayName = "HeaderSearch";

const HeaderViewMode = React.memo(
  ({
    viewMode,
    onViewModeChange,
  }: {
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;
  }) => {
    return (
      <div className="border rounded-md p-0.5 flex">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => onViewModeChange("grid")}
        >
          <Grid2X2 size={18} />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => onViewModeChange("list")}
        >
          <List size={18} />
        </Button>
      </div>
    );
  }
);

HeaderViewMode.displayName = "HeaderViewMode";

const HeaderProfileMenu = React.memo(() => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Help</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

HeaderProfileMenu.displayName = "HeaderProfileMenu";

const Header = ({
  viewMode,
  onViewModeChange,
  onSearch,
  onToggleTheme,
  isDarkMode,
}: HeaderProps) => {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <HeaderSearch onSearch={onSearch} />
      <div className="flex items-center space-x-2">
        <HeaderViewMode viewMode={viewMode} onViewModeChange={onViewModeChange} />
        <Button variant="ghost" size="icon" onClick={onToggleTheme}>
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        <Button variant="ghost" size="icon">
          <Bell size={18} />
        </Button>
        <HeaderProfileMenu />
      </div>
    </header>
  );
};

export default React.memo(Header);
