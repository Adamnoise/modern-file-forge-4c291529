
const STORAGE_KEY = "file-forge-data";

interface StoredData {
  files: any[];
  folders: any[];
}

export const loadStoredData = () => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) return { files: [], folders: [] };
  
  const parsedData = JSON.parse(storedData);
  return {
    files: parsedData.files.map((file: any) => ({
      ...file,
      createdAt: new Date(file.createdAt),
      modifiedAt: new Date(file.modifiedAt),
    })),
    folders: parsedData.folders.map((folder: any) => ({
      ...folder,
      createdAt: new Date(folder.createdAt),
    })),
  };
};

export const saveDataToStorage = (files: any[], folders: any[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ files, folders }));
};
