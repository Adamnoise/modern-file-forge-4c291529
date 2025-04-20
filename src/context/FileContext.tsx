
import React, { createContext, useContext } from "react";
import { FileContextValue } from "@/types/file-types";
import { useFileContextState } from "@/hooks/useFileContextState";

const FileContext = createContext<FileContextValue | undefined>(undefined);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const state = useFileContextState();

  return (
    <FileContext.Provider value={state}>
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error("useFiles must be used within a FileProvider");
  }
  return context;
};
