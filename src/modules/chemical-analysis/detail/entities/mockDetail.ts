import { BaseWineColor } from '@/modules/wine/create/general/entities/types'
import { IWineAnalysisDetail, CharacteristicsHistoryResponse, IBaseInfoWithoutColor } from '../entities/types'
import { WineImage } from '@/modules/wine/list/entities/types/types'
import { IWineForAnalysis } from '../../list/entities/types'

const mockImage: WineImage = {
  name: 'cabernet-sauvignon-2022',
  originalName: 'cabernet_sauvignon_2022.jpg',
  mimetype: 'image/jpeg',
  size: 2048576,
  smallUrl: 'https://example.com/wine-small.jpg',
  mediumUrl: 'https://example.com/wine-medium.jpg',
  originalUrl: 'https://example.com/wine-original.jpg',
}

const redWineColor: BaseWineColor = {
  id: '2',
  name: 'Червоне',
  colorHex: '#7c060d',
}
const redWineShade: BaseWineColor = {
  id: '6',
  name: 'Рубіновий',
  colorHex: '#9B111E',
}
const redWineTone: BaseWineColor = {
  id: '6',
  name: 'Блідий',
  colorHex: '#c55050',
}
const aromaGroup: BaseWineColor = {
  id: '8',
  name: 'Троянда',
  colorHex: '#E78AAE',
}
const aromaSubGroup: BaseWineColor = {
  id: '8',
  name: 'Бардо',
  colorHex: '#670303',
}
const aromas: IBaseInfoWithoutColor[] = [
  {
    id: '8',
    name: 'Першон',
  },
  {
    id: '8',
    name: 'Свіже-зірвана',
  },
]

const tasteGroup: BaseWineColor = {
  id: '6',
  name: 'Шоколад',
  colorHex: '#4B2E16',
}

const whiteWineColor: BaseWineColor = {
  id: '1',
  name: 'Біле',
  colorHex: '#fdffd4',
}

const roseWineColor: BaseWineColor = {
  id: '3',
  name: 'Рожеве',
  colorHex: '#7c060d',
}

const orangeWineColor: BaseWineColor = {
  id: '4',
  name: 'Помаранчеве',
  colorHex: '#f1bf85',
}

export const mockWineForAnalysis: IWineForAnalysis = {
  id: '1',
  name: 'Каберне Совиньон Reserve',
  typeName: 'Красное сухое',
  color: redWineColor,
  capacityName: '0.75 л',
  grapeVariety: 'Каберне Совиньон 100%',
  vintage: 2022,
  wintage: 2022,
  image: mockImage,
}

export const mockWineAnalysisDetail: IWineAnalysisDetail = {
  ...mockWineForAnalysis,

  sugarContent: [{ id: '1', value: 2.5, date: '2024-01-15' }],
  ph: [{ id: '2', value: 3.6, date: '2024-01-15' }],
  volatileAcidity: [{ id: '3', value: 0.6, date: '2024-01-15' }],
  totalAcidity: [{ id: '4', value: 5.8, date: '2024-01-15' }],
  alcohol: [{ id: '5', value: 13.5, date: '2024-01-15' }],
  freeSO2: 25,
  totalSO2: 80,
  density: 0.996,
  malolactic: true,
  fermentationTemp: 28,
  analysisDates: ['2024-01-15', '2024-01-10', '2024-01-05', '2023-12-28', '2023-12-20', '2026-12-20'],
  sensoryAnalysis: {
    visual: {
      color: redWineColor,
      shade: redWineShade,
      mousse: 7,
      perlage: 9,
    },
    aroma: {
      aromaGroup: aromaGroup,
      aromaSubGroup: aromaSubGroup,
      aromas: aromas,
      note: 'some note about aroma analysis',
    },
    taste: {
      taste: tasteGroup,
      note: 'some note about taste analysis',
    },
  },
}

