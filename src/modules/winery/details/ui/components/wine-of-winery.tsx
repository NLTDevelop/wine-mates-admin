import { WarningModal } from '@/modals/warningModal'
import { useWineColumns } from '@/modules/wine/list/presenters/useWineColumns'
import { useWineList } from '@/modules/wine/list/presenters/useWineList'
import { WineList } from '@/modules/wine/list/shared/ui'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Form } from '@/UIKit/shadcn/ui/form'
import { MultiSelect } from '@/UIKit/shadcn/ui/multi-select'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAddWineToWineryForm } from '../../presenters/useAddWineToWineryForm'
import { cn } from '@/lib/utils'
import { IWines } from '@/modules/wine/list/entities/types/types'

export const WineOfWinery = ({ wineryId }: { wineryId: string }) => {
  const { t } = useTranslation('winery')

  const [showMultiselect, setShowMultiselect] = useState<boolean>(false)

  const { wines, handleClearSearch, deleteModal, deleteWine, addWineToWinery, refetch, isInitialized } = useWineList(wineryId, 'winery')

  const { wines: winesWithoutWinery, handleClearSearch: clearSearchWithoutWinery, refetch: refetchWithoutWinery } = useWineList(null, 'withoutWinery')

  const wineOptions = useMemo(() => {
    return (winesWithoutWinery || []).map(wine => ({
      label: wine.name || "",
      value: wine.id || "",
    }))
  }, [winesWithoutWinery])

  const { form, setIsSubmitting, resetForm, selectedWineIds, handleWineChange, selectedOptions } = useAddWineToWineryForm(wineOptions)

  const columns = useWineColumns({ onDelete: deleteWine, isUnionAvailable: false })
  const { table } = useDataTable(wines ?? [], columns)

  useEffect(() => {
    if (isInitialized) {
      handleClearSearch()
    }
  }, [isInitialized, handleClearSearch])

  useEffect(() => {
    if (showMultiselect) {
      clearSearchWithoutWinery()
      refetchWithoutWinery()
    }
  }, [showMultiselect,clearSearchWithoutWinery])

  const handleAddWineToWinery = async () => {
    if (!showMultiselect) {
      setShowMultiselect(true)
      return
    }

    const isValid = await form.trigger()
    if (!isValid) return

    const wineIds = form.getValues().wineIds
    if (!wineIds || wineIds.length === 0) return

    setIsSubmitting(true)
    try {
      await addWineToWinery(wineryId, wineIds.map(id => Number(id)) )

      await Promise.all([refetch(), refetchWithoutWinery()])

      resetForm()
      setShowMultiselect(false)
    } catch (error) {
      console.error('Error adding wines:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setShowMultiselect(false)
    resetForm()
  }

  const fetchWineOptions = useCallback(
  async (/*search?: string*/) => {
    const options = (winesWithoutWinery || [])
      .filter((wine): wine is IWines & { id: string; name: string } => 
        Boolean(wine.id && wine.name)
      )
      .map(wine => ({
        value: wine.id,
        label: wine.name
      }));
    
    return {
      options,
      hasMore: false,
      totalCount: options.length
    };
  },
  [winesWithoutWinery]
);

  return (
    <WineList
      table={table}
      isRowClickAvailable={false}
      isTitleAvailable={false}
      renderActions={() => (
        <>
          {showMultiselect ? (
            <Form {...form}>
              <form className="space-y-6">
                <MultiSelect
                  value={selectedWineIds}
                  onChange={handleWineChange}
                  fetchOptions={fetchWineOptions}
                  placeholder={t('select_wines')}
                  itemOptions={selectedOptions}
                  mode="multiple"
                  maxSelections={20}
                  showSelectAll={false}
                  enablePagination={true}
                />
              </form>
            </Form>
          ) : null}
          <div className={cn('flex justify-end items-center gap-2 min-h-10', showMultiselect && 'mt-3')}>
            <Button onClick={handleAddWineToWinery}>{showMultiselect ? t('button.confirm_add') : t('button.add_wine')}</Button>
            {showMultiselect && (
              <Button variant="outline" onClick={handleCancel}>
                {t('button.cancel')}
              </Button>
            )}
          </div>
        </>
      )}
      renderModals={() => (
        <>
          <WarningModal
            title={t('list.wine_delete')}
            actionTitle={t('button.delete')}
            description={t('list.delete_description', { slug: `${deleteModal.wineName}` })}
            isOpen={deleteModal.isOpen}
            onClose={deleteModal.onClose}
            onSubmit={deleteModal.onSubmitFromWinery}
          />
        </>
      )}
    />
  )
}
