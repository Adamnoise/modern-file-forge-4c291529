
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useFiles } from '@/context/FileContext';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  FolderPlus, 
  Upload, 
  ChevronRight, 
  Grid, 
  List, 
  CirclePlus 
} from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import CreateFileModal from '@/components/CreateFileModal';
import FileCard from '@/components/FileCard';
import FilePreview from '@/components/FilePreview';
import FileUploader from '@/components/FileUploader';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const { 
    files, 
    folders, 
    navigateToFolder, 
    currentFolder, 
    breadcrumbs,
    getFilesInFolder,
    getFoldersInFolder,
    getFile
  } = useFiles();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  
  const currentFiles = getFilesInFolder(currentFolder);
  const currentFolders = getFoldersInFolder(currentFolder);
  
  const handleFolderClick = (folderId: string) => {
    navigateToFolder(folderId);
  };
  
  const handleFileClick = (fileId: string) => {
    setSelectedFile(fileId);
  };
  
  const handleBreadcrumbClick = (folderId: string | null) => {
    navigateToFolder(folderId);
  };
  
  const fileToPreview = selectedFile ? getFile(selectedFile) : null;
  
  const isEmpty = currentFiles.length === 0 && currentFolders.length === 0;
  
  return (
    <Layout>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Breadcrumb>
              {breadcrumbs.map((item, index) => (
                <BreadcrumbItem key={item.id} isLastItem={index === breadcrumbs.length - 1}>
                  <BreadcrumbLink 
                    onClick={() => handleBreadcrumbClick(item.id === 'root' ? null : item.id)}
                    className="cursor-pointer"
                  >
                    {item.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
          </div>
          
          <div className="flex items-center gap-4">
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <Grid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <CirclePlus className="mr-2 h-4 w-4" />
                    Create New
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DialogTrigger asChild>
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      New Document
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogTrigger asChild>
                    <DropdownMenuItem>
                      <FolderPlus className="mr-2 h-4 w-4" />
                      New Folder
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogTrigger asChild>
                    <DropdownMenuItem>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload File
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <CreateFileModal />
            </Dialog>
          </div>
        </div>
        
        <Separator className="mb-6" />
        
        <ScrollArea className="flex-1">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center py-12">
              <FileUploader className="max-w-lg w-full" />
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <>
                  {currentFolders.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-lg font-medium mb-4">Folders</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {currentFolders.map((folder) => (
                          <FileCard
                            key={folder.id}
                            item={folder}
                            isFolder={true}
                            onClick={() => handleFolderClick(folder.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentFiles.length > 0 && (
                    <div>
                      <h2 className="text-lg font-medium mb-4">Files</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {currentFiles.map((file) => (
                          <FileCard
                            key={file.id}
                            item={file}
                            isFolder={false}
                            onClick={() => handleFileClick(file.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  {currentFolders.length > 0 && (
                    <div>
                      <h2 className="text-lg font-medium mb-2">Folders</h2>
                      {currentFolders.map((folder) => (
                        <Card 
                          key={folder.id} 
                          className="mb-2 hover:bg-accent transition-colors cursor-pointer"
                          onClick={() => handleFolderClick(folder.id)}
                        >
                          <CardContent className="p-3 flex items-center justify-between">
                            <div className="flex items-center">
                              <FolderPlus className="h-5 w-5 text-forge-500 mr-3" />
                              <span>{folder.name}</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  {currentFiles.length > 0 && (
                    <div>
                      <h2 className="text-lg font-medium mb-2">Files</h2>
                      {currentFiles.map((file) => (
                        <Card 
                          key={file.id} 
                          className="mb-2 hover:bg-accent transition-colors cursor-pointer"
                          onClick={() => handleFileClick(file.id)}
                        >
                          <CardContent className="p-3 flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-forge-500 mr-3" />
                              <div className="flex flex-col">
                                <span>{file.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(file.modifiedAt).toLocaleDateString()} • {file.type}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </ScrollArea>
      </div>
      
      {fileToPreview && (
        <Dialog open={!!selectedFile} onOpenChange={(open) => !open && setSelectedFile(null)}>
          <FilePreview file={fileToPreview} />
        </Dialog>
      )}
    </Layout>
  );
};

export default Index;
