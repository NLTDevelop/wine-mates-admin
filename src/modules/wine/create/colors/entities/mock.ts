import { WineColor, WineColorItem } from './types/color'

export const mockColors: WineColor[] = [
  {
    id: '1',
    label: 'Червоний',
    labelEn: 'Red Wines',
    value: '#8B0000',
    items: [
      {
        name: 'Бордо',
        nameEn: 'Bordeaux',
        tones: {
          pale: '#A83731',
          medium: '#8B0000',
          deep: '#660000',
        },
      },
      {
        name: 'Бургундія',
        nameEn: 'Burgundy',
        tones: {
          pale: '#722F37',
          medium: '#5D1F1F',
          deep: '#3D0000',
        },
      },
      {
        name: 'Рубін',
        nameEn: 'Ruby',
        tones: {
          pale: '#E0115F',
          medium: '#C71585',
          deep: '#8B0000',
        },
      },
    ],
  },
  {
    id: '2',
    label: 'Білий',
    labelEn: 'White Wines',
    value: '#F5F5DC',
    items: [
      {
        name: 'Солома',
        nameEn: 'Straw',
        tones: {
          pale: '#F5F5DC',
          medium: '#E4D96F',
          deep: '#D2B48C',
        },
      },
      {
        name: 'Золото',
        nameEn: 'Gold',
        tones: {
          pale: '#FFF8DC',
          medium: '#FFD700',
          deep: '#DAA520',
        },
      },
      {
        name: 'Мед',
        nameEn: 'Honey',
        tones: {
          pale: '#F0E68C',
          medium: '#FFA500',
          deep: '#FF8C00',
        },
      },
    ],
  },
  {
    id: '3',
    label: 'Рожевий',
    labelEn: 'Rosé Wines',
    value: '#FFE4E1',
    items: [
      {
        name: 'Лосось',
        nameEn: 'Salmon',
        tones: {
          pale: '#FFE4E1',
          medium: '#FA8072',
          deep: '#E9967A',
        },
      },
      {
        name: 'Корал',
        nameEn: 'Coral',
        tones: {
          pale: '#FF7F50',
          medium: '#FF6347',
          deep: '#FF4500',
        },
      },
    ],
  },
  {
    id: '4',
    label: 'Помаранчевий',
    labelEn: 'Orange Wines',
    value: '#FFA500',
    items: [
      {
        name: 'Янтар',
        nameEn: 'Amber',
        tones: {
          pale: '#FFE4B5',
          medium: '#FFBF00',
          deep: '#FF8C00',
        },
      },
      {
        name: 'Мідь',
        nameEn: 'Copper',
        tones: {
          pale: '#B87333',
          medium: '#8B4513',
          deep: '#654321',
        },
      },
    ],
  },
  {
    id: '5',
    label: 'Кораловий',
    labelEn: 'Red',
    value: '#DC143C',
  },
]

export const mockSimpleColors: WineColor[] = [
  {
    id: '1',
    label: 'Червоне',
    labelEn: 'Red',
    value: '#DC143C',
  },
  {
    id: '2',
    label: 'Біле',
    labelEn: 'White',
    value: '#F5F5DC',
  },
  {
    id: '3',
    label: 'Рожеве',
    labelEn: 'Rosé',
    value: '#FFC0CB',
  },
  {
    id: '4',
    label: 'Помаранчеве',
    labelEn: 'Orange',
    value: '#FFA500',
  },
]

export const mockWineColorItems: WineColorItem[] = [
  {
    name: 'Гранатовий',
    nameEn: 'Garnet',
    tones: {
      pale: '#B22222',
      medium: '#8B0000',
      deep: '#660000',
    },
  },
  {
    name: 'Фіолетовий',
    nameEn: 'Violet',
    tones: {
      pale: '#EE82EE',
      medium: '#8A2BE2',
      deep: '#4B0082',
    },
  },
]
