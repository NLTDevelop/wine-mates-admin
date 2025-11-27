import { mockBaseWineColors } from '../../general/entities/mockBaseColor'
import { WineTaste } from './types/tastes'

export const mockWineTastes: WineTaste[] = [
  {
    id: 'fruity',
    translations: [
      { name: 'Фруктовий', language: 'uk' },
      { name: 'Fruity', language: 'en' },
    ],
    colorHex: '#FF6B6B',
    colors: [mockBaseWineColors[1], mockBaseWineColors[2]],
  },
  {
    id: 'dry',
    translations: [
      { name: 'Сухий', language: 'uk' },
      { name: 'Dry', language: 'en' },
    ],
    colorHex: '#D4A76A',
    colors: [mockBaseWineColors[2], mockBaseWineColors[3]],
  },
  {
    id: 'sweet',
    translations: [
      { name: 'Солодкий', language: 'uk' },
      { name: 'Sweet', language: 'en' },
    ],
    colorHex: '#FFD700',
    colors: [mockBaseWineColors[3]],
  },
  {
    id: 'acidic',
    translations: [
      { name: 'Кислий', language: 'uk' },
      { name: 'Acidic', language: 'en' },
    ],
    colorHex: '#90EE90',
    colors: [mockBaseWineColors[0], mockBaseWineColors[1]],
  },
  {
    id: 'tannic',
    translations: [
      { name: 'Таніновий', language: 'uk' },
      { name: 'Tannic', language: 'en' },
    ],
    colorHex: '#8B4513',
    colors: mockBaseWineColors,
  },
  {
    id: 'oaky',
    translations: [
      { name: 'Дубовий', language: 'uk' },
      { name: 'Oaky', language: 'en' },
    ],
    colorHex: '#A0522D',
    colors: [mockBaseWineColors[2], mockBaseWineColors[1]],
  },
  {
    id: 'spicy',
    translations: [
      { name: 'Пряний', language: 'uk' },
      { name: 'Spicy', language: 'en' },
    ],
    colorHex: '#FF4500',
    colors: [mockBaseWineColors[1], mockBaseWineColors[3]],
  },
]
