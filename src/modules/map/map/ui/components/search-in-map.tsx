import { useTranslation } from 'react-i18next'
import { MapEvent } from '@/modules/map/events/entities/types'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { Card } from '@/UIKit/shadcn/ui/card'
import { SearchInput } from '@/UIKit/shadcn/ui/input-search'
import { ScrollArea } from '@/UIKit/shadcn/ui/scroll-area'
import { MapPin } from 'lucide-react'

interface SearchInMapProps {
  searchQuery: string
  handleSearch: (query: string) => void
  isSearching: boolean
  searchResults: MapEvent[]
  handleSelectSearchResult: (event: MapEvent) => void
}

export const SearchInMap = ({ searchQuery, handleSearch, isSearching, searchResults, handleSelectSearchResult }: SearchInMapProps) => {
  const { t } = useTranslation('map')
  return (
    <div className="relative">
      <SearchInput value={searchQuery} onChange={e => handleSearch(e.target.value)} />

      {isSearching && searchResults.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 !p-0 z-20">
          <ScrollArea className="h-full">
            {searchResults.map(event => (
              <div key={event.id} className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={() => handleSelectSearchResult(event)}>
                <MapPin className="h-4 w-4 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium">{event.theme}</p>
                  <p className="text-sm text-gray-500">{event.restaurantName}</p>
                </div>
                <Badge>{event.tastingType}</Badge>
              </div>
            ))}
          </ScrollArea>
        </Card>
      )}

      {isSearching && searchResults.length === 0 && <Card className="absolute top-full left-0 right-0 mt-1 p-4 text-center text-gray-500 z-20">{t('not_found')}</Card>}
    </div>
  )
}
