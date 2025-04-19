
import { useMemo } from 'react';
import { FileItem, FolderItem } from '../types/file-system';

export const useFileFilters = (fileSystem: FolderItem, selectedFolder: FolderItem, activeTab: string) => {
  const findStarredFiles = (item: FileItem | FolderItem): (FileItem | FolderItem)[] => {
    if (item.type === "folder") {
      return [
        ...(item.starred ? [item] : []),
        ...item.children.flatMap(findStarredFiles)
      ];
    }
    return item.starred ? [item] : [];
  };

  const findSharedFiles = (item: FileItem | FolderItem): (FileItem | FolderItem)[] => {
    if (item.type === "folder") {
      return [
        ...(item.shared ? [item] : []),
        ...item.children.flatMap(findSharedFiles)
      ];
    }
    return item.shared ? [item] : [];
  };

  const starredFiles = useMemo(() => findStarredFiles(fileSystem), [fileSystem]);
  const sharedFiles = useMemo(() => findSharedFiles(fileSystem), [fileSystem]);

  const displayItems = useMemo(() => {
    switch (activeTab) {
      case "recent":
        return [...selectedFolder.children].sort((a, b) => {
          if (a.modified && b.modified) {
            return new Date(b.modified).getTime() - new Date(a.modified).getTime();
          }
          return 0;
        });
      case "starred":
        return starredFiles;
      case "shared":
        return sharedFiles;
      default:
        return selectedFolder.children;
    }
  }, [activeTab, selectedFolder, starredFiles, sharedFiles]);

  return { displayItems, starredFiles, sharedFiles };
};