export const mockWhiteWine: IWineForAnalysis = {
  id: '2',
  name: 'Шардоне Barrel Aged',
  typeName: 'Белое сухое',
  color: whiteWineColor,
  capacityName: '0.75 л',
  grapeVariety: 'Шардоне 100%',
  vintage: 2021,
  wintage: 2021,
  image: {
    ...mockImage,
    name: 'chardonnay-2021',
    originalName: 'chardonnay_2021.jpg',
    smallUrl: 'https://example.com/chardonnay-small.jpg',
    mediumUrl: 'https://example.com/chardonnay-medium.jpg',
    originalUrl: 'https://example.com/chardonnay-original.jpg',
  },
}

export const mockRoseWine: IWineForAnalysis = {
  id: '3',
  name: 'Прованс Розе',
  typeName: 'Розовое сухое',
  color: roseWineColor,
  capacityName: '0.75 л',
  grapeVariety: 'Гренаш, Сенсо, Сира',
  vintage: 2023,
  wintage: 2023,
  image: {
    ...mockImage,
    name: 'rose-2023',
    originalName: 'rose_2023.jpg',
    smallUrl: 'https://example.com/rose-small.jpg',
    mediumUrl: 'https://example.com/rose-medium.jpg',
    originalUrl: 'https://example.com/rose-original.jpg',
  },
}

export const mockOrangeWine: IWineForAnalysis = {
  id: '4',
  name: 'Георгія',
  typeName: 'Помаранчеве',
  color: orangeWineColor,
  capacityName: '0.75 л',
  grapeVariety: 'Ркацителі',
  vintage: 2020,
  wintage: 2020,
  image: {
    ...mockImage,
    name: 'orange-2020',
    originalName: 'orange_2020.jpg',
    smallUrl: 'https://example.com/orange-small.jpg',
    mediumUrl: 'https://example.com/orange-medium.jpg',
    originalUrl: 'https://example.com/orange-original.jpg',
  },
}

export const mockWhiteWineAnalysisDetail: IWineAnalysisDetail = {
  ...mockWhiteWine,
  sugarContent: [{ id: '6', value: 3.2, date: '2024-01-15' }],
  ph: [{ id: '7', value: 3.4, date: '2024-01-15' }],
  volatileAcidity: [{ id: '8', value: 0.4, date: '2024-01-15' }],
  totalAcidity: [{ id: '9', value: 6.2, date: '2024-01-15' }],
  alcohol: [{ id: '10', value: 12.5, date: '2024-01-15' }],
  freeSO2: 30,
  totalSO2: 85,
  density: 0.992,
  malolactic: false,
  fermentationTemp: 18,
  analysisDates: ['2024-01-15', '2024-01-08', '2024-01-01', '2023-12-25'],
  sensoryAnalysis: {
    visual: {
      color: redWineColor,
      shade: redWineShade,
      tone: redWineTone,
      mousse: 7,
      perlage: 9,
    },
    aroma: {
      aromaGroup: aromaGroup,
      aromaSubGroup: aromaSubGroup,
      aromas: aromas,
      note: 'some note about aroma analysis',
    },
    taste: {
      taste: tasteGroup,
      note: 'some note about taste analysis',
    },
  },
}

export const mockRoseWineAnalysisDetail: IWineAnalysisDetail = {
  ...mockRoseWine,
  sugarContent: [{ id: '11', value: 4.0, date: '2024-01-15' }],
  ph: [{ id: '12', value: 3.3, date: '2024-01-15' }],
  volatileAcidity: [{ id: '13', value: 0.3, date: '2024-01-15' }],
  totalAcidity: [{ id: '14', value: 5.5, date: '2024-01-15' }],
  alcohol: [{ id: '15', value: 12.0, date: '2024-01-15' }],
  freeSO2: 22,
  totalSO2: 75,
  density: 0.99,
  malolactic: false,
  fermentationTemp: 16,
  analysisDates: ['2024-01-15', '2024-01-07', '2023-12-30', '2026-12-30'],
  sensoryAnalysis: {
    visual: {
      color: redWineColor,
      shade: redWineShade,
      tone: redWineTone,
      mousse: 7,
      perlage: 9,
    },
    aroma: {
      aromaGroup: aromaGroup,
      aromaSubGroup: aromaSubGroup,
      aromas: aromas,
      note: 'some note about aroma analysis',
    },
    taste: {
      taste: tasteGroup,
      note: 'some note about taste analysis',
    },
  },
}

