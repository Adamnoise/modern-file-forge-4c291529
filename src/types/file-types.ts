
export interface File {
  id: string;
  name: string;
  type: string;
  parentId: string | null;
  createdAt: Date;
  modifiedAt: Date;
  content?: string;
  size?: number;
  url?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
}

export interface Breadcrumb {
  id: string;
  name: string;
}

export interface FileContextValue {
  files: File[];
  folders: Folder[];
  currentFolder: string | null;
  breadcrumbs: Breadcrumb[];
  addFile: (name: string, type: string, content: string) => void;
  addFolder: (name: string) => void;
  deleteItem: (id: string, isFolder: boolean) => void;
  navigateToFolder: (folderId: string | null) => void;
  getFilesInFolder: (folderId: string | null) => File[];
  getFoldersInFolder: (folderId: string | null) => Folder[];
  getFile: (id: string) => File | undefined;
  updateFile: (id: string, updates: Partial<File>) => void;
  uploadFile: (file: globalThis.File) => Promise<void>;
  isUploading: boolean;
}
