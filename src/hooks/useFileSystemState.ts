import { useState, useMemo } from 'react';
import { FileItem, FolderItem } from '../types/file-system';

export const useFileSystemState = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedFolderId, setSelectedFolderId] = useState("root");
  
  const fileSystem: FolderItem = useMemo(() => ({
    id: "root",
    name: "My Files",
    type: "folder",
    path: "/",
    children: [
      {
        id: "folder1",
        name: "Documents",
        type: "folder",
        path: "/Documents",
        children: [
          {
            id: "file1",
            name: "Project Proposal.docx",
            type: "document",
            size: "245 KB",
            modified: "Apr 15, 2025",
            path: "/Documents/Project Proposal.docx",
            starred: true
          },
          {
            id: "file2",
            name: "Meeting Notes.txt",
            type: "text",
            size: "12 KB",
            modified: "Apr 10, 2025",
            path: "/Documents/Meeting Notes.txt"
          }
        ]
      },
      {
        id: "folder2",
        name: "Images",
        type: "folder",
        path: "/Images",
        children: [
          {
            id: "file3",
            name: "Profile Picture.jpg",
            type: "image",
            size: "1.2 MB",
            modified: "Apr 5, 2025",
            path: "/Images/Profile Picture.jpg",
            shared: true
          },
          {
            id: "file4",
            name: "Screenshot.png",
            type: "image",
            size: "856 KB",
            modified: "Apr 2, 2025",
            path: "/Images/Screenshot.png"
          }
        ],
        shared: true
      },
      {
        id: "file5",
        name: "Resume.pdf",
        type: "pdf",
        size: "350 KB",
        modified: "Mar 28, 2025",
        path: "/Resume.pdf",
        starred: true
      },
      {
        id: "file6",
        name: "Budget.xlsx",
        type: "spreadsheet",
        size: "128 KB",
        modified: "Mar 20, 2025",
        path: "/Budget.xlsx"
      }
    ]
  }), []);

  const findFolder = (id: string, folder: FolderItem): FolderItem | null => {
    if (folder.id === id) {
      return folder;
    }
    
    for (const child of folder.children) {
      if (child.type === "folder") {
        const found = findFolder(id, child as FolderItem);
        if (found) {
          return found;
        }
      }
    }
    
    return null;
  };

  const selectedFolder = useMemo(() => {
    return findFolder(selectedFolderId, fileSystem) || fileSystem;
  }, [selectedFolderId, fileSystem]);

  return {
    activeTab,
    setActiveTab,
    selectedFolderId,
    setSelectedFolderId,
    selectedFolder,
    fileSystem
  };
};
