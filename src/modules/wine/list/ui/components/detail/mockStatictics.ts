export const statistics = {
  topColors: [
    {
      id: 1,
      colorHex: '#C68642',
      name: 'Біле',
      userCount: 200,
      shades: [
        { id: 1, colorHex: '#E8E3A0', name: 'lemon', userCount: 169, tone: '#EFDB49' },
        { id: 2, colorHex: '#EDE6B4', name: 'straw', userCount: 31, tone: '#F4F2DD' },
      ],
    },
    {
      id: 2,
      colorHex: '#F19628',
      name: 'Помаранчеве',
      userCount: 42,
      shades: [],
    },
    {
      id: 3,
      colorHex: '#FFC0CB',
      name: 'Рожеве',
      userCount: 70,
      shades: [
        { id: 3, colorHex: '#F6A794', name: 'Salmon', userCount: 14, tone: '#F6A794' },
        { id: 4, colorHex: '#CFA18D', name: 'Onion Skin', userCount: 56, tone: '#CF718D' },
      ],
    },
  ],
  topAromas: [
    {
      id: 60,
      colorHex: '#E78AAE',
      name: 'Троянда',
      userCount: 4,
      subgroups: [
        { id: 54, colorHex: '#670303', name: 'бардо', userCount: 1, aromas: [{ id: 58, name: 'Першон', userCount: 1 }] },
        {
          id: 53,
          colorHex: '#97057b',
          name: 'біла',
          userCount: 3,
          aromas: [
            { id: 57, name: 'свіже зірвана', userCount: 1 },
            { id: 56, name: 'суха', userCount: 2 },
          ],
        },
      ],
    },
    {
      id: 61,
      colorHex: '#dd9350',
      name: 'Дерево',
      userCount: 4,
      subgroups: [
        {
          id: 55,
          colorHex: '#de9e58',
          name: 'Дуб',
          userCount: 1,
          aromas: [
            { id: 59, name: 'Листя', userCount: 1 },
            { id: 60, name: 'Корінь', userCount: 0 },
          ],
        },
        {
          id: 56,
          colorHex: '#b9ac99',
          name: 'Горіх',
          userCount: 3,
          aromas: [
            { id: 58, name: 'ядро', userCount: 1 },
            { id: 61, name: 'сухений', userCount: 2 },
          ],
        },
      ],
    },
    {
      id: 58,
      colorHex: '#A8D86E',
      name: 'Зелене яблуко',
      userCount: 1,
      subgroups: [],
    },
    {
      id: 63,
      colorHex: '#7bbb32',
      name: 'Овочі',
      userCount: 10,
      subgroups: [],
    },
  ],
  topFlavors: [
    {
      id: 19,
      colorHex: '#4B2E16',
      name: 'Chocolate',
      userCount: 2,
    },
    {
      id: 18,
      colorHex: '#F4D23C',
      name: 'Citrus',
      userCount: 1,
    },
    {
      id: 16,
      colorHex: '#E78AAE',
      name: 'Rose',
      userCount: 1,
    },
  ],
  tasteCharacteristics: [
    {
      id: 23,
      colorHex: '#e5f1d0',
      name: 'Aftertaste',
      userCount: 22,
      levels: [
        { id: 55, name: 'very long', userCount: 8 },
        { id: 51, name: 'instantaneous', userCount: 2 },
        { id: 52, name: 'short', userCount: 3 },
        { id: 53, name: 'avarage', userCount: 4 },
        { id: 54, name: 'long', userCount: 5 },
      ],
    },
    {
      id: 7,
      colorHex: '#c3ffe6',
      name: 'Sweetness',
      userCount: 45,
      levels: [
        { id: 9, name: 'semi sweet', userCount: 10 },
        { id: 10, name: 'sweet', userCount: 9 },
        { id: 7, name: 'dry', userCount: 1 },
        { id: 8, name: 'semi dry', userCount: 25 },
      ],
    },
    {
      id: 48,
      colorHex: '#D4632B',
      name: 'Tanin (level)',
      userCount: 15,
      levels: [
        { id: 131, name: 'low', userCount: 5 },
        { id: 132, name: 'middle', userCount: 9 },
        { id: 133, name: 'high', userCount: 1 },
      ],
    },
    {
      id: 49,
      colorHex: '#FFC9C9',
      name: 'Body',
      userCount: 121,
      levels: [
        { id: 134, name: '1', userCount: 55 },
        { id: 137, name: '4', userCount: 43 },
        { id: 135, name: '2', userCount: 2 },
        { id: 136, name: '3', userCount: 21 },
      ],
    },
  ],
}
