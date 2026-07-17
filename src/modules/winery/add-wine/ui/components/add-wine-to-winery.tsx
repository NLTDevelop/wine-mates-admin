import { WineOfWinery } from '@/modules/winery/details/entities/types'
import { useWineListColumns } from '@/modules/winery/details/presenters/useWineListColumns'
import { useWineListOfWinery } from '@/modules/winery/details/presenters/useWineListOfWinery'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'

export const AddWineToWinery = () => {
  const { wines, handleClearSearch, deleteModal } = useWineListOfWinery()
  console.log('->', wines)

  const columns = useWineListColumns({ showCheckbox: false, showDelete: true })
  const { table } = useDataTable(wines ?? [], columns)

  const addWinesModalClose = async () => {
    addWinesModal.onClose()
    table?.resetRowSelection()
  }

  return <div>add-wine-to-winery</div>
}
