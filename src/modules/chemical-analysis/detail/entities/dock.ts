import { WineForAnalysisResponse } from '../../list/entities/types'
import { CharacteristicsHistoryResponse, IWineAnalysisDetail, TasteHistoryResponse } from './types'

//  LIST: '/v1/admin/analysis',
export const mockWineForAnalysisResponse: WineForAnalysisResponse = {
  rows: [
    {
      id: '1',
      name: 'Château Margaux',
      vintage: 2015,
      wintage: 2015,
      grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc, Petit Verdot',
      capacityName: 'Standard Bottle',
      typeName: 'Red Wine',
      color: {
        id: 'red',
        colorHex: '#722F37',
        name: 'Red',
      },
      image: {
        name: 'chateau-margaux-2015.jpg',
        originalName: 'Chateau_Margaux_2015_original.jpg',
        mimetype: 'image/jpeg',
        size: 2048576,
        smallUrl: 'https://example.com/images/small/chateau-margaux-2015.jpg',
        mediumUrl: 'https://example.com/images/medium/chateau-margaux-2015.jpg',
        originalUrl: 'https://example.com/images/original/chateau-margaux-2015.jpg',
      },
    },
    {
      id: '2',
      name: 'Dom Pérignon',
      vintage: 2012,
      wintage: 2012,
      grapeVariety: 'Chardonnay, Pinot Noir',
      capacityName: 'Magnum',
      typeName: 'Sparkling Wine',
      color: {
        id: 'yellow',
        colorHex: '#FFD700',
        name: 'Yellow',
      },
      image: {
        name: 'dom-perignon-2012.jpg',
        originalName: 'Dom_Perignon_2012_original.jpg',
        mimetype: 'image/jpeg',
        size: 1859328,
        smallUrl: 'https://example.com/images/small/dom-perignon-2012.jpg',
        mediumUrl: 'https://example.com/images/medium/dom-perignon-2012.jpg',
        originalUrl: 'https://example.com/images/original/dom-perignon-2012.jpg',
      },
    },
    {
      id: '3',
      name: 'Sancerre Blanc',
      vintage: 2021,
      wintage: 2021,
      grapeVariety: 'Sauvignon Blanc',
      capacityName: 'Standard Bottle',
      typeName: 'White Wine',
      color: {
        id: 'white',
        colorHex: '#F5F5DC',
        name: 'White',
      },
      image: {
        name: 'sancerre-blanc-2021.jpg',
        originalName: 'Sancerre_Blanc_2021_original.jpg',
        mimetype: 'image/jpeg',
        size: 1572864,
        smallUrl: 'https://example.com/images/small/sancerre-blanc-2021.jpg',
        mediumUrl: 'https://example.com/images/medium/sancerre-blanc-2021.jpg',
        originalUrl: 'https://example.com/images/original/sancerre-blanc-2021.jpg',
      },
    },
    {
      id: '4',
      name: "Rosé d'Anjou",
      vintage: 2022,
      wintage: 2022,
      grapeVariety: 'Grolleau, Gamay',
      capacityName: 'Standard Bottle',
      typeName: 'Rosé Wine',
      color: {
        id: 'pink',
        colorHex: '#FFC0CB',
        name: 'Pink',
      },
      image: {
        name: 'rose-anjou-2022.jpg',
        originalName: 'Rose_Anjou_2022_original.jpg',
        mimetype: 'image/jpeg',
        size: 1782579,
        smallUrl: 'https://example.com/images/small/rose-anjou-2022.jpg',
        mediumUrl: 'https://example.com/images/medium/rose-anjou-2022.jpg',
        originalUrl: 'https://example.com/images/original/rose-anjou-2022.jpg',
      },
    },
    {
      id: '5',
      name: 'Barolo',
      vintage: 2018,
      wintage: 2018,
      grapeVariety: 'Nebbiolo',
      capacityName: 'Standard Bottle',
      typeName: 'Red Wine',
      color: {
        id: 'red',
        colorHex: '#8B0000',
        name: 'Red',
      },
      image: {
        name: 'barolo-2018.jpg',
        originalName: 'Barolo_2018_original.jpg',
        mimetype: 'image/jpeg',
        size: 2097152,
        smallUrl: 'https://example.com/images/small/barolo-2018.jpg',
        mediumUrl: 'https://example.com/images/medium/barolo-2018.jpg',
        originalUrl: 'https://example.com/images/original/barolo-2018.jpg',
      },
    },
  ],
  totalPages: 2,
  count: 8,
}

