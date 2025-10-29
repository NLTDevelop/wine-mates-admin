import { Card, CardContent } from "@/UIKit/shadcn/ui/card"
import { CreateCategorySection } from "./components/create-category-section"

export const WineTypeManager = () => {
  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div>
           <CreateCategorySection onCreateCategory={handleAddCategory} isLoading={isLoading} />
         </div>
         </CardContent>
         </Card>

  )
}
