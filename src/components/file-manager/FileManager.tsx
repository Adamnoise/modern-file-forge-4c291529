
import { FileHeader } from "./FileHeader";
import { FileList } from "./FileList";
import { useFiles } from "@/context/FileContext";

export const FileManager = () => {
  const { currentFolder, breadcrumbs } = useFiles();

  return (
    <div className="space-y-4">
      <FileHeader currentFolder={currentFolder} breadcrumbs={breadcrumbs} />
      <FileList />
    </div>
  );
};
