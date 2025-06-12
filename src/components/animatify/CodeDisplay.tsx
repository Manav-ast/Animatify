import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeDisplayProps {
  code: string | null;
}

export function CodeDisplay({ code }: CodeDisplayProps) {
  if (!code) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Generated code will appear here.
      </div>
    );
  }

  return (
    <ScrollArea className="h-96 w-full rounded-md border bg-muted/20 p-1">
      <pre className="p-4 text-sm overflow-auto">
        <code className="font-code text-foreground whitespace-pre-wrap break-all">
          {code}
        </code>
      </pre>
    </ScrollArea>
  );
}
