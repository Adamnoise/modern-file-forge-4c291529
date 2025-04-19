
export interface BaseItem {
  id: string;
  name: string;
  type: string;
  path: string;
  modified?: string;
  starred?: boolean;
  shared?: boolean;
}

export interface FileItem extends BaseItem {
  type: "document" | "image" | "pdf" | "text" | "spreadsheet";
  size?: string;
}

export interface FolderItem extends BaseItem {
  type: "folder";
  children: (FileItem | FolderItem)[];
}