export const mockCharacteristicsHistory: CharacteristicsHistoryResponse = {
  range: 'day',
  selectedDate: '2024-01-15',
  data: [
    {
      timestamp: '2024-01-15T08:00:00',
      sugarContent: 2.5,
      ph: 3.6,
      alcohol: 13.5,
      volatileAcidity: 0.6,
      totalAcidity: 5.8,
    },
    {
      timestamp: '2024-01-15T12:00:00',
      sugarContent: 2.4,
      ph: 3.6,
      alcohol: 13.5,
      volatileAcidity: 0.6,
      totalAcidity: 5.8,
    },
    {
      timestamp: '2024-01-15T16:00:00',
      sugarContent: 2.3,
      ph: 3.6,
      alcohol: 13.5,
      volatileAcidity: 0.6,
      totalAcidity: 5.8,
    },
    {
      timestamp: '2024-01-15T20:00:00',
      sugarContent: 2.2,
      ph: 3.6,
      alcohol: 13.5,
      volatileAcidity: 0.6,
      totalAcidity: 5.8,
    },
  ],
  xAxisLabels: ['08:00', '12:00', '16:00', '20:00'],
}

export const mockMonthCharacteristicsHistory: CharacteristicsHistoryResponse = {
  range: 'month',
  selectedDate: '2024-01',
  data: [
    {
      timestamp: '2024-01-05T00:00:00',
      sugarContent: 3.2,
      ph: 3.5,
      alcohol: 12.8,
      volatileAcidity: 0.8,
      totalAcidity: 6.2,
    },
    {
      timestamp: '2024-01-10T00:00:00',
      sugarContent: 2.8,
      ph: 3.5,
      alcohol: 13.2,
      volatileAcidity: 0.7,
      totalAcidity: 6.0,
    },
    {
      timestamp: '2024-01-15T00:00:00',
      sugarContent: 2.5,
      ph: 3.6,
      alcohol: 13.5,
      volatileAcidity: 0.6,
      totalAcidity: 5.8,
    },
    {
      timestamp: '2024-01-20T00:00:00',
      sugarContent: 2.3,
      ph: 3.6,
      alcohol: 13.5,
      volatileAcidity: 0.6,
      totalAcidity: 5.8,
    },
  ],
  xAxisLabels: ['05 янв', '10 янв', '15 янв', '20 янв'],
}

export const mockYearCharacteristicsHistory: CharacteristicsHistoryResponse = {
  range: 'year',
  selectedDate: '2023',
  data: [
    {
      timestamp: '2023-03-01T00:00:00',
      sugarContent: 15.0,
      ph: 3.3,
      alcohol: 0,
      volatileAcidity: 0.2,
      totalAcidity: 8.5,
    },
    {
      timestamp: '2023-06-01T00:00:00',
      sugarContent: 10.5,
      ph: 3.4,
      alcohol: 5.2,
      volatileAcidity: 0.3,
      totalAcidity: 7.8,
    },
    {
      timestamp: '2023-09-01T00:00:00',
      sugarContent: 5.2,
      ph: 3.5,
      alcohol: 10.8,
      volatileAcidity: 0.5,
      totalAcidity: 6.5,
    },
    {
      timestamp: '2023-12-01T00:00:00',
      sugarContent: 2.8,
      ph: 3.6,
      alcohol: 13.2,
      volatileAcidity: 0.7,
      totalAcidity: 5.9,
    },
  ],
  xAxisLabels: ['Март', 'Июнь', 'Сентябрь', 'Декабрь'],
}

export { redWineColor, whiteWineColor, roseWineColor, orangeWineColor }
