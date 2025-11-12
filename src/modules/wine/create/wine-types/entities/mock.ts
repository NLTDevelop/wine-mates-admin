import { WineType } from './types/wine-type'

export const mockColors = [
  { id: 'white', label: 'Біле', labelEn: 'white', value: '#fdffd4' },
  { id: 'red', label: 'Червоне', labelEn: 'red', value: '#7c060d' },
  { id: 'orange', label: 'Помаранчеве', labelEn: 'orange', value: '#f99132' },
  { id: 'pink', label: 'Рожеве', labelEn: 'pink', value: '#f7b5e6' },
]

export const mockWineTypes: WineType[] = [
  {
    id: 'dry',
    label: 'Сухе',
    labelEn: 'Dry Wine',
    colors: mockColors,
  },
  {
    id: 'semi-dry',
    label: 'Полусухе вино',
    labelEn: 'Semi-dry Wine',
    colors: mockColors,
  },
  {
    id: 'sweet',
    label: 'Солодке вино',
    labelEn: 'Sweet Wine',
    colors: mockColors,
  },
  {
    id: 'sparkling',
    label: 'Игристое вино',
    labelEn: 'Sparkling Wine',
    colors: mockColors,
  },
  {
    id: 'dessert',
    label: 'Десертное вино',
    labelEn: 'Dessert Wine',
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
