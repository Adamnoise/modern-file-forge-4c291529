
import React, { useState } from 'react';
import { useFiles } from '@/context/FileContext';
import { FileType } from '@/types/file';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, FolderPlus, Upload } from 'lucide-react';

const CreateFileModal: React.FC = () => {
  const { addFile, addFolder } = useFiles();
  const [documentName, setDocumentName] = useState('');
  const [folderName, setFolderName] = useState('');
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  
  const handleCreateDocument = () => {
    if (documentName.trim()) {
      addFile(documentName, 'document', '# New Document\n\nStart writing here...');
      setDocumentName('');
    }
  };
  
  const handleCreateFolder = () => {
    if (folderName.trim()) {
      addFolder(folderName);
      setFolderName('');
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingFile(e.target.files[0]);
    }
  };
  
  const handleUpload = () => {
    if (uploadingFile) {
      const fileName = uploadingFile.name;
      const fileType = getFileType(fileName);
      
      addFile(fileName, fileType, undefined, uploadingFile);
      setUploadingFile(null);
      
      // Reset the file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };
  
  const getFileType = (fileName: string): FileType => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return 'image';
    } else if (['pdf'].includes(extension)) {
      return 'pdf';
    } else if (['mp3', 'wav', 'ogg'].includes(extension)) {
      return 'audio';
    } else if (['mp4', 'webm', 'mov'].includes(extension)) {
      return 'video';
    } else if (['xlsx', 'xls', 'csv'].includes(extension)) {
      return 'spreadsheet';
    } else if (['doc', 'docx', 'txt', 'md'].includes(extension)) {
      return 'document';
    }
    
    return 'other';
  };
  
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create New</DialogTitle>
      </DialogHeader>
      
      <Tabs defaultValue="document" className="mt-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="document" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Document
          </TabsTrigger>
          <TabsTrigger value="folder" className="flex items-center gap-2">
            <FolderPlus className="h-4 w-4" />
            Folder
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="document" className="pt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document-name">Document Name</Label>
            <Input
              id="document-name"
              placeholder="Enter document name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" onClick={handleCreateDocument}>Create Document</Button>
            </DialogClose>
          </DialogFooter>
        </TabsContent>
        
        <TabsContent value="folder" className="pt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" onClick={handleCreateFolder}>Create Folder</Button>
            </DialogClose>
          </DialogFooter>
        </TabsContent>
        
        <TabsContent value="upload" className="pt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Select File</Label>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
            />
            {uploadingFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {uploadingFile.name} ({(uploadingFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button 
                type="submit" 
                onClick={handleUpload}
                disabled={!uploadingFile}
              >
                Upload File
              </Button>
            </DialogClose>
          </DialogFooter>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};

export default CreateFileModal;
