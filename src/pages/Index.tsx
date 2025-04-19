import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { FileExplorer } from "@/components/FileExplorer";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [activePage, setActivePage] = useState("files");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  // Initialize dark mode based on system preference
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);

    if (prefersDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleNavigate = useCallback((page: string) => {
    setActivePage(page);

    toast({
      title: `Navigated to ${page.charAt(0).toUpperCase() + page.slice(1)}`,
      description: `You are now viewing the ${page} section.`,
      duration: 2000,
    });
  }, [toast]);

  const handleSearch = useCallback((query: string) => {
    toast({
      title: "Search initiated",
      description: `Searching for "${query}"`,
      duration: 2000,
    });
  }, [toast]);

  const toggleTheme = useCallback(() => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark");

    toast({
      title: `Theme changed to ${newDarkMode ? "dark" : "light"} mode`,
      duration: 2000,
    });
  }, [isDarkMode, toast]);

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />

      <div className="flex-1 flex flex-col">
        <Header
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onSearch={handleSearch}
          onToggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
        />

        <main className="flex-1 overflow-auto">
          <FileExplorer viewMode={viewMode} />
        </main>
      </div>
    </div>
  );
};

export default Index;
