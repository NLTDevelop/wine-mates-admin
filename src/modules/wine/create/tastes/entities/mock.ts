import { mockBaseWineColors } from "../../general/entities/mockBaseColor";
import { WineTaste } from "./types/tastes";


export const mockWineTastes: WineTaste[] = [
  {
    id: 'fruity',
    translations: [
      { language: 'ua', name: 'Фруктовий' },
      { language: 'en', name: 'Fruity' }
    ],
    colorHex: '#FF6B6B',
    colors: [mockBaseWineColors[1], mockBaseWineColors[2]],
  },
  {
    id: 'dry',
    translations: [
      { language: 'ua', name: 'Сухий' },
      { language: 'en', name: 'Dry' }
    ],
    colorHex: '#D4A76A',
    colors: [mockBaseWineColors[2], mockBaseWineColors[3]],
  },
  {
    id: 'sweet',
    translations: [
      { language: 'ua', name: 'Солодкий' },
      { language: 'en', name: 'Sweet' }
    ],
    colorHex: '#FFD700',
    colors: [mockBaseWineColors[3], mockBaseWineColors[4]],
  },
  {
    id: 'acidic',
    translations: [
      { language: 'ua', name: 'Кислий' },
      { language: 'en', name: 'Acidic' }
    ],
    colorHex: '#90EE90',
    colors: [mockBaseWineColors[0], mockBaseWineColors[1]],
  },
  {
    id: 'tannic',
    translations: [
      { language: 'ua', name: 'Таніновий' },
      { language: 'en', name: 'Tannic' }
    ],
    colorHex: '#8B4513',
    colors: mockBaseWineColors,
  },
  {
    id: 'oaky',
    translations: [
      { language: 'ua', name: 'Дубовий' },
      { language: 'en', name: 'Oaky' }
    ],
    colorHex: '#A0522D',
    colors: [mockBaseWineColors[2], mockBaseWineColors[4]],
  },
  {
    id: 'spicy',
    translations: [
      { language: 'ua', name: 'Пряний' },
      { language: 'en', name: 'Spicy' }
    ],
    colorHex: '#FF4500',
    colors: [mockBaseWineColors[1], mockBaseWineColors[3]],
  }
]