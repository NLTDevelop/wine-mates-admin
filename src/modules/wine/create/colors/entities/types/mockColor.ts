import { WineColorGroup } from './color-types'

export const mockWineColorGroups: WineColorGroup[] = [
  {
    id: '1',
    colorHex: '#8B0000',
    translations: [
      { name: 'Червоні вина', language: 'uk' },
      { name: 'Red Wines', language: 'en' },
    ],
    shades: [
      {
        id: '1-1',
        translations: [
          { name: 'Бордовий', language: 'uk' },
          { name: 'Burgundy', language: 'en' },
        ],
        tonePale: '#A52A2A',
        toneMedium: '#8B0000',
        toneDeep: '#800000',
        colorHex: '#8B0000',
        sortNumber: 1,
      },
      {
        id: '1-2',
        translations: [
          { name: 'Рубіновий', language: 'uk' },
          { name: 'Ruby', language: 'en' },
        ],
        tonePale: '#DC143C',
        toneMedium: '#B22222',
        toneDeep: '#8B0000',
        colorHex: '#B22222',
        sortNumber: 2,
      },
    ],
  },
  {
    id: '2',
    colorHex: '#FFD700',
    translations: [
      { name: 'Білі вина', language: 'uk' },
      { name: 'White Wines', language: 'en' },
    ],
    shades: [
      {
        id: '2-1',
        translations: [
          { name: "Солом'яний", language: 'uk' },
          { name: 'Straw', language: 'en' },
        ],
        tonePale: '#FFF8DC',
        toneMedium: '#FFEBCD',
        toneDeep: '#F5DEB3',
        colorHex: '#FFEBCD',
        sortNumber: 1,
      },
      {
        id: '2-2',
        translations: [
          { name: 'Золотий', language: 'uk' },
          { name: 'Golden', language: 'en' },
        ],
        tonePale: '#FFD700',
        toneMedium: '#DAA520',
        toneDeep: '#B8860B',
        colorHex: '#DAA520',
        sortNumber: 2,
      },
      {
        id: '2-3',
        translations: [
          { name: 'Бурштиновий', language: 'uk' },
          { name: 'Amber', language: 'en' },
        ],
        tonePale: '#FFBF00',
        toneMedium: '#FF8C00',
        toneDeep: '#FF4500',
        colorHex: '#FF8C00',
        sortNumber: 3,
      },
    ],
  },
  {
    id: '3',
    colorHex: '#FF69B4',
    translations: [
      { name: 'Рожеві вина', language: 'uk' },
      { name: 'Rosé Wines', language: 'en' },
    ],
    shades: [
      {
        id: '3-1',
        translations: [
          { name: 'Світло-рожевий', language: 'uk' },
          { name: 'Light Pink', language: 'en' },
        ],
        tonePale: '#FFB6C1',
        toneMedium: '#FF69B4',
        toneDeep: '#FF1493',
        colorHex: '#FF69B4',
        sortNumber: 1,
      },
      {
        id: '3-2',
        translations: [
          { name: 'Лососевий', language: 'uk' },
          { name: 'Salmon', language: 'en' },
        ],
        tonePale: '#FFA07A',
        toneMedium: '#FA8072',
        toneDeep: '#E9967A',
        colorHex: '#FA8072',
        sortNumber: 2,
      },
    ],
  },
  {
    id: '4',
    colorHex: '#4B0082',
    translations: [
      { name: 'Помаранчеві вина', language: 'uk' },
      { name: 'Orange Wines', language: 'en' },
    ],
    shades: [
      {
        id: '4-1',
        translations: [
          { name: 'Мідний', language: 'uk' },
          { name: 'Copper', language: 'en' },
        ],
        tonePale: '#CD853F',
        toneMedium: '#D2691E',
        toneDeep: '#8B4513',
        colorHex: '#D2691E',
        sortNumber: 1,
      },
      {
        id: '4-2',
        translations: [
          { name: 'Бурштиновий', language: 'uk' },
          { name: 'Amber', language: 'en' },
        ],
        tonePale: '#FFA500',
        toneMedium: '#FF8C00',
        toneDeep: '#FF4500',
        colorHex: '#FF8C00',
        sortNumber: 2,
      },
    ],
  },
  {
    id: '5',
    colorHex: '#800020',
    translations: [
      { name: 'Ігристі вина', language: 'uk' },
      { name: 'Sparkling Wines', language: 'en' },
    ],
    shades: [],
  },
]
