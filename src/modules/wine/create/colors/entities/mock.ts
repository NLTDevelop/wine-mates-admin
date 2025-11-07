import { WineColor } from './types/color'

export const mockColors: WineColor[] = [
  {
    id: '1',
    label: 'Червоний',
    labelEn: 'Red Wines',
    value: '#8B0000',
    items: [
      {
        id: '1-1',
        name: 'Бордо',
        nameEn: 'Bordeaux',
        shade: '#8B0000',
        tones: {
          pale: '#A83731',
          medium: '#8B0000',
          deep: '#660000',
        },
        order: '1',
      },
      {
        id: '1-2',
        name: 'Бургундія',
        nameEn: 'Burgundy',
        shade: '#5D1F1F',
        tones: {
          pale: '#722F37',
          medium: '#5D1F1F',
          deep: '#3D0000',
        },
        order: '2',
      },
      {
        id: '1-3',
        name: 'Рубін',
        nameEn: 'Ruby',
        shade: '#C71585',
        tones: {
          pale: '#E0115F',
          medium: '#C71585',
          deep: '#8B0000',
        },
        order: '3',
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
        id: '2-1',
        name: 'Солома',
        nameEn: 'Straw',
        shade: '#E4D96F',
        tones: {
          pale: '#F5F5DC',
          medium: '#E4D96F',
          deep: '#D2B48C',
        },
        order: '1',
      },
      {
        id: '2-2',
        name: 'Золото',
        nameEn: 'Gold',
        shade: '#FFD700',
        tones: {
          pale: '#FFF8DC',
          medium: '#FFD700',
          deep: '#DAA520',
        },
        order: '2',
      },
    ],
  },
]

// export const mockSimpleColors: WineColor[] = [
//   {
//     id: '1',
//     label: 'Червоне',
//     labelEn: 'Red',
//     value: '#DC143C',
//   },
//   {
//     id: '2',
//     label: 'Біле',
//     labelEn: 'White',
//     value: '#F5F5DC',
//   },
//   {
//     id: '3',
//     label: 'Рожеве',
//     labelEn: 'Rosé',
//     value: '#FFC0CB',
//   },
//   {
//     id: '4',
//     label: 'Помаранчеве',
//     labelEn: 'Orange',
//     value: '#FFA500',
//   },
// ]

// export const mockWineColorItems: WineColorItem[] = [
//   {
//     name: 'Гранатовий',
//     nameEn: 'Garnet',
//     tones: {
//       pale: '#B22222',
//       medium: '#8B0000',
//       deep: '#660000',
//     },
//     color: '#8B0000',
//     order: '1'
//   },
//   {
//     name: 'Фіолетовий',
//     nameEn: 'Violet',
//     tones: {
//       pale: '#EE82EE',
//       medium: '#8A2BE2',
//       deep: '#4B0082',
//     },
//     color: '#8A2BE2',
//     order: '2'
//   },
// ]
