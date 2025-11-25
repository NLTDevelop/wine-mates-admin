import { mockBaseWineColors } from '../../general/entities/mockBaseColor'
import { WineType } from './types/wine-type'


export const mockWineTypes: WineType[] = [
  {
    id: 'dry',
    sortNumber: 0,
    translations: [
      { name: 'Сухе', language: 'uk' },
      { name: 'Dry Wine', language: 'en' },
      { name: 'Dry Wine', language: 'fr' }
    ],
    colors: [mockBaseWineColors[0], mockBaseWineColors[1]],
  },
  {
    id: 'semi-dry',
    sortNumber: 1,
    translations: [
      { name: 'Полусухе вино', language: 'uk' },
      { name: 'Semi-dry Wine', language: 'en' }
    ],
    colors: [mockBaseWineColors[1], mockBaseWineColors[2]],
  },
  {
    id: 'sweet',
    sortNumber: 2,
    translations: [
      { name: 'Солодке вино', language: 'uk' },
      { name: 'Sweet Wine', language: 'en' }
    ],
    colors: [mockBaseWineColors[2], mockBaseWineColors[3]],
  },
  {
    id: 'sparkling',
    sortNumber: 3,
    translations: [
      { name: 'Ігристе вино', language: 'uk' },
      { name: 'Sparkling Wine', language: 'en' }
    ],
    colors: [mockBaseWineColors[0], mockBaseWineColors[3]],
  },
  {
    id: 'dessert',
    sortNumber: 4,
    translations: [
      { name: 'Десертне вино', language: 'uk' },
      { name: 'Dessert Wine', language: 'en' }
    ],
    colors: mockBaseWineColors,
  },
]

