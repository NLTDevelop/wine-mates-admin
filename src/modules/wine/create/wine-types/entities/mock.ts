import { WineType } from './types/wine-type'

export const mockWineTypes: WineType[] = [
  {
    value: 'red',
    label: 'Красное вино',
    labelEn: 'Red Wine',
    colors: ['ruby', 'garnet', 'purple'],
    aromas: ['berry', 'spicy', 'woody'],
    flavorNotes: ['fruity', 'earthy', 'oaky'],
    flavorCharacteristics: ['tannic', 'full-bodied', 'dry']
  },
  {
    value: 'white',
    label: 'Белое вино',
    labelEn: 'White Wine',
    colors: ['straw', 'golden', 'lemon'],
    aromas: ['citrus', 'tropical', 'floral'],
    flavorNotes: ['mineral', 'herbal', 'fruity'],
    flavorCharacteristics: ['acidic', 'dry', 'light']
  },
  {
    value: 'rose',
    label: 'Розовое вино',
    labelEn: 'Rosé Wine',
    colors: ['salmon', 'pink', 'peach'],
    aromas: ['red_fruits', 'floral_rose', 'herbal'],
    flavorNotes: ['fruity', 'fresh', 'citrus'],
    flavorCharacteristics: ['light', 'dry', 'refreshing']
  },
  {
    value: 'sparkling',
    label: 'Игристое вино',
    labelEn: 'Sparkling Wine',
    colors: ['champagne', 'blush'],
    aromas: ['bready', 'citrus_sparkling', 'mineral_sparkling'],
    flavorNotes: ['toasty', 'yeasty', 'citrus'],
    flavorCharacteristics: ['bubbly', 'crisp', 'dry']
  },
  {
    value: 'dessert',
    label: 'Десертное вино',
    labelEn: 'Dessert Wine',
    colors: ['amber', 'honey', 'caramel'],
    aromas: ['dried_fruits', 'honey_aroma', 'spicy_dessert'],
    flavorNotes: ['sweet', 'rich', 'complex'],
    flavorCharacteristics: ['sweet', 'full-bodied', 'luscious']
  }
]

export const mockColors = [
  { value: 'ruby', label: 'Рубиновый' },
  { value: 'garnet', label: 'Гранатовый' },
  { value: 'purple', label: 'Пурпурный' },
  { value: 'straw', label: 'Соломенный' },
  { value: 'golden', label: 'Золотистый' },
  { value: 'lemon', label: 'Лимонный' },
  { value: 'salmon', label: 'Лососевый' },
  { value: 'pink', label: 'Розовый' },
  { value: 'peach', label: 'Персиковый' },
  { value: 'champagne', label: 'Шампанское' },
  { value: 'blush', label: 'Розовое игристое' },
  { value: 'amber', label: 'Янтарный' },
  { value: 'honey', label: 'Медовый' },
  { value: 'caramel', label: 'Карамельный' }
]

export const mockAromas = [
  { value: 'berry', label: 'Ягодный' },
  { value: 'spicy', label: 'Пряный' },
  { value: 'woody', label: 'Древесный' },
  { value: 'citrus', label: 'Цитрусовый' },
  { value: 'tropical', label: 'Тропический' },
  { value: 'floral', label: 'Цветочный' },
  { value: 'red_fruits', label: 'Красные фрукты' },
  { value: 'floral_rose', label: 'Цветочный (розовое)' },
  { value: 'herbal', label: 'Травяной' },
  { value: 'bready', label: 'Хлебный' },
  { value: 'citrus_sparkling', label: 'Цитрусовый (игристое)' },
  { value: 'mineral_sparkling', label: 'Минеральный (игристое)' },
  { value: 'dried_fruits', label: 'Сухофрукты' },
  { value: 'honey_aroma', label: 'Медовый' },
  { value: 'spicy_dessert', label: 'Пряный (десертное)' }
]

export const mockFlavorNotes = [
  { value: 'fruity', label: 'Фруктовый' },
  { value: 'earthy', label: 'Землистый' },
  { value: 'oaky', label: 'Дубовый' },
  { value: 'mineral', label: 'Минеральный' },
  { value: 'herbal', label: 'Травяной' },
  { value: 'fresh', label: 'Свежий' },
  { value: 'citrus', label: 'Цитрусовый' },
  { value: 'toasty', label: 'Поджаренный' },
  { value: 'yeasty', label: 'Дрожжевой' },
  { value: 'sweet', label: 'Сладкий' },
  { value: 'rich', label: 'Богатый' },
  { value: 'complex', label: 'Сложный' }
]

export const mockFlavorCharacteristics = [
  { value: 'tannic', label: 'Танинный' },
  { value: 'full-bodied', label: 'Полнотелый' },
  { value: 'dry', label: 'Сухой' },
  { value: 'acidic', label: 'Кислый' },
  { value: 'light', label: 'Легкий' },
  { value: 'refreshing', label: 'Освежающий' },
  { value: 'bubbly', label: 'Игристость' },
  { value: 'crisp', label: 'Хрустящий' },
  { value: 'sweet', label: 'Сладкий' },
  { value: 'luscious', label: 'Сочный' }
]