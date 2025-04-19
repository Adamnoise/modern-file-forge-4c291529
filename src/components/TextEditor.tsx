
import React, { useState } from 'react';
import { FileItem } from '@/types/file';
import { useFiles } from '@/context/FileContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save, X } from 'lucide-react';

interface TextEditorProps {
  content: string;
  file: FileItem;
  onClose: () => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ content, file, onClose }) => {
  const { updateFile } = useFiles();
  const [value, setValue] = useState(content);
  
  const handleSave = () => {
    updateFile(file.id, { content: value });
    onClose();
  };
  
  return (
    <div className="space-y-4 mt-4">
      <ScrollArea className="h-[50vh]">
        <Textarea
          className="min-h-[50vh] font-mono"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Start writing here..."
        />
      </ScrollArea>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default TextEditor;
