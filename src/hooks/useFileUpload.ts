import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File, folder = '') => {
    if (!(file instanceof File)) {
      toast({
        title: 'Upload Error',
        description: 'Invalid file. Please select a valid file to upload.',
        variant: 'destructive',
      });
      return null;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop() || 'bin';
      const sanitizedBase = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '');
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${sanitizedBase}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { data, error } = await supabase.storage
        .from('uploads') // 👈 ellenőrizd hogy ez pontosan a Supabase bucket neve
        .upload(filePath, file);

      if (error) throw new Error(error.message);

      const { data: publicUrlData, error: urlError } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      if (urlError || !publicUrlData?.publicUrl) {
        throw new Error('Failed to retrieve public URL');
      }

      toast({
        title: 'Upload Successful',
        description: `${file.name} uploaded successfully!`,
      });

      return { path: filePath, publicUrl: publicUrlData.publicUrl };
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Unknown error during upload.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading };
};
