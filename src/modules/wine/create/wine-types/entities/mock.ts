import { WineType } from './types/wine-type'

export const mockWineTypes: WineType[] = [
  {
    id: 'dry',
    sortNumber: 0,
    translations: [
      { name: 'Сухе', language: 'uk' },
      { name: 'Dry Wine', language: 'en' },
      { name: 'Dry Wine', language: 'fr' },
    ],
  },
  {
    id: 'semi-dry',
    sortNumber: 1,
    translations: [
      { name: 'Полусухе вино', language: 'uk' },
      { name: 'Semi-dry Wine', language: 'en' },
    ],
  },
  {
    id: 'sweet',
    sortNumber: 2,
    translations: [
      { name: 'Солодке вино', language: 'uk' },
      { name: 'Sweet Wine', language: 'en' },
    ],
  },
  {
    id: 'sparkling',
    sortNumber: 3,
    translations: [
      { name: 'Ігристе вино', language: 'uk' },
      { name: 'Sparkling Wine', language: 'en' },
    ],
  },
  {
    id: 'dessert',
    sortNumber: 4,
    translations: [
      { name: 'Десертне вино', language: 'uk' },
      { name: 'Dessert Wine', language: 'en' },
    ],
  },
]
