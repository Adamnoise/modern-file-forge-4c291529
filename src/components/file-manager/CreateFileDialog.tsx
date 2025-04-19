
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useFiles } from "@/context/FileContext";
import { useState } from "react";

interface CreateFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateFileDialog = ({ open, onOpenChange }: CreateFileDialogProps) => {
  const [fileName, setFileName] = useState("");
  const { addFile } = useFiles();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileName.trim()) {
      // Fixing the addFile call to match the expected number of arguments in FileContext
      addFile(fileName, "document", "");
      setFileName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New File</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="File name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
