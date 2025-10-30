import { Badge } from "@/UIKit/shadcn/ui/badge";

export const FlavorItem = ({ flavor }: { flavor: any }) => (
  <div className="p-2 border rounded">
    <div className="font-medium">{flavor.label}</div>
    {flavor.characteristics && flavor.characteristics.length > 0 && (
      <div className="flex flex-wrap gap-1 mt-1">
        {flavor.characteristics.map((char: string) => (
          <Badge key={char} variant="outline" className="text-xs">
            {char}
          </Badge>
        ))}
      </div>
    )}
  </div>
)