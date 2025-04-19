
import { useFileSystemState } from './useFileSystemState';
import { useFileFilters } from './useFileFilters';

export const useFileSystem = () => {
  const {
    activeTab,
    setActiveTab,
    selectedFolderId,
    setSelectedFolderId,
    selectedFolder,
    fileSystem
  } = useFileSystemState();

  const { displayItems } = useFileFilters(fileSystem, selectedFolder, activeTab);

  return {
    activeTab,
    setActiveTab,
    selectedFolderId,
    setSelectedFolderId,
    selectedFolder,
    displayItems,
    fileSystem
  };
};
