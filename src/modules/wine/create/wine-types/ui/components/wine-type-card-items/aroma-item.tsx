import { Badge } from "@/UIKit/shadcn/ui/badge";

export const AromaItem = ({ aroma }: { aroma: any }) => (
  <div className="p-2 border rounded">
    <div className="font-medium">{aroma.label}</div>
    {aroma.subAromas && aroma.subAromas.length > 0 && (
      <div className="flex flex-wrap gap-1 mt-1">
        {aroma.subAromas.map((sub: string) => (
          <Badge key={sub} variant="outline" className="text-xs">
            {sub}
          </Badge>
        ))}
      </div>
    )}
  </div>
)