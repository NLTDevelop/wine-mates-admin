import { WineCategoryFormData, WineColorCategory } from '../types/color'

export const mockWineColorCategories: WineColorCategory[] = [
  {
    id: '1',
    value: '#8B0000', // HEX цвет для категории
    label: 'Красные вина',
    labelEn: 'Red Wines',
    tones: {
      pale: '#FF6B6B',
      medium: '#B22222',
      deep: '#8B0000',
    },
    colors: [
      {
        id: '1-1',
        value: '#B22222', // HEX цвет
        label: 'Рубиновый',
        labelEn: 'Ruby',
        items: [
          {
            name: 'Бледный рубин',
            nameEn: 'Pale Ruby',
            tones: {
              pale: '#FF6B6B',
              medium: '#B22222',
              deep: '#8B0000',
            },
          },
          {
            name: 'Насыщенный рубин',
            nameEn: 'Deep Ruby',
            tones: {
              pale: '#CD5C5C',
              medium: '#8B0000',
              deep: '#4B0000',
            },
          },
        ],
      },
      {
        id: '1-2',
        value: '#800000', // HEX цвет
        label: 'Гранатовый',
        labelEn: 'Garnet',
        items: [
          {
            name: 'Светлый гранат',
            nameEn: 'Light Garnet',
            tones: {
              pale: '#CD5C5C',
              medium: '#800000',
              deep: '#4B0000',
            },
          },
        ],
      },
    ],
  },
  {
    id: '2',
    value: '#F0E68C', // HEX цвет для категории
    label: 'Белые вина',
    labelEn: 'White Wines',
    tones: {
      pale: '#FFF8DC',
      medium: '#F0E68C',
      deep: '#DAA520',
    },
    colors: [
      {
        id: '2-1',
        value: '#F0E68C', // HEX цвет
        label: 'Соломенный',
        labelEn: 'Straw',
        items: [
          {
            name: 'Бледная солома',
            nameEn: 'Pale Straw',
            tones: {
              pale: '#FFF8DC',
              medium: '#F0E68C',
              deep: '#DAA520',
            },
          },
          {
            name: 'Золотистая солома',
            nameEn: 'Golden Straw',
            tones: {
              pale: '#FFEFD5',
              medium: '#FFD700',
              deep: '#DAA520',
            },
          },
        ],
      },
      {
        id: '2-2',
        value: '#FFD700', // HEX цвет
        label: 'Золотистый',
        labelEn: 'Golden',
        items: [
          {
            name: 'Светлое золото',
            nameEn: 'Light Gold',
            tones: {
              pale: '#FFEC8B',
              medium: '#FFD700',
              deep: '#DAA520',
            },
          },
        ],
      },
    ],
  },
  {
    id: '3',
    value: '#FF69B4', // HEX цвет для категории
    label: 'Розовые вина',
    labelEn: 'Rosé Wines',
    tones: {
      pale: '#FFB6C1',
      medium: '#FF69B4',
      deep: '#C71585',
    },
    colors: [
      {
        id: '3-1',
        value: '#FA8072', // HEX цвет
        label: 'Лососевый',
        labelEn: 'Salmon',
        items: [
          {
            name: 'Нежный лосось',
            nameEn: 'Delicate Salmon',
            tones: {
              pale: '#FFB6C1',
              medium: '#FA8072',
              deep: '#E9967A',
            },
          },
        ],
      },
      {
        id: '3-2',
        value: '#FFC0CB', // HEX цвет
        label: 'Нежно-розовый',
        labelEn: 'Light Pink',
        items: [
          {
            name: 'Лепестковый розовый',
            nameEn: 'Petals Pink',
            tones: {
              pale: '#FFE4E1',
              medium: '#FFC0CB',
              deep: '#FF69B4',
            },
          },
        ],
      },
    ],
  },
  {
    id: '4',
    value: '#FF8C00', // HEX цвет для категории
    label: 'Оранжевые вина',
    labelEn: 'Orange Wines',
    tones: {
      pale: '#FFA500',
      medium: '#FF8C00',
      deep: '#FF6347',
    },
    colors: [
      {
        id: '4-1',
        value: '#FFBF00', // HEX цвет
        label: 'Янтарный',
        labelEn: 'Amber',
        items: [
          {
            name: 'Светлый янтарь',
            nameEn: 'Light Amber',
            tones: {
              pale: '#FFE4B5',
              medium: '#FFBF00',
              deep: '#FF8C00',
            },
          },
          {
            name: 'Медовый янтарь',
            nameEn: 'Honey Amber',
            tones: {
              pale: '#FFD700',
              medium: '#FFA500',
              deep: '#FF8C00',
            },
          },
        ],
      },
    ],
  },
]

export const mockWineCategoryFormData: WineCategoryFormData[] = [
  {
    value: '#8B0000',
    label: 'Красные вина',
    labelEn: 'Red Wines',
    tones: {
      pale: '#FF6B6B',
      medium: '#B22222',
      deep: '#8B0000',
    },
  },
  {
    value: '#F0E68C',
    label: 'Белые вина',
    labelEn: 'White Wines',
    tones: {
      pale: '#FFF8DC',
      medium: '#F0E68C',
      deep: '#DAA520',
    },
  },
  {
    value: '#FF69B4',
    label: 'Розовые вина',
    labelEn: 'Rosé Wines',
    tones: {
      pale: '#FFB6C1',
      medium: '#FF69B4',
      deep: '#C71585',
    },
  },
  {
    value: '#FF8C00',
    label: 'Оранжевые вина',
    labelEn: 'Orange Wines',
    tones: {
      pale: '#FFA500',
      medium: '#FF8C00',
      deep: '#FF6347',
    },
  },
  {
    value: '#800080',
    label: 'Игристые вина',
    labelEn: 'Sparkling Wines',
    tones: {
      pale: '#E6E6FA',
      medium: '#9370DB',
      deep: '#4B0082',
    },
  },
  {
    value: '#8B4513',
    label: 'Крепленые вина',
    labelEn: 'Fortified Wines',
    tones: {
      pale: '#D2B48C',
      medium: '#A0522D',
      deep: '#8B4513',
    },
  },
  {
    value: '#2F4F4F',
    label: 'Десертные вина',
    labelEn: 'Dessert Wines',
    tones: {
      pale: '#708090',
      medium: '#2F4F4F',
      deep: '#000000',
    },
  },
]
