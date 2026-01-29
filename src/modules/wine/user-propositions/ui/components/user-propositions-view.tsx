import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { ContentLayout } from '@/layout/components/content-layout'
import { cn } from '@/lib/utils'
import { NLTDataTable } from '@/UIKit/components/NLTDataTable'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { SearchInput } from '@/UIKit/shadcn/ui/input-search'
import { useTranslation } from 'react-i18next'
import { useUserPropositions } from '../../presenters/useUserPropositions'
import { useUserPropositionsColumns } from '../../presenters/useUserPropositionsColumns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/UIKit/shadcn/ui/tabs'
import { PropositionsType } from '../../entities/types/types'

export const UserPropositionsView = () => {
  const { t } = useTranslation('propositions')

  const { propositions, filters, onChangeSearch, handleClearSearch, onChangePagination, searchValue, isLoading, totalCount, activeTab, onChangeTab } = useUserPropositions()
  const columns = useUserPropositionsColumns(activeTab)
  const { table } = useDataTable(propositions ?? [], columns)

  return (
    <ContentLayout title={t('propositions')}>
      <div className={cn('pb-2 w-full md:w-4/5 mx-auto', !isLoading ? 'fade-in' : '')}>
        <Tabs value={activeTab} onValueChange={value => onChangeTab(value as PropositionsType)} className="w-full">
          <TabsList className="grid w-full md:w-auto sm:grid-cols-2 grid-cols-1  my-6">
            <TabsTrigger value="taste">{t('tastes')}</TabsTrigger>
            <TabsTrigger value="aroma">{t('aromas')}</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="space-y-6">
            <NLTDataTable
              table={table}
              rowClassname="text-center cursor-pointer"
              ToolBar={
                <div className="flex-1 items-center space-x-2">
                  <SearchInput
                    value={searchValue}
                    onChange={onChangeSearch}
                    handleClear={() => {
                      handleClearSearch()
                    }}
                    placeholder={t('search_proposition')}
                    className="w-full"
                  />
                </div>
              }
            />
          </TabsContent>
        </Tabs>
      </div>

      {totalCount && totalCount > DEFAULT_PAGINATION_LIMIT ? <NLTTablePagination limit={filters.limit} page={filters.page} totalRows={totalCount || 1} setPage={onChangePagination} /> : null}
    </ContentLayout>
  )
}
