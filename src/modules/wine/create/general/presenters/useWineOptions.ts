import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { wineOptionsQueries } from '../../wine-types/entities/wine-options-queries'
import { getDisplayNames } from '@/lib/utils';
import { BaseWineColor } from '../entities/types';
import { mockWineColorGroups } from '../../colors/entities/types/mockColor';

//для мок

export const useWineOptionsMock = () => {
  const fetchColors = useCallback(async (search?: string) => {
    if (!search) return mockWineColorGroups;
    
    const searchTerm = search.toLowerCase();
    
    return mockWineColorGroups.filter((color:BaseWineColor) => {
      const { nameUa, nameEn } = getDisplayNames(color.translations);
      
      return nameUa.toLowerCase().includes(searchTerm) || 
             (nameEn && nameEn.toLowerCase().includes(searchTerm));
    });
  }, []);

  return {
    fetchColors,
  };
};

// -----------------------------------------------------------------------------

export const useWineOptions = () => {
  const fetchWithErrorHandling = useCallback(async (queryFn: () => Promise<any>) => {
    try {
      return await queryFn()
    } catch (error) {
      console.error('Error fetching wine options:', error)
      return []
    }
  }, [])

  const useColors = (search?: string) =>
    useQuery({
      ...wineOptionsQueries.colors(search),
      retry: 2,
      staleTime: 5 * 60 * 1000,
    })

  const fetchColors = useCallback(
    async (search?: string) => {
      return fetchWithErrorHandling(() => wineOptionsQueries.colors(search).queryFn())
    },
    [fetchWithErrorHandling]
  )

  return {
    useColors,
    fetchColors,
  }
}
