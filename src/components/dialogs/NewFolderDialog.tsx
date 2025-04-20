import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (name: string) => void;
}

export const NewFolderDialog = ({
  isOpen,
  onClose,
  onCreateFolder,
}: NewFolderDialogProps) => {
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fókusz a bemeneti mezőre az ablak megnyitásakor
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFolderName(e.target.value);
      if (error) {
        setError(null); // Töröljük az esetleges korábbi hibát
      }
    },
    [error]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!folderName.trim()) {
        setError("Folder name cannot be empty or only spaces.");
        return;
      }
      onCreateFolder(folderName.trim());
      setFolderName(""); // Tisztítjuk a mezőt
      onClose(); // Bezárjuk az ablakot
    },
    [folderName, onCreateFolder, onClose]
  );

  const handleClose = useCallback(() => {
    setFolderName(""); // Tisztítsuk az állapotot
    setError(null); // Töröljük az esetleges hibát
    onClose();
  }, [onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <Input
              ref={inputRef} // Hozzárendeljük a ref-et a bemeneti mezőhöz
              value={folderName}
              onChange={handleInputChange}
              placeholder="Enter folder name"
              autoFocus
              aria-invalid={!!error}
              aria-describedby={error ? "folder-name-error" : undefined}
            />
            {error && (
              <p id="folder-name-error" className="text-red-500 text-sm mt-2">
                {error}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!folderName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
