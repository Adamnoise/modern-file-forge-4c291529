
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UploadedFile {
  path: string;
  publicUrl: string;
}

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File, folder = ''): Promise<UploadedFile | null> => {
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
      // Get the current auth session
      const { data: sessionData } = await supabase.auth.getSession();
      
      // Check if the user is authenticated
      if (!sessionData?.session) {
        // Create anonymous session for uploads if needed
        // This is a fallback for testing without auth
        console.log("No authenticated session found. Uploads may fail due to RLS policies.");
      }

      // 🔧 Biztonságos fájlnév + elérési út létrehozása
      const fileExt = file.name.split('.').pop() || 'bin';
      const sanitizedBase = file.name
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9.\-_]/g, '');
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${sanitizedBase}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const contentType = file.type || 'application/octet-stream';

      // ⬆️ Fájl feltöltése Supabase-re
      const { data, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, { contentType });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message);
      }

      // 🌐 Publikus URL lekérése
      const publicUrlData = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      if (!publicUrlData?.data?.publicUrl) {
        throw new Error('Failed to retrieve public URL');
      }

      toast({
        title: 'Upload Successful',
        description: `${file.name} uploaded successfully!`,
      });

      return {
        path: filePath,
        publicUrl: publicUrlData.data.publicUrl,
      };
    } catch (error) {
      console.error('Upload error:', error);
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
