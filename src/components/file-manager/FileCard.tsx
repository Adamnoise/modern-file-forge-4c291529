
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useFiles } from "@/context/FileContext";
import { File, Trash } from "lucide-react";

interface FileCardProps {
  file: {
    id: string;
    name: string;
    type: string;
    createdAt: Date;
  };
}

export const FileCard = ({ file }: FileCardProps) => {
  const { deleteItem } = useFiles();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <File className="h-4 w-4 text-muted-foreground" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteItem(file.id, false)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">{file.name}</div>
        <p className="text-xs text-muted-foreground">
          {file.createdAt.toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full">
          Open
        </Button>
      </CardFooter>
    </Card>
  );
};
