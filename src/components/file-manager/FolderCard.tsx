
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useFiles } from "@/context/FileContext";
import { Folder, Trash } from "lucide-react";

interface FolderCardProps {
  folder: {
    id: string;
    name: string;
    createdAt: Date;
  };
}

export const FolderCard = ({ folder }: FolderCardProps) => {
  const { deleteItem, navigateToFolder } = useFiles();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Folder className="h-4 w-4 text-muted-foreground" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteItem(folder.id, true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">{folder.name}</div>
        <p className="text-xs text-muted-foreground">
          {folder.createdAt.toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => navigateToFolder(folder.id)}
        >
          Open
        </Button>
      </CardFooter>
    </Card>
  );
};