// DETAIL: '/v1/admin/analysis/{id}',
export const mockWineAnalysisDetail: IWineAnalysisDetail = {
  id: '1',
  name: 'Каберне Совиньон Reserve',
  typeName: 'Красное сухое',
  color: {
    id: '2',
    name: 'Червоне',
    colorHex: '#7c060d',
  },
  capacityName: '0.75 л',
  grapeVariety: 'Каберне Совиньон 100%',
  vintage: 2022,
  wintage: 2022,
  image: {
    name: 'cabernet-sauvignon-2022',
    originalName: 'cabernet_sauvignon_2022.jpg',
    mimetype: 'image/jpeg',
    size: 2048576,
    smallUrl: 'https://example.com/wine-small.jpg',
    mediumUrl: 'https://example.com/wine-medium.jpg',
    originalUrl: 'https://example.com/wine-original.jpg',
  },
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
      color: {
        id: '2',
        name: 'Червоне',
        colorHex: '#7c060d',
      },
      shade: {
        id: '6',
        name: 'Рубіновий',
        colorHex: '#9B111E',
      },
      tone: {
        id: '6',
        name: 'Блідий',
        colorHex: '#c55050',
      },
      mousse: 7,
      perlage: 9,
    },
    aroma: {
      aromaGroup: {
        id: '8',
        name: 'Троянда',
        colorHex: '#E78AAE',
      },
      aromaSubGroup: {
        id: '8',
        name: 'Бардо',
        colorHex: '#670303',
      },
      aromas: [
        {
          id: '8',
          name: 'Першон',
        },
        {
          id: '8',
          name: 'Свіже-зірвана',
        },
      ],
      note: 'some note about aroma analysis',
    },
    taste: {
      taste: {
        id: '6',
        name: 'Шоколад',
        colorHex: '#4B2E16',
      },
      note: 'some note about taste analysis',
    },
  },
}

// -------------для графиків-------------
// CHARACTERISTICS: '/v1/admin/analysis/{id}/history_characteristics/{date}',
export const mockMonthCharacteristicsHistory: CharacteristicsHistoryResponse = {
  range: 'month', //'day' | 'month' | 'year'
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
  xAxisLabels: ['05 янв', '10 янв', '15 янв', '20 янв'], //['08:00', '12:00', '16:00', '20:00']| ['05 янв', '10 янв', '15 янв', '20 янв'] | ['Март', 'Июнь', 'Сентябрь', 'Декабрь']
}

//--------------для кольорів, смаку та аромату--------------------
// TASTE: '/v1/admin/analysis/{id}/history_taste/{date}',
export const mockTasteHistory: TasteHistoryResponse = {
    visual: {
      color: {
        id: '2',
        name: 'Червоне',
        colorHex: '#7c060d',
      },
      shade: {
        id: '6',
        name: 'Рубіновий',
        colorHex: '#9B111E',
      },
      tone: {
        id: '6',
        name: 'Блідий',
        colorHex: '#c55050',
      },
      mousse: 7,
      perlage: 9,
    },
    aroma: {
      aromaGroup: {
        id: '8',
        name: 'Троянда',
        colorHex: '#E78AAE',
      },
      aromaSubGroup: {
        id: '8',
        name: 'Бардо',
        colorHex: '#670303',
      },
      aromas: [
        {
          id: '8',
          name: 'Першон',
        },
        {
          id: '8',
          name: 'Свіже-зірвана',
        },
      ],
      note: 'some note about aroma analysis',
    },
    taste: {
      taste: {
        id: '6',
        name: 'Шоколад',
        colorHex: '#4B2E16',
      },
      note: 'some note about taste analysis',
    },
    analysisDates: ['2024-01-15', '2024-01-10', '2024-01-05', '2023-12-28', '2023-12-20', '2026-12-20'],
}
