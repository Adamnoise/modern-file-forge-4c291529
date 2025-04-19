
import { FileProvider } from "@/context/FileContext";
import { FileManager } from "@/components/file-manager/FileManager";

const Index = () => {
  return (
    <FileProvider>
      <div className="min-h-screen bg-background p-4">
        <FileManager />
      </div>
    </FileProvider>
  );
};

export default Index;
