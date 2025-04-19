
import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: FileList) => void;
}

export const UploadDialog = ({
  isOpen,
  onClose,
  onUpload
}: UploadDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <div 
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto mb-4" />
            <p>Click to select files or drag and drop</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
