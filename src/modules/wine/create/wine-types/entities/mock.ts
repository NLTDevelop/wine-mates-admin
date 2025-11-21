import { mockBaseWineColors } from '../../general/entities/mockBaseColor'
import { WineType } from './types/wine-type'


export const mockWineTypes: WineType[] = [
  {
    id: 'dry',
    translations: [
      { language: 'ua', name: 'Сухе' },
      { language: 'en', name: 'Dry Wine' },
      { language: 'fr', name: 'Dry Wine' }
    ],
    colors: [mockBaseWineColors[0], mockBaseWineColors[1]],
  },
  {
    id: 'semi-dry',
    translations: [
      { language: 'ua', name: 'Полусухе вино' },
      { language: 'en', name: 'Semi-dry Wine' }
    ],
    colors: [mockBaseWineColors[1], mockBaseWineColors[2]],
  },
  {
    id: 'sweet',
    translations: [
      { language: 'ua', name: 'Солодке вино' },
      { language: 'en', name: 'Sweet Wine' }
    ],
    colors: [mockBaseWineColors[2], mockBaseWineColors[3]],
  },
  {
    id: 'sparkling',
    translations: [
      { language: 'ua', name: 'Ігристе вино' },
      { language: 'en', name: 'Sparkling Wine' }
    ],
    colors: [mockBaseWineColors[0], mockBaseWineColors[3]],
  },
  {
    id: 'dessert',
    translations: [
      { language: 'ua', name: 'Десертне вино' },
      { language: 'en', name: 'Dessert Wine' }
    ],
    colors: mockBaseWineColors,
  },
]

// export const mockAromas = [
//   { id: 'berry', label: 'Ягодный' },
//   { id: 'spicy', label: 'Пряный' },
//   { id: 'woody', label: 'Древесный' },
//   { id: 'citrus', label: 'Цитрусовый' },
//   { id: 'tropical', label: 'Тропический' },
//   { id: 'floral', label: 'Цветочный' },
//   { id: 'red_fruits', label: 'Красные фрукты' },
//   { id: 'floral_rose', label: 'Цветочный (розовое)' },
//   { id: 'herbal', label: 'Травяной' },
//   { id: 'bready', label: 'Хлебный' },
//   { id: 'citrus_sparkling', label: 'Цитрусовый (игристое)' },
//   { id: 'mineral_sparkling', label: 'Минеральный (игристое)' },
//   { id: 'dried_fruits', label: 'Сухофрукты' },
//   { id: 'honey_aroma', label: 'Медовый' },
//   { id: 'spicy_dessert', label: 'Пряный (десертное)' },
// ]

// export const mockFlavorNotes = [
//   { id: 'fruity', label: 'Фруктовый' },
//   { id: 'earthy', label: 'Землистый' },
//   { id: 'oaky', label: 'Дубовый' },
//   { id: 'mineral', label: 'Минеральный' },
//   { id: 'herbal', label: 'Травяной' },
//   { id: 'fresh', label: 'Свежий' },
//   { id: 'citrus', label: 'Цитрусовый' },
//   { id: 'toasty', label: 'Поджаренный' },
//   { id: 'yeasty', label: 'Дрожжевой' },
//   { id: 'sweet', label: 'Сладкий' },
//   { id: 'rich', label: 'Богатый' },
//   { id: 'complex', label: 'Сложный' },
// ]

// export const mockFlavorCharacteristics = [
//   { id: 'tannic', label: 'Танинный' },
//   { id: 'full-bodied', label: 'Полнотелый' },
//   { id: 'dry', label: 'Сухой' },
//   { id: 'acidic', label: 'Кислый' },
//   { id: 'light', label: 'Легкий' },
//   { id: 'refreshing', label: 'Освежающий' },
//   { id: 'bubbly', label: 'Игристость' },
//   { id: 'crisp', label: 'Хрустящий' },
//   { id: 'sweet', label: 'Сладкий' },
//   { id: 'luscious', label: 'Сочный' },
// ]
