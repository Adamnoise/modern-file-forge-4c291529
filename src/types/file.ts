
export type FileType = 'folder' | 'document' | 'image' | 'pdf' | 'audio' | 'video' | 'spreadsheet' | 'other';

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size?: number;
  createdAt: Date;
  modifiedAt: Date;
  parentId: string | null;
  content?: string;
  url?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
}

export type BreadcrumbItem = {
  id: string;
  name: string;
};
