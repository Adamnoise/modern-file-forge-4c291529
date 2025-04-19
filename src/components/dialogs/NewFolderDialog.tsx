import React, { useState, useCallback } from "react";
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

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value);
    if (error) {
      setError(null); // Töröljük az esetleges korábbi hibát
    }
  }, [error]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!folderName.trim()) {
        setError("Folder name cannot be empty.");
        return;
      }
      onCreateFolder(folderName.trim());
      setFolderName("");
      onClose();
    },
    [folderName, onCreateFolder, onClose]
  );

  const handleClose = useCallback(() => {
    setFolderName("");
    setError(null); // Töröljük az esetleges hibát a párbeszédablak bezárásakor
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
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
