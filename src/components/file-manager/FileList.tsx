
import { useFiles } from "@/context/FileContext";
import { FileCard } from "./FileCard";
import { FolderCard } from "./FolderCard";

export const FileList = () => {
  const { currentFolder, getFilesInFolder, getFoldersInFolder } = useFiles();
  
  const files = getFilesInFolder(currentFolder);
  const folders = getFoldersInFolder(currentFolder);

  if (files.length === 0 && folders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-lg text-gray-500">This folder is empty</p>
        <p className="text-sm text-gray-400">Create a new file or folder to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {folders.map((folder) => (
        <FolderCard key={folder.id} folder={folder} />
      ))}
      {files.map((file) => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  );
};
