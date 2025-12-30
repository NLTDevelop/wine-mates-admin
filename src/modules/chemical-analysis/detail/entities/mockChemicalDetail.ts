import { WineAnalysisUIResponse } from './chemical_types'

export const mockChemicalDetail: WineAnalysisUIResponse = {
  wine: {
    id: '123',
    name: 'Cabernet Sauvignon Reserve',
    typeName: 'Червоне',
    color: {
      id: '92',
      colorHex: '#8D0830',
      name: 'red',
    },
    capacityName: '0.75 л',
    grapeVariety: 'Каберне Совиньон 100%',
    vintage: 2022,
    wintage: 2022,

    image: {
      name: 'chardonnay-2022',
      originalName: 'chardonnay.jpg',
      mimetype: 'image/jpeg',
      size: 2883584,
      smallUrl: 'https://images.unsplash.com/photo-1605600659996-6c1be8fc4d6c?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=center',
      mediumUrl: 'https://images.unsplash.com/photo-1605600659996-6c1be8fc4d6c?ixlib=rb-4.0.3&w=400&h=400&fit=crop&crop=center',
      originalUrl: 'https://images.unsplash.com/photo-1605600659996-6c1be8fc4d6c',
    },
  },

  analysis: {
    date: '2024-12-20',

    sensory: {
      visual: {
        color: {
          id: 'color_1',
          colorHex: '#8B0000',
          name: 'Червоне',
        },
        shade: {
          id: 'shade_1',
          colorHex: '#9B111E',
          name: 'Рубіновий',
        },
        tone: {
          id: 'tone_1',
          colorHex: '#F5F5DC',
          name: 'Блідий',
        },
        perlage: 9,
        mousse: 7,
      },
      aroma: {
        aromaGroup: {
          id: 'aroma_group_1',
          colorHex: '#FFC0CB',
          name: 'Троянда',
        },
        aromaSubGroup: {
          id: 'aroma_subgroup_1',
          colorHex: '#722F37',
          name: 'Бардо',
        },
        aromas: [
          {
            id: 'aroma_1',
            name: 'Першон',
          },
          {
            id: 'aroma_2',
            name: 'Свіже-зірвана',
          },
        ],
      },
      taste: {
        taste: {
          id: 'taste_1',
          colorHex: '#7B3F00',
          name: 'Шоколад',
        },
      },
    },

    chemical: {
      sugarContent: {
        value: 2.3,
        unit: 'г/л',
        date: '20 дек. 14:30',
      },
      ph: {
        value: 3.6,
        unit: 'рН',
        date: '20 дек. 14:30',
      },
      alcohol: {
        value: 13.5,
        unit: '%',
        date: '20 дек. 14:30',
      },
      volatileAcidity: {
        value: 0.6,
        unit: 'г/л',
        date: '20 дек. 14:30',
      },
      totalAcidity: {
        value: 5.8,
        unit: 'г/л',
        date: '20 дек. 14:30',
      },
      freeSO2: {
        value: 2,
        unit: 'мг/л',
        date: '20 дек. 14:30',
      },
      totalSO2: {
        value: 1.7,
        unit: 'мг/л',
        date: '20 дек. 14:30',
      },
      density: {
        value: 0.992,
        unit: 'г/см³',
        date: '20 дек. 14:30',
      },
      malolactic: false,
      fermentationTemp: {
        value: 24,
        unit: '°C',
        date: '20 дек. 14:30',
      },
    },
    reviews: [
      {
        id: 1,
        expertRating: 55,
        review: 'Amazing wine with great taste! The aroma is incredible and the finish is smooth.',
        createdAt: '2025-12-01T10:30:00Z',
        user: {
          id: 4,
          firstName: 'John',
          lastName: 'Doe',
          wineExperienceLevel: 'expert',
          avatar: {
            smallUrl: 'https://example.com/avatars/small/user-4.jpg',
            mediumUrl: 'https://example.com/avatars/medium/user-4.jpg',
            originalUrl: 'https://example.com/avatars/original/user-4.jpg',
          },
        },
      },
      {
        id: 2,
        expertRating: 80,
        review: 'Good wine, enjoyed it with dinner.',
        createdAt: '2025-11-30T15:20:00Z',
        user: {
          id: 7,
          firstName: 'Jane',
          lastName: 'Smith',
          wineExperienceLevel: 'creator',
          avatar: null,
        },
      },
      {
        id: 3,
        expertRating: 65,
        review: 'Decent wine for the price. Nothing exceptional but drinkable.',
        createdAt: '2025-11-28T14:15:00Z',
        user: {
          id: 12,
          firstName: 'Robert',
          lastName: 'Johnson',
          wineExperienceLevel: 'lower',
          avatar: {
            smallUrl: 'https://example.com/avatars/small/user-12.jpg',
            mediumUrl: 'https://example.com/avatars/medium/user-12.jpg',
            originalUrl: 'https://example.com/avatars/original/user-12.jpg',
          },
        },
      },
      {
        id: 4,
        expertRating: 92,
        review: 'Exceptional wine! Complex notes of blackberry and oak with a long finish.',
        createdAt: '2025-11-25T09:45:00Z',
        user: {
          id: 8,
          firstName: 'Michael',
          lastName: 'Brown',
          wineExperienceLevel: 'expert',
          avatar: {
            smallUrl: 'https://example.com/avatars/small/user-8.jpg',
            mediumUrl: 'https://example.com/avatars/medium/user-8.jpg',
            originalUrl: 'https://example.com/avatars/original/user-8.jpg',
          },
        },
      },
    ],
  },

  charts: {
    period: {
      type: 'day',
      value: '2024-12',
    },

    graphs: [
      {
        parameter: 'sugarContent',
        title: 'Вміст цукру',
        unit: 'г/л',
        data: [
          {
            date: '2024-12-20T08:00:00',
            value: 3.29,
            label: '00:00',
          },
          {
            date: '2024-12-20T10:00:00',
            value: 3.11,
            label: '00:00',
          },
          {
            date: '2024-12-20T12:00:00',
            value: 2.81,
            label: '00:00',
          },
          {
            date: '2024-12-20T14:00:00',
            value: 2.51,
            label: '00:00',
          },
          {
            date: '2024-12-20T16:00:00',
            value: 2.21,
            label: '00:00',
          },
        ],
        stats: {
          min: 2.3,
          max: 3.29,
          delta: 0.99,
          current: 2.3,
        },
      },
      {
        parameter: 'alcohol',
        title: 'Алкоголь',
        unit: '%',
        data: [
          {
            date: '2024-12-01',
            value: 13.6,
            label: '00:00',
          },
          {
            date: '2024-12-05',
            value: 13.5,
            label: '00:00',
          },
          {
            date: '2024-12-10',
            value: 13.2,
            label: '00:00',
          },
          {
            date: '2024-12-15',
            value: 13.0,
            label: '00:00',
          },
          {
            date: '2024-12-20',
            value: 12.7,
            label: '00:00',
          },
        ],
        stats: {
          min: 12.7,
          max: 13.6,
          delta: 0.9,
          current: 13.5,
        },
      },
      {
        parameter: 'ph',
        title: 'рН',
        unit: 'рН',
        data: [
          {
            date: '2024-12-01',
            value: 3.78,
            label: '00:00',
          },
          {
            date: '2024-12-05',
            value: 3.62,
            label: '00:00',
          },
          {
            date: '2024-12-10',
            value: 3.47,
            label: '00:00',
          },
          {
            date: '2024-12-15',
            value: 3.32,
            label: '00:00',
          },
          {
            date: '2024-12-20',
            value: 3.17,
            label: '00:00',
          },
        ],
        stats: {
          min: 3.17,
          max: 3.78,
          delta: 0.61,
          current: 3.6,
        },
      },
      {
        parameter: 'volatileAcidity',
        title: 'Летюча кислотність',
        unit: 'г/л',
        data: [
          {
            date: '2024-12-01',
            value: 0.82,
            label: '00:00',
          },
          {
            date: '2024-12-05',
            value: 0.775,
            label: '00:00',
          },
          {
            date: '2024-12-10',
            value: 0.71,
            label: '00:00',
          },
          {
            date: '2024-12-15',
            value: 0.645,
            label: '00:00',
          },
          {
            date: '2024-12-20',
            value: 0.58,
            label: '00:00',
          },
        ],
        stats: {
          min: 0.58,
          max: 0.82,
          delta: 0.24,
          current: 0.6,
        },
      },
      {
        parameter: 'totalAcidity',
        title: 'Загальна кислотність',
        unit: 'г/л',
        data: [
          {
            date: '2024-12-01',
            value: 6.8,
            label: '00:00',
          },
          {
            date: '2024-12-05',
            value: 6.7,
            label: '00:00',
          },
          {
            date: '2024-12-10',
            value: 6.5,
            label: '00:00',
          },
          {
            date: '2024-12-15',
            value: 6.4,
            label: '00:00',
          },
          {
            date: '2024-12-20',
            value: 6.2,
            label: '00:00',
          },
        ],
        stats: {
          min: 6.2,
          max: 6.8,
          delta: 0.6,
          current: 6.3,
        },
      },
    ],
  },

  availableDates: ['2024-12-20', '2024-12-15', '2024-12-10', '2024-12-05', '2024-12-01', '2024-11-28', '2024-11-25', '2024-11-20', '2024-11-15', '2024-11-10'],
}
