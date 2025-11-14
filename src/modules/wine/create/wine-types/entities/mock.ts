import { WineType } from './types/wine-type'
export const mockColors = [
  {
    id: 'white',
    nameUa: 'Біле',
    nameEn: 'white',
    colorHex: '#fdffd4',
    label: 'Біле',
    value: 'white',
  },
  {
    id: 'red',
    nameUa: 'Червоне',
    nameEn: 'red',
    colorHex: '#7c060d',
    label: 'Червоне',
    value: 'red',
  },
  {
    id: 'orange',
    nameUa: 'Помаранчеве',
    nameEn: 'orange',
    colorHex: '#f99132',
    label: 'Помаранчеве',
    value: 'orange',
  },
  {
    id: 'pink',
    nameUa: 'Рожеве',
    nameEn: 'pink',
    colorHex: '#f7b5e6',
    label: 'Рожеве',
    value: 'pink',
  },
]

export const mockWineTypes: WineType[] = [
  {
    id: 'dry',
    nameUa: 'Сухе',
    nameEn: 'Dry Wine',
    colors: [mockColors[0], mockColors[1]],
  },
  {
    id: 'semi-dry',
    nameUa: 'Полусухе вино',
    nameEn: 'Semi-dry Wine',
    colors: [mockColors[1], mockColors[2]],
  },
  {
    id: 'sweet',
    nameUa: 'Солодке вино',
    nameEn: 'Sweet Wine',
    colors: [mockColors[2], mockColors[3]],
  },
  {
    id: 'sparkling',
    nameUa: 'Игристое вино',
    nameEn: 'Sparkling Wine',
    colors: [mockColors[0], mockColors[3]],
  },
  {
    id: 'dessert',
    nameUa: 'Десертное вино',
    nameEn: 'Dessert Wine',
    colors: mockColors,
  },
]

export const mockAromas = [
  { id: 'berry', label: 'Ягодный' },
  { id: 'spicy', label: 'Пряный' },
  { id: 'woody', label: 'Древесный' },
  { id: 'citrus', label: 'Цитрусовый' },
  { id: 'tropical', label: 'Тропический' },
  { id: 'floral', label: 'Цветочный' },
  { id: 'red_fruits', label: 'Красные фрукты' },
  { id: 'floral_rose', label: 'Цветочный (розовое)' },
  { id: 'herbal', label: 'Травяной' },
  { id: 'bready', label: 'Хлебный' },
  { id: 'citrus_sparkling', label: 'Цитрусовый (игристое)' },
  { id: 'mineral_sparkling', label: 'Минеральный (игристое)' },
  { id: 'dried_fruits', label: 'Сухофрукты' },
  { id: 'honey_aroma', label: 'Медовый' },
  { id: 'spicy_dessert', label: 'Пряный (десертное)' },
]

export const mockFlavorNotes = [
  { id: 'fruity', label: 'Фруктовый' },
  { id: 'earthy', label: 'Землистый' },
  { id: 'oaky', label: 'Дубовый' },
  { id: 'mineral', label: 'Минеральный' },
  { id: 'herbal', label: 'Травяной' },
  { id: 'fresh', label: 'Свежий' },
  { id: 'citrus', label: 'Цитрусовый' },
  { id: 'toasty', label: 'Поджаренный' },
  { id: 'yeasty', label: 'Дрожжевой' },
  { id: 'sweet', label: 'Сладкий' },
  { id: 'rich', label: 'Богатый' },
  { id: 'complex', label: 'Сложный' },
]

export const mockFlavorCharacteristics = [
  { id: 'tannic', label: 'Танинный' },
  { id: 'full-bodied', label: 'Полнотелый' },
  { id: 'dry', label: 'Сухой' },
  { id: 'acidic', label: 'Кислый' },
  { id: 'light', label: 'Легкий' },
  { id: 'refreshing', label: 'Освежающий' },
  { id: 'bubbly', label: 'Игристость' },
  { id: 'crisp', label: 'Хрустящий' },
  { id: 'sweet', label: 'Сладкий' },
  { id: 'luscious', label: 'Сочный' },
]
